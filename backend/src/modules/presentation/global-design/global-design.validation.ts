import { z } from 'zod';

// ============================================
// Global Design Schema
// ============================================

export const updateGlobalDesignSchema = z.object({
    global_styles: z.record(z.string(), z.any())
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
);

// ============================================
// Global Slot Schema
// ============================================

export const createGlobalSlotSchema = z.object({
    type: z.enum(["NAVBAR", "FOOTER"]),
    section_template_id: z.string(),
    props: z.record(z.string(), z.any())
});

export const updateGlobalSlotSchema = z.object({
    props: z.record(z.string(), z.any())
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
);

export const globalSlotParamsSchema = z.object({
    slotId: z.string()
        .pipe(z.cuid2("Invalid slot ID"))
});

// ============================================
// Type Exports
// ============================================

export type UpdateGlobalDesignInput = z.infer<typeof updateGlobalDesignSchema>;
export type CreateGlobalSlotInput = z.infer<typeof createGlobalSlotSchema>;
export type UpdateGlobalSlotInput = z.infer<typeof updateGlobalSlotSchema>;
export type GlobalSlotParamsInput = z.infer<typeof globalSlotParamsSchema>;