export const generateJWTPayload = (user: any, sessionId: string) => {
    return {
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId,
    };
}

export const generateSessionPayload = (user: any, refreshTokenHash: string) => {
    return {
        userId: user.id,
        role: user.role,
        refreshTokenId: refreshTokenHash,
        createdAt: new Date(),
    };
}