import { describe, expect, it } from 'vitest';
import { createCanvasSection, createContainer, createHeadingElement, createImageElement, createTextElement } from './defaults';
import { clampCanvasHeight, defaultFreeSize, flattenImplicitContainerBoxes, growSurfacesToFit, isLayoutSurface, MIN_CANVAS_HEIGHT, nextFreeOrigin, withFreeContainerPlacement, withFreePlacement } from './freeMove';

describe('free move', () => {
  it('gives new elements a slide position instead of stretching full width', () => {
    const placed = withFreePlacement(createHeadingElement('box', 0), { x: 80, y: 120 });
    expect(placed.styles.position).toBe('absolute');
    expect(placed.styles.left).toBe('80px');
    expect(placed.styles.top).toBe('120px');
    expect(placed.styles.width).toBe(defaultFreeSize(placed).width);
    expect(placed.properties.placement).toBe('absolute');
  });

  it('stacks the next element below existing ones', () => {
    const first = withFreePlacement(createImageElement('box', 0), { x: 64, y: 64 });
    first.properties.freePosition = { x: 64, y: 64, height: 200 };
    const next = nextFreeOrigin([first]);
    expect(next.x).toBe(64);
    expect(next.y).toBeGreaterThan(64);
  });

  it('starts at the default origin when the slide is empty', () => {
    expect(nextFreeOrigin([])).toEqual({ x: 64, y: 64 });
    expect(withFreePlacement(createTextElement('box', 0)).styles.top).toBe('64px');
  });

  it('clamps canvas height for the bottom handle', () => {
    expect(clampCanvasHeight(100)).toBe(MIN_CANVAS_HEIGHT);
    expect(clampCanvasHeight(1200)).toBe(1200);
  });

  it('grows the canvas to fit objects that sit below the current page', () => {
    const section = createCanvasSection('page-1', 0);
    const placed = withFreePlacement(createTextElement(section.children[0].id, 0), { x: 40, y: 1400 });
    placed.properties.freePosition = { x: 40, y: 1400, height: 120 };
    section.children[0].children = [placed];
    const grown = growSurfacesToFit([section])[0];
    expect(parseFloat(String(grown.styles.minHeight))).toBeGreaterThan(1400);
    expect(parseFloat(String(grown.children[0].styles.minHeight))).toBeGreaterThan(1400);
  });

  it('lets empty containers sit as free boxes on the slide', () => {
    const box = withFreeContainerPlacement(createContainer('sec', 0), { x: 40, y: 80 });
    expect(box.styles.position).toBe('absolute');
    expect(box.styles.left).toBe('40px');
    expect(box.styles.top).toBe('80px');
    expect(box.styles.width).not.toBe('100%');
  });

  it('flattens a boxed wrapper so text sits on the canvas instead of inside a container', () => {
    const section = createCanvasSection('page-1', 0);
    const box = withFreeContainerPlacement(createContainer(section.id, 0), { x: 40, y: 80 });
    const text = withFreePlacement(createTextElement(box.id, 0), { x: 10, y: 20 });
    box.children = [text];
    section.children = [box];
    const [next] = flattenImplicitContainerBoxes([section]);
    expect(isLayoutSurface(next.children[0])).toBe(true);
    expect(next.children[0].styles.position).toBe('relative');
    expect(next.children[0].children[0].styles.left).toBe('50px');
    expect(next.children[0].children[0].styles.top).toBe('100px');
  });
});
