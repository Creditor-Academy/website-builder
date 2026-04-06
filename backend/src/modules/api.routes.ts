import { Router } from "express";
import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./user/user.routes.js";
import websiteRoutes from "./website/website.routes.js";
import institutionRoutes from "./institution/institution.routes.js";
import statsRoutes from "./stats/stats.routes.js";
import templateRoutes from "./template/template.routes.js";  // ← ADD THIS

const router = Router();

// Register all module routes here
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/websites', websiteRoutes);
router.use('/organizations', institutionRoutes);
router.use('/stats', statsRoutes);
router.use('/templates', templateRoutes);  // ← ADD THIS

export default router;