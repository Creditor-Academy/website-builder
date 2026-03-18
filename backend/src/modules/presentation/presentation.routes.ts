import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import pageRoutes from "./pages/page.routes.js";
import { resolveWebsiteDraft } from "../../middlewares/resource-access.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { websiteIdParamsSchema } from "./presentation.validation.js";
import globalDesignRoutes from "./global-design/global-design.routes.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ============================================
// Nested Routes - Global Design, Pages and Sections
// /presentation/:websiteId/global-design
// /presentation/:websiteId/pages
// ============================================

router.use(
    "/:websiteId/global-design",
    validateRequest(websiteIdParamsSchema, 'params'),
    resolveWebsiteDraft({ include_global_design: true }),
    globalDesignRoutes
);

router.use(
    "/:websiteId/pages",
    validateRequest(websiteIdParamsSchema, 'params'),
    resolveWebsiteDraft(),
    pageRoutes
);

export default router;