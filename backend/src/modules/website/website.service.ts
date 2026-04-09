import WebsiteDao from './website.dao.js';
import UserDao from '../user/user.dao.js';
import templateDao from '../template/template.dao.js';
import type { CreateWebsiteInput, DomainInput, ListWebsitesQuerySchema, PublishWebsiteInput, UpdateWebsiteInput, UpdateWebsiteSettingsInput } from './website.validation.js';
import { WebsiteStatus, type Website } from '@prisma/client';
import { addWebsiteDomain, createWebsiteContentFromTemplate, duplicateWebsiteContent, getWebsiteDomains, getWebsiteVersions, normalizeWebsiteContent, publishWebsiteContent, removeWebsiteDomain, verifyWebsiteDomain } from './website-content.utils.js';

class WebsiteService {
    private websiteDao: WebsiteDao;
    private userDao: UserDao;

    constructor() {
        this.websiteDao = new WebsiteDao();
        this.userDao = new UserDao();
    }

    async createWebsite(userId: string, institutionId: string | null, data: CreateWebsiteInput) {
        let content;
        let sourceTemplateId: string | undefined;

        if (data.template_id) {
            const template = await templateDao.getWebsiteTemplateById(data.template_id);

            if (!template || template.deletedAt) {
                throw Error('Template not found');
            }

            content = createWebsiteContentFromTemplate(template);
            sourceTemplateId = template.id;
        } else {
            content = normalizeWebsiteContent(data.content);
        }

        return await this.websiteDao.createWebsite(userId, { 
            ...data,
            content,
            ...(sourceTemplateId ? { source_template_id: sourceTemplateId } : {}),
            institution_id: institutionId || undefined 
        } as any);
    }

    async listWebsites(user: any, filters: ListWebsitesQuerySchema) {
        // If an institution_id is explicitly provided, validate the user has access to it
        if (filters.institution_id) {
            if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
                // Super admins can view any institution's websites
                return await this.websiteDao.listWebsites(filters);
            }
            if (user.role === 'INSTITUTION_ADMIN' && user.institution_id === filters.institution_id) {
                // Institution admins can only view their own institution
                return await this.websiteDao.listWebsites(filters);
            }
            // Regular users or institution admins for other orgs: ignore filter, show only owned
            return await this.websiteDao.listWebsites({ ...filters, institution_id: undefined } as any, user.id);
        }

        // Institution Admin sees all websites in their institution by default on their dashboard
        if (user.role === 'INSTITUTION_ADMIN' && user.institution_id) {
            return await this.websiteDao.listWebsites({ 
                ...filters, 
                institution_id: user.institution_id 
            });
        }

        // For Super Admin on personal dash, and regular users: show only their owned websites
        return await this.websiteDao.listWebsites(filters, user.id);
    }

    async listAllWebsites(user: any, filters: ListWebsitesQuerySchema) {
        // Super Admin sees everything (optionally filtered by institution_id)
        if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
            return await this.websiteDao.listWebsites(filters);
        }

        // Institution Admin sees all websites in their institution (ignore other institution_id filters)
        if (user.role === 'INSTITUTION_ADMIN' && user.institution_id) {
            return await this.websiteDao.listWebsites({ 
                ...filters, 
                institution_id: user.institution_id 
            });
        }

        // Regular users/others shouldn't really call listAllWebsites, but if they do, show only their own
        return await this.websiteDao.listWebsites(filters, user.id);
    }

    async getSingleWebsite(website: any) {
        const settingsId = website.settings?.id || website.settings_id;
        const settingsPromise = settingsId ? this.websiteDao.getWebsiteSettings(settingsId) : Promise.resolve(null);
        const ownerPromise = this.userDao.findUserById(website.owner_id);

        const [settings, owner] = await Promise.all([settingsPromise, ownerPromise]);

        return { website, settings, owner };
    }

    async updateWebsite(website: Website, data: UpdateWebsiteInput) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error("Website not found")
        }
        const updateData = {
            ...data,
            ...(data.content ? { content: normalizeWebsiteContent(data.content) } : {}),
        };
        return await this.websiteDao.updateWebsite(website.id, updateData);
    }

    async deleteWebsite(website: Website) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error("Website Already Deleted");
        }
        await this.websiteDao.updateWebsite(website.id, {
            status: WebsiteStatus.DELETED,
            deleted_at: new Date()
        });
        // Remove domain mapping from cache  and invalidate cache
        // mark all domains.status = deleted
    }

    async restoreWebsite(website: Website) {
        if (website.status !== WebsiteStatus.DELETED) {
            throw Error("Website Already not Deleted");
        }
        await this.websiteDao.updateWebsite(website.id, {
            status: WebsiteStatus.DRAFT,
            deleted_at: null
        });
        // mark all domains.status = inactive
    }

    async duplicateWebsite(website: Website) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error("Website Deleted");
        }
        const duplicatedContent = duplicateWebsiteContent(website.content);
        const currentSettings = website.settings_id ? await this.websiteDao.getWebsiteSettings(website.settings_id) : null;

        return await this.websiteDao.createWebsiteWithSettings(website.owner_id, {
            name: `${website.name} (Copy)`,
            ...(website.institution_id ? { institution_id: website.institution_id } : {}),
            content: duplicatedContent,
            settings: currentSettings ? {
                seo: currentSettings.seo,
                contact: currentSettings.contact,
                social_links: currentSettings.social_links,
            } : {},
        });
    }

    async updateWebsiteSettings(website: any, data: UpdateWebsiteSettingsInput) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error("Website Deleted");
        }
        const settingId = website.settings?.id || website.settings_id;
        if (!settingId) throw Error("Settings not found");
        return await this.websiteDao.updateWebsiteSettings(settingId, data);
    }

    async getWebsiteVersions(website: Website) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error('Website Deleted');
        }
        return getWebsiteVersions(website.content);
    }

    async publishWebsite(website: Website, data: PublishWebsiteInput) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error('Website Deleted');
        }

        const published = publishWebsiteContent(website.content, {
            websiteId: website.id,
            ...(data.subdomain ? { subdomain: data.subdomain } : {}),
            ...(data.customDomain ? { customDomain: data.customDomain } : {}),
        });

        await this.websiteDao.updateWebsite(website.id, {
            status: WebsiteStatus.PUBLISHED,
            content: published.content,
        });

        return published.response;
    }

    async getDomains(website: Website) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error('Website Deleted');
        }
        return getWebsiteDomains(website.content);
    }

    async addDomain(website: Website, data: DomainInput) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error('Website Deleted');
        }

        const result = addWebsiteDomain(website.content, data.domain);
        await this.websiteDao.updateWebsite(website.id, { content: result.content });
        return result.domain;
    }

    async removeDomain(website: Website, data: DomainInput) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error('Website Deleted');
        }

        const content = removeWebsiteDomain(website.content, data.domain);
        await this.websiteDao.updateWebsite(website.id, { content });
    }

    async verifyDomain(website: Website, data: DomainInput) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error('Website Deleted');
        }

        const result = verifyWebsiteDomain(website.content, data.domain);
        await this.websiteDao.updateWebsite(website.id, { content: result.content });

        return {
            verified: Boolean(result.domain),
            dnsRecords: result.domain?.dnsRecords || {},
        };
    }

    async cleanupDeletedWebsites() {
        // Hard delete websites that were soft deleted more than 30 days ago
        await this.websiteDao.cleanupDeletedWebsites();
    }
}

export default WebsiteService;