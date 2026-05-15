import '@testing-library/jest-dom/vitest';

// Polyfill localStorage for jsdom environments where accessing it throws SecurityError
let needsMock = false;
try {
  globalThis.localStorage.getItem('__test__');
} catch {
  needsMock = true;
}
if (needsMock) {
  const store: Record<string, string> = {};
  const ls = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { for (const k in store) delete store[k]; },
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] ?? null,
  };
  Object.defineProperty(globalThis, 'localStorage', { value: ls, configurable: true, writable: true });
}
