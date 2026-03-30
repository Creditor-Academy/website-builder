import prismaClient from "../../config/prisma.js";
import { Website, PageSnapshot, WebsiteStatus, Page } from "@prisma/client";

class DeploymentDao {
    async updateWebsiteStatus(websiteId: string, status: WebsiteStatus) {
        return await prismaClient.website.update({
            where: { id: websiteId },
            data: { status: status },
            include: {
                domains: {
                    where: {
                        verified: true,
                        deleted_at: null
                    },
                },
            }
        });
    }

    async getCompleteWebsite(websiteId: string) {
        return await prismaClient.website.findUnique({
            where: { id: websiteId },
            include: {
                pages: {
                    where: { deleted_at: null },
                    include: {
                        sections: {
                            where: { deleted_at: null },
                            orderBy: { order: 'asc' }
                        }
                    }
                },
                globalDesign: {
                    include: {
                        globalSlots: {
                            where: { deleted_at: null },
                        }
                    }
                },
                settings: true
            }
        });
    }

    async getPageSnapshot(pageId: string) {
        return await prismaClient.pageSnapshot.findUnique({
            where: { page_id: pageId },
        });
    }

    async getPageSnapshotBySlug(websiteId: string, slug: string) {
        return await prismaClient.pageSnapshot.findUnique({
            where: { website_id_slug: { website_id: websiteId, slug: slug } },
        });
    }

    async createPageSnapshot(websiteId: string, page: Page, snapshotData: any) {
        return await prismaClient.pageSnapshot.create({
            data: {
                website_id: websiteId,
                page_id: page.id,
                snapshot: snapshotData,
                slug: page.slug
            },
        });
    }

    async deletePageSnapshots(websiteId: string) {
        await prismaClient.pageSnapshot.deleteMany({
            where: { website_id: websiteId },
        });
    }
}

export default DeploymentDao;