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

    async createWebsite(userId: string, data: CreateWebsiteInput) {
        return await this.websiteDao.createWebsite(userId, data);

        // Initialize settings, global_design, homepage, clone from template if needed
        // Generate new subdomain
    }

    async listWebsites(userId: string, filters: ListWebsitesQuerySchema) {
        return await this.websiteDao.listWebsites(filters, userId);
    }

    async listAllWebsites(filters: ListWebsitesQuerySchema) {
        return await this.websiteDao.listWebsites(filters);
    }

    async getSingleWebsite(website: Website) {
        const settingsPromise = this.websiteDao.getWebsiteSettings(website.settings_id!);
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
        // clone website, settings, global design, pages, sections
        // generate new subdomain
    }

    async updateWebsiteSettings(website: Website, data: UpdateWebsiteSettingsInput) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error("Website Deleted");
        }
        const settingId = website.settings_id!;
        await this.websiteDao.updateWebsiteSettings(settingId, data);
    }

    async cleanupDeletedWebsites() {
        // Hard delete websites that were soft deleted more than 30 days ago
        await this.websiteDao.cleanupDeletedWebsites();
    }
}

export default WebsiteService;