import { z } from 'zod';

/**
 * Shared param schema for all presentation routes.
 * Route param is :websiteId (not :id).
 */
export const websiteIdParamsSchema = z.object({
    websiteId: z.string().min(1, 'Invalid website ID format')
        .pipe(z.cuid2('Invalid website ID format'))
});

export type WebsiteIdParams = z.infer<typeof websiteIdParamsSchema>;