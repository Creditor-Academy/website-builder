import { z } from 'zod';
import { jsonObject } from '../../utils/validator.utils.js';

// ============================================
// List Query Schemas
// ============================================

export const listTemplatesQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(200).optional().default(50),
    category: z.string().min(1).optional(),
    search: z.string().min(1).optional()
});

// ============================================
// Website Template Schemas
// ============================================

export const createWebsiteTemplateSchema = z.object({
    name: z.string().trim()
        .min(2, 'Template name must be at least 2 characters')
        .max(100, 'Template name must not exceed 100 characters'),

    description: z.string().trim()
        .min(1, 'Description is required')
        .max(500, 'Description must not exceed 500 characters')
        .optional(),

    category: z.string().trim()
        .min(1, 'Category is required')
        .max(50, 'Category must not exceed 50 characters'),

    global_styles: jsonObject.optional(),
    navbar: jsonObject.optional(),
    footer: jsonObject.optional(),
    home_layout: jsonObject.optional(),
});

export const updateWebsiteTemplateSchema = z.object({
    name: z.string().trim()
        .min(2, 'Template name must be at least 2 characters')
        .max(100, 'Template name must not exceed 100 characters')
        .optional(),

    description: z.string().trim()
        .min(1, 'Description is required')
        .max(500, 'Description must not exceed 500 characters')
        .optional(),

    category: z.string().trim()
        .min(1, 'Category is required')
        .max(50, 'Category must not exceed 50 characters')
        .optional(),

    global_styles: jsonObject.optional(),
    navbar: jsonObject.optional(),
    footer: jsonObject.optional(),
    home_layout: jsonObject.optional(),

}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
);

// ============================================
// Section Template Schemas
// ============================================

export const createSectionTemplateSchema = z.object({
    name: z.string().trim()
        .min(2, 'Template name must be at least 2 characters')
        .max(100, 'Template name must not exceed 100 characters'),

    description: z.string().trim()
        .min(1, 'Description is required')
        .max(500, 'Description must not exceed 500 characters')
        .optional(),

    category: z.string().trim()
        .min(1, 'Category is required')
        .max(50, 'Category must not exceed 50 characters'),

    props: jsonObject
});

export const updateSectionTemplateSchema = z.object({
    name: z.string().trim()
        .min(2, 'Template name must be at least 2 characters')
        .max(100, 'Template name must not exceed 100 characters')
        .optional(),

    description: z.string().trim()
        .min(1, 'Description is required')
        .max(500, 'Description must not exceed 500 characters')
        .optional(),

    category: z.string().trim()
        .min(1, 'Category is required')
        .max(50, 'Category must not exceed 50 characters')
        .optional(),

    props: jsonObject.optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
);

// ============================================
// Params Schemas
// ============================================

export const templateIdParamsSchema = z.object({
    templateId: z.string().min(1, 'Invalid template ID format')
        .pipe(z.cuid2('Invalid template ID format'))
});

// ============================================
// Type Exports
// ============================================

export type ListTemplatesQueryInput = z.infer<typeof listTemplatesQuerySchema>;
export type TemplateIdParams = z.infer<typeof templateIdParamsSchema>;
export type CreateWebsiteTemplateInput = z.infer<typeof createWebsiteTemplateSchema>;
export type UpdateWebsiteTemplateInput = z.infer<typeof updateWebsiteTemplateSchema>;
export type CreateSectionTemplateInput = z.infer<typeof createSectionTemplateSchema>;
export type UpdateSectionTemplateInput = z.infer<typeof updateSectionTemplateSchema>;