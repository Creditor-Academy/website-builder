import { Prisma } from "@prisma/client";
import prismaClient from "../../config/prisma.js";
import type { ListDomainsQuerySchemaType, RegisterDomainSchemaType } from "./domain.validation.js";
import { DELETED_DOMAIN_RETENTION_TIME } from "../../constants/domains.constants.js";

class DomainDao {
    // Get domain by id
    async getDomainById(domainId: string) {
        try {
            const result = await prismaClient.domain.findUnique({
                where: {
                    id: domainId,
                },
            });
            return result;
        } catch (error: any) {
            throw error;
        }
    }

    // Check Domain Exists by Hostname
    async checkDomainExists(hostname: string) {
        try {
            const result = await prismaClient.domain.findUnique({
                where: {
                    name: hostname
                },
            });
            return result;
        } catch (error: any) {
            throw error;
        }
    }

    // Get domain by hostname
    async fetchDomainByHostnameWithWebsite(hostname: string) {
        try {
            const result = await prismaClient.domain.findUnique({
                where: {
                    name: hostname,
                    deleted_at: null,
                },
                include: {
                    website: {
                        select: {
                            id: true,
                            status: true
                        }
                    },
                },
            });
            return result;
        } catch (error: any) {
            throw error;
        }
    }

    // List all custom domains
    async listAllCustomDomains(query: ListDomainsQuerySchemaType) {
        try {
            const { page = 1, limit = 10, search } = query;

            const skip = (page - 1) * limit;

            const where: Prisma.DomainWhereInput = {
                custom: true,
                deleted_at: null,
            };

            if (search) {
                where.OR = [
                    { name: { contains: search } }
                ];
            }

            const result = await prismaClient.domain.findMany({
                where,
                skip, take: limit,
            });
            return result;
        } catch (error: any) {
            throw error;
        }
    }

    // Get domains by Website Id 
    async getDomainsByWebsiteId(websiteId: string, { custom }: { custom?: boolean } = {}) {
        try {
            const result = await prismaClient.domain.findMany({
                where: {
                    website_id: websiteId,
                    ...(custom && { custom }),
                    deleted_at: null,
                },
            });
            return result;
        } catch (error: any) {
            throw error;
        }
    }

    // Get Platform Target
    async getPlatformTarget(websiteId: string) {
        try {
            const result = await prismaClient.domain.findFirst({
                where: {
                    website_id: websiteId,
                    custom: false,
                },
                select: {
                    name: true,
                }
            });
            return result?.name;
        } catch (error: any) {
            throw error;
        }
    }

    // Register domain
    async registerDomain(websiteId: string, data: RegisterDomainSchemaType, platformTarget: string) {
        try {
            const result = await prismaClient.domain.create({
                data: {
                    website_id: websiteId,
                    name: data.hostname,
                    platform_target: platformTarget,
                    custom: true,
                },
            });
            return result;
        } catch (error: any) {
            throw error;
        }
    }

    // Update domain
    async updateDomain(domainId: string, data: Prisma.DomainUpdateInput) {
        try {
            const result = await prismaClient.domain.update({
                where: {
                    id: domainId
                },
                data,
            });
            return result;
        } catch (error: any) {
            throw error;
        }
    }

    // Verify domain
    async verifyDomain(domainId: string) {
        try {
            const result = await prismaClient.domain.update({
                where: {
                    id: domainId,
                },
                data: {
                    verified: true,
                },
            });
            return result;
        } catch (error: any) {
            throw error;
        }
    }

    // Delete domain
    async deleteDomain(domainId: string) {
        try {
            const result = await prismaClient.domain.update({
                where: {
                    id: domainId,
                },
                data: {
                    deleted_at: new Date(),
                },
            });
            return result;
        } catch (error: any) {
            throw error;
        }
    }

    // Cleanup deleted domains
    async cleanupDeletedDomains() {
        try {
            const result = await prismaClient.domain.deleteMany({
                where: {
                    deleted_at: {
                        lt: new Date(Date.now() - DELETED_DOMAIN_RETENTION_TIME),
                    },
                },
            });
            return result;
        } catch (error: any) {
            throw error;
        }
    }
}

export default DomainDao;