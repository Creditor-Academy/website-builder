/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { NavbarPreview } from './NavbarPreview';

vi.mock('@/contexts/BuilderContext', () => ({
  useBuilder: () => ({
    pages: [],
    setActivePage: vi.fn(),
    updatePageName: vi.fn(),
    createPage: vi.fn(),
  }),
}));

describe('NavbarPreview - Navigation Radius', () => {
  const baseNavbar = {
    links: [
      { id: 'link-1', label: 'Home', href: '/', isButton: false },
      { id: 'link-2', label: 'Get Started', href: '/signup', isButton: true },
    ],
    logo: { text: 'Athena' },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      borderRadius: '16px',
      buttonRadius: '999px',
    },
  };

  it('applies borderRadius and overflow hidden to the outer nav element when curved', () => {
    const { container } = render(
      <NavbarPreview config={baseNavbar} />
    );

    const nav = container.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav?.style.borderRadius).toBe('16px');
    expect(nav?.style.overflow).toBe('hidden');
    expect(nav?.style.borderTopWidth || nav?.style.border).toBeTruthy();
  });

  it('keeps default flat edges and borderBottom when borderRadius is 0px', () => {
    const { container } = render(
      <NavbarPreview
        config={{
          ...baseNavbar,
          styles: { ...baseNavbar.styles, borderRadius: '0px' },
        }}
      />
    );

    const nav = container.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav?.style.borderRadius).toBe('0px');
    expect(nav?.style.overflow).toBeFalsy();
    expect(nav?.style.borderBottomWidth || nav?.style.borderBottom).toBeTruthy();
  });
});
