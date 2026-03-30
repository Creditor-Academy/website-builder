// Generates Redis key for authentication sessions)
// If userId or sessionId is not provided, it defaults to '*' for pattern matching
export const generateAuthSessionKey = (userId: string = '*', sessionId: string = '*') => {
    return `session:${userId}:${sessionId}`;
}

// Generates Redis key for snapshots
export const generateSnapshotKey = (domain: string, slug: string) => {
    return `website:${domain}:${slug}`;
}

// Generates Redis key for domains
export const generateDomainKey = (domain: string) => {
    return `domain:${domain}`;
}