import { Domain } from "@prisma/client";
import DomainDao from "./domain.dao.js";
import type { RegisterDomainSchemaType, ListDomainsQuerySchemaType, UpdateDomainSchemaType } from "./domain.validation.js";
import { RESERVED_DOMAINS } from "../../constants/domains.constants.js";
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/error.utils.js";

class DomainService {
    private domainDao: DomainDao;
    constructor() {
        this.domainDao = new DomainDao();
    }

    // Verify CNAME DNS record
    async resolveCNAMERecord(hostname: string, cname: string) {
        try {
            // logic to verify CNAME DNS record
            throw new Error("Failed to verify CNAME DNS record");
        } catch (error: any) {
            throw new BadRequestError("Failed to verify CNAME DNS record");
        }
    };

    // Process domains to add platform domain if not custom
    async getProcessedDomains(domains: Domain[]) {
        const processedDomains = domains.map((domain) => {
            return {
                ...domain,
                name: domain.custom ? domain.name : `${domain.name}.${process.env.PLATFORM_DOMAIN}`
            };
        });
        return processedDomains;
    };

    // List all custom domains
    async listAllCustomDomains(query: ListDomainsQuerySchemaType) {
        try {
            const result = await this.domainDao.listAllCustomDomains(query);
            return result;
        } catch (error: any) {
            throw error;
        }
    };

    // Get domains by Website Id
    async getDomainsByWebsiteId(websiteId: string) {
        try {
            const result = await this.domainDao.getDomainsByWebsiteId(websiteId);
            const processedDomains = await this.getProcessedDomains(result);
            return processedDomains;
        } catch (error: any) {
            throw error;
        }
    };

    // Check if domain is available
    // Domain is not available if it already exists in DB (even if soft deleted)
    // or exists in Reserved Domains List
    async checkDomainAvailability(hostname: string) {
        try {
            // Check if domain is in reserved domains list
            if (RESERVED_DOMAINS.includes(hostname)) {
                return { available: false };
            }

            // Check if domain exists in DB
            const exists = await this.domainDao.checkDomainExists(hostname);
            if (exists) {
                return { available: false };
            }

            return { available: true };
        } catch (error: any) {
            throw error;
        }
    };

    // Register domain
    async registerDomain(websiteId: string, data: RegisterDomainSchemaType) {
        try {
            // Check if website already has a custom domain
            const existingDomains = await this.domainDao.getDomainsByWebsiteId(websiteId, { custom: true });
            if (existingDomains.length > 0) {
                throw new ConflictError("Website already has a custom domain");
            }

            // Check if domain is in reserved domains list
            if (RESERVED_DOMAINS.includes(data.hostname)) {
                throw new ConflictError("Domain already exists");
            }

            // Check if domain exists in DB
            const exists = await this.domainDao.checkDomainExists(data.hostname);
            if (exists) {
                // If domain was already used by user and deleted, user can reuse it after retention period (when domain is hard deleted)
                throw new ConflictError("Domain already exists");
            }

            // Get Platform Target
            const subdomain = await this.domainDao.getPlatformTarget(websiteId);
            if (!subdomain) {
                // ALthough never happens as defualt domain is generated when website is created
                throw new ConflictError("Website subdomain not found");
            }

            const platform_target = `${subdomain}.${process.env.PLATFORM_DOMAIN}`;

            const result = await this.domainDao.registerDomain(websiteId, data, platform_target);
            return result;
        } catch (error: any) {
            throw error;
        }
    };

    // Update domain
    async updateDomain(websiteId: string, data: UpdateDomainSchemaType) {
        try {
            // Check if domain exists
            const domains = await this.domainDao.getDomainsByWebsiteId(websiteId, { custom: true });
            if (domains.length === 0 || !domains[0]) {
                throw new NotFoundError("Domain not found");
            }

            const domain = domains[0];

            // Check if domain is already verified
            if (domain.verified) {
                throw new ConflictError("Domain is already verified");
            }

            // Check if new domain is in reserved domains list
            if (RESERVED_DOMAINS.includes(data.hostname)) {
                throw new ConflictError("Domain already exists");
            }

            // Check if new domain exists in DB
            const exists = await this.domainDao.checkDomainExists(data.hostname);
            if (exists && exists.id !== domain.id) {
                throw new ConflictError("Domain already exists");
            }

            const result = await this.domainDao.updateDomain(domain.id, { name: data.hostname });
            return result;
        } catch (error: any) {
            throw error;
        }
    };

    // Verify domain
    async verifyDomain(websiteId: string) {
        try {
            // Check if domain exists
            const domains = await this.domainDao.getDomainsByWebsiteId(websiteId, { custom: true });
            if (domains.length === 0 || !domains[0]) {
                throw new NotFoundError("Domain not found");
            }

            const domain = domains[0];
            if (!domain.platform_target) {
                throw new ConflictError("Domain platform target not found");
            }

            // Check if domain is already verified
            if (domain.verified) {
                throw new ConflictError("Domain is already verified");
            }

            // Verify CNAME DNS record
            await this.resolveCNAMERecord(domain.name, domain.platform_target);

            const result = await this.domainDao.verifyDomain(domain.id);
            return result;
        } catch (error: any) {
            throw error;
        }
    };

    // Delete domain
    async deleteDomain(websiteId: string) {
        try {
            const domains = await this.domainDao.getDomainsByWebsiteId(websiteId, { custom: true });
            if (domains.length === 0 || !domains[0]) {
                throw new NotFoundError("Domain not found");
            }

            const domain = domains[0];

            const result = await this.domainDao.deleteDomain(domain.id);
            return result;
        } catch (error: any) {
            throw error;
        }
    };

    // Cleanup deleted domains
    async cleanupDeletedDomains() {
        // Hard delete domains that are deleted more than 30 days ago
        await this.domainDao.cleanupDeletedDomains();
    };
}

export default DomainService;