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
import GlobalDesignDao from '../presentation/global-design/global-design.dao.js';
import DomainDao from '../domain/domain.dao.js';
import type { CreatePageInput } from '../presentation/pages/page.validation.js';
import { JsonObjectType } from '../../utils/validator.utils.js';
import { ConflictError, NotFoundError } from '../../utils/error.utils.js';

class WebsiteService {
    private websiteDao: WebsiteDao;
    private pageDao: PageDao;
    private userDao: UserDao;
    private templateDao: TemplateDao;
    private globalDesignDao: GlobalDesignDao;
    private domainDao: DomainDao;

    constructor() {
        this.websiteDao = new WebsiteDao();
        this.pageDao = new PageDao();
        this.userDao = new UserDao();
        this.templateDao = new TemplateDao();
        this.globalDesignDao = new GlobalDesignDao();
        this.domainDao = new DomainDao();
    }

    generateUniqueSubdomain(name: string) {
        // replaces non-alphanumeric characters with hyphens and converts to lowercase
        // and appends last 7 characters of current timestamp in base 36 (collision chances once in 36^7ms = 2.5 years)
        const subdomain = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString(36).slice(-7);
        return subdomain;
    }

    async createWebsite(userId: string, data: CreateWebsiteInput) {
        const { name, templateId } = data;
        // const website = await this.websiteDao.createWebsite(userId, { name });

        const subdomain = this.generateUniqueSubdomain(name);

        if (!templateId) {
            const defaultPage: CreatePageInput = {
                name: 'Home',
                slug: '/',
                page_styles: {},
                meta: {},
                sections: []
            };

            const website = await this.websiteDao.createWebsiteWithPage(
                userId, defaultPage, { name },
                {}, [],
                subdomain
            );
            return website;
        }

        if (templateId) {
            const template = await this.templateDao.getWebsiteTemplateById(templateId);
            if (!template) {
                throw new NotFoundError("Template not found");
            }

            const { navbar, footer, home_layout, global_styles } = template;

            const homepage: CreatePageInput = {
                name: 'Home',
                slug: '/',
                page_styles: home_layout as JsonObjectType || {},
                meta: {},
                sections: []
            };

            const website = await this.websiteDao.createWebsiteWithPage(
                userId, homepage, { name },
                global_styles,
                [
                    { type: GlobalSlotType.NAVBAR, props: navbar },
                    { type: GlobalSlotType.FOOTER, props: footer }
                ],
                subdomain
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
        const globalDesignPromise = this.globalDesignDao.getGlobalDesignById(website.globalDesignId!);
        const domainsPromise = this.domainDao.getDomainsByWebsiteId(website.id);

        const [settings, owner, pages, globalDesign, domains] = await Promise.all(
            [settingsPromise, ownerPromise, pagesPromise, globalDesignPromise, domainsPromise]
        );

        // process domains to add platform domain if not custom
        const processedDomains = domains.map((domain) => {
            return {
                ...domain,
                name: domain.custom ? domain.name : `${domain.name}.${process.env.PLATFORM_DOMAIN}`
            };
        });

        return { website, settings, owner, pages, globalDesign, domains: processedDomains };
    }

    async updateWebsite(website: Website, data: UpdateWebsiteInput) {
        if (website.status === WebsiteStatus.DELETED) {
            throw new NotFoundError("Website not found")
        }
        await this.websiteDao.updateWebsite(website.id, data);
    }

    async deleteWebsite(website: Website) {
        if (website.status === WebsiteStatus.DELETED) {
            throw new ConflictError("Website Already Deleted");
        }
        await this.websiteDao.updateWebsite(website.id, {
            status: WebsiteStatus.DELETED,
            deleted_at: new Date()
        });
        // Remove domain mapping from cache  and invalidate cache
        // mark all domains.status = inactive
    }

    async restoreWebsite(website: Website) {
        if (website.status !== WebsiteStatus.DELETED) {
            throw new ConflictError("Website Already not Deleted");
        }
        await this.websiteDao.updateWebsite(website.id, {
            status: WebsiteStatus.DRAFT,
            deleted_at: null
        });
    }

    async duplicateWebsite(website: Website) {
        if (website.status === WebsiteStatus.DELETED) {
            throw new NotFoundError("Website Deleted");
        }

        const settingsPromise = this.websiteDao.getWebsiteSettings(website.settings_id!);
        const globalDesignPromise = this.globalDesignDao.getGlobalDesignById(website.globalDesignId!);
        const pagesPromise = this.pageDao.listPagesByWebsiteId(website.id);

        const [settings, globalDesign, pages] = await Promise.all([settingsPromise, globalDesignPromise, pagesPromise]);

        // generate new subdomain
        const subdomain = this.generateUniqueSubdomain(website.name + "-copy");

        const newWebsite = await this.websiteDao.cloneWebsite(website, settings!, globalDesign!, pages, subdomain);

        return newWebsite;
    }

    async updateWebsiteSettings(website: Website, data: UpdateWebsiteSettingsInput) {
        if (website.status === WebsiteStatus.DELETED) {
            throw new NotFoundError("Website Deleted");
        }
        const settingId = website.settings_id!;
        await this.websiteDao.updateWebsiteSettings(settingId, data);
    }

    async publishWebsite(website: Website) {
        if (website.status === WebsiteStatus.DELETED) {
            throw new NotFoundError("Website Deleted");
        }
        return await this.websiteDao.updateWebsite(website.id, { status: WebsiteStatus.PUBLISHED });
    }

    async unpublishWebsite(website: Website) {
        if (website.status === WebsiteStatus.DELETED) {
            throw new NotFoundError("Website Deleted");
        }
        return await this.websiteDao.updateWebsite(website.id, { status: WebsiteStatus.DRAFT });
    }

    async cleanupDeletedWebsites() {
        // Hard delete websites that were soft deleted more than 30 days ago
        await this.websiteDao.cleanupDeletedWebsites();
    }
}

export default WebsiteService;