/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { isIconUrl, IconView, CanvasElementView } from '@/builder/components/CanvasPrimitives';
import { CanvasProperties } from '@/builder/components/CanvasProperties';
import useBuilderStore from '@/store/useBuilderStore';

describe('Icon Element & URL Support', () => {
  it('correctly identifies icon URLs', () => {
    expect(isIconUrl('https://example.com/icon.svg')).toBe(true);
    expect(isIconUrl('http://example.com/icon.png')).toBe(true);
    expect(isIconUrl('/assets/icon.svg')).toBe(true);
    expect(isIconUrl('data:image/svg+xml;base64,PHN2Zz4...')).toBe(true);
    expect(isIconUrl('blob:http://localhost/123')).toBe(true);
    expect(isIconUrl('icon.svg')).toBe(true);
    expect(isIconUrl('Sparkles')).toBe(false);
    expect(isIconUrl('Star')).toBe(false);
    expect(isIconUrl('')).toBe(false);
    expect(isIconUrl(undefined)).toBe(false);
  });

  it('renders IconView with img tag when given image URL', () => {
    const { container } = render(
      <IconView url="https://example.com/icon.png" size={32} alt="Custom Icon" />
    );
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://example.com/icon.png');
    expect(img?.getAttribute('alt')).toBe('Custom Icon');
    expect(img?.style.width).toBe('32px');
    expect(img?.style.height).toBe('32px');
  });

  it('renders IconView with CSS mask when given SVG URL and color', () => {
    const { container } = render(
      <IconView url="https://example.com/icon.svg" size={24} color="#ef4444" alt="SVG Icon" />
    );
    const span = container.querySelector('span[role="img"]') as HTMLElement | null;
    expect(span).toBeTruthy();
    expect(span?.style.width).toBe('24px');
    expect(span?.style.height).toBe('24px');
    expect(span?.style.backgroundColor).toBe('#ef4444');
  });

  it('renders Lucide icon when no URL is provided', () => {
    const { container } = render(
      <IconView name="Star" size={28} color="#0f172a" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders icon element via CanvasElementView with URL', () => {
    const element = {
      id: 'icon-1',
      name: 'Icon',
      type: 'icon' as const,
      parentId: 'cont-1',
      order: 0,
      content: {
        url: 'https://example.com/brand-logo.svg',
        size: 36,
      },
      styles: {
        color: '#3b82f6',
      },
      responsiveStyles: {},
      properties: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    };

    const { container } = render(
      <CanvasElementView element={element} css={{ color: '#3b82f6' }} />
    );
    const rendered = container.querySelector('span[role="img"], img');
    expect(rendered).toBeTruthy();
  });

  it('allows editing icon URL and size in CanvasProperties', () => {
    const mockPage = {
      id: 'page-1',
      name: 'Home',
      sections: [
        {
          id: 'sec-1',
          name: 'Section',
          styles: {},
          children: [
            {
              id: 'cont-1',
              name: 'Container',
              type: 'container' as const,
              styles: {},
              children: [
                {
                  id: 'icon-1',
                  name: 'Icon',
                  type: 'icon' as const,
                  styles: { color: '#0f172a', width: '28px', height: '28px' },
                  content: { icon: 'Sparkles', size: 28, url: '' },
                },
              ],
            },
          ],
        },
      ],
    };

    useBuilderStore.setState({
      activeWebsiteId: 'site-1',
      activePageId: 'page-1',
      websites: [
        {
          id: 'site-1',
          name: 'Site 1',
          pages: [mockPage],
        },
      ] as any,
      editor: {
        device: 'desktop',
        previewMode: false,
        selectedNodeId: 'icon-1',
        selectedNodeIds: ['icon-1'],
        selectedKind: 'element',
      } as any,
    });

    render(<CanvasProperties />);

    expect(screen.getByText('Icon Content')).toBeTruthy();
    expect(screen.getByTestId('icon-url-input')).toBeTruthy();
    expect(screen.getByTestId('icon-name-input')).toBeTruthy();
    expect(screen.getByTestId('icon-size-input')).toBeTruthy();

    const urlInput = screen.getByTestId('icon-url-input');
    fireEvent.change(urlInput, { target: { value: 'https://example.com/custom.svg' } });

    const page = useBuilderStore.getState().getActivePage();
    const iconElement = (page?.sections[0] as any).children[0].children[0];
    expect(iconElement.content.url).toBe('https://example.com/custom.svg');
  });
});
