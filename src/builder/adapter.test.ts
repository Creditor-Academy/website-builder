import { describe, expect, it } from 'vitest';
import { normalizePageSections, unpackNodeStyles } from './adapter';

describe('canvas content normalize', () => {
  it('unpacks backend breakpoint styles into editor styles + responsiveStyles', () => {
    const unpacked = unpackNodeStyles(
      { base: { fontSize: '20px', color: '#111' }, tablet: { fontSize: '18px' }, mobile: { fontSize: '16px' } },
      {}
    );
    expect(unpacked.styles).toEqual({ fontSize: '20px', color: '#111' });
    expect(unpacked.responsiveStyles.tablet).toEqual({ fontSize: '18px' });
    expect(unpacked.responsiveStyles.mobile).toEqual({ fontSize: '16px' });
  });

  it('stamps canvas kind and keeps image src aliases', () => {
    const sections = normalizePageSections(
      [
        {
          id: 'sec-1',
          kind: 'canvas',
          children: [
            {
              id: 'box-1',
              type: 'container',
              children: [{ id: 'img-1', type: 'image', content: { imageUrl: 'https://cdn.example/a.webp' } }],
            },
          ],
        },
      ],
      'page-1'
    );
    expect(sections[0].kind).toBe('canvas');
    expect(sections[0].children[0].children[0].content.src).toBe('https://cdn.example/a.webp');
  });
});
