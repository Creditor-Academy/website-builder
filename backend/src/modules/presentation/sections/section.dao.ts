import prismaClient from '../../../config/prisma.js';
import type { Section } from '@prisma/client';

class SectionDao {
    /**
     * Create a new section
     */
    async createSection(data: {
        page_id: string;
        category: string;
        order: number;
        props: any;
        sectionTemplateId?: string | null;
    }): Promise<Section> {
        return await prismaClient.section.create({
            data,
            include: {
                sectionTemplate: true,
                page: true
            }
        });
    }

    /**
     * Get section by ID
     */
    async getSectionById(sectionId: string): Promise<Section | null> {
        return await prismaClient.section.findFirst({
            where: { id: sectionId, deleted_at: null },
            include: {
                sectionTemplate: true,
                page: true
            }
        });
    }

    /**
     * Get section including deleted records
     */
    async getSectionByIdWithDeleted(sectionId: string): Promise<Section | null> {
        return await prismaClient.section.findUnique({
            where: { id: sectionId },
            include: {
                sectionTemplate: true,
                page: true
            }
        });
    }

    /**
     * Get all sections for a page
     */
    async getSectionsByPageId(pageId: string): Promise<Section[]> {
        return await prismaClient.section.findMany({
            where: { page_id: pageId, deleted_at: null },
            orderBy: { order: 'asc' },
            include: {
                sectionTemplate: true
            }
        });
    }

    /**
     * Get sections by page including deleted
     */
    async getSectionsByPageIdWithDeleted(pageId: string): Promise<Section[]> {
        return await prismaClient.section.findMany({
            where: { page_id: pageId },
            orderBy: { order: 'asc' },
            include: {
                sectionTemplate: true
            }
        });
    }

    /**
     * Update section
     */
    async updateSection(sectionId: string, data: Partial<{
        category: string;
        props: any;
        order: number;
        sectionTemplateId: string | null;
    }>): Promise<Section> {
        return await prismaClient.section.update({
            where: { id: sectionId },
            data,
            include: {
                sectionTemplate: true,
                page: true
            }
        });
    }

    /**
     * Reorder sections
     */
    async reorderSections(updates: Array<{ id: string; order: number }>): Promise<Section[]> {
        const operations = updates.map(({ id, order }) =>
            prismaClient.section.update({
                where: { id },
                data: { order },
                include: { sectionTemplate: true }
            })
        );

        return await prismaClient.$transaction(operations);
    }

    /**
     * Delete section (soft delete)
     */
    async deleteSection(sectionId: string): Promise<Section> {
        return await prismaClient.section.update({
            where: { id: sectionId },
            data: { deleted_at: new Date() },
            include: {
                sectionTemplate: true,
                page: true
            }
        });
    }

    /**
     * Delete multiple sections
     */
    async deleteSections(sectionIds: string[]): Promise<any> {
        return await prismaClient.section.updateMany({
            where: { id: { in: sectionIds } },
            data: { deleted_at: new Date() }
        });
    }

    /**
     * Restore deleted section
     */
    async restoreSection(sectionId: string): Promise<Section> {
        return await prismaClient.section.update({
            where: { id: sectionId },
            data: { deleted_at: null },
            include: {
                sectionTemplate: true,
                page: true
            }
        });
    }

    /**
     * Check if section exists
     */
    async sectionExists(sectionId: string, pageId: string): Promise<boolean> {
        const section = await prismaClient.section.findFirst({
            where: {
                id: sectionId,
                page_id: pageId,
                deleted_at: null
            },
            select: { id: true }
        });

        return !!section;
    }

    /**
     * Get max order in page
     */
    async getMaxOrderInPage(pageId: string): Promise<number> {
        const result = await prismaClient.section.aggregate({
            where: { page_id: pageId, deleted_at: null },
            _max: { order: true }
        });

        return (result._max.order || -1) + 1;
    }

    /**
     * Count sections in page
     */
    async countSectionsByPage(pageId: string): Promise<number> {
        return await prismaClient.section.count({
            where: { page_id: pageId, deleted_at: null }
        });
    }

    /**
     * Move section to different position
     */
    async moveSectionOrder(pageId: string, sectionId: string, newOrder: number): Promise<void> {
        // Get all sections in the page
        const sections = await this.getSectionsByPageId(pageId);

        const section = sections.find(s => s.id === sectionId);
        if (!section) {
            throw new Error('Section not found');
        }

        const oldOrder = section.order;

        // Reorder based on direction
        if (newOrder > oldOrder) {
            // Moving down - shift up sections between old and new order
            const updates = sections
                .filter(s => s.order > oldOrder && s.order <= newOrder)
                .map(s => ({ id: s.id, order: s.order - 1 }));

            updates.push({ id: sectionId, order: newOrder });
            await this.reorderSections(updates);
        } else if (newOrder < oldOrder) {
            // Moving up - shift down sections between new and old order
            const updates = sections
                .filter(s => s.order >= newOrder && s.order < oldOrder)
                .map(s => ({ id: s.id, order: s.order + 1 }));

            updates.push({ id: sectionId, order: newOrder });
            await this.reorderSections(updates);
        }
    }

    /**
     * Duplicate section
     */
    async duplicateSection(section: Section, newPageId: string): Promise<Section> {
        // Get next order
        const order = await this.getMaxOrderInPage(newPageId);

        return await this.createSection({
            page_id: newPageId,
            category: section.category,
            props: section.props,
            order: order,
            sectionTemplateId: section.sectionTemplateId
        });
    }

    /**
     * Batch create sections
     */
    async createSectionsBatch(data: Array<{
        page_id: string;
        category: string;
        order: number;
        props: any;
        sectionTemplateId?: string | null;
    }>): Promise<Section[]> {
        const operations = data.map(sectionData =>
            prismaClient.section.create({
                data: sectionData,
                include: {
                    sectionTemplate: true
                }
            })
        );

        return await prismaClient.$transaction(operations);
    }
}

export default SectionDao;
