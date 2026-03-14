import { z } from 'zod';

/**
 * Shared param schema for all presentation routes.
 * Route param is :websiteId (not :id).
 */
export const websiteIdParamsSchema = z.object({
    websiteId: z.string().pipe(
        z.cuid2('Invalid website ID format')
    )
});

export type WebsiteIdParams = z.infer<typeof websiteIdParamsSchema>;