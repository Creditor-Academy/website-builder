import { DeleteObjectCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import AssetsDao from "./assets.dao.js";
import { ListAssetsQuerySchema } from "./assets.validation.js";
import { ForbiddenError, NotFoundError } from "../../../utils/error.utils.js";
import { User, UserRole } from "@prisma/client";
import S3Service from "../../../services/s3.service.js";

class AssetsService {
    private assetsDao: AssetsDao;
    private s3Service: S3Service;

    constructor() {
        this.assetsDao = new AssetsDao();
        this.s3Service = new S3Service();
    }

    async uploadSingle(user: User, file: Express.Multer.File, category: string) {
        try {
            const fileExtension = file.originalname.split(".").pop();

            const mimeType = file.mimetype.split("/")[0] || "others";
            const key = `${user.id}/${category}/${mimeType}/${uuid()}.${fileExtension}`;

            await this.s3Service.uploadFileToS3(file, key);

            const fileUrl = `${process.env.AWS_ASSET_BASE_URL}/${key}`;

            const assetData = {
                key,
                url: fileUrl,
                user_id: user.id,
                name: file.originalname,
                type: mimeType,
                size: file.size,
                category,
            };

            const asset = await this.assetsDao.createAsset(assetData);

            const { id, type, url, createdAt } = asset;
            return { id, type, category, url, createdAt };
        } catch (error) {
            throw error;
        }
    };

    async uploadMultiple(user: User, files: Express.Multer.File[], category: string) {
        try {
            const fileUrls = await Promise.all(files.map(
                (file) => this.uploadSingle(user, file, category)
            ));
            return fileUrls;
        } catch (error) {
            throw error;
        }
    }

    async listAssets(filters: ListAssetsQuerySchema, userId: string, category: string) {
        return await this.assetsDao.listAssets(filters, category, userId);
    }

    async deleteAsset(user: User, assetId: string, category: string) {
        const asset = await this.assetsDao.getAssetById(assetId);
        if (!asset || asset.deletedAt || asset.category !== category) {
            throw new NotFoundError("Asset not found");
        }
        if (asset.user_id !== user.id && user.role !== UserRole.ADMIN) {
            throw new ForbiddenError("Access Denied");
        }
        return await this.assetsDao.deleteAsset(assetId);
    }

    async restoreAsset(user: User, assetId: string, category: string) {
        const asset = await this.assetsDao.getAssetById(assetId);
        if (!asset || !asset.deletedAt || asset.category !== category) {
            throw new NotFoundError("Asset not found");
        }
        if (asset.user_id !== user.id && user.role !== UserRole.ADMIN) {
            throw new ForbiddenError("Access Denied");
        }
        return await this.assetsDao.restoreAsset(assetId);
    }

    async deleteMultipleAssets(user: User, assetIds: string[], category: string) {
        return await Promise.all(assetIds.map(
            (assetId) => this.deleteAsset(user, assetId, category)
        ));
    }

    async cleanupDeletedAssets() {
        const deletedAssets = await this.assetsDao.cleanupDeletedAssets();

        await Promise.all(deletedAssets.map(
            (asset) => this.s3Service.deleteFileFromS3(asset.key)
        ));
    }
}

export default AssetsService;