import z from "zod";
import { MAX_FILE_SIZE, MAX_FILES_COUNT, ALLOWED_FILE_TYPES } from "../../../constants/assets.constants.js";
import { jsonArray } from "../../../utils/validator.utils.js";

const fileValidationSchema = z.object({
    originalname: z.string(),
    buffer: z.any(),

    size: z.number()
        .refine((size) => size <= MAX_FILE_SIZE, "File size must be less than 5MB"),

    mimetype: z.string()
        .refine((type) => ALLOWED_FILE_TYPES.includes(type), "Invalid file type"),
})

export const singleFileSchema = fileValidationSchema;

export const multipleFilesSchema = z.array(fileValidationSchema)
    .min(1, "At least one file is required")
    .max(MAX_FILES_COUNT, `Maximum ${MAX_FILES_COUNT} files allowed`);

export const listAssetsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),

    search: z.string().optional(),

    // Optional filters based on Asset model
    type: z.string().optional(),
    category: z.string().optional(),
});

// Asset ID params schema
export const assetIdParamsSchema = z.object({
    id: z.string().min(1, 'Invalid asset ID format')
        .pipe(z.cuid2('Invalid asset ID format'))
});

// Delete Multiple Assets Body Schema
export const deleteMultipleAssetsSchema = z.object({
    ids: jsonArray
        .pipe(
            z.array(
                z.string().min(1, 'Invalid asset ID format')
                    .pipe(z.cuid2('Invalid asset ID format'))
            ).min(1, 'At least one asset ID is required')
        )
});

export type SingleFileSchema = z.infer<typeof singleFileSchema>;
export type MultipleFilesSchema = z.infer<typeof multipleFilesSchema>;
export type ListAssetsQuerySchema = z.infer<typeof listAssetsQuerySchema>;
export type AssetIdParamsSchema = z.infer<typeof assetIdParamsSchema>;
export type DeleteMultipleAssetsSchema = z.infer<typeof deleteMultipleAssetsSchema>;