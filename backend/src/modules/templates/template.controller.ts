import type { NextFunction, Request, Response } from 'express';
import TemplateService from './template.service.js';
import { NotFoundError } from '../../utils/error.utils.js';

class TemplateController {
    private templateService: TemplateService;

    constructor() {
        this.templateService = new TemplateService();
    }

    // ============================================
    // Page Template Routes
    // ============================================

    /**
     * POST /templates/pages
     * Create a new page template
     */
    createPageTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = await this.templateService.createPageTemplate(req.validated.body);

            res.status(201).json({
                message: 'Page template created successfully',
                data: template
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * GET /templates/pages
     * Get all page templates
     */
    listPageTemplates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const templates = await this.templateService.listPageTemplates(req.validated.query);

            res.status(200).json({
                data: templates,
                count: templates.length
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * GET /templates/pages/:templateId
     * Get single page template by ID
     */
    getPageTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = req.context.pageTemplate;

            if (!template) {
                throw new NotFoundError('Page template not found');
            }

            res.status(200).json({ data: template });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * PATCH /templates/pages/:templateId
     * Update page template
     */
    updatePageTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = req.context.pageTemplate!;

            const updatedTemplate = await this.templateService.updatePageTemplate(
                template,
                req.validated.body
            );

            res.status(200).json({
                message: 'Page template updated successfully',
                data: updatedTemplate
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * DELETE /templates/pages/:templateId
     * Delete (soft delete) page template
     */
    deletePageTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = req.context.pageTemplate!;

            await this.templateService.deletePageTemplate(template);

            res.status(200).json({
                message: 'Page template deleted successfully'
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * POST /templates/pages/:templateId/restore
     * Restore deleted page template
     */
    restorePageTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = req.context.pageTemplate!;

            const updatedTemplate = await this.templateService.restorePageTemplate(template);

            res.status(200).json({
                message: 'Page template restored successfully',
                data: updatedTemplate
            });
        } catch (error: any) {
            next(error);
        }
    };

    // ============================================
    // Section Template Routes
    // ============================================

    /**
     * POST /templates/sections
     * Create a new section template
     */
    createSectionTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = await this.templateService.createSectionTemplate(req.validated.body);

            res.status(201).json({
                message: 'Section template created successfully',
                data: template
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * GET /templates/sections
     * Get all section templates
     */
    listSectionTemplates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const templates = await this.templateService.listSectionTemplates(req.validated.query);

            res.status(200).json({
                data: templates,
                count: templates.length
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * GET /templates/sections/:templateId
     * Get single section template by ID
     */
    getSectionTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = req.context.sectionTemplate!;

            if (!template) {
                throw new NotFoundError('Section template not found');
            }

            res.status(200).json({ data: template });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * PATCH /templates/sections/:templateId
     * Update section template
     */
    updateSectionTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = req.context.sectionTemplate!;

            const updatedTemplate = await this.templateService.updateSectionTemplate(
                template,
                req.validated.body
            );

            res.status(200).json({
                message: 'Section template updated successfully',
                data: updatedTemplate
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * DELETE /templates/sections/:templateId
     * Delete (soft delete) section template
     */
    deleteSectionTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = req.context.sectionTemplate!;

            await this.templateService.deleteSectionTemplate(template);

            res.status(200).json({
                message: 'Section template deleted successfully'
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * POST /templates/sections/:templateId/restore
     * Restore deleted section template
     */
    restoreSectionTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = req.context.sectionTemplate!;

            const updatedTemplate = await this.templateService.restoreSectionTemplate(template);

            res.status(200).json({
                message: 'Section template restored successfully',
                data: updatedTemplate
            });
        } catch (error: any) {
            next(error);
        }
    };
}

export default new TemplateController();
