import { describe, expect, it } from 'vitest';
import { normalizeRotation, parseRotation, rotationDelta, snapRotation } from './rotation';

describe('element rotation', () => {
  it('computes the drag angle around a center point', () => {
    expect(rotationDelta({ x: 0, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 0 })).toBe(-90);
  });

  it('snaps to 15 degree steps when holding shift', () => {
    expect(snapRotation(22, true)).toBe(15);
    expect(snapRotation(22, false)).toBe(22);
    expect(normalizeRotation(370)).toBe(10);
  });

  it('reads rotate() from a transform string', () => {
    expect(parseRotation('rotate(45deg)')).toBe(45);
    expect(parseRotation('none')).toBe(0);
  });
});
