import { z } from 'zod';
import { jsonArray, jsonObject } from '../../../utils/validator.utils.js';

// ============================================
// Create Page Schema
// ============================================

const createSectionSchema = z.object({
    category: z.string().trim()
        .min(2, 'Category must be at least 2 characters')
        .max(100, 'Category must not exceed 100 characters'),

    props: jsonObject.optional().default({}),
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

    meta: jsonObject.default({}),
    page_styles: jsonObject.default({}),

    sections: jsonArray
        .pipe(z.array(createSectionSchema))
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

    props: jsonObject.optional(),
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

    meta: jsonObject.optional(),
    page_styles: jsonObject.optional(),

    createSections: jsonArray
        .pipe(z.array(createSectionSchema))
        .optional(),

    updateSections: jsonArray
        .pipe(z.array(updateSectionSchema))
        .optional(),

    deleteSections: jsonArray
        .pipe(z.array(
            z.string().pipe(z.cuid2('Invalid section ID format'))
        ))
        .optional(),

    restoreSections: jsonArray
        .pipe(z.array(
            z.string().pipe(z.cuid2('Invalid section ID format'))
        ))
        .optional()
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