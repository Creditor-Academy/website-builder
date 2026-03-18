import prismaClient from '../../config/prisma.js';
import type { Prisma, SectionTemplate, WebsiteTemplate } from '@prisma/client';
import type {
    CreateWebsiteTemplateInput,
    CreateSectionTemplateInput,
    ListTemplatesQueryInput,
    UpdateWebsiteTemplateInput,
    UpdateSectionTemplateInput
} from './template.validation.js';

class TemplateDao {

    // ==============================
    // Website Template Operations
    // ==============================

    /**
     * Create a new website template
     */
    async createWebsiteTemplate(data: CreateWebsiteTemplateInput): Promise<WebsiteTemplate> {
        return await prismaClient.websiteTemplate.create({
            data: {
                ...data,
                thumbnail_url: data.thumbnail_url || null
            }
        });
    }

    /**
     * Get all website templates
     */
    async listWebsiteTemplates(options: ListTemplatesQueryInput) {
        const { page = 1, limit = 10, category, search } = options;
        const skip = (page - 1) * limit;

        const where: Prisma.WebsiteTemplateWhereInput = {};

        where.deleted_at = null;
        if (category) where.category = category;

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { category: { contains: category || '', mode: 'insensitive' } },
            ]
        }

        return await prismaClient.websiteTemplate.findMany({
            where, skip,
            take: limit,
            orderBy: { created_at: 'desc' }
        });
    }

    /**
     * Get website template by ID
     */
    async getWebsiteTemplateById(templateId: string): Promise<WebsiteTemplate | null> {
        return await prismaClient.websiteTemplate.findFirst({
            where: { id: templateId }
        });
    }

    /**
     * Update website template
     */
    async updateWebsiteTemplate(
        templateId: string,
        data: UpdateWebsiteTemplateInput
    ): Promise<WebsiteTemplate> {
        // Removed Undefined Values from Object
        const updatedData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => value !== undefined)
        );

        return await prismaClient.websiteTemplate.update({
            where: { id: templateId },
            data: updatedData
        });
    }

    /**
     * Soft delete website template
     */
    async deleteWebsiteTemplate(templateId: string): Promise<WebsiteTemplate> {
        return await prismaClient.websiteTemplate.update({
            where: { id: templateId },
            data: { deleted_at: new Date() }
        });
    }

    /**
     * Restore deleted website template
     */
    async restoreWebsiteTemplate(templateId: string): Promise<WebsiteTemplate> {
        return await prismaClient.websiteTemplate.update({
            where: { id: templateId },
            data: { deleted_at: null }
        });
    }

    /**
     * Get unique categories for website templates
     */
    async getWebsiteTemplateCategories(): Promise<string[]> {
        const templates = await prismaClient.websiteTemplate.findMany({
            where: { deleted_at: null },
            distinct: ['category'],
            select: { category: true }
        });

        return templates.map(t => t.category);
    }

    // ===============================
    // Section Template Operations
    // ===============================

    /**
     * Create a new section template
     */
    async createSectionTemplate(data: CreateSectionTemplateInput): Promise<SectionTemplate> {
        return await prismaClient.sectionTemplate.create({
            data: {
                ...data,
                thumbnail_url: data.thumbnail_url || null,
                props: data.props as any
            }
        });
    }

    /**
     * Get all section templates
     */
    async listSectionTemplates(options: ListTemplatesQueryInput) {
        const { page = 1, limit = 10, category, search } = options;
        const skip = (page - 1) * limit;

        const where: Prisma.SectionTemplateWhereInput = {};

        where.deleted_at = null;
        if (category) where.category = category;

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { category: { contains: category || '', mode: 'insensitive' } },
            ]
        }

        return await prismaClient.sectionTemplate.findMany({
            where, skip,
            take: limit,
            orderBy: { created_at: 'desc' }
        });
    }

    /**
     * Get section template by ID
     */
    async getSectionTemplateById(templateId: string): Promise<SectionTemplate | null> {
        return await prismaClient.sectionTemplate.findFirst({
            where: { id: templateId }
        });
    }

    /**
     * Get section template including deleted
     */
    async getSectionTemplateByIdWithDeleted(templateId: string): Promise<SectionTemplate | null> {
        return await prismaClient.sectionTemplate.findUnique({
            where: { id: templateId }
        });
    }

    /**
     * Update section template
     */
    async updateSectionTemplate(
        templateId: string,
        data: UpdateSectionTemplateInput
    ): Promise<SectionTemplate> {
        const updatedData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => value !== undefined)
        );

        return await prismaClient.sectionTemplate.update({
            where: { id: templateId },
            data: updatedData
        });
    }

    /**
     * Soft delete section template
     */
    async deleteSectionTemplate(templateId: string): Promise<SectionTemplate> {
        return await prismaClient.sectionTemplate.update({
            where: { id: templateId },
            data: { deleted_at: new Date() }
        });
    }

    /**
     * Restore deleted section template
     */
    async restoreSectionTemplate(templateId: string): Promise<SectionTemplate> {
        return await prismaClient.sectionTemplate.update({
            where: { id: templateId },
            data: { deleted_at: null }
        });
    }

    /**
     * Get unique categories for section templates
     */
    async getSectionTemplateCategories(): Promise<string[]> {
        const templates = await prismaClient.sectionTemplate.findMany({
            where: { deleted_at: null },
            distinct: ['category'],
            select: { category: true }
        });

        return templates.map(t => t.category);
    }
}

export default TemplateDao;
