import { describe, expect, it } from 'vitest';
import { matchesAssetSearch } from './assetSearch';

describe('matchesAssetSearch', () => {
  it('matches name, description, tags, and metadata fields', () => {
    expect(matchesAssetSearch({
      name: 'launch.mp4',
      meta: { description: 'Product teaser', tags: ['campaign', 'summer'] },
    }, 'summer teaser')).toBe(true);
  });

  it('requires all query words and handles case-insensitive matches', () => {
    expect(matchesAssetSearch({ name: 'Product-Launch.mp4' }, 'PRODUCT mp4')).toBe(true);
    expect(matchesAssetSearch({ name: 'Product-Launch.mp4' }, 'product summer')).toBe(false);
  });
});
