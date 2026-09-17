import { describe, expect, it } from 'vitest';
import { canvasToScreen, clientDeltaToCanvas, screenToCanvas, zoomFactor } from './coordinates';

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
});
