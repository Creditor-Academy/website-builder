import { z } from 'zod';

// ============================================
// Create Page Schema
// ============================================

export const createPageSchema = z.object({
    name: z.string().trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),

    slug: z.string().trim()
        .min(1, 'Slug is required')
        .max(100, 'Slug must not exceed 100 characters')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens only'),

    templateId: z.string()
        .pipe(z.cuid2('Invalid template ID format'))
        .optional(),

    meta: z.json().optional(),
    page_styles: z.json().optional()
});

// ============================================
// Update Page Schema
// ============================================

export const updatePageSchema = z.object({
    name: z.string().trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .optional(),

    slug: z.string().trim()
        .min(1, 'Slug is required')
        .max(100, 'Slug must not exceed 100 characters')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens only')
        .optional(),

    meta: z.json().optional(),
    page_styles: z.json().optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
);

// ============================================
// Duplicate Page Schema
// ============================================

export const duplicatePageSchema = z.object({
    newName: z.string().trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    slug: z.string().trim()
        .min(1, 'Slug is required')
        .max(100, 'Slug must not exceed 100 characters')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens only')
});

// ============================================
// Page ID Params Schema
// ============================================

export const pageIdParamsSchema = z.object({
    id: z.string().pipe(
        z.cuid2('Invalid page ID format')
    )
});

export const pageSlugParamsSchema = z.object({
    slug: z.string()
        .min(1, 'Slug is required')
        .max(100, 'Slug must not exceed 100 characters')
});

// ============================================
// List Pages Query Schema
// ============================================

export const listPagesQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(200).optional().default(50),
    search: z.string().min(1).optional(),

    includeDeleted: z.enum(['true', 'false'])
        .transform(val => val === 'true')
        .optional()
        .default(false)
});

// ============================================
// Type Exports
// ============================================

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type DuplicatePageInput = z.infer<typeof duplicatePageSchema>;
export type PageIdParams = z.infer<typeof pageIdParamsSchema>;
export type PageSlugParams = z.infer<typeof pageSlugParamsSchema>;
export type ListPagesQueryInput = z.infer<typeof listPagesQuerySchema>;