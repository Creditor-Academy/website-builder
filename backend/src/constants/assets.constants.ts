export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const MAX_FILES_COUNT = 10;

export const ALLOWED_FILE_TYPES = [
    "image/jpeg", "image/png", "image/webp",
    "video/mp4", "video/mov", "video/webm"
];

// 30 days in milliseconds
export const DELETED_ASSET_RETENTION_TIME = 30 * 24 * 60 * 60 * 1000;