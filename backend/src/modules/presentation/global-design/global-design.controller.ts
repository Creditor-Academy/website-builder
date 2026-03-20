import type { NextFunction, Request, Response } from 'express';
import GlobalDesignService from './global-design.service.js';
import { NotFoundError } from '../../../utils/error.utils.js';

class GlobalDesignController {
    private service: GlobalDesignService;

    constructor() {
        this.service = new GlobalDesignService();
    }

    /**
     * GET /presentation/website/:websiteId/global-design
     * Get global design configuration for the website.
     */
    getGlobalDesign = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const websiteId = req.context.website!.id;
            if (!req.context.website.globalDesign) {
                throw new NotFoundError('Global design not found. Initialize it first.');
            }

            const globalDesign = await this.service.getGlobalDesign(websiteId);

            res.status(200).json({ data: globalDesign });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * PATCH /presentation/website/:websiteId/global-design
     * Update global styles / theme for the website.
     */
    updateGlobalDesign = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const websiteId = req.context.website!.id;
            if (!req.context.website.globalDesign) {
                throw new NotFoundError('Global design not found. Initialize it first.');
            }

            const globalDesign = await this.service.updateGlobalDesign(websiteId, req.validated.body);

            res.status(200).json({
                message: 'Global design updated successfully',
                data: globalDesign
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * POST /presentation/website/:websiteId/global-design/slots
     * Create global slot
     */
    createGlobalSlot = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const globalDesign = req.context.website!.globalDesign;
            if (!globalDesign) {
                throw new NotFoundError('Global design not found. Initialize it first.');
            }

            const globalSlot = await this.service.createGlobalSlot(globalDesign.id, req.validated.body);

            res.status(200).json({
                message: 'Global slot created successfully',
                data: globalSlot
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * PATCH /presentation/website/:websiteId/global-design/slots/:slotId
     * Update global slot
     */
    updateGlobalSlot = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const globalDesign = req.context.website!.globalDesign;
            if (!globalDesign) {
                throw new NotFoundError('Global design not found. Initialize it first.');
            }

            const slotId = req.validated.params.slotId!;
            const globalSlot = await this.service.updateGlobalSlot(globalDesign.id, slotId, req.validated.body);

            res.status(200).json({
                message: 'Global slot updated successfully',
                data: globalSlot
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * DELETE /presentation/website/:websiteId/global-design/slots/:slotId
     * Delete global slot
     */
    deleteGlobalSlot = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const globalDesign = req.context.website!.globalDesign;
            if (!globalDesign) {
                throw new NotFoundError('Global design not found. Initialize it first.');
            }

            const slotId = req.validated.params.slotId!;
            const globalSlot = await this.service.deleteGlobalSlot(globalDesign.id, slotId);

            res.status(200).json({
                message: 'Global slot deleted successfully',
                data: globalSlot
            });
        } catch (error: any) {
            next(error);
        }
    };
}

export default new GlobalDesignController();
