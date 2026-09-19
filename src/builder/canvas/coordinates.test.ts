import { describe, expect, it } from 'vitest';
import {
  canvasToScreen,
  clientDeltaToCanvas,
  parentLocalToOverlay,
  rectToParentLocal,
  screenToCanvas,
  zoomFactor,
} from './coordinates';

describe('canvas coordinates', () => {
  it('converts screen points through zoom without using raw mouse coords as document coords', () => {
    const metrics = { zoom: 0.5, canvasLeft: 100, canvasTop: 50, scrollLeft: 0, scrollTop: 0, deviceWidth: 1280 };
    expect(screenToCanvas(150, 90, metrics)).toEqual({ x: 100, y: 80 });
    expect(canvasToScreen(100, 80, metrics)).toEqual({ x: 150, y: 90 });
  });

  it('scales pointer deltas by zoom', () => {
    expect(clientDeltaToCanvas(20, 10, 200)).toEqual({ x: 10, y: 5 });
    expect(zoomFactor(25)).toBe(0.25);
    expect(zoomFactor(200)).toBe(2);
  });

  it('maps parent-local guide positions into overlay space including parent inset and zoom', () => {
    const space = {
      parent: { left: 124, top: 80, width: 600, height: 600, offsetWidth: 800, offsetHeight: 800 },
      overlay: { left: 100, top: 40 },
    };
    expect(parentLocalToOverlay(0, 'x', space)).toBe(24);
    expect(parentLocalToOverlay(800, 'x', space)).toBe(624);
    expect(parentLocalToOverlay(0, 'y', space)).toBe(40);
  });

  it('expresses the canvas page box in parent-local coordinates so snaps use the visible page edge', () => {
    const parent = { left: 124, top: 64, width: 800, height: 800, offsetWidth: 800, offsetHeight: 800 };
    const page = rectToParentLocal({ left: 100, top: 40, width: 1280, height: 800 }, parent);
    expect(page).toEqual({ x: -24, y: -24, width: 1280, height: 800 });
  });
});
