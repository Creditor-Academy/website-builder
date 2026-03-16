import express from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import templateController from "./template.controller.js";
import {
    listTemplatesQuerySchema,
    templateIdParamsSchema,
    createPageTemplateSchema,
    updatePageTemplateSchema,
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

// GET /websites/templates - List all website templates
router.get(
    '/websites',
    validateRequest(listTemplatesQuerySchema, 'query'),
    templateController.listWebsiteTemplates
);

// ============================================
// Page Template Routes
// ============================================

/**
 * POST /templates/pages
 * Create a new page template
 */
router.post(
    "/pages",
    authorize([UserRole.ADMIN]),
    validateRequest(createPageTemplateSchema),
    templateController.createPageTemplate
);

/**
 * GET /templates/pages
 * List all page templates with optional filters
 */
router.get(
    "/pages",
    validateRequest(listTemplatesQuerySchema, 'query'),
    templateController.listPageTemplates
);

/**
 * GET /templates/pages/:templateId
 * Get single page template by ID
 */
router.get(
    "/pages/:templateId",
    validateRequest(templateIdParamsSchema, 'params'),
    validateTemplate('page'),
    templateController.getPageTemplate
);

/**
 * PATCH /templates/pages/:templateId
 * Update page template
 */
router.patch(
    "/pages/:templateId",
    authorize([UserRole.ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    validateRequest(updatePageTemplateSchema),
    validateTemplate('page'),
    templateController.updatePageTemplate
);

/**
 * DELETE /templates/pages/:templateId
 * Delete (soft delete) page template
 */
router.delete(
    "/pages/:templateId",
    authorize([UserRole.ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    validateTemplate('page'),
    templateController.deletePageTemplate
);

/**
 * POST /templates/pages/:templateId/restore
 * Restore deleted page template
 */
router.post(
    "/pages/:templateId/restore",
    authorize([UserRole.ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    validateTemplate('page'),
    templateController.restorePageTemplate
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