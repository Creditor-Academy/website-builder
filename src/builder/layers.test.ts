import { describe, expect, it } from 'vitest';
import {
  SECTION_PLANES,
  bringForward,
  componentPlane,
  sectionBackgroundImageCss,
  sendBackward,
  setComponentPlane,
  shouldClearInnerSectionFill,
  sortByLayer,
  splitByPlane,
  stackZIndex,
} from './layers';

describe('section layering', () => {
  it('places background below content and content below above-plane elements', () => {
    expect(SECTION_PLANES.background).toBeLessThan(SECTION_PLANES.behind);
    expect(SECTION_PLANES.behind).toBeLessThan(SECTION_PLANES.content);
    expect(SECTION_PLANES.content).toBeLessThan(SECTION_PLANES.above);
  });

  it('treats explicit behind plane and low z-index as behind the section', () => {
    expect(componentPlane({ plane: 'behind' })).toBe('behind');
    expect(componentPlane({ style: { zIndex: 3 } })).toBe('behind');
    expect(componentPlane({ plane: 'above', layer: 2 })).toBe('above');
    expect(componentPlane({})).toBe('above');
  });

  it('sorts siblings by plane then layer index', () => {
    const sorted = sortByLayer([
      { id: 'top', plane: 'above', layer: 2 },
      { id: 'back', plane: 'behind', layer: 8 },
      { id: 'mid', plane: 'above', layer: 0 },
    ]);
    expect(sorted.map((item) => item.id)).toEqual(['back', 'mid', 'top']);
    expect(stackZIndex(sorted[0])).toBeLessThan(SECTION_PLANES.content);
    expect(stackZIndex({ plane: 'behind', layer: 99 })).toBeLessThan(SECTION_PLANES.content);
    expect(stackZIndex(sorted[2])).toBeGreaterThan(SECTION_PLANES.content);
  });

  it('splits components so a bg image can sit under section content', () => {
    const { behind, above } = splitByPlane([
      { id: 'photo', plane: 'behind', layer: 0 },
      { id: 'badge', plane: 'above', layer: 1 },
    ]);
    expect(behind.map((item) => item.id)).toEqual(['photo']);
    expect(above.map((item) => item.id)).toEqual(['badge']);
  });

  it('moves a layer forward and backward without changing plane', () => {
    const current = { plane: 'above' as const, layer: 1 };
    expect(bringForward(current)).toEqual({ plane: 'above', layer: 2 });
    expect(sendBackward(current)).toEqual({ plane: 'above', layer: 0 });
    expect(sendBackward({ plane: 'behind', layer: 0 })).toEqual({ plane: 'behind', layer: 0 });
    expect(setComponentPlane(current, 'behind')).toEqual({ plane: 'behind', layer: 1 });
  });

  it('builds a cover background-image style from a url', () => {
    expect(sectionBackgroundImageCss({ backgroundImage: 'https://cdn.example/bg.jpg' })).toEqual({
      backgroundImage: 'url(https://cdn.example/bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    });
    expect(sectionBackgroundImageCss({ backgroundImage: 'url(/local.png)', backgroundSize: 'contain' }).backgroundSize).toBe('contain');
    expect(sectionBackgroundImageCss({})).toEqual({});
    expect(shouldClearInnerSectionFill({ backgroundImage: 'https://cdn.example/bg.jpg' })).toBe(true);
    expect(shouldClearInnerSectionFill({})).toBe(false);
  });
});
