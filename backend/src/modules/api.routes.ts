import { Router } from "express";
import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./user/user.routes.js";
import websiteRoutes from "./website/website.routes.js";

const router = Router();

// Register all module routes here
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/websites', websiteRoutes);

export default router;