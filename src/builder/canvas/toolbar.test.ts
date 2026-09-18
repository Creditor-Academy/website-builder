import { describe, expect, it } from 'vitest';
import { TOOLBAR_GAP, toolbarPosition } from './toolbar';

describe('toolbarPosition', () => {
  it('places the toolbar above a mid-canvas element', () => {
    expect(
      toolbarPosition({ left: 120, top: 200, width: 80, height: 40 })
    ).toEqual({
      left: 160,
      top: 200 - TOOLBAR_GAP,
      transform: 'translate(-50%, -100%)',
    });
  });

  it('keeps the toolbar at the top of a tall section instead of covering the move handle', () => {
    const pos = toolbarPosition({ left: 40, top: 4, width: 720, height: 640 }, { width: 800, height: 700 });
    expect(pos.top).toBeLessThan(40);
    expect(pos.top).toBeGreaterThanOrEqual(8);
    expect(pos.transform).toBe('translate(-50%, 0)');
  });

  it('stays above header items at the top of the canvas instead of overlapping them', () => {
    const pos = toolbarPosition({ left: 640, top: 18, width: 120, height: 36 });
    expect(pos.top).toBe(10);
    expect(pos.top).toBeLessThan(18);
    expect(pos.left).toBe(700);
  });

  it('does not clamp onto the selected element when it sits at y=0', () => {
    const pos = toolbarPosition({ left: 40, top: 0, width: 64, height: 28 });
    expect(pos.top).toBe(-TOOLBAR_GAP);
    expect(pos.left).toBe(72);
  });
});
