import PageDao from './page.dao.js';
import SectionDao from './section.dao.js';
import { NotFoundError, BadRequestError, ConflictError } from '../../../utils/error.utils.js';
import type { CreatePageInput, UpdatePageInput, updateSectionSchema } from './page.validation.js';
import type { DuplicatePageInput } from './page.validation.js';
import type { Page, Section } from '@prisma/client';
import { WebsiteWithIncludes } from '../../../types/website.types.js';

class PageService {
    private pageDao: InstanceType<typeof PageDao>;
    private sectionDao: InstanceType<typeof SectionDao>;

    constructor() {
        this.pageDao = new PageDao();
        this.sectionDao = new SectionDao();
    }

    /**
     * Create a new page in the given website.
     * websiteId comes from req.context.website.id (set by resolveWebsiteDraft).
     */
    async createPage(websiteId: string, data: CreatePageInput): Promise<Page> {
        const slug = data.slug;

        // Validate slug uniqueness within the website
        const isUnique = await this.pageDao.isSlugUnique(slug, websiteId);
        if (!isUnique) {
            throw new ConflictError(`Slug "${slug}" already exists in this website`);
        }

        return await this.pageDao.createPage(websiteId, data);
    }

    /**
     * List all pages for a website with pagination and optional search.
     */
    async listPages(websiteId: string): Promise<Page[]> {
        return await this.pageDao.listPagesByWebsiteId(websiteId);
    }

    /**
     * Get single page with full section content.
     */
    async getSinglePage(page: Page): Promise<any> {
        if (page.deleted_at) {
            throw new NotFoundError('Page not found');
        }

        const fullPage = await this.pageDao.getPageFullContent(page.id);
        if (!fullPage) {
            throw new NotFoundError('Page not found');
        }
        return {
            ...fullPage,
            sectionsCount: (fullPage as any).sections?.length ?? 0
        };
    }

    /**
     * Update page details (name, slug, meta, page_styles).
     */
    async updatePage(page: Page, data: UpdatePageInput): Promise<Page> {
        if (page.deleted_at) {
            throw new BadRequestError('Page is already deleted');
        }

        const updateData: any = {};

        if (data.name !== undefined) updateData.name = data.name;

        if (data.slug !== undefined) {
            const isUnique = await this.pageDao.isSlugUnique(data.slug, page.website_id, page.id);
            if (!isUnique) {
                throw new ConflictError(`Slug "${data.slug}" already exists in this website`);
            }
            updateData.slug = data.slug;
        }

        if (data.meta !== undefined) updateData.meta = data.meta;
        if (data.page_styles !== undefined) updateData.page_styles = data.page_styles;

        // Section Operations (not atomic)
        // can be partially updated
        let updates: Promise<Section>[] = [];
        let deletes: Promise<Section>[] = [];
        let restores: Promise<Section>[] = [];

        if (data.updateSections !== undefined) {
            updates = data.updateSections.map(
                (section) => this.sectionDao.updateSection(section.id, section)
            );
        }

        if (data.deleteSections !== undefined) {
            deletes = data.deleteSections.map(
                (sectionId) => this.sectionDao.deleteSection(sectionId)
            );
        }

        if (data.restoreSections !== undefined) {
            restores = data.restoreSections.map(
                (sectionId) => this.sectionDao.restoreSection(sectionId)
            );
        }

        await Promise.all([...updates, ...deletes, ...restores]);

        const updatedPage = await this.pageDao.updatePage(page.id, updateData, data.createSections);

        return updatedPage;
    }

    /**
     * Soft delete a page and all its sections.
     */
    async deletePage(website: WebsiteWithIncludes, page: Page): Promise<void> {
        if (page.deleted_at) {
            throw new BadRequestError('Page is already deleted');
        }

        if (website.homepageId === page.id) {
            throw new BadRequestError('Cannot delete the homepage');
        }

        await this.pageDao.deletePage(page.id);
    }

    /**
     * Restore a soft-deleted page and its sections.
     */
    async restorePage(page: Page): Promise<void> {
        if (!page.deleted_at) {
            throw new BadRequestError('Page is not deleted');
        }
        await this.pageDao.restorePage(page.id);
    }

    /**
     * Duplicate a page and all its sections into the same website.
     */
    async duplicatePage(
        websiteId: string,
        sourcePage: Page & { sections: Section[] },
        data: DuplicatePageInput
    ): Promise<Page> {
        // Validate slug uniqueness within the website
        const isUnique = await this.pageDao.isSlugUnique(data.slug, websiteId);
        if (!isUnique) {
            throw new ConflictError(`Slug "${data.slug}" already exists in this website`);
        }

        // Create new page
        const newPage = await this.pageDao.clonePage(websiteId, sourcePage, data);
        return newPage;
    }

    /**
     * Cleanup deleted pages
     */
    async cleanupDeletedPages() {
        await this.pageDao.cleanupDeletedPages();
    }
}

export default PageService;