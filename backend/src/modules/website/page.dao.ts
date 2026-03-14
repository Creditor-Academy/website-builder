import { Prisma } from "@prisma/client";
import prismaClient from "../../config/prisma.js";

class PageDao {
    async findPageById(id: string) {
        return await prismaClient.page.findUnique({
            where: { id }
        });
    }

    async findPagesByWebsiteId(websiteId: string) {
        return await prismaClient.page.findMany({
            where: { website_id: websiteId },
            orderBy: { created_at: 'asc' }
        });
    }

    async createPage(data: {
        website_id: string;
        name: string;
        slug: string;
        content?: any;
        navbar?: any;
        footer?: any;
        globalStyles?: any;
        meta?: any;
    }) {
        return await prismaClient.page.create({
            data: {
                ...data,
                content: data.content || []
            } as any
        });
    }

    async updatePage(id: string, data: Partial<{
        name: string;
        slug: string;
        content: any;
        navbar: any;
        footer: any;
        globalStyles: any;
        meta: any;
    }>) {
        return await prismaClient.page.update({
            where: { id },
            data: data as any
        });
    }

    async deletePage(id: string) {
        return await prismaClient.page.delete({
            where: { id }
        });
    }
}

export default PageDao;
