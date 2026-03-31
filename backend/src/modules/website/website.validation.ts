import { z } from 'zod';
import { WebsiteStatus } from '@prisma/client';

const WebsiteStatusValues = Object.values(WebsiteStatus);

// Create website schema
export const createWebsiteSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    content: z.any().optional(),
    institution_id: z.string().optional(),
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
    institution_id: z.string().optional(),
});

// Update website schema
export const updateWebsiteSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .optional(),
    status: z.enum(WebsiteStatusValues).optional(),
    content: z.any().optional(),
});

// Update website settings schema
export const updateWebsiteSettingsSchema = z.object({
    seo: z.json('seo should be valid JSON'),
    contact: z.json('contact should be valid JSON'),
    social_links: z.json('social_links should be valid JSON'),
});

// Website ID params schema
export const websiteIdParamsSchema = z.object({
    id: z.string().pipe(
        z.cuid2('Invalid website ID format')
    )
});

export type CreateWebsiteInput = z.infer<typeof createWebsiteSchema>;
export type ListWebsitesQuerySchema = z.infer<typeof listWebsitesQuerySchema>;
export type UpdateWebsiteInput = z.infer<typeof updateWebsiteSchema>;
export type UpdateWebsiteSettingsInput = z.infer<typeof updateWebsiteSettingsSchema>;
export type WebsiteIdParams = z.infer<typeof websiteIdParamsSchema>;