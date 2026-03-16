import type { NextFunction, Request, Response } from 'express';
import PageService from './page.service.js';

class PageController {
    private pageService: PageService;

    constructor() {
        this.pageService = new PageService();
    }

    /**
     * POST /presentation/website/:websiteId/pages
     * Create a new page in the current draft website.
     */
    createPage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const websiteId = req.context.website!.id;
            const page = await this.pageService.createPage(websiteId, req.validated.body);
            res.status(201).json({
                message: 'Page created successfully',
                data: page
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * GET /presentation/website/:websiteId/pages
     * List all pages for the current draft website.
     */
    listPages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const websiteId = req.context.website!.id;
            const pages = await this.pageService.listPages(websiteId);
            res.status(200).json({
                data: pages,
                count: pages.length
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * GET /presentation/website/:websiteId/pages/:id
     * Get single page by ID with all sections.
     */
    getPageById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = req.context.page!;
            const data = await this.pageService.getSinglePage(page);
            res.status(200).json({ data });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * PATCH /presentation/website/:websiteId/pages/:id
     * Update page metadata and styles.
     */
    updatePage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = req.context.page!;
            const updatedPage = await this.pageService.updatePage(page, req.validated.body);
            res.status(200).json({
                message: 'Page updated successfully',
                data: updatedPage
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * DELETE /presentation/website/:websiteId/pages/:id
     * Soft delete page and all its sections.
     */
    deletePage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = req.context.page!;
            await this.pageService.deletePage(page);
            res.status(200).json({ message: 'Page deleted successfully' });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * POST /presentation/website/:websiteId/pages/:id/restore
     * Restore a soft-deleted page.
     */
    restorePage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.pageService.restorePage(req.context.page!);
            res.status(200).json({ message: 'Page restored successfully' });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * POST /presentation/website/:websiteId/pages/:id/duplicate
     * Duplicate page with all its sections.
     */
    duplicatePage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = req.context.page!;
            const websiteId = req.context.website!.id;

            const duplicatedPage = await this.pageService.duplicatePage(
                websiteId, page,
                req.validated.body
            );
            res.status(201).json({
                message: 'Page duplicated successfully',
                data: duplicatedPage
            });
        } catch (error: any) {
            next(error);
        }
    };
}

export default PageController;