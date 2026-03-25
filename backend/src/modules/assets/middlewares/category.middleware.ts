import { NextFunction, Request, Response } from "express";

export const injectCategoryMiddleware = (category: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        req.context.assetCategory = category;
        next();
    };
};