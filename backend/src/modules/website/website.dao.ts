import { GlobalSlotType, Prisma, WebsiteStatus } from "@prisma/client";
import prismaClient from "../../config/prisma.js";
import { DELETED_WEBSITE_RETENTION_TIME, SELECT_WEBSITE_FIELDS } from "../../constants/website.constants.js";
import type { ListWebsitesQuerySchema, UpdateWebsiteSettingsInput } from "./website.validation.js";
import { CreatePageInput } from "../presentation/pages/page.validation.js";

class WebsiteDao {
    async findWebsiteById(id: string, options?: { include_global_design?: boolean }) {
        return await prismaClient.website.findUnique({
            where: { id },
            include: {
                globalDesign: options?.include_global_design ? true : false
            }
        });
    }

    async listWebsites(filters: ListWebsitesQuerySchema, ownerId?: string) {
        const {
            page = 1, limit = 10,
            search, status, created_after
        } = filters;

        const skip = (page - 1) * limit;

        const where: Prisma.WebsiteWhereInput = { deleted_at: null };

        if (status) where.status = status;
        if (ownerId) where.owner_id = ownerId;

        if (created_after) {
            where.created_at = { gte: new Date(created_after) };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [websites, total] = await Promise.all([
            prismaClient.website.findMany({
                where,
                skip, take: limit,
                orderBy: { created_at: 'desc' },
                select: SELECT_WEBSITE_FIELDS
            }),
            prismaClient.website.count({ where }),
        ]);

        return {
            websites,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async createWebsite(userId: string, websiteData: { name: string }) {
        return await prismaClient.website.create({
            data: {
                ...websiteData,
                owner: { connect: { id: userId } },
                settings: { create: {} },
                globalDesign: { create: { global_styles: {} } }
                // Nested settings and globalDesign creation (atomic)
            }
        });
    }

    async createWebsiteWithPage(
        userId: string,
        pageData: CreatePageInput,
        websiteData: any,
        global_styles: any,
        global_slots: { type: GlobalSlotType, props: any }[]
    ) {
        return await prismaClient.website.create({
            data: {
                ...websiteData,
                owner: { connect: { id: userId } },
                settings: { create: {} },
                globalDesign: {
                    create: {
                        global_styles,
                        ...(global_slots.length > 0 && {
                            globalSlots: {
                                create: global_slots
                            }
                        })
                    }
                },
                pages: {
                    create: {
                        ...pageData,
                        sections: {
                            create: pageData.sections
                        }
                    }
                }
            }
        });
    }

    async updateWebsite(id: string, websiteData: any) {
        return await prismaClient.website.update({
            data: websiteData,
            where: { id }
        });
    }

    async getWebsiteSettings(settingsId: string) {
        return await prismaClient.settings.findUnique({
            where: { id: settingsId }
        })
    }

    async updateWebsiteSettings(id: string, data: UpdateWebsiteSettingsInput) {
        return await prismaClient.settings.update({
            where: { id },
            data: data as any
        })
    }

    async cleanupDeletedWebsites() {
        await prismaClient.website.deleteMany({
            where: {
                status: WebsiteStatus.DELETED,
                deleted_at: {
                    lte: new Date(Date.now() - DELETED_WEBSITE_RETENTION_TIME)
                }
            }
        });
    }
}

export default WebsiteDao;