import express from 'express';
import PageController from './page.controller.js';
import { validateRequest } from '../../../middlewares/validation.middleware.js';
import { validatePage } from '../../../middlewares/resource-access.middleware.js';
import {
    createPageSchema,
    updatePageSchema,
    duplicatePageSchema,
    pageIdParamsSchema,
    listPagesQuerySchema
} from './page.validation.js';

const router = express.Router({ mergeParams: true });
const pageController = new PageController();

/**
 * GET /presentation/website/:websiteId/pages
 * List all pages for the draft version with optional pagination and search.
 */
router.get(
    '/',
    validateRequest(listPagesQuerySchema, 'query'),
    pageController.listPages
);

/**
 * POST /presentation/website/:websiteId/pages
 * Create a new page in the draft version.
 */
router.post(
    '/',
    validateRequest(createPageSchema),
    pageController.createPage
);

/**
 * GET /presentation/website/:websiteId/pages/:id
 * Get single page by ID with all sections.
 */
router.get(
    '/:id',
    validateRequest(pageIdParamsSchema, 'params'),
    validatePage,
    pageController.getPageById
);

/**
 * PATCH /presentation/website/:websiteId/pages/:id
 * Update page metadata, name, slug, and styles.
 */
router.patch(
    '/:id',
    validateRequest(pageIdParamsSchema, 'params'),
    validateRequest(updatePageSchema),
    validatePage,
    pageController.updatePage
);

/**
 * DELETE /presentation/website/:websiteId/pages/:id
 * Soft delete page (also soft deletes all child sections).
 */
router.delete(
    '/:id',
    validateRequest(pageIdParamsSchema, 'params'),
    validatePage,
    pageController.deletePage
);

/**
 * POST /presentation/website/:websiteId/pages/:id/restore
 * Restore a soft-deleted page.
 */
router.post(
    '/:id/restore',
    validateRequest(pageIdParamsSchema, 'params'),
    validatePage,
    pageController.restorePage
);

/**
 * POST /presentation/website/:websiteId/pages/:id/duplicate
 * Duplicate page with all its sections.
 */
router.post(
    '/:id/duplicate',
    validateRequest(pageIdParamsSchema, 'params'),
    validateRequest(duplicatePageSchema),
    validatePage,
    pageController.duplicatePage
);

export default router;
