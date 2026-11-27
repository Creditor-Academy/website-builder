import { describe, expect, it } from 'vitest';
import { patchResponsiveStyles, resolveStyles, responsivePadding } from '../styles';
import {
  getBlankPage,
  getBusinessPage,
  getPortfolioPage,
  getEcommercePage,
  getConsultantPage,
  getAgenciesPage,
  getCoachPage,
  getRestaurantPage,
  getBlogPage,
} from '@/lib/defaultPageData';

describe('responsive styles', () => {
  it('keeps desktop styles when applying tablet/mobile overrides', () => {
    const base = { fontSize: '20px', width: '100%' };
    const patched = patchResponsiveStyles(base, {}, 'mobile', { fontSize: '16px' });
    expect(patched.styles).toEqual(base);
    expect(patched.responsiveStyles.mobile).toEqual({ fontSize: '16px' });
    expect(resolveStyles(patched.styles, patched.responsiveStyles, 'desktop').fontSize).toBe('20px');
    expect(resolveStyles(patched.styles, patched.responsiveStyles, 'mobile').fontSize).toBe('16px');
  });

  it('proportionally scales and bounds absolute desktop positions to mobile and tablet', () => {
    const base = { position: 'absolute', left: '700px', width: '400px', top: '150px' };
    const mobileStyles = resolveStyles(base, {}, 'mobile');
    const tabletStyles = resolveStyles(base, {}, 'tablet');

    // On mobile (390px), 700px desktop position must be inside the 390px frame
    expect(parseFloat(mobileStyles.left as string)).toBeLessThan(390);
    expect(parseFloat(mobileStyles.width as string)).toBeLessThan(390);
    expect(parseFloat(mobileStyles.left as string) + parseFloat(mobileStyles.width as string)).toBeLessThanOrEqual(390);

    // On tablet (768px), 700px desktop position must be inside the 768px frame
    expect(parseFloat(tabletStyles.left as string)).toBeLessThan(768);
    expect(parseFloat(tabletStyles.width as string)).toBeLessThan(768);
    expect(parseFloat(tabletStyles.left as string) + parseFloat(tabletStyles.width as string)).toBeLessThanOrEqual(768);
  });
});

describe('responsivePadding', () => {
  it('returns default fallback when padding is empty or missing', () => {
    expect(responsivePadding()).toBe('clamp(48px, 6vw, 100px) 0');
    expect(responsivePadding('')).toBe('clamp(48px, 6vw, 100px) 0');
    expect(responsivePadding(undefined, '60px 0')).toBe('60px 0');
  });

  it('preserves existing fluid or relative values', () => {
    expect(responsivePadding('clamp(30px, 4vw, 80px) 0')).toBe('clamp(30px, 4vw, 80px) 0');
    expect(responsivePadding('calc(2rem + 1vw) 0')).toBe('calc(2rem + 1vw) 0');
    expect(responsivePadding('4rem 2rem')).toBe('4rem 2rem');
    expect(responsivePadding('10vh 5vw')).toBe('10vh 5vw');
  });

  it('preserves small padding thresholds (<= 48px)', () => {
    expect(responsivePadding('15px 0')).toBe('15px 0');
    expect(responsivePadding('24px 16px')).toBe('24px 16px');
    expect(responsivePadding('48px 0')).toBe('48px 0');
  });

  it('converts large fixed pixel paddings into fluid clamp ranges', () => {
    expect(responsivePadding('140px 0')).toBe('clamp(63px, 6vw, 140px) 0');
    expect(responsivePadding('100px 0')).toBe('clamp(45px, 6vw, 100px) 0');
    expect(responsivePadding('110px 0')).toBe('clamp(50px, 6vw, 110px) 0');
    expect(responsivePadding('60px 0')).toBe('clamp(36px, 6vw, 60px) 0');
  });
});

describe('all 9 templates responsive page generation', () => {
  const templates = [
    { name: 'blank', fn: getBlankPage },
    { name: 'business', fn: getBusinessPage },
    { name: 'portfolio', fn: getPortfolioPage },
    { name: 'ecommerce', fn: getEcommercePage },
    { name: 'consultant', fn: getConsultantPage },
    { name: 'agencies', fn: getAgenciesPage },
    { name: 'coaching', fn: getCoachPage },
    { name: 'restaurant', fn: getRestaurantPage },
    { name: 'blog', fn: getBlogPage },
  ];

  it.each(templates)('generates valid page structure for $name template', ({ name, fn }) => {
    const page = fn();
    expect(page).toBeDefined();
    expect(page.id).toBeDefined();
    expect(Array.isArray(page.sections)).toBe(true);
    if (name === 'blank') {
      expect(page.sections.length).toBe(0);
    } else {
      expect(page.sections.length).toBeGreaterThan(0);
    }

    for (const section of page.sections) {
      expect(section.id).toBeDefined();
      expect(section.type).toBeDefined();
      expect(section.styles).toBeDefined();
    }
  });
});
