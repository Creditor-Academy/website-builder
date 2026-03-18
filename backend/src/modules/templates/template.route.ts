import express from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import templateController from "./template.controller.js";
import {
    listTemplatesQuerySchema,
    templateIdParamsSchema,
    createWebsiteTemplateSchema,
    updateWebsiteTemplateSchema,
    createSectionTemplateSchema,
    updateSectionTemplateSchema
} from "./template.validation.js";
import { validateTemplate } from "../../middlewares/resource-access.middleware.js";
import { UserRole } from "@prisma/client";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ============================================
// Website Template Routes
// ============================================

/**
 * POST /templates/websites
 * Create a new website template
 */
router.post(
    "/websites",
    authorize([UserRole.ADMIN]),
    validateRequest(createWebsiteTemplateSchema),
    templateController.createWebsiteTemplate
);

/**
 * GET /templates/Websites
 * List all website templates with optional filters
 */
router.get(
    "/Websites",
    validateRequest(listTemplatesQuerySchema, 'query'),
    templateController.listWebsiteTemplates
);

/**
 * GET /templates/Websites/:templateId
 * Get single website template by ID
 */
router.get(
    "/Websites/:templateId",
    validateRequest(templateIdParamsSchema, 'params'),
    validateTemplate('website'),
    templateController.getWebsiteTemplate
);

/**
 * PATCH /templates/Websites/:templateId
 * Update website template
 */
router.patch(
    "/Websites/:templateId",
    authorize([UserRole.ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    validateRequest(updateWebsiteTemplateSchema),
    validateTemplate('website'),
    templateController.updateWebsiteTemplate
);

/**
 * DELETE /templates/Websites/:templateId
 * Delete (soft delete) website template
 */
router.delete(
    "/Websites/:templateId",
    authorize([UserRole.ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    validateTemplate('website'),
    templateController.deleteWebsiteTemplate
);

/**
 * POST /templates/Websites/:templateId/restore
 * Restore deleted website template
 */
router.post(
    "/Websites/:templateId/restore",
    authorize([UserRole.ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    validateTemplate('website'),
    templateController.restoreWebsiteTemplate
);

// ============================================
// Section Template Routes
// ============================================

/**
 * POST /templates/sections
 * Create a new section template
 */
router.post(
    "/sections",
    authorize([UserRole.ADMIN]),
    validateRequest(createSectionTemplateSchema),
    templateController.createSectionTemplate
);

/**
 * GET /templates/sections
 * List all section templates with optional filters
 */
router.get(
    "/sections",
    validateRequest(listTemplatesQuerySchema, 'query'),
    templateController.listSectionTemplates
);

/**
 * GET /templates/sections/:templateId
 * Get single section template by ID
 */
router.get(
    "/sections/:templateId",
    validateRequest(templateIdParamsSchema, 'params'),
    validateTemplate('section'),
    templateController.getSectionTemplate
);

/**
 * PATCH /templates/sections/:templateId
 * Update section template
 */
router.patch(
    "/sections/:templateId",
    authorize([UserRole.ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    validateRequest(updateSectionTemplateSchema),
    validateTemplate('section'),
    templateController.updateSectionTemplate
);

/**
 * DELETE /templates/sections/:templateId
 * Delete (soft delete) section template
 */
router.delete(
    "/sections/:templateId",
    authorize([UserRole.ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    validateTemplate('section'),
    templateController.deleteSectionTemplate
);

/**
 * POST /templates/sections/:templateId/restore
 * Restore deleted section template
 */
router.post(
    "/sections/:templateId/restore",
    authorize([UserRole.ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    validateTemplate('section'),
    templateController.restoreSectionTemplate
);

export default router;