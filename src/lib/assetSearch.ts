type SearchableAsset = {
  name?: string;
  filename?: string;
  description?: string;
  tags?: string[] | string;
  meta?: {
    filename?: string;
    description?: string;
    tags?: string[] | string;
  };
};

function toSearchText(value: string[] | string | undefined) {
  return Array.isArray(value) ? value.join(' ') : value || '';
}

export function matchesAssetSearch(asset: SearchableAsset, query: string) {
  const searchText = [
    asset.name,
    asset.filename,
    asset.description,
    toSearchText(asset.tags),
    asset.meta?.filename,
    asset.meta?.description,
    toSearchText(asset.meta?.tags),
  ].join(' ').toLowerCase();

  return query.trim().toLowerCase().split(/\s+/).filter(Boolean).every((term) => searchText.includes(term));
}
