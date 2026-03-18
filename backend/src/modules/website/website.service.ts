import WebsiteDao from './website.dao.js';
import UserDao from '../user/user.dao.js';
import type {
    CreateWebsiteInput,
    ListWebsitesQuerySchema,
    UpdateWebsiteInput,
    UpdateWebsiteSettingsInput
} from './website.validation.js';
import { GlobalSlotType, WebsiteStatus, type Website } from '@prisma/client';
import PageDao from '../presentation/pages/page.dao.js';
import TemplateDao from '../templates/template.dao.js';
import type { CreatePageInput } from '../presentation/pages/page.validation.js';

class WebsiteService {
    private websiteDao: WebsiteDao;
    private pageDao: PageDao;
    private userDao: UserDao;
    private templateDao: TemplateDao;

    constructor() {
        this.websiteDao = new WebsiteDao();
        this.pageDao = new PageDao();
        this.userDao = new UserDao();
        this.templateDao = new TemplateDao();
    }

    async createWebsite(userId: string, data: CreateWebsiteInput) {
        const { name, templateId } = data;
        // const website = await this.websiteDao.createWebsite(userId, { name });

        if (!templateId) {
            const defaultPage: CreatePageInput = {
                name: 'Home',
                slug: '/home',
                templateId: null,
                page_styles: {},
                meta: {},
                sections: []
            };

            const website = await this.websiteDao.createWebsiteWithPage(
                userId, defaultPage, { name },
                {}, []
            );
            return website;
        }

        if (templateId) {
            const template = await this.templateDao.getWebsiteTemplateById(templateId);
            if (!template) {
                throw Error("Template not found");
            }

            const { navbar, footer, home_layout, global_styles } = template;

            const homepage: CreatePageInput = {
                name: 'Home',
                slug: '/home',
                templateId: template.id,
                page_styles: home_layout,
                meta: {},
                sections: []
            };

            const website = await this.websiteDao.createWebsiteWithPage(
                userId, homepage, { name },
                global_styles,
                [
                    { type: GlobalSlotType.NAVBAR, props: navbar },
                    { type: GlobalSlotType.FOOTER, props: footer }
                ]
            );

            return website;
        }

        return;
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
        const pagesPromise = this.pageDao.findPagesByWebsiteId(website.id);

        const [settings, owner, pages] = await Promise.all([settingsPromise, ownerPromise, pagesPromise]);

        return { website, settings, owner, pages };
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

    async updateWebsiteSettings(website: Website, data: UpdateWebsiteSettingsInput) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error("Website Deleted");
        }
        const settingId = website.settings_id!;
        await this.websiteDao.updateWebsiteSettings(settingId, data);
    }

    async publishWebsite(website: Website) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error("Website Deleted");
        }
        return await this.websiteDao.updateWebsite(website.id, { status: WebsiteStatus.PUBLISHED });
    }

    async unpublishWebsite(website: Website) {
        if (website.status === WebsiteStatus.DELETED) {
            throw Error("Website Deleted");
        }
        return await this.websiteDao.updateWebsite(website.id, { status: WebsiteStatus.DRAFT });
    }

    async cleanupDeletedWebsites() {
        // Hard delete websites that were soft deleted more than 30 days ago
        await this.websiteDao.cleanupDeletedWebsites();
    }
}

export default WebsiteService;