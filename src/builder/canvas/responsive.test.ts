import { describe, expect, it } from 'vitest';
import { patchResponsiveStyles, resolveStyles } from '../styles';

describe('responsive styles', () => {
  it('keeps desktop styles when applying tablet/mobile overrides', () => {
    const base = { fontSize: '20px', width: '100%' };
    const patched = patchResponsiveStyles(base, {}, 'mobile', { fontSize: '16px' });
    expect(patched.styles).toEqual(base);
    expect(patched.responsiveStyles.mobile).toEqual({ fontSize: '16px' });
    expect(resolveStyles(patched.styles, patched.responsiveStyles, 'desktop').fontSize).toBe('20px');
    expect(resolveStyles(patched.styles, patched.responsiveStyles, 'mobile').fontSize).toBe('16px');
  });
});
