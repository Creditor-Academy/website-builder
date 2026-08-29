import { describe, expect, it } from 'vitest';
import { canAcceptChild, findNode, insertElement, insertSection, moveNode, removeNode } from './tree';
import { createCanvasSection, createTextElement } from './defaults';
import type { CanvasSection } from './types';

describe('canvas tree', () => {
  it('enforces parent-child relationships', () => {
    expect(canAcceptChild('page', 'section')).toBe(true);
    expect(canAcceptChild('section', 'container')).toBe(true);
    expect(canAcceptChild('container', 'text')).toBe(true);
    expect(canAcceptChild('container', 'section')).toBe(false);
    expect(canAcceptChild('element', 'text')).toBe(false);
  });

  it('inserts, finds, and moves elements by id', () => {
    const pageId = 'page-1';
    const section = createCanvasSection(pageId, 0);
    const container = section.children[0];
    let sections: CanvasSection[] = [section];
    const text = createTextElement(container.id, 0);
    sections = insertElement(sections, container.id, text, 0);

    const found = findNode(sections, text.id);
    expect(found?.kind).toBe('element');
    expect(found?.container?.id).toBe(container.id);

    const extra = createCanvasSection(pageId, 1);
    sections = insertSection(sections, extra, 1);
    sections = moveNode(sections, section.id, { parentId: pageId, parentKind: 'page', index: 1 });
    expect(sections[1].id).toBe(section.id);

    sections = removeNode(sections, text.id);
    expect(findNode(sections, text.id)).toBeNull();
  });
});
