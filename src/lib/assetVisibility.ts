const STORAGE_KEY = 'buildora-user-visible-asset-ids';

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

export function isAssetVisibleToUsers(id: string): boolean {
  const ids = getUserVisibleAssetIds();
  if (ids === null) return true;
  return ids.includes(id);
}

export function filterAssetsVisibleToUsers<T extends { id: string }>(assets: T[]): T[] {
  const ids = getUserVisibleAssetIds();
  if (ids === null) return assets;
  const allowed = new Set(ids);
  return assets.filter((asset) => allowed.has(asset.id));
}
