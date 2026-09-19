import { describe, expect, it } from 'vitest';
import { isProtectedAppPath } from './authPaths';

describe('isProtectedAppPath', () => {
  it('treats dashboard, admin, builder, and editor as protected', () => {
    expect(isProtectedAppPath('/dashboard')).toBe(true);
    expect(isProtectedAppPath('/dashboard/templates')).toBe(true);
    expect(isProtectedAppPath('/admin/users')).toBe(true);
    expect(isProtectedAppPath('/builder/abc')).toBe(true);
    expect(isProtectedAppPath('/editor')).toBe(true);
    expect(isProtectedAppPath('/template-builder/1')).toBe(true);
  });

  it('keeps marketing and auth pages public', () => {
    expect(isProtectedAppPath('/')).toBe(false);
    expect(isProtectedAppPath('/login')).toBe(false);
    expect(isProtectedAppPath('/features')).toBe(false);
    expect(isProtectedAppPath('/reset-password')).toBe(false);
  });
});
