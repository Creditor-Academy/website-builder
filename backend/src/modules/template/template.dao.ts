import prisma from '../../config/prisma.js';

export class TemplateDao {

    // ─── Website Templates ────────────────────────────────────────────────────

    /** Get all non-deleted website templates */
    async getAllWebsiteTemplates() {
        return prisma.websiteTemplate.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }

    /** Get a single website template by ID (including deleted, for admin) */
    async getWebsiteTemplateById(id: string) {
        return prisma.websiteTemplate.findUnique({
            where: { id },
        });
    }

    /** Create a new website template */
    async createWebsiteTemplate(data: {
        name: string;
        description: string;
        category: string;
        image?: string | null;
        global_styles?: object;
        navbar?: object;
        footer?: object;
        home_layout?: object;
    }) {
        return prisma.websiteTemplate.create({
            data: {
                name: data.name,
                description: data.description,
                category: data.category,
                image: data.image ?? null,
                global_styles: data.global_styles ?? {},
                navbar: data.navbar ?? {},
                footer: data.footer ?? {},
                home_layout: data.home_layout ?? {},
            },
        });
    }

    /** Update a website template */
    async updateWebsiteTemplate(id: string, data: Partial<{
        name: string;
        description: string;
        category: string;
        image: string | null;
        global_styles: object;
        navbar: object;
        footer: object;
        home_layout: object;
    }>) {
        return prisma.websiteTemplate.update({
            where: { id },
            data,
        });
    }

    /** Soft delete a website template */
    async deleteWebsiteTemplate(id: string) {
        return prisma.websiteTemplate.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    /** Restore a soft-deleted website template */
    async restoreWebsiteTemplate(id: string) {
        return prisma.websiteTemplate.update({
            where: { id },
            data: { deletedAt: null },
        });
    }

    // ─── Section Templates ────────────────────────────────────────────────────

    /** Get all non-deleted section templates */
    async getAllSectionTemplates() {
        return prisma.sectionTemplate.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }

    /** Get a single section template by ID */
    async getSectionTemplateById(id: string) {
        return prisma.sectionTemplate.findUnique({
            where: { id },
        });
    }

    /** Create a new section template */
    async createSectionTemplate(data: {
        name: string;
        category: string;
        props?: object;
    }) {
        return prisma.sectionTemplate.create({
            data: {
                name: data.name,
                category: data.category,
                props: data.props ?? {},
            },
        });
    }

    /** Update a section template */
    async updateSectionTemplate(id: string, data: Partial<{
        name: string;
        category: string;
        props: object;
    }>) {
        return prisma.sectionTemplate.update({
            where: { id },
            data,
        });
    }

    /** Soft delete a section template */
    async deleteSectionTemplate(id: string) {
        return prisma.sectionTemplate.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    /** Restore a soft-deleted section template */
    async restoreSectionTemplate(id: string) {
        return prisma.sectionTemplate.update({
            where: { id },
            data: { deletedAt: null },
        });
    }
}

export default new TemplateDao();