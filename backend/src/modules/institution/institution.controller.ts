import type { NextFunction, Request, Response } from 'express';
import InstitutionService from './institution.service.js';

class InstitutionController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await InstitutionService.createInstitution(req.body);
            res.status(201).json({ message: 'Organization created successfully', data: result });
        } catch (error) {
            next(error);
        }
    }

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await InstitutionService.getInstitutions();
            res.status(200).json({ data: result });
        } catch (error) {
            next(error);
        }
    }

    async listDetailed(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await InstitutionService.getDetailedInstitutions();
            res.status(200).json({ data: result });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const result = await InstitutionService.getInstitutionById(id);
            res.status(200).json({ data: result });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const result = await InstitutionService.updateInstitution(id, req.body);
            res.status(200).json({ message: 'Organization updated successfully', data: result });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            await InstitutionService.deleteInstitution(id);
            res.status(200).json({ message: 'Organization deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export default new InstitutionController();
