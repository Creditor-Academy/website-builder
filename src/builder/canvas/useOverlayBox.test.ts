import { describe, expect, it } from 'vitest';
import { measureOverlayBox } from './useOverlayBox';

describe('measureOverlayBox', () => {
  it('returns overlay-local coordinates for a canvas node', () => {
    const overlay = document.createElement('div');
    overlay.getBoundingClientRect = () => ({
      left: 40,
      top: 20,
      width: 800,
      height: 600,
      right: 840,
      bottom: 620,
      x: 40,
      y: 20,
      toJSON: () => ({}),
    });

    const node = document.createElement('div');
    node.setAttribute('data-canvas-node', 'el-1');
    node.getBoundingClientRect = () => ({
      left: 140,
      top: 80,
      width: 200,
      height: 48,
      right: 340,
      bottom: 128,
      x: 140,
      y: 80,
      toJSON: () => ({}),
    });
    document.body.append(node);

    expect(measureOverlayBox('el-1', overlay)).toEqual({
      left: 100,
      top: 60,
      width: 200,
      height: 48,
    });
    expect(measureOverlayBox(null, overlay)).toBeNull();
    expect(measureOverlayBox('missing', overlay)).toBeNull();

    node.remove();
  });
});
