import { describe, expect, it } from 'vitest';
import { applyResizeDelta, boxToStylePatch, getResizeConfig } from './resize';

describe('resize constraints', () => {
  it('keeps image aspect ratio and never goes below minimum size', () => {
    const config = getResizeConfig('element', 'image');
    const next = applyResizeDelta({ x: 0, y: 0, width: 200, height: 100 }, 'right', { x: 50, y: 0 }, config);
    expect(next.width).toBe(250);
    expect(next.height).toBe(125);
    const tiny = applyResizeDelta({ x: 0, y: 0, width: 200, height: 100 }, 'left', { x: 400, y: 0 }, config);
    expect(tiny.width).toBeGreaterThanOrEqual(config.minWidth);
    expect(tiny.height).toBeGreaterThanOrEqual(config.minHeight);
  });

  it('resizes buttons by width only', () => {
    const config = getResizeConfig('element', 'button');
    expect(config.handles).toEqual(['left', 'right']);
    const patch = boxToStylePatch({ x: 0, y: 0, width: 180, height: 40 }, 'button', false);
    expect(patch).toEqual({ width: '180px' });
  });

  it('grows from the bottom without moving the top-left', () => {
    const config = getResizeConfig('element', 'text', true);
    const next = applyResizeDelta({ x: 40, y: 80, width: 200, height: 100 }, 'bottom', { x: 30, y: 50 }, config);
    expect(next).toEqual({ x: 40, y: 80, width: 200, height: 150 });
  });

  it('stores absolute boxes as position data', () => {
    const patch = boxToStylePatch({ x: 12, y: 8, width: 64, height: 32 }, 'element', true);
    expect(patch).toMatchObject({ left: '12px', top: '8px', width: '64px', height: '32px' });
  });
});
