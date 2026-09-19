import { describe, expect, it } from 'vitest';
import { createDefaultFeaturesSection, createDefaultHeroSection } from '@/lib/defaultPageData';
import { explodePrebuiltSection, needsPrebuiltExplode } from './prebuiltToCanvas';

describe('prebuilt to canvas', () => {
  it('turns a hero section into movable heading, buttons, and image', () => {
    const hero = createDefaultHeroSection();
    const section = explodePrebuiltSection(hero, 'page-1', 0);
    expect(section.kind).toBe('canvas');
    expect(needsPrebuiltExplode(section)).toBe(false);
    const types = section.children[0].children.map((element) => element.type);
    expect(types).toContain('text');
    expect(types).toContain('button');
    expect(types).toContain('image');
    expect(section.children[0].children.every((element) => element.styles.position === 'absolute')).toBe(true);
  });

  it('turns feature cards into separate movable items', () => {
    const features = createDefaultFeaturesSection();
    const section = explodePrebuiltSection(features, 'page-1', 1);
    expect(section.children[0].children.length).toBeGreaterThan(6);
    const bottoms = section.children[0].children.map((element) => {
      const top = parseFloat(String(element.styles.top || 0));
      const height = parseFloat(String(element.styles.height || element.styles.minHeight || 64));
      return top + height;
    });
    expect(parseFloat(String(section.styles.minHeight))).toBeGreaterThanOrEqual(Math.max(...bottoms));
  });
});
