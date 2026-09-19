export const BUILDER_STORAGE_NAME = 'website-builder-storage';

export function getStoredUserId(): string | null {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return typeof user?.id === 'string' && user.id ? user.id : null;
  } catch {
    return null;
  }
}

export function builderStorageKey(userId: string | null | undefined): string {
  return userId ? `${BUILDER_STORAGE_NAME}:${userId}` : `${BUILDER_STORAGE_NAME}:guest`;
}

type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> & {
  keys?: () => string[];
};

function storageKeys(storage: KeyValueStorage): string[] {
  if (typeof storage.keys === 'function') return storage.keys();
  if (typeof localStorage !== 'undefined' && storage === localStorage) {
    return Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).filter(
      (key): key is string => Boolean(key)
    );
  }
  return [];
}

function hasOtherAccountStore(storage: KeyValueStorage, userId: string): boolean {
  const prefix = `${BUILDER_STORAGE_NAME}:`;
  const ownKey = builderStorageKey(userId);
  const guestKey = builderStorageKey(null);
  return storageKeys(storage).some((key) => key.startsWith(prefix) && key !== ownKey && key !== guestKey);
}

/** Move the old shared project list into the already-logged-in account's store. */
export function migrateLegacyBuilderStorage(
  storage: KeyValueStorage = localStorage,
  userId: string | null = getStoredUserId(),
): boolean {
  if (!userId) return false;
  const scopedKey = builderStorageKey(userId);
  const scoped = storage.getItem(scopedKey);
  const legacy = storage.getItem(BUILDER_STORAGE_NAME);
  if (scoped) {
    if (legacy) storage.removeItem(BUILDER_STORAGE_NAME);
    return false;
  }
  if (!legacy) return false;
  if (hasOtherAccountStore(storage, userId)) return false;
  storage.setItem(scopedKey, legacy);
  storage.removeItem(BUILDER_STORAGE_NAME);
  return true;
}

let persistPaused = false;

export function pauseBuilderPersist() {
  persistPaused = true;
}

export function resumeBuilderPersist() {
  persistPaused = false;
}

export const userScopedBuilderStorage: KeyValueStorage = {
  getItem: (_name: string) => localStorage.getItem(builderStorageKey(getStoredUserId())),
  setItem: (_name: string, value: string) => {
    if (persistPaused) return;
    localStorage.setItem(builderStorageKey(getStoredUserId()), value);
  },
  removeItem: (_name: string) => {
    localStorage.removeItem(builderStorageKey(getStoredUserId()));
  },
};
