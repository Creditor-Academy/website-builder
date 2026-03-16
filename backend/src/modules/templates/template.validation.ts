import { z } from 'zod';

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
// Page Template Schemas
// ============================================

export const createPageTemplateSchema = z.object({
    name: z.string()
        .min(2, 'Template name must be at least 2 characters')
        .max(100, 'Template name must not exceed 100 characters'),

    category: z.string()
        .min(1, 'Category is required')
        .max(50, 'Category must not exceed 50 characters'),

    thumbnail_url: z.string()
        .pipe(z.url('Invalid thumbnail URL'))
        .optional(),

    sections: z.array(
        z.string().pipe(z.cuid2())
    ).min(1, 'At least one section must be added')
});

export const updatePageTemplateSchema = z.object({
    name: z.string()
        .min(2, 'Template name must be at least 2 characters')
        .max(100, 'Template name must not exceed 100 characters')
        .optional(),

    category: z.string()
        .min(1, 'Category is required')
        .max(50, 'Category must not exceed 50 characters')
        .optional(),

    thumbnail_url: z.string()
        .pipe(z.url('Invalid thumbnail URL'))
        .optional()
        .nullable(),

    sections: z.array(
        z.string().pipe(z.cuid2())
    ).min(1, 'At least one section must be added')
        .optional()

}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
);

// ============================================
// Section Template Schemas
// ============================================

export const createSectionTemplateSchema = z.object({
    name: z.string()
        .min(2, 'Template name must be at least 2 characters')
        .max(100, 'Template name must not exceed 100 characters'),

    category: z.string()
        .min(1, 'Category is required')
        .max(50, 'Category must not exceed 50 characters'),

    thumbnail_url: z.string()
        .pipe(z.url('Invalid thumbnail URL'))
        .optional(),

    props: z.any()
});

export const updateSectionTemplateSchema = z.object({
    name: z.string()
        .min(2, 'Template name must be at least 2 characters')
        .max(100, 'Template name must not exceed 100 characters')
        .optional(),

    category: z.string()
        .min(1, 'Category is required')
        .max(50, 'Category must not exceed 50 characters')
        .optional(),

    thumbnail_url: z.string()
        .pipe(z.url('Invalid thumbnail URL'))
        .optional()
        .nullable(),

    props: z.json().optional()
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
export type CreatePageTemplateInput = z.infer<typeof createPageTemplateSchema>;
export type UpdatePageTemplateInput = z.infer<typeof updatePageTemplateSchema>;
export type CreateSectionTemplateInput = z.infer<typeof createSectionTemplateSchema>;
export type UpdateSectionTemplateInput = z.infer<typeof updateSectionTemplateSchema>;