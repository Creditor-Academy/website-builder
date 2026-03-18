import type { NextFunction, Request, Response } from 'express';
import TemplateService from './template.service.js';
import { NotFoundError } from '../../utils/error.utils.js';

class TemplateController {
    private templateService: TemplateService;

    constructor() {
        this.templateService = new TemplateService();
    }

    // ============================================
    // Website Template Routes
    // ============================================

    /**
     * POST /templates/websites
     * Create a new website template
     */
    createWebsiteTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = await this.templateService.createWebsiteTemplate(req.validated.body);

            res.status(201).json({
                message: 'Website template created successfully',
                data: template
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * GET /templates/websites
     * Get all website templates
     */
    listWebsiteTemplates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const templates = await this.templateService.listWebsiteTemplates(req.validated.query);

            res.status(200).json({
                data: templates,
                count: templates.length
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * GET /templates/websites/:templateId
     * Get single website template by ID
     */
    getWebsiteTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = req.context.websiteTemplate;

            if (!template) {
                throw new NotFoundError('Website template not found');
            }

            res.status(200).json({ data: template });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * PATCH /templates/websites/:templateId
     * Update website template
     */
    updateWebsiteTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = req.context.websiteTemplate!;

            const updatedTemplate = await this.templateService.updateWebsiteTemplate(
                template,
                req.validated.body
            );

            res.status(200).json({
                message: 'Website template updated successfully',
                data: updatedTemplate
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * DELETE /templates/websites/:templateId
     * Delete (soft delete) website template
     */
    deleteWebsiteTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = req.context.websiteTemplate!;

            await this.templateService.deleteWebsiteTemplate(template);

            res.status(200).json({
                message: 'Website template deleted successfully'
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * POST /templates/websites/:templateId/restore
     * Restore deleted website template
     */
    restoreWebsiteTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const template = req.context.websiteTemplate!;

            const updatedTemplate = await this.templateService.restoreWebsiteTemplate(template);

            res.status(200).json({
                message: 'Website template restored successfully',
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
