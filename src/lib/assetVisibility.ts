import { getStoredUser } from '@/lib/authSession';

const STORAGE_KEY = 'buildora-user-visible-asset-ids';
const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'INSTITUTION_ADMIN'];

export type AssetVisibilityMeta = {
  userVisible?: boolean;
  hidden?: boolean;
  visibilityUpdatedAt?: string;
};

export function getUserVisibleAssetIds(): string[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : null;
  } catch {
    return null;
  }
}

export function setUserVisibleAssetIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function isAdminGlobalAsset(asset: { scope?: string; isGlobal?: boolean }): boolean {
  return asset.scope === 'GLOBAL' || (asset.isGlobal === true && asset.scope !== 'USER');
}

export function isUserOwnedAsset(
  asset: { scope?: string; isGlobal?: boolean; ownerId?: string },
  userId?: string | null,
): boolean {
  if (!userId) return false;
  if (isAdminGlobalAsset(asset)) return false;
  return asset.scope === 'USER' || asset.ownerId === userId;
}

export function canDeleteAsset(asset: { scope?: string; isGlobal?: boolean; ownerId?: string }): boolean {
  const user = getStoredUser();
  if (!user?.id) return false;
  if (ADMIN_ROLES.includes(user.role || '')) return true;
  return isUserOwnedAsset(asset, user.id);
}

export function rememberAssetVisibleToUsers(id: string) {
  const ids = getUserVisibleAssetIds();
  if (ids === null || ids.includes(id)) return;
  setUserVisibleAssetIds([id, ...ids]);
}

function metaHidesAsset(meta?: AssetVisibilityMeta): boolean {
  if (!meta) return false;
  return meta.hidden === true || meta.userVisible === false;
}

export function isAssetVisibleToUsers(
  id: string,
  asset?: { scope?: string; isGlobal?: boolean; ownerId?: string; meta?: AssetVisibilityMeta },
): boolean {
  const user = getStoredUser();
  if (asset && isUserOwnedAsset(asset, user?.id)) return true;
  if (metaHidesAsset(asset?.meta)) return false;
  if (asset?.meta?.userVisible === true) return true;
  if (asset && isAdminGlobalAsset(asset) && asset.meta?.userVisible == null && asset.meta?.hidden == null) {
    const ids = getUserVisibleAssetIds();
    if (ids === null) return true;
    return ids.includes(id);
  }
  const ids = getUserVisibleAssetIds();
  if (ids === null) return !metaHidesAsset(asset?.meta);
  return ids.includes(id);
}

export function filterAssetsVisibleToUsers<T extends { id: string; scope?: string; isGlobal?: boolean; ownerId?: string; meta?: AssetVisibilityMeta }>(
  assets: T[],
): T[] {
  const user = getStoredUser();
  return assets.filter((asset) => isUserOwnedAsset(asset, user?.id) || isAssetVisibleToUsers(asset.id, asset));
}

export function visibleAssetIdsFromMeta<T extends { id: string; meta?: AssetVisibilityMeta }>(assets: T[]): string[] {
  return assets.filter((asset) => !metaHidesAsset(asset.meta)).map((asset) => asset.id);
}
