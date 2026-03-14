import { z } from 'zod';
import { WebsiteStatus } from '@prisma/client';

const WebsiteStatusValues = Object.values(WebsiteStatus);

// Create website schema
export const createWebsiteSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    templateId: z.string().optional()
});

// Get websites schema
export const listWebsitesQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),

    search: z.string().optional(),

    status: z.enum(WebsiteStatusValues, {
        message: 'Status filter must be either active or inactive',
    }).optional(),

    created_after: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: 'created_after must be a valid date string',
    }).optional(),
});

// Update website schema
export const updateWebsiteSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .optional(),
});

// Update website settings schema
export const updateWebsiteSettingsSchema = z.object({
    seo: z.any().optional(),
    contact: z.any().optional(),
    social_links: z.any().optional(),
});

// Update page content schema
export const updatePageContentSchema = z.object({
    content: z.any(),
    name: z.string().optional(),
    slug: z.string().optional(),
    navbar: z.any().optional(),
    footer: z.any().optional(),
    globalStyles: z.any().optional(),
    meta: z.any().optional()
});

// Website ID params schema
export const websiteIdParamsSchema = z.object({
    id: z.string().min(1, 'Invalid website ID format')
});

export type CreateWebsiteInput = z.infer<typeof createWebsiteSchema>;
export type ListWebsitesQuerySchema = z.infer<typeof listWebsitesQuerySchema>;
export type UpdateWebsiteInput = z.infer<typeof updateWebsiteSchema>;
export type UpdateWebsiteSettingsInput = z.infer<typeof updateWebsiteSettingsSchema>;
export type UpdatePageContentInput = z.infer<typeof updatePageContentSchema>;
export type WebsiteIdParams = z.infer<typeof websiteIdParamsSchema>;