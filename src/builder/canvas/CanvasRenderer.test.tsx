/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CanvasRenderer } from './CanvasRenderer';
import { CanvasEngineContext, type CanvasEngineValue } from './CanvasEngineContext';

vi.mock('@/contexts/BuilderContext', () => ({
  useBuilder: () => ({
    state: { editor: { previewMode: false } },
    updateComponent: vi.fn(),
    deleteComponent: vi.fn(),
    selectComponent: vi.fn(),
    selectSection: vi.fn(),
    moveComponent: vi.fn(),
    updatePageName: vi.fn(),
    pages: [],
    setActivePage: vi.fn(),
    createPage: vi.fn(),
  }),
}));

function renderWithEngine(device: 'desktop' | 'tablet' | 'mobile', previewMode = false) {
  const engineValue: CanvasEngineValue = {
    previewMode,
    hoveredNodeId: null,
    setHoveredNodeId: vi.fn(),
    editingNodeId: null,
    setEditingNodeId: vi.fn(),
    viewportRef: { current: null },
    frameRef: { current: null },
    overlayRef: { current: null },
    scalerRef: { current: null },
    zoom: 100,
    device,
    resizePreview: null,
    setResizePreview: vi.fn(),
    guides: [],
    setGuides: vi.fn(),
    interacting: false,
    setInteracting: vi.fn(),
    liveGeometryRef: { current: {} },
    clickSuppressRef: { current: false },
  };

  return render(
    <MemoryRouter>
      <CanvasEngineContext.Provider value={engineValue}>
        <CanvasRenderer
          pageId="test-page"
          sections={[]}
          navbar={{ id: 'nav-1', links: [], styles: {} }}
          footer={{ id: 'ft-1', columns: [] }}
          globalStyles={{}}
        />
      </CanvasEngineContext.Provider>
    </MemoryRouter>
  );
}

describe('CanvasRenderer - Cross-Device Preview in Editing Mode', () => {
  it('renders mobile canvas with data-device="mobile" and mobile frame width', () => {
    const { container } = renderWithEngine('mobile');
    const root = container.querySelector('#canvas-root') as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.getAttribute('data-device')).toBe('mobile');
    expect(root.style.width).toBe('390px');
  });

  it('renders tablet canvas with data-device="tablet" and tablet frame width', () => {
    const { container } = renderWithEngine('tablet');
    const root = container.querySelector('#canvas-root') as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.getAttribute('data-device')).toBe('tablet');
    expect(root.style.width).toBe('768px');
  });

  it('renders desktop canvas with data-device="desktop" and desktop frame width', () => {
    const { container } = renderWithEngine('desktop');
    const root = container.querySelector('#canvas-root') as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.getAttribute('data-device')).toBe('desktop');
    expect(root.style.width).toBe('1280px');
  });

  it('injects cross-device CSS rules for grid, container, and typography', () => {
    const { container } = renderWithEngine('mobile');
    const styleTag = container.querySelector('style');
    expect(styleTag).toBeTruthy();
    const css = styleTag?.innerHTML || '';
    expect(css).toContain('#canvas-root[data-device="mobile"]');
    expect(css).toContain('grid-template-columns: repeat(1, minmax(0, 1fr))');
    expect(css).toContain('#canvas-root[data-device="tablet"]');
  });
});
