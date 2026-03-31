import WebsiteDao from './website.dao.js';
import UserDao from '../user/user.dao.js';
import type { CreateWebsiteInput, ListWebsitesQuerySchema, UpdateWebsiteInput, UpdateWebsiteSettingsInput } from './website.validation.js';
import { WebsiteStatus, type Website } from '@prisma/client';

class WebsiteService {
    private websiteDao: WebsiteDao;
    private userDao: UserDao;

    constructor() {
        this.websiteDao = new WebsiteDao();
        this.userDao = new UserDao();
    }

    async createWebsite(userId: string, institutionId: string | null, data: CreateWebsiteInput) {
        return await this.websiteDao.createWebsite(userId, { 
            ...data, 
            institution_id: institutionId || undefined 
        } as any);
    }

    async listWebsites(userId: string, filters: ListWebsitesQuerySchema) {
        return await this.websiteDao.listWebsites(filters, userId);
    }

    async listAllWebsites(filters: ListWebsitesQuerySchema) {
        return await this.websiteDao.listWebsites(filters);
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
        await this.websiteDao.updateWebsite(website.id, data);
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
        // clone website settings, current draft and published version
        // generate new subdomain
    }

    async updateWebsiteSettings(website: any, data: UpdateWebsiteSettingsInput) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error("Website Deleted");
        }
        const settingId = website.settings?.id || website.settings_id;
        if (!settingId) throw Error("Settings not found");
        await this.websiteDao.updateWebsiteSettings(settingId, data);
    }

    async cleanupDeletedWebsites() {
        // Hard delete websites that were soft deleted more than 30 days ago
        await this.websiteDao.cleanupDeletedWebsites();
    }
}

export default WebsiteService;