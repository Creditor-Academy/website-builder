import express from "express";
import { validateRequest } from "../../../middlewares/validation.middleware.js";
import globalDesignController from "./global-design.controller.js";
import { createGlobalSlotSchema, globalSlotParamsSchema, updateGlobalDesignSchema, updateGlobalSlotSchema } from "./global-design.validation.js";

const router = express.Router();

// ============================================
// Global Design Routes
// /presentation/website/:websiteId/global-design
// ============================================

/**
 * GET /presentation/website/:websiteId/global-design
 * Get global design (navbar, footer, global styles) for the website.
 */
router.get(
    "/",
    globalDesignController.getGlobalDesign
);

/**
 * PATCH /presentation/website/:websiteId/global-design
 * Update global styles / theme for the website.
 */
router.patch(
    "/",
    validateRequest(updateGlobalDesignSchema),
    globalDesignController.updateGlobalDesign
);

/**
 * POST /presentation/website/:websiteId/global-design/slots
 * Create global slot
 */
router.post(
    "/slots",
    validateRequest(createGlobalSlotSchema),
    globalDesignController.createGlobalSlot
);

/**
 * PATCH /presentation/website/:websiteId/global-design/slots/:slotId
 * Update global slot
 */
router.patch(
    "/slots/:slotId",
    validateRequest(globalSlotParamsSchema),
    validateRequest(updateGlobalSlotSchema),
    globalDesignController.updateGlobalSlot
);

/**
 * DELETE /presentation/website/:websiteId/global-design/slots/:slotId
 * Delete global slot
 */
router.delete(
    "/slots/:slotId",
    validateRequest(globalSlotParamsSchema),
    globalDesignController.deleteGlobalSlot
);

export default router;