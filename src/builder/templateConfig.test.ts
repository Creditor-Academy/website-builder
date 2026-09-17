import { describe, expect, it } from 'vitest';
import {
  floaterImageSrc,
  floaterStyle,
  floaterText,
  normalizeLiftedPiece,
  resolveTemplateSectionBackground,
  sectionForTemplateRenderer,
  stylesToPrebuiltHostCss,
  templateResizePatch,
} from './templateConfig';

describe('template engine alignment', () => {
  it('uses gradient and token colors the way templates configure sections', () => {
    expect(
      resolveTemplateSectionBackground({
        useGradient: true,
        backgroundGradient: 'linear-gradient(#111, #333)',
        backgroundColor: '#0f172a',
      })
    ).toBe('linear-gradient(#111, #333)');
    expect(resolveTemplateSectionBackground({ backgroundColor: '#f8fafc' })).toBe('#f8fafc');
    expect(resolveTemplateSectionBackground({ backgroundColor: 'transparent' }, '#fff')).toBe('#fff');
  });

  it('resizes prebuilt sections through minHeight, not wrapper width/height', () => {
    expect(templateResizePatch('section', 1100, 420)).toEqual({ minHeight: '420px' });
    expect(templateResizePatch('element', 240, 80)).toEqual({ width: '240px', height: '80px' });
  });

  it('keeps padding and fill off the prebuilt host so the section component owns them', () => {
    expect(
      stylesToPrebuiltHostCss({
        padding: '140px 0',
        backgroundColor: '#0f172a',
        minHeight: '90vh',
        headingColor: '#fff',
      })
    ).toEqual({ minHeight: '90vh' });
  });

  it('reads lifted pieces with either template or canvas field names', () => {
    expect(floaterImageSrc({ imageUrl: 'a.jpg' })).toBe('a.jpg');
    expect(floaterImageSrc({ src: 'b.jpg' })).toBe('b.jpg');
    expect(floaterText({ label: 'Go' })).toBe('Go');
    expect(floaterStyle({ styles: { color: '#111' }, style: { fontSize: '20px' } })).toEqual({
      color: '#111',
      fontSize: '20px',
    });
    const lifted = normalizeLiftedPiece({
      type: 'image',
      style: { width: '120px' },
      content: { imageUrl: 'hero.jpg' },
    });
    expect(lifted.content).toMatchObject({ imageUrl: 'hero.jpg', src: 'hero.jpg' });
    expect(lifted.styles).toMatchObject({ width: '120px' });
  });

  it('maps process template sections onto the features renderer', () => {
    const mapped = sectionForTemplateRenderer({
      type: 'process',
      variant: 'timeline',
      content: { headline: 'Approach', steps: [{ id: '1', title: 'Discover', description: 'Look', icon: 'Search' }] },
    });
    expect(mapped.type).toBe('features');
    expect(mapped.variant).toBe('list');
    expect((mapped.content as { features: { title: string }[] }).features[0].title).toBe('Discover');
  });
});
