import TemplateDao from './template.dao.js';
import { NotFoundError, BadRequestError } from '../../utils/error.utils.js';
import type { PageTemplate, SectionTemplate } from '@prisma/client';
import type {
    ListTemplatesQueryInput,
    CreatePageTemplateInput,
    UpdatePageTemplateInput,
    CreateSectionTemplateInput,
    UpdateSectionTemplateInput
} from './template.validation.js';

class TemplateService {
    private templateDao: TemplateDao;

    constructor() {
        this.templateDao = new TemplateDao();
    }

    /**
     * Create a new page template
     */
    async createPageTemplate(data: CreatePageTemplateInput): Promise<PageTemplate> {
        return await this.templateDao.createPageTemplate(data);
    }

    /**
     * Get all page templates
     */
    async listPageTemplates(query: ListTemplatesQueryInput) {
        let templates = await this.templateDao.listPageTemplates(query);
        return templates;
    }

    /**
     * Get single page template
     */
    async getPageTemplate(template: PageTemplate): Promise<PageTemplate> {
        if (!template || template.deleted_at !== null) {
            throw new NotFoundError('Page template not found');
        }

        return template;
    }

    /**
     * Update page template
     */
    async updatePageTemplate(template: PageTemplate, data: UpdatePageTemplateInput): Promise<PageTemplate> {
        if (!template || template.deleted_at !== null) {
            throw new NotFoundError('Page template not found');
        }

        return await this.templateDao.updatePageTemplate(template.id, data);
    }

    /**
     * Delete page template
     */
    async deletePageTemplate(template: PageTemplate): Promise<void> {
        if (!template || template.deleted_at !== null) {
            throw new NotFoundError('Page template not found');
        }

        await this.templateDao.deletePageTemplate(template.id);
    }

    /**
     * Restore deleted page template
     */
    async restorePageTemplate(template: PageTemplate): Promise<PageTemplate> {
        if (!template) {
            throw new NotFoundError('Page template not found');
        }

        if (!template.deleted_at) {
            throw new BadRequestError('Template is not deleted');
        }

        return await this.templateDao.restorePageTemplate(template.id);
    }

    /**
     * Create a new section template
     */
    async createSectionTemplate(data: CreateSectionTemplateInput): Promise<SectionTemplate> {
        return await this.templateDao.createSectionTemplate(data);
    }

    /**
     * Get all section templates
     */
    async listSectionTemplates(query: ListTemplatesQueryInput) {
        let templates = await this.templateDao.listSectionTemplates(query);
        return templates;
    }

    /**
     * Get single section template
     */
    async getSectionTemplate(template: SectionTemplate): Promise<SectionTemplate> {
        if (!template || template.deleted_at !== null) {
            throw new NotFoundError('Section template not found');
        }

        return template;
    }

    /**
     * Update section template
     */
    async updateSectionTemplate(template: SectionTemplate, data: UpdateSectionTemplateInput): Promise<SectionTemplate> {
        if (!template || template.deleted_at !== null) {
            throw new NotFoundError('Section template not found');
        }

        return await this.templateDao.updateSectionTemplate(template.id, data);
    }

    /**
     * Delete section template
     */
    async deleteSectionTemplate(template: SectionTemplate): Promise<void> {
        if (!template || template.deleted_at !== null) {
            throw new NotFoundError('Section template not found');
        }

        await this.templateDao.deleteSectionTemplate(template.id);
    }

    /**
     * Restore deleted section template
     */
    async restoreSectionTemplate(template: SectionTemplate): Promise<SectionTemplate> {
        if (!template) {
            throw new NotFoundError('Section template not found');
        }

        if (!template.deleted_at) {
            throw new BadRequestError('Template is not deleted');
        }

        return await this.templateDao.restoreSectionTemplate(template.id);
    }

    /**
     * Get available template categories
     */
    async getAvailableCategories(type: 'pages' | 'sections') {
        if (type === 'pages') {
            return await this.templateDao.getPageTemplateCategories();
        } else {
            return await this.templateDao.getSectionTemplateCategories();
        }
    }
}

export default TemplateService;
