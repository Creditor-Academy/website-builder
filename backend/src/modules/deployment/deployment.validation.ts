import { z } from 'zod';

// Website ID params schema
export const websiteIdParamsSchema = z.object({
    id: z.string().min(1, 'Invalid website ID format')
        .pipe(z.cuid2('Invalid website ID format'))
});

// Live Website Page Query Schema
export const liveWebsitePageQuerySchema = z.object({
    slug: z.string().optional().default("/")
});

export type WebsiteIdParams = z.infer<typeof websiteIdParamsSchema>;
export type LiveWebsitePageQuery = z.infer<typeof liveWebsitePageQuerySchema>;