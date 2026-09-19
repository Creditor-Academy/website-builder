/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteThumbnail, navbarBrand, unpackPageTheme } from './SiteThumbnail';
import { mapWebsitePages } from '@/builder/websiteDocument';

describe('dashboard site thumbnail', () => {
  it('reads navbar logo text and unpacked theme colors', () => {
    expect(navbarBrand({ logo: { text: 'SiteBuilder' }, brand: 'Fallback' })).toBe('SiteBuilder');
    expect(unpackPageTheme({
      base: { backgroundColor: '#ffffff', primaryColor: '#3b82f6', textColor: '#0f172a' },
      mobile: {},
      tablet: {},
    }).backgroundColor).toBe('#ffffff');
  });

  it('renders canvas elements saved on the project page', () => {
    const pages = mapWebsitePages([
      {
        id: 'page-1',
        navbar: {
          logo: { text: 'SiteBuilder' },
          links: [{ label: 'Home' }, { label: 'About' }],
          styles: { backgroundColor: 'transparent', textColor: '#000000' },
        },
        globalStyles: {
          base: { backgroundColor: '#ffffff', textColor: '#0f172a' },
          mobile: {},
          tablet: {},
        },
        sections: [
          {
            id: 'sec-1',
            kind: 'canvas',
            type: 'section',
            visible: true,
            styles: { base: { minHeight: '400px', backgroundColor: '#ffffff', position: 'relative' } },
            children: [
              {
                id: 'box-1',
                type: 'container',
                children: [
                  {
                    id: 'heading-1',
                    type: 'text',
                    content: { tag: 'h2', text: 'Add a heading' },
                    styles: { base: { position: 'absolute', top: '64px', left: '64px', width: '640px' } },
                    properties: { placement: 'absolute' },
                  },
                  {
                    id: 'copy-1',
                    type: 'text',
                    content: { tag: 'p', text: 'Edit this text' },
                    styles: { base: { position: 'absolute', top: '160px', left: '64px', width: '520px' } },
                    properties: { placement: 'absolute' },
                  },
                  {
                    id: 'img-1',
                    type: 'image',
                    content: { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', alt: 'Image' },
                    styles: { base: { position: 'absolute', top: '104px', left: '720px', width: '480px' } },
                    properties: { placement: 'absolute' },
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);

    render(
      <div style={{ width: 320, height: 180 }}>
        <SiteThumbnail site={{ pages }} className="absolute inset-0 w-full h-full" />
      </div>
    );

    expect(screen.getByText('SiteBuilder')).toBeInTheDocument();
    expect(screen.getByText('Add a heading')).toBeInTheDocument();
    expect(screen.getByText('Edit this text')).toBeInTheDocument();
    expect(screen.getByAltText('Image')).toHaveAttribute(
      'src',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
    );
  });
});
