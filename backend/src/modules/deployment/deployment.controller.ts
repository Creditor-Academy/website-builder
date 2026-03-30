import { Request, Response, NextFunction } from "express";
import DeploymentService from "./deployment.service.js";

class DeploymentController {
    private deploymentService: DeploymentService;

    constructor() {
        this.deploymentService = new DeploymentService();
    }

    // POST /deploy/website/:id/publish
    publishWebsite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const website = req.context.website;
            await this.deploymentService.publishWebsite(website);
            res.status(200).json({ success: true, message: "Website published successfully" });
        } catch (error) {
            next(error);
        }
    };

    // POST /deploy/website/:id/unpublish
    unpublishWebsite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const website = req.context.website;
            await this.deploymentService.unpublishWebsite(website);
            res.status(200).json({ success: true, message: "Website unpublished successfully" });
        } catch (error) {
            next(error);
        }
    };

    // GET /deploy/render?slug={slug}
    renderLiveWebsite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const hostname = req.headers.host! as string;
            const slug = req.validated.query.slug as string;
            const pageSnapshot = await this.deploymentService.renderLiveWebsite(hostname, slug);
            res.status(200).json({ success: true, data: pageSnapshot });
        } catch (error) {
            next(error);
        }
    };
}

export default DeploymentController;