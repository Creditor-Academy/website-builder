import prismaClient from '../../config/prisma.js';
import type { PageTemplate, Prisma, SectionTemplate } from '@prisma/client';
import type {
    CreatePageTemplateInput,
    CreateSectionTemplateInput,
    ListTemplatesQueryInput,
    UpdatePageTemplateInput,
    UpdateSectionTemplateInput
} from './template.validation.js';

class TemplateDao {
    // ==============================
    // Page Template Operations
    // ==============================

    /**
     * Get all page templates
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
     * Create a new page template
     */
    async createPageTemplate(data: CreatePageTemplateInput): Promise<PageTemplate> {
        return await prismaClient.pageTemplate.create({
            data: {
                ...data,
                thumbnail_url: data.thumbnail_url || null
            }
        });
    }

    /**
     * Get all page templates
     */
    async listPageTemplates(options: ListTemplatesQueryInput) {
        const { page = 1, limit = 10, category, search } = options;
        const skip = (page - 1) * limit;

        const where: Prisma.PageTemplateWhereInput = {};

        where.deleted_at = null;
        if (category) where.category = category;

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { category: { contains: category || '', mode: 'insensitive' } },
            ]
        }

        return await prismaClient.pageTemplate.findMany({
            where, skip,
            take: limit,
            orderBy: { created_at: 'desc' }
        });
    }

    /**
     * Get page template by ID
     */
    async getPageTemplateById(templateId: string): Promise<PageTemplate | null> {
        return await prismaClient.pageTemplate.findFirst({
            where: { id: templateId }
        });
    }

    /**
     * Update page template
     */
    async updatePageTemplate(
        templateId: string,
        data: UpdatePageTemplateInput
    ): Promise<PageTemplate> {
        // Removed Undefined Values from Object
        const updatedData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => value !== undefined)
        );

        return await prismaClient.pageTemplate.update({
            where: { id: templateId },
            data: updatedData
        });
    }

    /**
     * Soft delete page template
     */
    async deletePageTemplate(templateId: string): Promise<PageTemplate> {
        return await prismaClient.pageTemplate.update({
            where: { id: templateId },
            data: { deleted_at: new Date() }
        });
    }

    /**
     * Restore deleted page template
     */
    async restorePageTemplate(templateId: string): Promise<PageTemplate> {
        return await prismaClient.pageTemplate.update({
            where: { id: templateId },
            data: { deleted_at: null }
        });
    }

    /**
     * Get unique categories for page templates
     */
    async getPageTemplateCategories(): Promise<string[]> {
        const templates = await prismaClient.pageTemplate.findMany({
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
            where: { id: templateId, deleted_at: null }
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
