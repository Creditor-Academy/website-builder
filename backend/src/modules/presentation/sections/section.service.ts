import SectionDao from './section.dao.js';
import PageDao from '../pages/page.dao.js';
import { NotFoundError, BadRequestError } from '../../../utils/error.utils.js';
import type { CreateSectionInput, UpdateSectionInput, ReorderSectionsInput } from './section.validation.js';
import type { Section } from '@prisma/client';

class SectionService {
    private sectionDao: SectionDao;
    private pageDao: PageDao;

    constructor() {
        this.sectionDao = new SectionDao();
        this.pageDao = new PageDao();
    }

    /**
     * Create a new section in a page
     */
    async createSection(pageId: string, data: CreateSectionInput): Promise<Section> {
        // Verify page exists
        const page = await this.pageDao.getPageById(pageId);
        if (!page) {
            throw new NotFoundError('Page not found');
        }

        // Validate category
        if (!data.category || data.category.trim().length === 0) {
            throw new BadRequestError('Section category is required');
        }

        // Validate props
        if (!data.props || Object.keys(data.props).length === 0) {
            throw new BadRequestError('Section props must contain at least one property');
        }

        // Get next order if not provided
        const order = data.order !== undefined ? data.order : await this.sectionDao.getMaxOrderInPage(pageId);

        const section = await this.sectionDao.createSection({
            page_id: pageId,
            category: data.category,
            order,
            props: data.props,
            sectionTemplateId: data.sectionTemplateId
        });

        return section;
    }

    /**
     * Get section by ID
     */
    async getSection(sectionId: string): Promise<Section> {
        const section = await this.sectionDao.getSectionById(sectionId);

        if (!section) {
            throw new NotFoundError('Section not found');
        }

        return section;
    }

    /**
     * Get all sections for a page
     */
    async getSectionsByPage(pageId: string): Promise<Section[]> {
        // Verify page exists
        const page = await this.pageDao.getPageById(pageId);
        if (!page) {
            throw new NotFoundError('Page not found');
        }

        return await this.sectionDao.getSectionsByPageId(pageId);
    }

    /**
     * Update section
     */
    async updateSection(sectionId: string, data: UpdateSectionInput): Promise<Section> {
        const section = await this.getSection(sectionId);

        const updateData: any = {};

        if (data.category !== undefined) {
            if (data.category.trim().length === 0) {
                throw new BadRequestError('Section category cannot be empty');
            }
            updateData.category = data.category;
        }

        if (data.props !== undefined) {
            if (Object.keys(data.props).length === 0) {
                throw new BadRequestError('Section props must contain at least one property');
            }
            // Merge with existing props
            updateData.props = { ...section.props, ...data.props };
        }

        if (data.order !== undefined) {
            if (data.order < 0) {
                throw new BadRequestError('Section order must be non-negative');
            }
            updateData.order = data.order;
        }

        if (Object.keys(updateData).length === 0) {
            throw new BadRequestError('No fields provided for update');
        }

        return await this.sectionDao.updateSection(sectionId, updateData);
    }

    /**
     * Delete section
     */
    async deleteSection(sectionId: string): Promise<void> {
        const section = await this.getSection(sectionId);
        await this.sectionDao.deleteSection(sectionId);
    }

    /**
     * Restore deleted section
     */
    async restoreSection(sectionId: string): Promise<Section> {
        const section = await this.sectionDao.getSectionByIdWithDeleted(sectionId);

        if (!section) {
            throw new NotFoundError('Section not found');
        }

        if (!section.deleted_at) {
            throw new BadRequestError('Section is not deleted');
        }

        return await this.sectionDao.restoreSection(sectionId);
    }

    /**
     * Reorder sections within a page
     */
    async reorderSections(pageId: string, data: ReorderSectionsInput): Promise<Section[]> {
        // Verify page exists
        const page = await this.pageDao.getPageById(pageId);
        if (!page) {
            throw new NotFoundError('Page not found');
        }

        // Validate all section IDs belong to this page
        const pagesSections = await this.sectionDao.getSectionsByPageId(pageId);
        const sectionIdMap = new Set(pagesSections.map(s => s.id));

        for (const sectionUpdate of data.sections) {
            if (!sectionIdMap.has(sectionUpdate.id)) {
                throw new BadRequestError(`Section ${sectionUpdate.id} does not belong to this page`);
            }
        }

        // Check for duplicate orders
        const orders = data.sections.map(s => s.order);
        if (new Set(orders).size !== orders.length) {
            throw new BadRequestError('Duplicate orders are not allowed');
        }

        return await this.sectionDao.reorderSections(data.sections);
    }

    /**
     * Move section to a new position
     */
    async moveSectionOrder(pageId: string, sectionId: string, newOrder: number): Promise<void> {
        // Verify page exists
        const page = await this.pageDao.getPageById(pageId);
        if (!page) {
            throw new NotFoundError('Page not found');
        }

        // Verify section exists and belongs to page
        const section = await this.getSection(sectionId);
        if (section.page_id !== pageId) {
            throw new BadRequestError('Section does not belong to this page');
        }

        if (newOrder < 0) {
            throw new BadRequestError('New order must be non-negative');
        }

        await this.sectionDao.moveSectionOrder(pageId, sectionId, newOrder);
    }

    /**
     * Duplicate section
     */
    async duplicateSection(sectionId: string): Promise<Section> {
        const section = await this.getSection(sectionId);

        const duplicated = await this.sectionDao.duplicateSection(sectionId);

        return duplicated;
    }

    /**
     * Delete multiple sections
     */
    async deleteSections(sectionIds: string[]): Promise<void> {
        if (sectionIds.length === 0) {
            throw new BadRequestError('At least one section ID must be provided');
        }

        await this.sectionDao.deleteSections(sectionIds);
    }

    /**
     * Batch create sections (for template-based page creation)
     */
    async createSectionsBatch(pageId: string, sections: Array<{
        category: string;
        props: any;
        sectionTemplateId?: string;
    }>): Promise<Section[]> {
        // Verify page exists
        const page = await this.pageDao.getPageById(pageId);
        if (!page) {
            throw new NotFoundError('Page not found');
        }

        if (sections.length === 0) {
            throw new BadRequestError('At least one section must be provided');
        }

        // Prepare section data with order
        const sectionsData = sections.map((section, index) => ({
            page_id: pageId,
            category: section.category,
            order: index,
            props: section.props,
            sectionTemplateId: section.sectionTemplateId || null
        }));

        return await this.sectionDao.createSectionsBatch(sectionsData);
    }
}

export default SectionService;
