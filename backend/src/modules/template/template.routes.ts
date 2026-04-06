import express from 'express';
import templateController from './template.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import {
    createWebsiteTemplateSchema,
    updateWebsiteTemplateSchema,
    templateIdParamsSchema,
    createSectionTemplateSchema,
    updateSectionTemplateSchema,
} from './template.validation.js';
import { UserRole } from '@prisma/client';

const router = express.Router();

// ─── Website Template Routes ──────────────────────────────────────────────────

// GET /templates/websites — public, no auth needed
router.get('/websites', templateController.getAllWebsiteTemplates);

// GET /templates/websites/:id — admin only
router.get(
    '/websites/:id',
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    templateController.getWebsiteTemplateById
);

// POST /templates/websites — admin only
router.post(
    '/websites',
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN]),
    validateRequest(createWebsiteTemplateSchema),
    templateController.createWebsiteTemplate
);

// PATCH /templates/websites/:id — admin only
router.patch(
    '/websites/:id',
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    validateRequest(updateWebsiteTemplateSchema),
    templateController.updateWebsiteTemplate
);

// DELETE /templates/websites/:id — admin only (soft delete)
router.delete(
    '/websites/:id',
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    templateController.deleteWebsiteTemplate
);

// POST /templates/websites/:id/restore — admin only
router.post(
    '/websites/:id/restore',
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    templateController.restoreWebsiteTemplate
);

// ─── Section Template Routes ──────────────────────────────────────────────────

// GET /templates/sections — public
router.get('/sections', templateController.getAllSectionTemplates);

// GET /templates/sections/:id — auth required
router.get(
    '/sections/:id',
    authenticate,
    validateRequest(templateIdParamsSchema, 'params'),
    templateController.getSectionTemplateById
);

// POST /templates/sections — admin only
router.post(
    '/sections',
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN]),
    validateRequest(createSectionTemplateSchema),
    templateController.createSectionTemplate
);

// PATCH /templates/sections/:id — admin only
router.patch(
    '/sections/:id',
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    validateRequest(updateSectionTemplateSchema),
    templateController.updateSectionTemplate
);

// DELETE /templates/sections/:id — admin only (soft delete)
router.delete(
    '/sections/:id',
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    templateController.deleteSectionTemplate
);

// POST /templates/sections/:id/restore — admin only
router.post(
    '/sections/:id/restore',
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN]),
    validateRequest(templateIdParamsSchema, 'params'),
    templateController.restoreSectionTemplate
);

export default router;