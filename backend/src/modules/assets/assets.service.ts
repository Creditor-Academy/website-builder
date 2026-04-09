import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

export type AssetRecord = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'file';
  url: string;
  size?: string;
  date: string;
  ownerId: string;
  institutionId?: string;
};

class AssetsService {
  private readonly storageRoot = path.resolve(process.cwd(), 'storage', 'assets');
  private readonly filesRoot = path.resolve(this.storageRoot, 'files');
  private readonly manifestPath = path.resolve(this.storageRoot, 'manifest.json');

  private async ensureStorage() {
    await fs.mkdir(this.filesRoot, { recursive: true });
    try {
      await fs.access(this.manifestPath);
    } catch {
      await fs.writeFile(this.manifestPath, '[]', 'utf8');
    }
  }

  private async readManifest(): Promise<AssetRecord[]> {
    await this.ensureStorage();
    const raw = await fs.readFile(this.manifestPath, 'utf8');
    return JSON.parse(raw) as AssetRecord[];
  }

  private async writeManifest(records: AssetRecord[]) {
    await this.ensureStorage();
    await fs.writeFile(this.manifestPath, JSON.stringify(records, null, 2), 'utf8');
  }

  private getAssetType(mimeType?: string, fileName?: string): AssetRecord['type'] {
    if (mimeType?.startsWith('image/')) return 'image';
    if (mimeType?.startsWith('video/')) return 'video';
    if (fileName && /\.(png|jpe?g|gif|webp|svg)$/i.test(fileName)) return 'image';
    if (fileName && /\.(mp4|webm|ogg|mov)$/i.test(fileName)) return 'video';
    return 'file';
  }

  async listAssets(ownerId: string) {
    const records = await this.readManifest();
    return records.filter((record) => record.ownerId === ownerId);
  }

  async createUploadedAsset(ownerId: string, institutionId: string | undefined, file: Express.Multer.File, baseUrl: string) {
    const records = await this.readManifest();
    const extension = path.extname(file.originalname) || '';
    const fileName = `${crypto.randomUUID()}${extension}`;
    const targetPath = path.resolve(this.filesRoot, fileName);

    await fs.rename(file.path, targetPath);

    const asset: AssetRecord = {
      id: crypto.randomUUID(),
      name: file.originalname,
      type: this.getAssetType(file.mimetype, file.originalname),
      url: `${baseUrl}/uploads/${fileName}`,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: new Date().toISOString(),
      ownerId,
      ...(institutionId ? { institutionId } : {}),
    };

    await this.writeManifest([asset, ...records]);
    return asset;
  }

  async importAssetFromUrl(ownerId: string, institutionId: string | undefined, name: string, url: string) {
    const records = await this.readManifest();
    const asset: AssetRecord = {
      id: crypto.randomUUID(),
      name,
      type: this.getAssetType(undefined, url),
      url,
      size: 'External',
      date: new Date().toISOString(),
      ownerId,
      ...(institutionId ? { institutionId } : {}),
    };

    await this.writeManifest([asset, ...records]);
    return asset;
  }

  async deleteAsset(ownerId: string, assetId: string) {
    const records = await this.readManifest();
    const target = records.find((record) => record.id === assetId && record.ownerId === ownerId);

    if (!target) {
      return false;
    }

    await this.writeManifest(records.filter((record) => record.id !== assetId));

    const uploadsPrefix = '/uploads/';
    if (target.url.includes(uploadsPrefix)) {
      const fileName = target.url.split(uploadsPrefix)[1];
      if (fileName) {
        await fs.rm(path.resolve(this.filesRoot, fileName), { force: true });
      }
    }

    return true;
  }
}

export default new AssetsService();