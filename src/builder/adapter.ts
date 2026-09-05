import { DEFAULT_VISIBILITY, PREBUILT_SECTION_TYPES, type CanvasContainer, type CanvasElement, type CanvasSection, type DeviceVisibility } from './types';

function visibilityOf(value: unknown): DeviceVisibility {
  const raw = value as Partial<DeviceVisibility> | undefined;
  return {
    desktop: raw?.desktop !== false,
    tablet: raw?.tablet !== false,
    mobile: raw?.mobile !== false,
  };
}

function normalizeElement(element: Partial<CanvasElement>, parentId: string, order: number): CanvasElement {
  return {
    id: element.id as string,
    type: (element.type as CanvasElement['type']) || 'text',
    parentId,
    name: element.name || String(element.type || 'Element'),
    order: element.order ?? order,
    content: (element.content as Record<string, unknown>) || {},
    styles: element.styles || {},
    responsiveStyles: element.responsiveStyles || {},
    properties: element.properties || {},
    visibility: visibilityOf(element.visibility),
    locked: Boolean(element.locked),
    animation: element.animation,
  };
}

function normalizeContainer(container: Partial<CanvasContainer>, parentId: string, order: number): CanvasContainer {
  const id = (container.id as string) || parentId;
  return {
    id,
    type: 'container',
    parentId,
    name: container.name || 'Container',
    order: container.order ?? order,
    content: (container.content as Record<string, unknown>) || {},
    styles: container.styles || {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '100%',
      maxWidth: '1120px',
      margin: '0 auto',
    },
    responsiveStyles: container.responsiveStyles || {},
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
    styles: (section.styles as CanvasSection['styles']) || {},
    responsiveStyles: (section.responsiveStyles as CanvasSection['responsiveStyles']) || {},
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
