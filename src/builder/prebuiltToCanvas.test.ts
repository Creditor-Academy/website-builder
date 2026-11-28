import { describe, expect, it } from 'vitest';
import { createDefaultAboutSection, createDefaultFeaturesSection, createDefaultHeroSection } from '@/lib/defaultPageData';
import { explodePrebuiltSection, needsPrebuiltExplode } from './prebuiltToCanvas';

function boxes(section: ReturnType<typeof explodePrebuiltSection>) {
  return section.children[0].children.map((element) => {
    const x = parseFloat(String(element.styles.left || 0));
    const y = parseFloat(String(element.styles.top || 0));
    const width = parseFloat(String(element.styles.width || 0));
    const height = parseFloat(String(element.styles.height || 0));
    return { text: String(element.content.text || element.content.label || ''), x, y, right: x + width, bottom: y + height };
  });
}

function overlaps(a: { x: number; y: number; right: number; bottom: number }, b: { x: number; y: number; right: number; bottom: number }) {
  return a.x < b.right - 4 && b.x < a.right - 4 && a.y < b.bottom - 4 && b.y < a.bottom - 4;
}

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
    const placed = boxes(section);
    const title = placed.find((box) => box.text === 'Drag & Drop Builder');
    const body = placed.find((box) => box.text.startsWith('Intuitive drag and drop'));
    expect(title && body && overlaps(title, body)).toBe(false);
  });

  it('keeps the about headline beside the image and values below both', () => {
    const section = explodePrebuiltSection(createDefaultAboutSection(), 'page-1', 0);
    const placed = boxes(section);
    const headline = placed.find((box) => box.text.startsWith('We Build Digital Experiences'));
    const image = section.children[0].children.find((element) => element.type === 'image');
    const imageBox = {
      x: parseFloat(String(image?.styles.left || 0)),
      y: parseFloat(String(image?.styles.top || 0)),
      right: parseFloat(String(image?.styles.left || 0)) + parseFloat(String(image?.styles.width || 0)),
      bottom: parseFloat(String(image?.styles.top || 0)) + parseFloat(String(image?.styles.height || 0)),
    };
    expect(headline && overlaps(headline, imageBox)).toBe(false);
    const mission = placed.find((box) => box.text === 'Our Mission');
    const missionBody = placed.find((box) => box.text.startsWith('Empowering everyone'));
    expect(mission && missionBody && overlaps(mission, missionBody)).toBe(false);
    expect(mission && mission.y).toBeGreaterThan(imageBox.bottom - 4);
  });

  it('turns stats section into canvas elements preserving color and typography', () => {
    const statsSection = {
      id: 'stats-test',
      type: 'stats',
      name: 'Stats',
      styles: {
        headingColor: '#10b981',
        paragraphColor: '#64748b',
        fontFamily: 'Montserrat',
      },
      content: {
        stats: [
          { value: '100', suffix: 'K+', label: 'Happy Users' },
          { value: '99.9', suffix: '%', label: 'Uptime' },
        ],
      },
    };
    const section = explodePrebuiltSection(statsSection, 'page-1', 0);
    const elements = section.children[0].children;
    expect(elements.length).toBe(4); // 2 headings + 2 paragraphs
    const headingEl = elements.find((el) => el.content.text === '100K+');
    expect(headingEl).toBeDefined();
    expect(headingEl?.styles.color).toBe('#10b981');
    expect(headingEl?.styles.fontFamily).toBe('Montserrat');

    const labelEl = elements.find((el) => el.content.text === 'Happy Users');
    expect(labelEl).toBeDefined();
    expect(labelEl?.styles.color).toBe('#64748b');
    expect(labelEl?.styles.fontFamily).toBe('Montserrat');
  });
});
