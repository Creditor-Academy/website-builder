import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import pageRoutes from "./pages/page.routes.js";
import sectionRoutes from "./sections/section.routes.js";
import { resolveWebsiteDraft } from "../../middlewares/resource-access.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { websiteIdParamsSchema } from "./presentation.validation.js";
import globalDesignRoutes from "./global-design/global-design.routes.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ============================================
// Nested Routes - Global Design, Pages and Sections
// /presentation/website/:websiteId/global-design
// /presentation/website/:websiteId/pages
// /presentation/website/:websiteId/sections
// ============================================

router.use(
    "/website/:websiteId/global-design",
    validateRequest(websiteIdParamsSchema, 'params'),
    resolveWebsiteDraft({ include_global_design: true }),
    globalDesignRoutes
);

router.use(
    "/website/:websiteId/pages",
    validateRequest(websiteIdParamsSchema, 'params'),
    resolveWebsiteDraft(),
    pageRoutes
);

router.use(
    "/website/:websiteId/sections",
    validateRequest(websiteIdParamsSchema, 'params'),
    resolveWebsiteDraft(),
    sectionRoutes
);

export default router;