/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { downloadPdfFromUrl, PdfView, CanvasElementView } from '@/builder/components/CanvasPrimitives';
import { CanvasProperties } from '@/builder/components/CanvasProperties';
import { CanvasToolbar } from '@/builder/canvas/CanvasToolbar';
import { CanvasEngineContext, type CanvasEngineValue } from '@/builder/canvas/CanvasEngineContext';
import useBuilderStore from '@/store/useBuilderStore';

describe('PDF Resource Element & URL Download', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(['%PDF-1.4...'], { type: 'application/pdf' })),
    } as any);
  });

  it('triggers download anchor click in downloadPdfFromUrl with data URL', () => {
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    downloadPdfFromUrl('data:application/pdf;base64,JVBERi0...', 'my-document.pdf');

    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });

  it('renders PdfView with title, description, and Download button', () => {
    const element = {
      id: 'pdf-1',
      name: 'PDF Resource',
      type: 'pdf' as const,
      parentId: 'cont-1',
      order: 0,
      content: {
        title: 'Course Syllabus',
        description: 'Complete syllabus for semester 1',
        url: 'https://example.com/syllabus.pdf',
        filename: 'syllabus.pdf',
      },
      styles: {
        width: '100%',
      },
      responsiveStyles: {},
      properties: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    };

    render(<PdfView element={element} css={{ width: '100%' }} editingCanvas={true} />);

    expect(screen.getByText('Course Syllabus')).toBeTruthy();
    expect(screen.getByText('Complete syllabus for semester 1')).toBeTruthy();
    const downloadBtn = screen.getByTestId('pdf-download-button');
    expect(downloadBtn).toBeTruthy();
    expect(downloadBtn.getAttribute('disabled')).toBeNull();
  });

  it('disables download button in PdfView when URL is empty', () => {
    const element = {
      id: 'pdf-1',
      name: 'PDF Resource',
      type: 'pdf' as const,
      parentId: 'cont-1',
      order: 0,
      content: {
        title: 'Empty PDF',
        url: '',
      },
      styles: {},
      responsiveStyles: {},
      properties: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    };

    render(<PdfView element={element} css={{}} editingCanvas={true} />);
    const downloadBtn = screen.getByTestId('pdf-download-button');
    expect(downloadBtn.getAttribute('disabled')).toBeDefined();
  });

  it('clicking download button in PdfView triggers download', () => {
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');

    const element = {
      id: 'pdf-1',
      name: 'PDF Resource',
      type: 'pdf' as const,
      parentId: 'cont-1',
      order: 0,
      content: {
        title: 'Annual Report',
        url: 'https://example.com/report.pdf',
      },
      styles: {},
      responsiveStyles: {},
      properties: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    };

    render(<PdfView element={element} css={{}} editingCanvas={true} />);
    const downloadBtn = screen.getByTestId('pdf-download-button');

    fireEvent.click(downloadBtn);
    expect(appendChildSpy).toHaveBeenCalled();
  });

  it('renders correctly via CanvasElementView', () => {
    const element = {
      id: 'pdf-1',
      name: 'PDF Resource',
      type: 'pdf' as const,
      parentId: 'cont-1',
      order: 0,
      content: {
        title: 'Student Handbook',
        url: 'https://example.com/handbook.pdf',
      },
      styles: {},
      responsiveStyles: {},
      properties: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    };

    const { container } = render(<CanvasElementView element={element} css={{}} editingCanvas={true} />);
    expect(container.querySelector('[data-pdf-element]')).toBeTruthy();
    expect(screen.getByText('Student Handbook')).toBeTruthy();
  });

  it('allows editing PDF URL, title, description, and testing download in CanvasProperties', () => {
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
                  id: 'pdf-1',
                  name: 'PDF Resource',
                  type: 'pdf' as const,
                  styles: { width: '100%' },
                  content: { title: 'Old Title', url: '', description: '' },
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
        selectedNodeId: 'pdf-1',
        selectedNodeIds: ['pdf-1'],
        selectedKind: 'element',
      } as any,
    });

    render(<CanvasProperties />);

    expect(screen.getAllByText('PDF Resource').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('pdf-url-input')).toBeTruthy();
    expect(screen.getByTestId('pdf-title-input')).toBeTruthy();
    expect(screen.getByTestId('pdf-description-input')).toBeTruthy();
    expect(screen.getByTestId('pdf-test-download')).toBeTruthy();

    // Change URL
    const urlInput = screen.getByTestId('pdf-url-input');
    fireEvent.change(urlInput, { target: { value: 'https://example.com/fresh.pdf' } });

    const page = useBuilderStore.getState().getActivePage();
    const pdfNode = (page?.sections[0] as any).children[0].children[0];
    expect(pdfNode.content.url).toBe('https://example.com/fresh.pdf');
  });
});
