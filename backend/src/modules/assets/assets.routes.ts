import express from 'express';
import multer from 'multer';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import assetsController from './assets.controller.js';
import { assetIdParamsSchema, importAssetUrlSchema } from './assets.validation.js';

const upload = multer({
  dest: 'storage/assets/tmp',
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

const router = express.Router();

router.use(authenticate);

router.get('/', assetsController.listAssets);
router.post('/upload', upload.single('file'), assetsController.uploadAsset);
router.post('/import-url', validateRequest(importAssetUrlSchema), assetsController.importUrl);
router.delete('/:id', validateRequest(assetIdParamsSchema, 'params'), assetsController.deleteAsset);

export default router;