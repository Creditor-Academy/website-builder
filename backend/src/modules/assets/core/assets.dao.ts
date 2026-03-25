import { Prisma } from "@prisma/client";
import prismaClient from "../../../config/prisma.js";
import { DELETED_ASSET_RETENTION_TIME } from "../../../constants/assets.constants.js";
import type { ListAssetsQuerySchema } from "./assets.validation.js";

class AssetsDao {
    async createAsset(assetData: Omit<Prisma.AssetUncheckedCreateInput, 'id' | 'createdAt' | 'deletedAt'>) {
        return await prismaClient.asset.create({
            data: assetData
        });
    }

    async getAssetById(id: string) {
        return await prismaClient.asset.findUnique({
            where: { id }
        });
    }

    async listAssets(filters: ListAssetsQuerySchema, category: string, userId?: string) {
        const {
            page = 1, limit = 10,
            search, type
        } = filters;

        const skip = (page - 1) * limit;

        const where: Prisma.AssetWhereInput = { deletedAt: null, category };

        if (userId) where.user_id = userId;
        if (type) where.type = type;

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [assets, total] = await Promise.all([
            prismaClient.asset.findMany({
                where,
                skip, take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prismaClient.asset.count({ where }),
        ]);

        return {
            assets,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async deleteAsset(id: string) {
        return await prismaClient.asset.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }

    async restoreAsset(id: string) {
        return await prismaClient.asset.update({
            where: { id },
            data: { deletedAt: null }
        });
    }

    async cleanupDeletedAssets() {
        // Find assets to actually delete from storage (if we need to return them to S3 cleanup job)
        const assetsToDelete = await prismaClient.asset.findMany({
            where: {
                deletedAt: {
                    lte: new Date(Date.now() - DELETED_ASSET_RETENTION_TIME)
                }
            }
        });

        if (assetsToDelete.length > 0) {
            await prismaClient.asset.deleteMany({
                where: {
                    id: { in: assetsToDelete.map(a => a.id) }
                }
            });
        }

        return assetsToDelete;
    }
}

export default AssetsDao;
