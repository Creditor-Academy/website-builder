// Generates Redis key for authentication sessions)
// If userId or sessionId is not provided, it defaults to '*' for pattern matching
export const generateAuthSessionKey = (userId: string = '*', sessionId: string = '*') => {
    return `session:${userId}:${sessionId}`;
}