import type { CanvasContainer, CanvasElement, CanvasSection, CanvasStyles, DeviceVisibility, ResponsiveStyles } from './types';
import { PREBUILT_SECTION_TYPES } from './types';

function visibilityOf(value: unknown): DeviceVisibility {
  const raw = value as Partial<DeviceVisibility> | undefined;
  return {
    desktop: raw?.desktop !== false,
    tablet: raw?.tablet !== false,
    mobile: raw?.mobile !== false,
  };
}

const BREAKPOINT_KEYS = ['base', 'desktop', 'tablet', 'mobile'] as const;

export function isBreakpointStyles(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return BREAKPOINT_KEYS.some((key) => record[key] != null && typeof record[key] === 'object' && !Array.isArray(record[key]));
}

export function unpackNodeStyles(
  styles: unknown,
  responsive: unknown
): { styles: CanvasStyles; responsiveStyles: ResponsiveStyles } {
  const existingResponsive = (responsive && typeof responsive === 'object' && !Array.isArray(responsive)
    ? responsive
    : {}) as ResponsiveStyles;

  if (!isBreakpointStyles(styles)) {
    return {
      styles: (styles as CanvasStyles) || {},
      responsiveStyles: existingResponsive,
    };
  }

  const record = styles as Record<string, CanvasStyles | undefined>;
  const base = { ...(record.base || record.desktop || {}) };
  return {
    styles: base,
    responsiveStyles: {
      ...existingResponsive,
      ...(record.tablet ? { tablet: { ...(existingResponsive.tablet || {}), ...record.tablet } } : {}),
      ...(record.mobile ? { mobile: { ...(existingResponsive.mobile || {}), ...record.mobile } } : {}),
    },
  };
}

function normalizeElementContent(type: CanvasElement['type'], content: Record<string, unknown>): Record<string, unknown> {
  if (type !== 'image') return content;
  const src = content.src || content.imageUrl || content.url;
  return src ? { ...content, src } : content;
}

function normalizeElement(element: Partial<CanvasElement>, parentId: string, order: number): CanvasElement {
  const unpacked = unpackNodeStyles(element.styles, element.responsiveStyles);
  const type = (element.type as CanvasElement['type']) || 'text';
  return {
    id: element.id as string,
    type,
    parentId,
    name: element.name || String(element.type || 'Element'),
    order: element.order ?? order,
    content: normalizeElementContent(type, (element.content as Record<string, unknown>) || {}),
    styles: unpacked.styles,
    responsiveStyles: unpacked.responsiveStyles,
    properties: element.properties || {},
    visibility: visibilityOf(element.visibility),
    locked: Boolean(element.locked),
    animation: element.animation,
  };
}

function normalizeContainer(container: Partial<CanvasContainer>, parentId: string, order: number): CanvasContainer {
  const id = (container.id as string) || parentId;
  const unpacked = unpackNodeStyles(container.styles, container.responsiveStyles);
  const free = container.properties?.placement === 'absolute' || unpacked.styles?.position === 'absolute';
  return {
    id,
    type: 'container',
    parentId,
    name: container.name || 'Container',
    order: container.order ?? order,
    content: (container.content as Record<string, unknown>) || {},
    styles: free
      ? { ...unpacked.styles, position: 'absolute' }
      : {
          ...unpacked.styles,
          position: unpacked.styles?.position || 'relative',
          width: unpacked.styles?.width || '100%',
          minHeight: unpacked.styles?.minHeight || '320px',
        },
    responsiveStyles: unpacked.responsiveStyles,
    properties: container.properties || {},
    visibility: visibilityOf(container.visibility),
    locked: Boolean(container.locked),
    animation: container.animation,
    children: ((container.children || []) as CanvasElement[]).map((element, index) =>
      normalizeElement(element, id, index)
    ),
  };
}

export function isCanvasSection(section: { kind?: string; children?: unknown; type?: string }): boolean {
  if (section.kind === 'canvas') return true;
  if (Array.isArray(section.children) && section.children.length > 0) return true;
  return false;
}

export function normalizeSection(section: Record<string, unknown>, pageId: string, order: number): CanvasSection {
  const type = String(section.type || 'section');
  const children = Array.isArray(section.children) ? (section.children as CanvasContainer[]) : [];
  const kind = section.kind === 'canvas' || children.length > 0 ? 'canvas' : PREBUILT_SECTION_TYPES.has(type) ? 'prebuilt' : 'prebuilt';
  const unpacked = unpackNodeStyles(section.styles, section.responsiveStyles);

  return {
    ...(section as unknown as CanvasSection),
    id: String(section.id),
    type,
    kind,
    parentId: pageId,
    name: String(section.name || type),
    order: (section.order as number) ?? order,
    visible: section.visible !== false,
    locked: Boolean(section.locked),
    content: (section.content as Record<string, unknown>) || {},
    styles: unpacked.styles,
    responsiveStyles: unpacked.responsiveStyles,
    properties: (section.properties as Record<string, unknown>) || {},
    visibility: visibilityOf(section.visibility),
    children: children.map((container, index) => normalizeContainer(container, String(section.id), index)),
    components: (section.components as unknown[]) || [],
    variant: section.variant as string | undefined,
  };
}

export function normalizePageSections(sections: unknown[] | undefined, pageId: string): CanvasSection[] {
  return (sections || []).map((section, index) => normalizeSection(section as Record<string, unknown>, pageId, index));
}
