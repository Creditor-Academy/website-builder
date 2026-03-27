import { Request, Response, NextFunction } from "express";
import DomainService from "./domain.service.js";

class DomainController {
    private domainService: DomainService;

    constructor() {
        this.domainService = new DomainService();
    }

    // List all custom domains
    listAllCustomDomains = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.domainService.listAllCustomDomains(req.validated.query);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    };

    // Get domains by Website Id
    getDomainsByWebsiteId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const websiteId = req.validated.params.id;
            const result = await this.domainService.getDomainsByWebsiteId(websiteId);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    };

    // Check if domain is available
    checkDomainAvailability = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const hostname = req.validated.query.hostname;
            const result = await this.domainService.checkDomainAvailability(hostname);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    };

    // Register domain
    registerDomain = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const websiteId = req.validated.params.id;
            const result = await this.domainService.registerDomain(websiteId, req.validated.body);
            res.status(201).json(result);
        } catch (error: any) {
            next(error);
        }
    };

    // Update domain
    updateDomain = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const websiteId = req.validated.params.id;
            const result = await this.domainService.updateDomain(websiteId, req.validated.body);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    };

    // Verify domain
    verifyDomain = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const websiteId = req.validated.params.id;
            const result = await this.domainService.verifyDomain(websiteId);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    };

    // Delete domain
    deleteDomain = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const domainId = req.validated.params.id;
            const result = await this.domainService.deleteDomain(domainId);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    };
}

export default DomainController;