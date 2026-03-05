import "express";

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
      sessionId: string;
      validated: {
        body?: any;
        query?: any;
        params?: any;
      };
    }
  }
}

export { };