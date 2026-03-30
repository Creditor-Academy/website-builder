import { Router } from "express";
import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./user/user.routes.js";
import websiteRoutes from "./website/website.routes.js";
import presentationRoutes from "./presentation/presentation.routes.js";
import templateRoutes from "./templates/template.route.js";
import assetsRoutes from "./assets/assets.routes.js";
import domainRoutes from "./domain/domain.routes.js";
import deploymentRoutes from "./deployment/deployment.routes.js";

const router = Router();

// Register all module routes here
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/websites', websiteRoutes);
router.use('/presentation', presentationRoutes);
router.use('/templates', templateRoutes);
router.use('/assets', assetsRoutes);
router.use('/domains', domainRoutes);
router.use('/deploy', deploymentRoutes);

export default router;