import express from 'express';
import AssetsController from '../core/assets.controller.js';
import { upload } from '../../../middlewares/assets.middleware.js';
import { validateRequest } from '../../../middlewares/validation.middleware.js';
import { rateLimiting } from '../../../middlewares/rate-limiting.middleware.js';
import { UPLOAD_MULTIPLE_LIMIT, UPLOAD_SINGLE_LIMIT } from '../../../constants/assets.constants.js';
import {
    assetIdParamsSchema,
    deleteMultipleAssetsSchema,
    listAssetsQuerySchema,
    multipleFilesSchema,
    singleFileSchema
} from '../core/assets.validation.js';

const router = express.Router();
const assetsController = new AssetsController();

// POST /assets/website/single
// Upload single file
router.post(
    '/single',
    upload.single('file'),
    validateRequest(singleFileSchema, 'file'),
    rateLimiting('UPLOAD_LIMIT', UPLOAD_SINGLE_LIMIT),
    assetsController.uploadSingle
);

// POST /assets/website/multiple
// Upload multiple files
router.post(
    '/multiple',
    upload.array('files'),
    validateRequest(multipleFilesSchema, 'files'),
    rateLimiting('UPLOAD_LIMIT', UPLOAD_MULTIPLE_LIMIT),
    assetsController.uploadMultiple
);

// GET /assets
// List assets
router.get(
    '/',
    validateRequest(listAssetsQuerySchema, 'query'),
    assetsController.listAssets
);

// DELETE /assets/website/multiple
// Delete multiple assets
router.delete(
    '/multiple',
    validateRequest(deleteMultipleAssetsSchema),
    assetsController.deleteMultipleAssets
);

// DELETE /assets/website/:id
// Delete asset
router.delete(
    '/:id',
    validateRequest(assetIdParamsSchema, 'params'),
    assetsController.deleteAsset
);

// POST /assets/website/:id/restore
// Restore asset
router.post(
    '/:id/restore',
    validateRequest(assetIdParamsSchema, 'params'),
    assetsController.restoreAsset
);

export default router;