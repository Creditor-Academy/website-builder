import { describe, expect, it } from 'vitest';
import { calculateDropPosition, canDrop, calculatedDropToTarget, indexAlongAxis, refineElementDrop, sortCanvasCollisions, type DropOver, type DropSource, type SiblingRect } from './drop';
import { createButtonElement, createCanvasSection, createTextElement } from '../defaults';
import { insertElement } from '../tree';
import type { CanvasSection } from '../types';

function rect(top = 0, height = 100, left = 0, width = 400): DropOver['rect'] {
  return { top, bottom: top + height, left, right: left + width, height, width };
}

function sectionTree(): CanvasSection[] {
  const section = createCanvasSection('page-1', 0);
  const text = createTextElement(section.children[0].id, 0);
  const button = createButtonElement(section.children[0].id, 1);
  let sections = insertElement([section], section.children[0].id, text, 0);
  sections = insertElement(sections, section.children[0].id, button, 1);
  return sections;
}

describe('calculateDropPosition', () => {
  it('places an element before another when the pointer is in the top half', () => {
    const over: DropOver = {
      id: 'image',
      kind: 'element',
      type: 'image',
      index: 1,
      parentId: 'box',
      parentKind: 'container',
      childCount: 3,
      rect: rect(100, 80),
    };
    const source: DropSource = { source: 'canvas', kind: 'element', type: 'button', nodeId: 'btn', elementType: 'button' };
    const drop = calculateDropPosition({ x: 20, y: 110 }, over, source);
    expect(drop).toMatchObject({ parentId: 'box', parentKind: 'container', edge: 'before', index: 1, position: 'before' });
  });

  it('places an element after another when the pointer is in the bottom half', () => {
    const over: DropOver = {
      id: 'image',
      kind: 'element',
      type: 'image',
      index: 1,
      parentId: 'box',
      parentKind: 'container',
      childCount: 3,
      rect: rect(100, 80),
    };
    const source: DropSource = { source: 'elements-panel', kind: 'element', type: 'button', elementType: 'button' };
    const drop = calculateDropPosition({ x: 20, y: 170 }, over, source);
    expect(drop).toMatchObject({ parentId: 'box', edge: 'after', index: 1, position: 'after' });
  });

  it('drops elements inside a container', () => {
    const over: DropOver = {
      id: 'box',
      kind: 'container',
      type: 'container',
      index: 0,
      parentId: 'section',
      parentKind: 'section',
      childCount: 2,
      rect: rect(0, 200),
    };
    const source: DropSource = { source: 'elements-panel', kind: 'element', type: 'text', elementType: 'text' };
    const drop = calculateDropPosition({ x: 10, y: 100 }, over, source);
    expect(drop).toMatchObject({ parentId: 'box', parentKind: 'container', edge: 'inside' });
  });

  it('reorders sections with before/after', () => {
    const over: DropOver = {
      id: 'sec-a',
      kind: 'section',
      type: 'section',
      index: 0,
      parentId: 'page-1',
      parentKind: 'page',
      childCount: 1,
      rect: rect(0, 200),
    };
    const source: DropSource = { source: 'canvas', kind: 'section', type: 'section', nodeId: 'sec-b' };
    const drop = calculateDropPosition({ x: 10, y: 180 }, over, source);
    expect(drop).toMatchObject({ parentKind: 'page', parentId: 'page-1', edge: 'after', index: 0 });
  });
});

describe('canDrop', () => {
  it('rejects self, descendant, and incompatible parents', () => {
    const sections = sectionTree();
    const section = sections[0];
    const container = section.children[0];
    const text = container.children[0];
    const source: DropSource = { source: 'canvas', kind: 'element', type: 'text', nodeId: text.id };
    expect(canDrop(sections, source, {
      targetId: container.id,
      parentId: container.id,
      parentKind: 'container',
      position: 'inside',
      index: 0,
      edge: 'inside',
      accepts: [],
    })).toBe(true);
    expect(canDrop(sections, { ...source, locked: true }, {
      targetId: container.id,
      parentId: container.id,
      parentKind: 'container',
      position: 'inside',
      index: 0,
      edge: 'inside',
      accepts: [],
    })).toBe(false);
    expect(canDrop(sections, { source: 'canvas', kind: 'section', type: 'section', nodeId: section.id }, {
      targetId: container.id,
      parentId: container.id,
      parentKind: 'container',
      position: 'inside',
      index: 0,
      edge: 'inside',
      accepts: [],
    })).toBe(false);
  });

  it('maps calculated drops onto document targets', () => {
    const target = calculatedDropToTarget({
      targetId: 'img',
      parentId: 'box',
      parentKind: 'container',
      position: 'before',
      index: 1,
      edge: 'before',
      accepts: ['text'],
    });
    expect(target).toEqual({ parentId: 'box', parentKind: 'container', index: 1, edge: 'before', accepts: ['text'] });
  });
});

describe('canvas drop targeting', () => {
  const siblings: SiblingRect[] = [
    { id: 'a', index: 0, rect: rect(0, 80, 0, 400) },
    { id: 'b', index: 1, rect: rect(80, 80, 0, 400) },
    { id: 'c', index: 2, rect: rect(160, 80, 0, 400) },
  ];

  it('inserts between stacked siblings at the pointer', () => {
    expect(indexAlongAxis({ x: 20, y: 90 }, siblings)).toMatchObject({ targetId: 'b', edge: 'before', index: 1 });
    expect(indexAlongAxis({ x: 20, y: 210 }, siblings)).toMatchObject({ targetId: 'c', edge: 'after', index: 2 });
  });

  it('uses a container sibling list instead of always dropping at the end', () => {
    const over: DropOver = {
      id: 'box',
      kind: 'container',
      type: 'container',
      index: 0,
      parentId: 'section',
      parentKind: 'section',
      childCount: 3,
      rect: rect(0, 240),
    };
    const source: DropSource = { source: 'canvas', kind: 'element', type: 'image', nodeId: 'img', elementType: 'image' };
    const drop = calculateDropPosition({ x: 20, y: 90 }, over, source, { siblings });
    expect(drop).toMatchObject({ parentId: 'box', parentKind: 'container', edge: 'before', index: 1, targetId: 'b' });
  });

  it('prefers the element under the pointer over the page', () => {
    const source: DropSource = { source: 'canvas', kind: 'element', type: 'image', nodeId: 'img' };
    const hits = [{ id: 'node:page:page-1' }, { id: 'node:section:sec' }, { id: 'node:container:box' }, { id: 'node:element:heading' }];
    const rects = new Map([
      ['node:page:page-1', { width: 1200, height: 2000 }],
      ['node:section:sec', { width: 1200, height: 800 }],
      ['node:container:box', { width: 1100, height: 600 }],
      ['node:element:heading', { width: 800, height: 80 }],
    ]);
    const sorted = sortCanvasCollisions(hits, rects, source, 'node:element:img');
    expect(sorted[0].id).toBe('node:element:heading');
  });

  it('retargets a section drop onto the nearest container slot', () => {
    const drop = refineElementDrop(
      {
        targetId: 'sec',
        parentId: 'sec',
        parentKind: 'section',
        position: 'inside',
        index: 0,
        edge: 'inside',
        accepts: [],
      },
      { x: 20, y: 90 },
      [{ id: 'box', index: 0, rect: rect(0, 240) }],
      { box: siblings }
    );
    expect(drop).toMatchObject({ parentId: 'box', parentKind: 'container', edge: 'before', index: 1 });
  });
});
