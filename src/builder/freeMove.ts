import { getFreePosition, isFreePositioned } from './tree';
import type { CanvasContainer, CanvasElement, CanvasSection, FreePosition } from './types';

const DEFAULT_ORIGIN = { x: 64, y: 64 };
export const SURFACE_GROW_PADDING = 80;
export const MIN_CANVAS_HEIGHT = 800;
export const MAX_CANVAS_HEIGHT = 20000;
export const CANVAS_HEIGHT_HANDLE = 36;

export function clampCanvasHeight(height: number): number {
  return Math.max(MIN_CANVAS_HEIGHT, Math.min(MAX_CANVAS_HEIGHT, Math.round(height)));
}

function px(value?: string | number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = parseFloat(String(value || ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function freeBottom(node: { styles?: { height?: string; minHeight?: string }; properties?: Record<string, unknown> }): number {
  if (!isFreePositioned(node)) return 0;
  const pos = getFreePosition(node);
  const height = Math.max(pos.height || 0, px(node.styles?.height), px(node.styles?.minHeight)) || 64;
  return pos.y + height;
}

export function childrenBottom(nodes: Array<{ styles?: { height?: string; minHeight?: string }; properties?: Record<string, unknown> }> = []): number {
  return nodes.reduce((max, node) => Math.max(max, freeBottom(node)), 0);
}

function withGrownHeight<T extends { styles?: Record<string, unknown> }>(
  node: T,
  needed: number,
  options: { pad?: number; min?: number } = {}
): T {
  const pad = options.pad ?? SURFACE_GROW_PADDING;
  const min = options.min ?? 0;
  const current = Math.max(px(node.styles?.minHeight as string), px(node.styles?.height as string), min);
  const next = Math.max(current, min, Math.round(needed + pad));
  if (next <= current) return node;
  return {
    ...node,
    styles: {
      ...node.styles,
      minHeight: `${next}px`,
      ...(node.styles?.height ? { height: `${next}px` } : {}),
    },
  };
}

export function growSurfacesToFit(sections: CanvasSection[]): CanvasSection[] {
  return sections.map((section) => {
    const children = (section.children || []).map((container) => {
      const needed = childrenBottom(container.children || []);
      return needed > 0 ? withGrownHeight(container, needed) : container;
    });
    const needed = Math.max(
      0,
      ...children.map((container) => {
        if (isFreePositioned(container)) return freeBottom(container);
        return Math.max(px(container.styles.minHeight), px(container.styles.height));
      })
    );
    return withGrownHeight({ ...section, children }, needed, { pad: 0, min: MIN_CANVAS_HEIGHT });
  });
}

export function growOffsetParents(node: HTMLElement | null, padding = SURFACE_GROW_PADDING) {
  let current = node;
  while (current) {
    const parent = current.offsetParent as HTMLElement | null;
    if (!parent) break;
    const needed = Math.round(current.offsetTop + current.offsetHeight + padding);
    if (needed > parent.clientHeight) {
      parent.style.minHeight = `${needed}px`;
      if (parent.style.height) parent.style.height = `${needed}px`;
    }
    if (parent.id === 'canvas-root' || parent.dataset.canvasKind === 'page') break;
    current = parent;
  }
}

export function defaultFreeSize(element: CanvasElement): { width?: string; height?: string } {
  const tag = String(element.content?.tag || '');
  if (element.name === 'Heading' || tag === 'h1' || tag === 'h2' || tag === 'h3') {
    return { width: '640px' };
  }
  switch (element.type) {
    case 'image':
      return { width: '480px' };
    case 'video':
      return { width: '560px' };
    case 'button':
      return { width: '180px' };
    case 'icon':
      return { width: '40px', height: '40px' };
    case 'divider':
      return { width: '480px', height: '2px' };
    case 'form':
    case 'pdf':
      return { width: '480px' };
    case 'gallery':
      return { width: '640px' };
    case 'social':
      return { width: '280px' };
    case 'html':
    case 'text':
    default:
      return { width: '520px' };
  }
}

export function nextFreeOrigin(siblings: Array<{ styles?: { height?: string }; properties?: Record<string, unknown> }>): { x: number; y: number } {
  if (!siblings.length) return { ...DEFAULT_ORIGIN };
  let bottom = DEFAULT_ORIGIN.y;
  for (const sibling of siblings) {
    const pos = getFreePosition(sibling);
    const height = pos.height || parseFloat(String(sibling.styles.height || '')) || 72;
    bottom = Math.max(bottom, pos.y + height + 24);
  }
  return { x: DEFAULT_ORIGIN.x, y: Math.min(bottom, 2400) };
}

export function withFreePlacement(element: CanvasElement, at?: { x: number; y: number }): CanvasElement {
  const origin = at || DEFAULT_ORIGIN;
  const size = defaultFreeSize(element);
  const width = !element.styles.width || element.styles.width === '100%' ? size.width : element.styles.width;
  const height = element.styles.height || size.height;
  return {
    ...element,
    styles: {
      ...element.styles,
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
      position: 'absolute',
      left: `${Math.round(origin.x)}px`,
      top: `${Math.round(origin.y)}px`,
    },
    properties: {
      ...element.properties,
      placement: 'absolute',
      freePosition: {
        x: origin.x,
        y: origin.y,
        width: width ? parseFloat(width) : undefined,
        height: height ? parseFloat(height) : undefined,
        zIndex: 1,
      } satisfies FreePosition,
    },
  };
}

export function withFreeContainerPlacement(container: CanvasContainer, at?: { x: number; y: number }): CanvasContainer {
  const origin = at || DEFAULT_ORIGIN;
  const width = !container.styles.width || container.styles.width === '100%' ? '560px' : container.styles.width;
  const height = container.styles.height || container.styles.minHeight || '320px';
  return {
    ...container,
    styles: {
      ...container.styles,
      width,
      height,
      minHeight: height,
      position: 'absolute',
      left: `${Math.round(origin.x)}px`,
      top: `${Math.round(origin.y)}px`,
    },
    properties: {
      ...container.properties,
      placement: 'absolute',
      freePosition: {
        x: origin.x,
        y: origin.y,
        width: parseFloat(width) || 560,
        height: parseFloat(height) || 320,
        zIndex: 1,
      } satisfies FreePosition,
    },
  };
}

export function collectFlowElements(sections: CanvasSection[]): Array<{ id: string; containerId: string }> {
  const items: Array<{ id: string; containerId: string }> = [];
  for (const section of sections) {
    for (const container of section.children || []) {
      for (const element of container.children || []) {
        if (!isFreePositioned(element)) {
          items.push({ id: element.id, containerId: container.id });
        }
      }
    }
  }
  return items;
}

export function isLayoutSurface(node: { properties?: Record<string, unknown>; styles?: { position?: string } }): boolean {
  if (node.properties?.role === 'surface') return true;
  return node.properties?.placement === 'flow' && node.styles?.position !== 'absolute';
}

export function asLayoutSurface(container: CanvasContainer, children: CanvasElement[] = container.children || []): CanvasContainer {
  const { left: _left, top: _top, width: _width, height: _height, ...styles } = container.styles || {};
  return {
    ...container,
    name: container.name === 'Container' ? 'Canvas' : container.name,
    styles: {
      ...styles,
      position: 'relative',
      width: '100%',
      left: undefined,
      top: undefined,
      height: undefined,
      minHeight: styles.minHeight || `${MIN_CANVAS_HEIGHT}px`,
    },
    properties: {
      ...container.properties,
      placement: 'flow',
      role: 'surface',
      freePosition: undefined,
    },
    children,
  };
}

export function flattenImplicitContainerBoxes(sections: CanvasSection[]): CanvasSection[] {
  let changed = false;
  const next = sections.map((section) => {
    const containers = section.children || [];
    if (containers.length !== 1) return section;
    const box = containers[0];
    if (isLayoutSurface(box) || !isFreePositioned(box)) return section;
    const kids = box.children || [];
    if (!kids.length) return section;
    const origin = getFreePosition(box);
    changed = true;
    return {
      ...section,
      children: [
        asLayoutSurface(
          box,
          kids.map((element) => {
            if (!isFreePositioned(element)) return element;
            const pos = getFreePosition(element);
            const x = pos.x + origin.x;
            const y = pos.y + origin.y;
            return {
              ...element,
              styles: {
                ...element.styles,
                position: 'absolute' as const,
                left: `${Math.round(x)}px`,
                top: `${Math.round(y)}px`,
              },
              properties: {
                ...element.properties,
                placement: 'absolute',
                freePosition: { ...pos, x, y },
              },
            };
          })
        ),
      ],
    };
  });
  return changed ? next : sections;
}
