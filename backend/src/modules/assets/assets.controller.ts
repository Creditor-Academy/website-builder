import type { NextFunction, Request, Response } from 'express';
import assetsService from './assets.service.js';

class AssetsController {
  listAssets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assets = await assetsService.listAssets(req.context.user.id);
      res.status(200).json({ assets });
    } catch (error) {
      next(error);
    }
  };

  uploadAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'File is required' });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const asset = await assetsService.createUploadedAsset(
        req.context.user.id,
        req.context.user.institution_id,
        req.file,
        baseUrl,
      );

      res.status(201).json({ asset });
    } catch (error) {
      next(error);
    }
  };

  importUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const asset = await assetsService.importAssetFromUrl(
        req.context.user.id,
        req.context.user.institution_id,
        req.validated.body.name || 'Imported Asset',
        req.validated.body.url,
      );

      res.status(201).json({ asset });
    } catch (error) {
      next(error);
    }
  };

  deleteAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await assetsService.deleteAsset(req.context.user.id, req.validated.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Asset not found' });
      }

      res.status(200).json({ message: 'Asset deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export default new AssetsController();