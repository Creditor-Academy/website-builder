import type { NextFunction, Request, Response } from 'express';
import WebsiteService from './website.service.js';
import type { WebsiteIdParams } from './website.validation.js';

class WebsiteController {
    private websiteService: WebsiteService;

    constructor() {
        this.websiteService = new WebsiteService();
    }

    // POST /websites - Create a new website
    createWebsite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.context.user.id;
            const website = await this.websiteService.createWebsite(userId, req.validated.body);
            res.status(201).json({ message: 'Website created successfully', website });
        } catch (error: any) {
            next(error);
        }
    }

    // GET /websites - List my websites
    listWebsites = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.context.user.id;
            const result = await this.websiteService.listWebsites(userId, req.validated.query);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    }

    // GET /websites/all - List all websites
    listAllWebsites = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.websiteService.listAllWebsites(req.validated.query);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    }

    // GET /websites/:id - Get single website by ID
    getWebsiteById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const website = req.context.website!;
            const data = await this.websiteService.getSingleWebsite(website);
            return res.status(200).json({ data });
        } catch (error: any) {
            next(error);
        }
    }

    // PATCH /websites/:id - Update website
    updateWebsite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const website = req.context.website!;
            const updatedWebsite = await this.websiteService.updateWebsite(website, req.validated.body);
            return res.status(200).json({ message: 'Website updated successfully', website: updatedWebsite });
        } catch (error: any) {
            next(error);
        }
    }

    // DELETE /websites/:id - Soft Delete Website
    deleteWebsite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const website = req.context.website!;
            await this.websiteService.deleteWebsite(website);
            return res.status(200).json({ message: 'Website deleted successfully' });
        } catch (error: any) {
            next(error);
        }
    }

    // POST /websites/:id/restore - Restore Website
    restoreWebsite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const website = req.context.website!;
            await this.websiteService.restoreWebsite(website);
            return res.status(200).json({ message: 'Website restored successfully' });
        } catch (error: any) {
            next(error);
        }
    }

    // POST /websites/:id/duplicate - Duplicate Website
    duplicateWebsite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const website = req.context.website!;
            const newWebsite = await this.websiteService.duplicateWebsite(website);
            return res.status(200).json({ message: 'Website duplicated successfully', website: newWebsite });
        } catch (error: any) {
            next(error);
        }
    }

    // PATCH /websites/:id/settings - Update Website Settings
    updateWebsiteSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const website = req.context.website!;
            await this.websiteService.updateWebsiteSettings(website, req.validated.body);
            return res.status(200).json({ message: 'Website settings updated successfully' });
        } catch (error: any) {
            next(error);
        }
    }

    // POST /websites/:id/publish - Publish Website
    publishWebsite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const website = req.context.website!;
            await this.websiteService.publishWebsite(website);
            return res.status(200).json({ message: 'Website published successfully' });
        } catch (error: any) {
            next(error);
        }
    }

    // POST /websites/:id/unpublish - Unpublish Website
    unpublishWebsite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const website = req.context.website!;
            await this.websiteService.unpublishWebsite(website);
            return res.status(200).json({ message: 'Website unpublished successfully' });
        } catch (error: any) {
            next(error);
        }
    }
}

export default WebsiteController;