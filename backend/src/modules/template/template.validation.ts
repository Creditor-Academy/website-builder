import { z } from 'zod';

// ─── Website Template Schemas ─────────────────────────────────────────────────

export const createWebsiteTemplateSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().min(1, 'Description is required').max(500),
    category: z.string().min(1, 'Category is required').max(50),
    image: z.string().url().optional().nullable(),
    global_styles: z.record(z.any()).optional().default({}),
    navbar: z.record(z.any()).optional().default({}),
    footer: z.record(z.any()).optional().default({}),
    home_layout: z.record(z.any()).optional().default({}),
});

export const updateWebsiteTemplateSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().min(1).max(500).optional(),
    category: z.string().min(1).max(50).optional(),
    image: z.string().url().optional().nullable(),
    global_styles: z.record(z.any()).optional(),
    navbar: z.record(z.any()).optional(),
    footer: z.record(z.any()).optional(),
    home_layout: z.record(z.any()).optional(),
});

export const templateIdParamsSchema = z.object({
    id: z.string().min(1, 'Template ID is required'),
});

// ─── Section Template Schemas ─────────────────────────────────────────────────

export const createSectionTemplateSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    category: z.string().min(1, 'Category is required').max(50),
    props: z.record(z.any()).optional().default({}),
});

export const updateSectionTemplateSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    category: z.string().min(1).max(50).optional(),
    props: z.record(z.any()).optional(),
});