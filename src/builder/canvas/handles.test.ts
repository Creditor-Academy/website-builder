import { describe, expect, it } from 'vitest';
import { TRANSFORM_HANDLE_GAP, TRANSFORM_HANDLE_SIZE, bottomHandlePositions } from './handles';

describe('bottomHandlePositions', () => {
  it('places rotate and move side by side at the same height', () => {
    const pos = bottomHandlePositions({ left: 100, top: 50, width: 160, height: 40 });
    expect(pos.rotate.top).toBe(pos.move.top);
    expect(pos.rotate.top).toBe(100);
    expect(pos.move.left).toBeGreaterThan(pos.rotate.left);
    expect(pos.move.left - pos.rotate.left).toBe(TRANSFORM_HANDLE_SIZE + TRANSFORM_HANDLE_GAP);
  });

  it('keeps both handles centered under the element', () => {
    const pos = bottomHandlePositions({ left: 20, top: 10, width: 100, height: 20 });
    const midX = 70;
    expect((pos.rotate.left + pos.move.left) / 2).toBe(midX);
  });
});
