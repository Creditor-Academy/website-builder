import { Request, Response, NextFunction } from "express";
import AssetsService from "./assets.service.js";

class AssetsController {
    private assetsService: AssetsService;

    constructor() {
        this.assetsService = new AssetsService();
    }

    uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.validated.file as Express.Multer.File;
            const category = req.context.assetCategory!;

            const result = await this.assetsService.uploadSingle(req.context.user, file, category);

            return res.json({
                message: "Upload successful",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    uploadMultiple = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const files = req.validated.files as Express.Multer.File[];
            const category = req.context.assetCategory!;

            const result = await Promise.all(files.map(
                async (file) => await this.assetsService.uploadSingle(req.context.user, file, category)
            ));

            return res.json({
                message: "Upload successful",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    listAssets = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const category = req.context.assetCategory!;
            const assets = await this.assetsService.listAssets(req.validated.query, req.context.user.id, category);
            return res.json({ data: assets });
        } catch (error) {
            next(error);
        }
    }

    deleteAsset = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const assetId = req.validated.params.id;
            const category = req.context.assetCategory!;

            await this.assetsService.deleteAsset(req.context.user, assetId, category);
            return res.json({ message: 'Asset deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    restoreAsset = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const assetId = req.validated.params.id;
            const category = req.context.assetCategory!;

            await this.assetsService.restoreAsset(req.context.user, assetId, category);
            return res.json({ message: 'Asset restored successfully' });
        } catch (error) {
            next(error);
        }
    }

    deleteMultipleAssets = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const assetIds = req.validated.body.ids;
            const category = req.context.assetCategory!;

            await this.assetsService.deleteMultipleAssets(req.context.user, assetIds, category);
            return res.json({ message: 'Assets deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export default AssetsController;