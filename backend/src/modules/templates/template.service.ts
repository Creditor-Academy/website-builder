import TemplateDao from './template.dao.js';
import { NotFoundError, BadRequestError } from '../../utils/error.utils.js';
import type { WebsiteTemplate, SectionTemplate } from '@prisma/client';
import type {
    ListTemplatesQueryInput,
    CreateWebsiteTemplateInput,
    UpdateWebsiteTemplateInput,
    CreateSectionTemplateInput,
    UpdateSectionTemplateInput
} from './template.validation.js';

class TemplateService {
    private templateDao: TemplateDao;

    constructor() {
        this.templateDao = new TemplateDao();
    }

    /**
     * Create a new website template
     */
    async createWebsiteTemplate(data: CreateWebsiteTemplateInput): Promise<WebsiteTemplate> {
        return await this.templateDao.createWebsiteTemplate(data);
    }

    /**
     * Get all website templates
     */
    async listWebsiteTemplates(query: ListTemplatesQueryInput) {
        let templates = await this.templateDao.listWebsiteTemplates(query);
        return templates;
    }

    /**
     * Get single website template
     */
    async getWebsiteTemplate(template: WebsiteTemplate): Promise<WebsiteTemplate> {
        if (!template || template.deleted_at !== null) {
            throw new NotFoundError('Website template not found');
        }

        return template;
    }

    /**
     * Update website template
     */
    async updateWebsiteTemplate(template: WebsiteTemplate, data: UpdateWebsiteTemplateInput): Promise<WebsiteTemplate> {
        if (!template || template.deleted_at !== null) {
            throw new NotFoundError('Website template not found');
        }

        return await this.templateDao.updateWebsiteTemplate(template.id, data);
    }

    /**
     * Delete website template
     */
    async deleteWebsiteTemplate(template: WebsiteTemplate): Promise<void> {
        if (!template || template.deleted_at !== null) {
            throw new NotFoundError('Website template not found');
        }

        await this.templateDao.deleteWebsiteTemplate(template.id);
    }

    /**
     * Restore deleted website template
     */
    async restoreWebsiteTemplate(template: WebsiteTemplate): Promise<WebsiteTemplate> {
        if (!template) {
            throw new NotFoundError('Website template not found');
        }

        if (!template.deleted_at) {
            throw new BadRequestError('Template is not deleted');
        }

        return await this.templateDao.restoreWebsiteTemplate(template.id);
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
            return await this.templateDao.getWebsiteTemplateCategories();
        } else {
            return await this.templateDao.getSectionTemplateCategories();
        }
    }
}

export default TemplateService;
