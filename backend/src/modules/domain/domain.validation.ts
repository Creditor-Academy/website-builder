import { z } from "zod";
import { DOMAIN_REGEX } from "../../constants/domains.constants.js";

// list domains query schema
export const listDomainsQuerySchema = z.object({
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    search: z.string().optional(),
});

// website id params schema
export const websiteIdParamsSchema = z.object({
    id: z.string()
        .pipe(z.cuid2())
});

// hostname params schema
export const hostnameCheckQuerySchema = z.object({
    hostname: z.string()
        .trim().min(1).toLowerCase()
        .regex(DOMAIN_REGEX, "Invalid domain name"),
});

// register domain schema
export const registerDomainSchema = z.object({
    hostname: z.string()
        .trim().min(1).toLowerCase()
        .regex(DOMAIN_REGEX, "Invalid domain name"),
});

// update domain schema
export const updateDomainSchema = z.object({
    hostname: z.string()
        .trim().min(1).toLowerCase()
        .regex(DOMAIN_REGEX, "Invalid domain name"),
});

// domain id params schema
export const domainIdParamsSchema = z.object({
    id: z.string()
        .pipe(z.cuid2()),
});

export type ListDomainsQuerySchemaType = z.infer<typeof listDomainsQuerySchema>;
export type WebsiteIdParamsSchemaType = z.infer<typeof websiteIdParamsSchema>;
export type HostnameCheckQuerySchemaType = z.infer<typeof hostnameCheckQuerySchema>;
export type RegisterDomainSchemaType = z.infer<typeof registerDomainSchema>;
export type UpdateDomainSchemaType = z.infer<typeof updateDomainSchema>;
export type DomainIdParamsSchemaType = z.infer<typeof domainIdParamsSchema>;