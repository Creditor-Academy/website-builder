import { describe, expect, it } from 'vitest';
import { filterAssetsVisibleToUsers, isAssetVisibleToUsers, visibleAssetIdsFromMeta } from './assetVisibility';

describe('asset visibility meta', () => {
  it('hides assets marked hidden or not userVisible', () => {
    expect(isAssetVisibleToUsers('a', { meta: { hidden: true } })).toBe(false);
    expect(isAssetVisibleToUsers('b', { meta: { userVisible: false } })).toBe(false);
    expect(isAssetVisibleToUsers('c', { scope: 'GLOBAL', isGlobal: true, meta: { userVisible: true } })).toBe(true);
  });

  it('builds the visible set from persisted meta', () => {
    expect(
      visibleAssetIdsFromMeta([
        { id: 'keep', meta: { userVisible: true } },
        { id: 'hide', meta: { hidden: true } },
        { id: 'open' },
      ])
    ).toEqual(['keep', 'open']);
  });

  it('keeps user-owned assets in the library', () => {
    const user = { id: 'user-1' };
    localStorage.setItem('user', JSON.stringify(user));
    const visible = filterAssetsVisibleToUsers([
      { id: 'mine', scope: 'USER', ownerId: 'user-1', meta: { userVisible: false } },
      { id: 'hidden-global', scope: 'GLOBAL', isGlobal: true, meta: { userVisible: false } },
    ]);
    expect(visible.map((asset) => asset.id)).toEqual(['mine']);
    localStorage.removeItem('user');
  });
});
