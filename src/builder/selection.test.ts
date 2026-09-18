import { describe, expect, it } from 'vitest';
import { createCanvasSection, createTextElement } from './defaults';
import { insertElement } from './tree';
import {
  nextSelectedIds,
  normalizeMarqueeBox,
  pointerSelectMode,
  pruneNestedSelection,
  rectsIntersect,
  selectionCanJoin,
  unionRects,
} from './selection';

describe('multi-select helpers', () => {
  it('uses modifier keys to toggle instead of replace', () => {
    expect(pointerSelectMode({ shiftKey: false, metaKey: false, ctrlKey: false })).toBe('replace');
    expect(pointerSelectMode({ shiftKey: true, metaKey: false, ctrlKey: false })).toBe('toggle');
    expect(pointerSelectMode({ shiftKey: false, metaKey: true, ctrlKey: false })).toBe('toggle');
    expect(pointerSelectMode({ shiftKey: false, metaKey: false, ctrlKey: true })).toBe('toggle');
  });

  it('adds, toggles, and replaces selected ids', () => {
    expect(nextSelectedIds(['a'], 'b', 'replace')).toEqual(['b']);
    expect(nextSelectedIds(['a'], 'b', 'add')).toEqual(['a', 'b']);
    expect(nextSelectedIds(['a', 'b'], 'b', 'toggle')).toEqual(['a']);
    expect(nextSelectedIds(['a'], 'b', 'toggle', false)).toEqual(['b']);
    expect(nextSelectedIds(['a'], null, 'toggle')).toEqual([]);
  });

  it('only groups elements and containers together', () => {
    expect(selectionCanJoin('element', 'container', 1)).toBe(true);
    expect(selectionCanJoin('section', 'element', 1)).toBe(false);
    expect(selectionCanJoin('element', 'section', 1)).toBe(false);
    expect(selectionCanJoin(null, 'element', 0)).toBe(true);
  });

  it('detects overlapping marquee boxes', () => {
    expect(rectsIntersect({ left: 0, top: 0, width: 40, height: 40 }, { left: 20, top: 20, width: 40, height: 40 })).toBe(true);
    expect(rectsIntersect({ left: 0, top: 0, width: 40, height: 40 }, { left: 50, top: 0, width: 10, height: 10 })).toBe(false);
    expect(normalizeMarqueeBox(80, 60, 20, 20)).toEqual({ left: 20, top: 20, width: 60, height: 40 });
    expect(unionRects([
      { left: 10, top: 10, width: 20, height: 20 },
      { left: 40, top: 5, width: 10, height: 50 },
    ])).toEqual({ left: 10, top: 5, width: 40, height: 50 });
  });

  it('drops nested nodes when a parent is also selected', () => {
    const section = createCanvasSection('page-1', 0);
    const container = section.children[0];
    const text = createTextElement(container.id, 0);
    const sections = insertElement([section], container.id, text, 0);
    expect(pruneNestedSelection(sections, [container.id, text.id])).toEqual([container.id]);
    expect(pruneNestedSelection(sections, [text.id])).toEqual([text.id]);
  });
});
