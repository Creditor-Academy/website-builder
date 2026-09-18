import { describe, expect, it, beforeEach } from 'vitest';
import {
  BUILDER_STORAGE_NAME,
  builderStorageKey,
  migrateLegacyBuilderStorage,
} from './builderStorage';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    getItem: (key: string) => (key in data ? data[key] : null),
    setItem: (key: string, value: string) => {
      data[key] = value;
    },
    removeItem: (key: string) => {
      delete data[key];
    },
    keys: () => Object.keys(data),
    data,
  };
}

describe('builderStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('keeps each account on its own storage key', () => {
    expect(builderStorageKey('user-a')).toBe(`${BUILDER_STORAGE_NAME}:user-a`);
    expect(builderStorageKey('user-b')).toBe(`${BUILDER_STORAGE_NAME}:user-b`);
    expect(builderStorageKey(null)).toBe(`${BUILDER_STORAGE_NAME}:guest`);
  });

  it('moves shared leftover projects to the account already signed in', () => {
    const storage = memoryStorage({
      [BUILDER_STORAGE_NAME]: '{"state":{"websites":[{"id":"old"}]}}',
    });

    expect(migrateLegacyBuilderStorage(storage, 'user-a')).toBe(true);
    expect(storage.getItem(`${BUILDER_STORAGE_NAME}:user-a`)).toContain('old');
    expect(storage.getItem(BUILDER_STORAGE_NAME)).toBeNull();
  });

  it('does not give shared leftover projects to a later account', () => {
    const storage = memoryStorage({
      [`${BUILDER_STORAGE_NAME}:user-a`]: '{"state":{"websites":[{"id":"a"}]}}',
      [BUILDER_STORAGE_NAME]: '{"state":{"websites":[{"id":"old"}]}}',
    });

    expect(migrateLegacyBuilderStorage(storage, 'user-a')).toBe(false);
    expect(migrateLegacyBuilderStorage(storage, 'user-b')).toBe(false);
    expect(storage.getItem(`${BUILDER_STORAGE_NAME}:user-b`)).toBeNull();
  });
});
