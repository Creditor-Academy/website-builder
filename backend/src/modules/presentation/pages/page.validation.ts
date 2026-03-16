import { z } from 'zod';

// ============================================
// Create Page Schema
// ============================================

const createSectionSchema = z.object({
    category: z.string().trim()
        .min(2, 'Category must be at least 2 characters')
        .max(100, 'Category must not exceed 100 characters'),

    props: z.any().optional().default({}),
    sectionTemplateId: z.string()
        .pipe(z.cuid2('Invalid section template ID format'))
        .nullable(),

    order: z.number()
});

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
        .nullable(),

    meta: z.any().default({}),
    page_styles: z.any().default({}),

    sections: z.array(createSectionSchema)
        .default([])
});

// ============================================
// Update Page Schema
// ============================================
export const updateSectionSchema = z.object({
    id: z.string()
        .pipe(z.cuid2('Invalid section ID format')),

    category: z.string().trim()
        .min(2, 'Category must be at least 2 characters')
        .max(100, 'Category must not exceed 100 characters'),

    props: z.any().optional(),
    order: z.number().optional()
});

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

    meta: z.any().optional(),
    page_styles: z.any().optional(),

    createSections: z.array(createSectionSchema)
        .optional(),

    updateSections: z.array(updateSectionSchema)
        .optional(),

    deleteSections: z.array(z.string()
        .pipe(z.cuid2('Invalid section ID format'))
    ).optional(),

    restoreSections: z.array(z.string()
        .pipe(z.cuid2('Invalid section ID format'))
    ).optional()
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
    id: z.string().min(1, 'Invalid page ID format')
        .pipe(z.cuid2('Invalid page ID format'))
});

export const pageSlugParamsSchema = z.object({
    slug: z.string()
        .min(1, 'Slug is required')
        .max(100, 'Slug must not exceed 100 characters')
});

// ============================================
// Type Exports
// ============================================

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type DuplicatePageInput = z.infer<typeof duplicatePageSchema>;
export type PageIdParams = z.infer<typeof pageIdParamsSchema>;
export type PageSlugParams = z.infer<typeof pageSlugParamsSchema>;