import { doubleCsrf } from 'csrf-csrf';
import type { Request } from 'express';

export const {
    invalidCsrfTokenError,
    generateToken,
    doubleCsrfProtection,
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || 'a-very-secure-secret-key-that-should-be-in-env',
    cookieName: '__Host-buildora.x-csrf-token',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getTokenFromRequest: (req: Request) => req.headers['x-csrf-token'] as string,
});
