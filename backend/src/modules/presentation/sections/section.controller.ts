import type { NextFunction, Request, Response } from 'express';
import SectionService from './section.service.js';

class SectionController {
    private sectionService: SectionService;

    constructor() {
        this.sectionService = new SectionService();
    }

    /**
     * POST /versions/:versionId/sections/pages/:pageId
     * Create a new section in a page
     */
    createSection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pageId = req.validated.params.pageId;
            const section = await this.sectionService.createSection(pageId, req.validated.body);

            res.status(201).json({
                message: 'Section created successfully',
                data: section
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * GET /versions/:versionId/sections/:sectionId
     * Get single section by ID
     */
    getSection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sectionId = req.validated.params.sectionId;
            const section = await this.sectionService.getSection(sectionId);

            res.status(200).json({ data: section });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * GET /versions/:versionId/sections/page/:pageId
     * Get all sections for a page
     */
    getSectionsByPage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pageId = req.validated.params.pageId;
            const sections = await this.sectionService.getSectionsByPage(pageId);

            res.status(200).json({
                data: sections,
                count: sections.length
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * PATCH /versions/:versionId/sections/:sectionId
     * Update section properties and metadata
     */
    updateSection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sectionId = req.validated.params.sectionId;
            const section = await this.sectionService.updateSection(sectionId, req.validated.body);

            res.status(200).json({
                message: 'Section updated successfully',
                data: section
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * DELETE /versions/:versionId/sections/:sectionId
     * Delete (soft delete) a section
     */
    deleteSection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sectionId = req.validated.params.sectionId;
            await this.sectionService.deleteSection(sectionId);

            res.status(200).json({
                message: 'Section deleted successfully'
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * POST /versions/:versionId/sections/:sectionId/restore
     * Restore a soft-deleted section
     */
    restoreSection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sectionId = req.validated.params.sectionId;
            const section = await this.sectionService.restoreSection(sectionId);

            res.status(200).json({
                message: 'Section restored successfully',
                data: section
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * PATCH /versions/:versionId/sections/pages/:pageId/reorder
     * Reorder sections within a page
     */
    reorderSections = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pageId = req.validated.params.pageId;
            const sections = await this.sectionService.reorderSections(pageId, req.validated.body);

            res.status(200).json({
                message: 'Sections reordered successfully',
                data: sections
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * POST /versions/:versionId/sections/:sectionId/move
     * Move section to a new position in the page
     */
    moveSection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sectionId = req.validated.params.sectionId;
            const pageId = req.validated.params.pageId;
            const { newOrder } = req.validated.body;

            await this.sectionService.moveSectionOrder(pageId, sectionId, newOrder);

            res.status(200).json({
                message: 'Section moved successfully'
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * POST /versions/:versionId/sections/:sectionId/duplicate
     * Duplicate a section
     */
    duplicateSection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sectionId = req.validated.params.sectionId;
            const section = await this.sectionService.duplicateSection(sectionId);

            res.status(201).json({
                message: 'Section duplicated successfully',
                data: section
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * DELETE /versions/:versionId/sections/pages/:pageId/bulk
     * Delete multiple sections from a page
     */
    deleteSectionsBulk = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sectionIds } = req.validated.body;
            await this.sectionService.deleteSections(sectionIds);

            res.status(200).json({
                message: `${sectionIds.length} section(s) deleted successfully`
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * POST /versions/:versionId/sections/pages/:pageId/batch
     * Create multiple sections at once (for template-based creation)
     */
    createSectionsBatch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pageId = req.validated.params.pageId;
            const sections = await this.sectionService.createSectionsBatch(pageId, req.validated.body.sections);

            res.status(201).json({
                message: `${sections.length} section(s) created successfully`,
                data: sections
            });
        } catch (error: any) {
            next(error);
        }
    };
}

export default new SectionController();