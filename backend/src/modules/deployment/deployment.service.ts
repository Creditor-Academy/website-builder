import { Domain, GlobalDesign, Page, PageSnapshot, Section, Settings, Website, WebsiteStatus } from "@prisma/client";
import DeploymentDao from "./deployment.dao.js";
import cacheService from "../../services/cache.service.js";
import { generateDomainKey, generateSnapshotKey } from "../../builders/redis-key.builder.js";
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/error.utils.js";
import DomainDao from "../domain/domain.dao.js";
import { DOMAIN_REDIS_TTL } from "../../constants/domains.constants.js";
import { SNAPSHOT_REDIS_TTL } from "../../constants/website.constants.js";

class DeploymentService {
    private deploymentDao: DeploymentDao;
    private domainDao: DomainDao;

    constructor() {
        this.deploymentDao = new DeploymentDao();
        this.domainDao = new DomainDao();
    }

    generateSnapshotData(
        websiteId: string,
        page: Page,
        sections: Section[],
        globalDesign: GlobalDesign,
        settings: Settings
    ) {
        const snapshotData = {
            website_id: websiteId,
            page_id: page.id,
            name: page.name,
            global_styles: globalDesign.global_styles,
            page_styles: page.page_styles,
            slug: page.slug,
            meta: page.meta,
            sections: sections.map((section) => {
                const { id, category, props, order } = section;
                return { id, category, props, order };
            }),
            settings: settings,
            created_at: new Date()
        }
        return snapshotData;
    }

    async generatePageSnapshots(websiteId: string): Promise<PageSnapshot[]> {
        const website = await this.deploymentDao.getCompleteWebsite(websiteId);
        if (!website) {
            throw new Error('Website not found');
        }

        const { settings, globalDesign, pages } = website;

        const pageSnapshots: PageSnapshot[] = await Promise.all(
            pages.map(async (page) => {
                const snapshotData = this.generateSnapshotData(website.id, page, page.sections, globalDesign, settings);
                const pageSnapshot = await this.deploymentDao.createPageSnapshot(website.id, page, snapshotData);
                return pageSnapshot;
            })
        );
        return pageSnapshots;
    }

    getDomains(website: Website & { domains: Domain[] }) {
        const subdomain = website.domains.find((domain) => !domain.custom);
        const defaultDomain = `${subdomain!.name}.${process.env.PLATFORM_DOMAIN}`;

        const customDomain = website.domains.find((domain) => domain.custom);
        return { defaultDomain, customDomain };
    }

    async cachePageSnapshot(pageSnapshot: PageSnapshot, domain: string) {
        const snapshotKey = generateSnapshotKey(domain, pageSnapshot.slug);
        await cacheService.set(snapshotKey, pageSnapshot.snapshot, SNAPSHOT_REDIS_TTL);
    }

    async publishWebsite(website: Website) {
        if (website.status === WebsiteStatus.PUBLISHED) {
            throw new ConflictError('Website is already published');
        }
        if (!website.homepageId) {
            throw new BadRequestError('Atleast homepage required to publish website');
        }

        // ======= DELETE and CREATE new page snapshots =======

        // delete existing website snapshots
        await this.deploymentDao.deletePageSnapshots(website.id);

        // generate page snapshots
        const pageSnapshots = await this.generatePageSnapshots(website.id);

        // ======= UPDATE WEBSITE STATUS to PUBLISHED =======

        // update website status to published
        const publishedWebsite = await this.deploymentDao.updateWebsiteStatus(website.id, WebsiteStatus.PUBLISHED);

        // ======= CACHE PAGE SNAPSHOTS in REDIS =======

        const { defaultDomain, customDomain } = this.getDomains(publishedWebsite);

        // cache domain in redis
        const defaultDomainCachePromise = cacheService.set(
            generateDomainKey(defaultDomain),
            { website_id: publishedWebsite.id },
            DOMAIN_REDIS_TTL
        );

        const customDomainCachePromise = customDomain
            ? cacheService.set(
                generateDomainKey(customDomain.name),
                { website_id: publishedWebsite.id },
                DOMAIN_REDIS_TTL
            )
            : Promise.resolve();

        // cache snapshots in redis
        const defaultDomainSnapshotCachePromise = Promise.all(pageSnapshots.map(
            (pageSnapshot) => this.cachePageSnapshot(pageSnapshot, defaultDomain)
        ));

        // cache custom domain snapshots in redis
        const customDomainSnapshotCachePromise = customDomain
            ? Promise.all(pageSnapshots.map(
                (pageSnapshot) => this.cachePageSnapshot(pageSnapshot, customDomain!.name)
            ))
            : Promise.resolve();

        // cache both domains in parallel
        await Promise.all([
            defaultDomainCachePromise,
            customDomainCachePromise,
            defaultDomainSnapshotCachePromise,
            customDomainSnapshotCachePromise
        ]);
    };

    async unpublishWebsite(website: Website) {
        if (website.status === WebsiteStatus.DRAFT) {
            throw new ConflictError('Website is already unpublished');
        }

        // ======== UPDATE WEBSITE STATUS to DRAFT ========

        const unpublishedWebsite = await this.deploymentDao.updateWebsiteStatus(website.id, WebsiteStatus.DRAFT);

        // ======== REMOVE CACHED PAGE SNAPSHOTS from REDIS ========

        const { defaultDomain, customDomain } = this.getDomains(unpublishedWebsite);

        // remove domain cache
        const defaultDomainCacheClearPromise = cacheService.del(generateDomainKey(defaultDomain));
        const customDomainCacheClearPromise = customDomain
            ? cacheService.del(generateDomainKey(customDomain.name))
            : Promise.resolve();

        // remove all snapshots stored in redis (for both domains)
        const defaultDomainSnapshotCacheClearPromise = cacheService.clear(generateSnapshotKey(defaultDomain, "*"));
        const customDomainSnapshotCacheClearPromise = customDomain
            ? cacheService.clear(generateSnapshotKey(customDomain.name, "*"))
            : Promise.resolve();

        // remove both domains snapshots in parallel
        await Promise.all([
            defaultDomainCacheClearPromise,
            customDomainCacheClearPromise,
            defaultDomainSnapshotCacheClearPromise,
            customDomainSnapshotCacheClearPromise
        ]);
    };

    // fetch and cache domain
    async resolveDomain(hostname: string) {
        // fetch domain from cache
        const domainCacheKey = generateDomainKey(hostname);

        const cachedDomain = await cacheService.get(domainCacheKey) as { website_id: string } | null;
        if (cachedDomain) {
            return cachedDomain.website_id;
        }

        // extract subdomain if not custom
        let domainName = hostname;
        if (hostname.endsWith(`.${process.env.PLATFORM_DOMAIN}`)) {
            domainName = hostname.replace(`.${process.env.PLATFORM_DOMAIN}`, '');
        }

        // if domain not found in cache, fetch website from database
        const domain = await this.domainDao.fetchDomainByHostnameWithWebsite(domainName);
        if (!domain || !domain.verified) {
            throw new NotFoundError('Domain not found');
        }

        // if website is not published, throw error
        if (domain.website.status !== WebsiteStatus.PUBLISHED) {
            throw new NotFoundError('Website not found');
        }

        // cache domain in redis
        await cacheService.set(domainCacheKey, { website_id: domain.website_id }, DOMAIN_REDIS_TTL);

        return domain.website_id;
    }

    // fetch and cache page snapshot
    async resolvePageSnapshot(websiteId: string, hostname: string, slug: string) {
        // fetch page snapshot from database
        const pageSnapshot = await this.deploymentDao.getPageSnapshotBySlug(websiteId, slug);
        if (!pageSnapshot) {
            throw new NotFoundError('Page not found');
        }

        // cache page snapshot in redis
        await this.cachePageSnapshot(pageSnapshot, hostname);

        return pageSnapshot;
    }

    async renderLiveWebsite(hostname: string, slug: string) {
        const websiteId = await this.resolveDomain(hostname);

        // fetch page snapshot from cache
        const snapshotKey = generateSnapshotKey(hostname, slug);

        // if snapshot not found in cache, fetch domain
        const cachedPageSnapshot = await cacheService.get(snapshotKey);
        if (cachedPageSnapshot) {
            return cachedPageSnapshot;
        }

        // fetch and cache page snapshot
        return await this.resolvePageSnapshot(websiteId, hostname, slug);
    }
}

export default DeploymentService;