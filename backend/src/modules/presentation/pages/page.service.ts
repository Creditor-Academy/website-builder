import PageDao from './page.dao.js';
import SectionDao from './section.dao.js';
import { NotFoundError, BadRequestError, ConflictError } from '../../../utils/error.utils.js';
import type { CreatePageInput, UpdatePageInput, updateSectionSchema } from './page.validation.js';
import type { DuplicatePageInput } from './page.validation.js';
import type { Page, Section } from '@prisma/client';

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
    async deletePage(page: Page): Promise<void> {
        if (page.deleted_at) {
            throw new BadRequestError('Page is already deleted');
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
    async duplicatePage(websiteId: string, sourcePage: Page, data: DuplicatePageInput): Promise<Page> {
        // Validate slug uniqueness within the website
        const isUnique = await this.pageDao.isSlugUnique(data.slug, websiteId);
        if (!isUnique) {
            throw new ConflictError(`Slug "${data.slug}" already exists in this website`);
        }

        const pageSections = await this.sectionDao.getSectionsByPageId(sourcePage.id);

        // Create new page
        const newPage = await this.pageDao.createPage(websiteId, {
            ...sourcePage,
            name: data.newName,
            slug: data.slug,
            sections: pageSections.map((section) => ({
                category: section.category,
                sectionTemplateId: section.sectionTemplateId,
                order: section.order,
                props: section.props
            }))
        });

        return newPage;
    }
}

export default PageService;
