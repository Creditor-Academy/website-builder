import type { Prisma } from "@prisma/client";

export const SELECT_WEBSITE_FIELDS = {
    id: true,
    name: true,
    status: true,
    created_at: true
} satisfies Prisma.WebsiteSelect;

// 30 days in milliseconds
export const DELETED_WEBSITE_RETENTION_TIME = 30 * 24 * 60 * 60 * 1000;

// Rate limiting
export const CREATE_WEB_LIMIT = {
    LIMIT: 5,
    WINDOW_SEC: 60 * 60 // 1hr
}

export const DUPLICATE_WEB_LIMIT = {
    LIMIT: 5,
    WINDOW_SEC: 60 * 60 // 1hr
}

// Snapshot Redis TTL
export const SNAPSHOT_REDIS_TTL = 60 * 60 * 24 * 30; // 30 days