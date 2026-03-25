import express from 'express';
import AssetsController from '../core/assets.controller.js';
import { upload } from '../../../middlewares/assets.middleware.js';
import { validateRequest } from '../../../middlewares/validation.middleware.js';
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
    assetsController.uploadSingle
);

// POST /assets/website/multiple
// Upload multiple files
router.post(
    '/multiple',
    upload.array('files'),
    validateRequest(multipleFilesSchema, 'files'),
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