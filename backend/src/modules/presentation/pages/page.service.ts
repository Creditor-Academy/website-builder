import PageDao from './page.dao.js';
import SectionDao from '../sections/section.dao.js';
import { NotFoundError, BadRequestError, ConflictError } from '../../../utils/error.utils.js';
import type { CreatePageInput, UpdatePageInput } from './page.validation.js';
import type { ListPagesQueryInput } from './page.validation.js';
import type { DuplicatePageInput } from './page.validation.js';
import type { Page } from '@prisma/client';

class PageService {
    private pageDao: InstanceType<typeof PageDao>;
    private sectionDao: InstanceType<typeof SectionDao>;

    constructor() {
        this.pageDao = new PageDao();
        this.sectionDao = new SectionDao();
    }

    /**
     * Create a new page in the given version.
     * versionId comes from req.context.version.id (set by resolveWebsiteDraft).
     */
    async createPage(versionId: string, data: CreatePageInput): Promise<Page> {
        const slug = data.slug;

        // Validate slug uniqueness within the version
        const isUnique = await this.pageDao.isSlugUnique(slug, versionId);
        if (!isUnique) {
            throw new ConflictError(`Slug "${slug}" already exists in this version`);
        }

        return await this.pageDao.createPage({
            name: data.name,
            slug,
            version_id: versionId,
            meta: data.meta || {},
            page_styles: data.page_styles
        });
    }

    /**
     * List all pages for a version with pagination and optional search.
     */
    async listPages(versionId: string, query: ListPagesQueryInput): Promise<Page[]> {
        const { page = 1, limit = 50, search } = query;
        const skip = (page - 1) * limit;

        return await this.pageDao.listPagesByVersion(versionId, {
            skip,
            take: limit,
            ...(search ? { search } : {})
        });
    }

    /**
     * Get single page with full section content.
     */
    async getSinglePage(page: Page): Promise<any> {
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
        const updateData: any = {};

        if (data.name !== undefined) updateData.name = data.name;

        if (data.slug !== undefined) {
            const isUnique = await this.pageDao.isSlugUnique(data.slug, page.version_id, page.id);
            if (!isUnique) {
                throw new ConflictError(`Slug "${data.slug}" already exists in this version`);
            }
            updateData.slug = data.slug;
        }

        if (data.meta !== undefined) updateData.meta = data.meta;
        if (data.page_styles !== undefined) updateData.page_styles = data.page_styles;

        return await this.pageDao.updatePage(page.id, updateData);
    }

    /**
     * Soft delete a page and all its sections.
     */
    async deletePage(page: Page): Promise<void> {
        const sections = await this.sectionDao.getSectionsByPageId(page.id);
        if (sections.length > 0) {
            await this.sectionDao.deleteSections(sections.map((s: any) => s.id));
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
     * Duplicate a page and all its sections into the same version.
     */
    async duplicatePage(versionId: string, sourcePage: Page, data: DuplicatePageInput): Promise<Page> {
        // Validate slug uniqueness within the version
        const isUnique = await this.pageDao.isSlugUnique(data.slug, versionId);
        if (!isUnique) {
            throw new ConflictError(`Slug "${data.slug}" already exists in this version`);
        }

        // Create new page
        const newPage = await this.pageDao.createPage({
            name: data.newName,
            slug: data.slug,
            version_id: versionId,
            meta: sourcePage.meta,
            page_styles: sourcePage.page_styles
        });

        // Duplicate sections
        const sections = await this.sectionDao.getSectionsByPageId(sourcePage.id);
        for (const section of sections) {
            await this.sectionDao.duplicateSection(section, newPage.id);
        }

        return newPage;
    }
}

export default PageService;
