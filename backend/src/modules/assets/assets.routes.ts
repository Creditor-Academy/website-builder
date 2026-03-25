import { Router } from "express";
import websiteAssetsRoutes from "./routes/websiteAssets.routes.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { injectCategoryMiddleware } from "./middlewares/category.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Website assets routes
// used for both website and templates
router.use(
    '/website',
    injectCategoryMiddleware('website'),
    websiteAssetsRoutes
);

export default router;