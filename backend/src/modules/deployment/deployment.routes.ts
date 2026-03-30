import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { liveWebsitePageQuerySchema, websiteIdParamsSchema } from "./deployment.validation.js";
import DeploymentController from "./deployment.controller.js";
import { requireWebsiteAccess } from "../../middlewares/resource-access.middleware.js";

const router = Router();
const deploymentController = new DeploymentController();

// Render Live Website
// GET /deploy/render?slug=home
router.get(
    "/render",
    validateRequest(liveWebsitePageQuerySchema, "query"),
    deploymentController.renderLiveWebsite
);

router.use(authenticate);

// Publish Website
// POST /deploy/website/:id/publish
router.post(
    "/website/:id/publish",
    validateRequest(websiteIdParamsSchema, "params"),
    requireWebsiteAccess,
    deploymentController.publishWebsite
);

// Unpublish Website
// POST /deploy/website/:id/unpublish
router.post(
    "/website/:id/unpublish",
    validateRequest(websiteIdParamsSchema, "params"),
    requireWebsiteAccess,
    deploymentController.unpublishWebsite
);

export default router;
