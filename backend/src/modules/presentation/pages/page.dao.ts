import prismaClient from '../../../config/prisma.js';
import type { Page } from '@prisma/client';

class PageDao {
    /**
     * Create a new page
     */
    async createPage(data: {
        name: string;
        slug: string;
        version_id: string;
        meta: any;
        page_styles?: any;
    }): Promise<Page> {
        return await prismaClient.page.create({
            data,
            // include: {
            //     sections: {
            //         where: { deleted_at: null },
            //         orderBy: { order: 'asc' }
            //     }
            // }
        });
    }

    /**
     * Get page by ID with sections
     */
    async getPageById(pageId: string): Promise<Page | null> {
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
     * Get page by slug and version
     */
    async getPageBySlug(slug: string, versionId: string): Promise<Page | null> {
        return await prismaClient.page.findFirst({
            where: {
                slug,
                version_id: versionId,
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
     * List all pages for a version with pagination
     */
    async listPagesByVersion(
        versionId: string,
        options: {
            skip?: number;
            take?: number;
            search?: string;
        } = {}
    ): Promise<Page[]> {
        const { skip = 0, take = 50, search } = options;

        return await prismaClient.page.findMany({
            where: {
                version_id: versionId,
                deleted_at: null,
                ...(search ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { slug: { contains: search, mode: 'insensitive' } }
                    ]
                } : {})
            },
            include: {
                sections: {
                    where: { deleted_at: null },
                    orderBy: { order: 'asc' }
                }
            },
            skip,
            take,
            orderBy: { created_at: 'desc' }
        });
    }

    /**
     * Update page
     */
    async updatePage(pageId: string, data: Partial<{
        name: string;
        slug: string;
        meta: any;
        page_styles: any;
    }>): Promise<Page> {
        return await prismaClient.page.update({
            where: { id: pageId },
            data,
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
            data: { deleted_at: new Date() },
            include: {
                sections: {
                    orderBy: { order: 'asc' }
                }
            }
        });
    }

    /**
     * Restore deleted page
     */
    async restorePage(pageId: string): Promise<Page> {
        return await prismaClient.page.update({
            where: { id: pageId },
            data: { deleted_at: null },
            include: {
                sections: {
                    where: { deleted_at: null },
                    orderBy: { order: 'asc' }
                }
            }
        });
    }

    /**
     * Check if page exists
     */
    async pageExists(pageId: string, versionId: string): Promise<boolean> {
        const page = await prismaClient.page.findFirst({
            where: {
                id: pageId,
                version_id: versionId,
                deleted_at: null
            },
            select: { id: true }
        });

        return !!page;
    }

    /**
     * Check if slug is unique in version
     * excludePageId is used to exclude the current page from the check
     */
    async isSlugUnique(slug: string, versionId: string, excludePageId?: string): Promise<boolean> {
        const page = await prismaClient.page.findFirst({
            where: {
                slug,
                version_id: versionId,
                deleted_at: null,
                ...(excludePageId ? { NOT: { id: excludePageId } } : {})
            },
            select: { id: true }
        });

        return !page;
    }

    /**
     * Count pages in version
     */
    async countPagesByVersion(versionId: string): Promise<number> {
        return await prismaClient.page.count({
            where: {
                version_id: versionId,
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
                    where: { deleted_at: null },
                    orderBy: { order: 'asc' },
                }
            }
        });
    }
}

export default PageDao;
