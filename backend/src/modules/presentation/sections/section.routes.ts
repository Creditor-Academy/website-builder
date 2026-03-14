import express from 'express';
import SectionController from './section.controller.js';
import { validateRequest } from '../../../middlewares/validation.middleware.js';
import { validateSection } from '../../../middlewares/resource-access.middleware.js';
import {
    createSectionSchema,
    updateSectionSchema,
    reorderSectionsSchema,
    moveSectionSchema,
    createSectionsBatchSchema,
    deleteSectionsBulkSchema,
    sectionIdParamsSchema,
    pageIdParamsSchema
} from './section.validation.js';

const router = express.Router({ mergeParams: true });

/**
 * POST /presentation/website/:websiteId/sections/pages/:pageId
 * Create a new section in a page.
 */
router.post(
    '/pages/:pageId',
    validateRequest(pageIdParamsSchema, 'params'),
    validateRequest(createSectionSchema, 'body'),
    SectionController.createSection
);

/**
 * GET /presentation/website/:websiteId/sections/page/:pageId
 * Get all sections for a page.
 */
router.get(
    '/page/:pageId',
    validateRequest(pageIdParamsSchema, 'params'),
    SectionController.getSectionsByPage
);

/**
 * PATCH /presentation/website/:websiteId/sections/pages/:pageId/reorder
 * Reorder sections within a page.
 */
router.patch(
    '/pages/:pageId/reorder',
    validateRequest(pageIdParamsSchema, 'params'),
    validateRequest(reorderSectionsSchema, 'body'),
    SectionController.reorderSections
);

/**
 * DELETE /presentation/website/:websiteId/sections/pages/:pageId/bulk
 * Soft delete multiple sections from a page.
 */
router.delete(
    '/pages/:pageId/bulk',
    validateRequest(pageIdParamsSchema, 'params'),
    validateRequest(deleteSectionsBulkSchema, 'body'),
    SectionController.deleteSectionsBulk
);

/**
 * POST /presentation/website/:websiteId/sections/pages/:pageId/batch
 * Create multiple sections at once (for template-based page init).
 */
router.post(
    '/pages/:pageId/batch',
    validateRequest(pageIdParamsSchema, 'params'),
    validateRequest(createSectionsBatchSchema, 'body'),
    SectionController.createSectionsBatch
);

/**
 * GET /presentation/website/:websiteId/sections/:sectionId
 * Get single section by ID.
 */
router.get(
    '/:sectionId',
    validateRequest(sectionIdParamsSchema, 'params'),
    validateSection,
    SectionController.getSection
);

/**
 * PATCH /presentation/website/:websiteId/sections/:sectionId
 * Update section  properties and metadata.
 */
router.patch(
    '/:sectionId',
    validateRequest(sectionIdParamsSchema, 'params'),
    validateRequest(updateSectionSchema, 'body'),
    validateSection,
    SectionController.updateSection
);

/**
 * DELETE /presentation/website/:websiteId/sections/:sectionId
 * Soft delete a section.
 */
router.delete(
    '/:sectionId',
    validateRequest(sectionIdParamsSchema, 'params'),
    validateSection,
    SectionController.deleteSection
);

/**
 * POST /presentation/website/:websiteId/sections/:sectionId/restore
 * Restore a soft-deleted section.
 */
router.post(
    '/:sectionId/restore',
    validateRequest(sectionIdParamsSchema, 'params'),
    SectionController.restoreSection
);

/**
 * POST /presentation/website/:websiteId/sections/:sectionId/duplicate
 * Duplicate a section within the same page.
 */
router.post(
    '/:sectionId/duplicate',
    validateRequest(sectionIdParamsSchema, 'params'),
    validateSection,
    SectionController.duplicateSection
);

/**
 * POST /presentation/website/:websiteId/sections/:sectionId/move
 * Move section to a new position within the page.
 */
router.post(
    '/:sectionId/move',
    validateRequest(sectionIdParamsSchema, 'params'),
    validateRequest(moveSectionSchema, 'body'),
    validateSection,
    SectionController.moveSection
);

export default router;