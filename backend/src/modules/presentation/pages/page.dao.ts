import prismaClient from '../../../config/prisma.js';
import { Prisma } from '@prisma/client';
import type { Page, Section } from '@prisma/client';
import { CreatePageInput, CreateSectionInput, UpdatePageInput } from './page.validation.js';
import { DELETED_PAGES_RETENTION_TIME } from '../../../constants/presentation.constants.js';

class PageDao {
    /**
     * Create a new page
     */
    async createPage(website_id: string, data: CreatePageInput): Promise<Page> {
        return await prismaClient.page.create({
            data: {
                ...data,
                website_id,
                sections: { create: data.sections }
            },
            include: {
                sections: {
                    where: { deleted_at: null },
                    orderBy: { order: 'asc' }
                }
            }
        });
    }

    /**
     * Get page by ID with sections
     */
    async getPageById(pageId: string): Promise<Page & { sections: Section[] } | null> {
        return await prismaClient.page.findFirst({
            where: { id: pageId },
            include: {
                sections: {
                    where: { deleted_at: null },
                    orderBy: { order: 'asc' }
                }
            }
        });
    }

    /**
     * Get page by slug and website
     */
    async getPageBySlug(slug: string, websiteId: string): Promise<Page | null> {
        return await prismaClient.page.findFirst({
            where: {
                slug,
                website_id: websiteId,
                deleted_at: null
            },
            include: {
                sections: {
                    where: { deleted_at: null },
                    orderBy: { order: 'asc' }
                }
            }
        });
    }

    /**
     * List all pages for a website (without associations)
     */
    async findPagesByWebsiteId(websiteId: string) {
        return await prismaClient.page.findMany({
            where: { website_id: websiteId },
            orderBy: { created_at: 'asc' }
        });
    }

    /**
     * List all pages for a website (with sections in order)
     */
    async listPagesByWebsiteId(websiteId: string): Promise<(Page & { sections: Section[] })[]> {
        return await prismaClient.page.findMany({
            where: {
                website_id: websiteId,
                deleted_at: null,
            },
            include: {
                sections: {
                    where: { deleted_at: null },
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { created_at: 'desc' }
        });
    }

    /**
     * Update page
     */
    async updatePage(
        pageId: string,
        data: Partial<{
            name: string;
            slug: string;
            meta: any;
            page_styles: any;
        }>,
        createSections?: CreateSectionInput[]
    ): Promise<Page> {
        return await prismaClient.page.update({
            where: { id: pageId },
            data: {
                ...data,
                sections: createSections ? { create: createSections } : {}
            },
            include: {
                sections: {
                    where: { deleted_at: null },
                    orderBy: { order: 'asc' }
                }
            }
        });
    }

    /**
     * Soft delete page
     */
    async deletePage(pageId: string): Promise<Page> {
        return await prismaClient.page.update({
            where: { id: pageId },
            data: { deleted_at: new Date() }
        });
    }

    /**
     * Restore deleted page
     */
    async restorePage(pageId: string): Promise<Page> {
        return await prismaClient.page.update({
            where: { id: pageId },
            data: { deleted_at: null }
        });
    }

    /**
     * Clone a page and all its sections
     */
    async clonePage(
        websiteId: string,
        sourcePage: Page & { sections: Section[] },
        data: { newName: string, slug: string }
    ): Promise<Page & { sections: Section[] }> {
        const createdPage = await prismaClient.page.create({
            data: {
                website_id: websiteId,
                name: data.newName,
                slug: data.slug,
                meta: sourcePage.meta as Prisma.InputJsonValue,
                page_styles: sourcePage.page_styles as Prisma.InputJsonValue,
                sections: {
                    create: sourcePage.sections.map((section) => ({
                        category: section.category,
                        sectionTemplateId: section.sectionTemplateId,
                        order: section.order,
                        props: section.props as Prisma.InputJsonValue
                    }))
                }
            },
            include: {
                sections: {
                    where: { deleted_at: null },
                    orderBy: { order: 'asc' }
                }
            }
        });

        return createdPage;
    }

    /**
     * Check if page exists
     */
    async pageExists(pageId: string, websiteId: string): Promise<boolean> {
        const page = await prismaClient.page.findFirst({
            where: {
                id: pageId,
                website_id: websiteId,
                deleted_at: null
            },
            select: { id: true }
        });

        return !!page;
    }

    /**
     * Check if slug is unique in website
     * excludePageId is used to exclude the current page from the check
     */
    async isSlugUnique(slug: string, websiteId: string, excludePageId?: string): Promise<boolean> {
        const page = await prismaClient.page.findFirst({
            where: {
                slug,
                website_id: websiteId,
                deleted_at: null,
                ...(excludePageId ? { NOT: { id: excludePageId } } : {})
            },
            select: { id: true }
        });

        return !page;
    }

    /**
     * Count pages in website
     */
    async countPagesByWebsite(websiteId: string): Promise<number> {
        return await prismaClient.page.count({
            where: {
                website_id: websiteId,
                deleted_at: null
            }
        });
    }

    /**
     * Get page with all its content (sections with templates)
     */
    async getPageFullContent(pageId: string): Promise<Page | null> {
        return await prismaClient.page.findFirst({
            where: { id: pageId, deleted_at: null },
            include: {
                sections: {
                    orderBy: { order: 'asc' },
                }
            }
        });
    }

    /**
     * Cleanup deleted pages
     */
    async cleanupDeletedPages() {
        const retentionDate = new Date(Date.now() - DELETED_PAGES_RETENTION_TIME);

        // Delete pages
        await prismaClient.page.deleteMany({
            where: {
                deleted_at: { lte: retentionDate }
            }
        });
    }
}

export default PageDao;
