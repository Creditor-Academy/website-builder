import { z } from 'zod';

// ============================================
// Create Section Schema
// ============================================

export const createSectionSchema = z.object({
    category: z.string()
        .min(1, 'Category is required')
        .max(50, 'Category must not exceed 50 characters'),
    props: z.json(),
    sectionTemplateId: z.string()
        .pipe(z.cuid2('Invalid template ID format'))
        .optional(),
    order: z.coerce.number()
        .int('Order must be an integer')
        .min(0, 'Order must be non-negative')
        .optional()
});

// ============================================
// Update Section Schema
// ============================================

export const updateSectionSchema = z.object({
    category: z.string()
        .min(1, 'Category is required')
        .max(50, 'Category must not exceed 50 characters')
        .optional(),
    props: z.json().optional(),
    order: z.coerce.number()
        .int('Order must be an integer')
        .min(0, 'Order must be non-negative')
        .optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
);

// ============================================
// Reorder Sections Schema
// ============================================

export const reorderSectionsSchema = z.object({
    sections: z.array(
        z.object({
            id: z.string().pipe(z.cuid2('Invalid section ID format')),
            order: z.coerce.number()
                .int('Order must be an integer')
                .min(0, 'Order must be non-negative')
        })
    ).min(1, 'At least one section must be provided')
});

// ============================================
// Move Section Schema
// ============================================

export const moveSectionSchema = z.object({
    newOrder: z.coerce.number()
        .int('Order must be an integer')
        .min(0, 'Order must be non-negative')
});

// ============================================
// Batch Create Sections Schema
// ============================================

export const createSectionsBatchSchema = z.object({
    sections: z.array(
        z.object({
            category: z.string()
                .min(1, 'Category is required')
                .max(50, 'Category must not exceed 50 characters'),
            props: z.json(),
            sectionTemplateId: z.string()
                .pipe(z.cuid2('Invalid template ID format'))
                .optional()
        })
    ).min(1, 'At least one section must be provided')
        .max(100, 'Maximum 100 sections can be created at once')
});

// ============================================
// Bulk Delete Sections Schema
// ============================================

export const deleteSectionsBulkSchema = z.object({
    sectionIds: z.array(
        z.string().pipe(z.cuid2('Invalid section ID format'))
    ).min(1, 'At least one section ID must be provided')
        .max(100, 'Maximum 100 sections can be deleted at once')
});

// ============================================
// Section ID Params Schema
// ============================================

export const sectionIdParamsSchema = z.object({
    sectionId: z.string().pipe(
        z.cuid2('Invalid section ID format')
    )
});

export const pageIdParamsSchema = z.object({
    pageId: z.string().pipe(
        z.cuid2('Invalid page ID format')
    )
});

// ============================================
// Type Exports
// ============================================

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
export type ReorderSectionsInput = z.infer<typeof reorderSectionsSchema>;
export type MoveSectionInput = z.infer<typeof moveSectionSchema>;
export type CreateSectionsBatchInput = z.infer<typeof createSectionsBatchSchema>;
export type DeleteSectionsBulkInput = z.infer<typeof deleteSectionsBulkSchema>;
export type SectionIdParams = z.infer<typeof sectionIdParamsSchema>;
export type PageIdParams = z.infer<typeof pageIdParamsSchema>;