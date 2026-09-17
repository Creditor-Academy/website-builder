import { describe, expect, it } from 'vitest';
import { ELEMENT_REGISTRY, getElementDefinition, nodeAcceptsChild } from './registry';
import { computeAlignmentGuides, snapToGrid } from './guides';

describe('element registry', () => {
  it('defines core elements and parent rules', () => {
    expect(ELEMENT_REGISTRY.text.allowedParents).toContain('container');
    expect(ELEMENT_REGISTRY.image.resizable).toBe(true);
    expect(getElementDefinition('heading').inlineEditable).toBe(true);
    expect(nodeAcceptsChild('container')).toBe(true);
    expect(nodeAcceptsChild('element')).toBe(false);
  });
});

describe('alignment guides', () => {
  it('snaps a free-position box to a sibling center and grid', () => {
    const result = computeAlignmentGuides(
      { id: 'a', x: 82, y: 4, width: 40, height: 20 },
      [{ id: 'b', x: 0, y: 0, width: 200, height: 20 }]
    );
    expect(result.x).toBe(80);
    expect(result.guides.some((guide) => guide.type === 'center')).toBe(true);
    expect(snapToGrid(13, 8)).toBe(16);
  });
});
