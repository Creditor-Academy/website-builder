import { z } from 'zod';
import { jsonObject } from '../../../utils/validator.utils.js';

// ============================================
// Global Design Schema
// ============================================

export const updateGlobalDesignSchema = z.object({
    global_styles: jsonObject
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
);

// ============================================
// Global Slot Schema
// ============================================

export const createGlobalSlotSchema = z.object({
    type: z.enum(["NAVBAR", "FOOTER"]),
    section_template_id: z.string().nullish(),
    props: jsonObject
});

export const updateGlobalSlotSchema = z.object({
    props: jsonObject.optional()
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