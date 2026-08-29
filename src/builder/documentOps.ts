import { v4 as uuidv4 } from 'uuid';
import { normalizePageSections } from './adapter';
import { createCanvasSection, createCanvasSectionWithElement, createContainer, ELEMENT_FACTORIES } from './defaults';
import { cloneNode, findNode, insertContainer, insertElement, insertSection, moveNode, removeNode, updateNodeById } from './tree';
import { patchResponsiveStyles } from './styles';
import type { CanvasSection, DeviceId, DropTarget, ElementType, NodeKind } from './types';

export function normalizeActiveSections(page: { id: string; sections?: unknown[] } | null): CanvasSection[] {
  if (!page) return [];
  return normalizePageSections(page.sections, page.id);
}

export function addElementToPage(
  page: { id: string; sections?: unknown[] },
  selectedId: string | null,
  type: ElementType
): { sections: CanvasSection[]; selectId: string; selectKind: NodeKind } {
  const sections = normalizeActiveSections(page);
  const found = findNode(sections, selectedId);

  if (found?.kind === 'container') {
    const element = ELEMENT_FACTORIES[type](found.node.id, (found.node as { children?: unknown[] }).children?.length || 0);
    return { sections: insertElement(sections, found.node.id, element), selectId: element.id, selectKind: 'element' };
  }

  if (found?.kind === 'element' && found.container) {
    const index = (found.container.children || []).findIndex((element) => element.id === found.node.id) + 1;
    const element = ELEMENT_FACTORIES[type](found.container.id, index);
    return { sections: insertElement(sections, found.container.id, element, index), selectId: element.id, selectKind: 'element' };
  }

  if (found?.kind === 'section' && found.section?.kind === 'canvas' && found.section.children?.[0]) {
    const container = found.section.children[0];
    const element = ELEMENT_FACTORIES[type](container.id, container.children.length);
    return { sections: insertElement(sections, container.id, element), selectId: element.id, selectKind: 'element' };
  }

  const index = found?.kind === 'section' ? sections.findIndex((section) => section.id === found.node.id) + 1 : sections.length;
  const section = createCanvasSectionWithElement(page.id, type, index);
  const elementId = section.children[0]?.children[0]?.id;
  return { sections: insertSection(sections, section, index), selectId: elementId || section.id, selectKind: elementId ? 'element' : 'section' };
}

export function addContainerToPage(
  page: { id: string; sections?: unknown[] },
  selectedId: string | null
): { sections: CanvasSection[]; selectId: string; selectKind: NodeKind } {
  const sections = normalizeActiveSections(page);
  const found = findNode(sections, selectedId);

  if (found?.kind === 'section' && (found.section?.kind === 'canvas' || found.section?.children?.length)) {
    const container = createContainer(found.section.id, found.section.children.length);
    return { sections: insertContainer(sections, found.section.id, container), selectId: container.id, selectKind: 'container' };
  }

  const index = found?.kind === 'section' ? sections.findIndex((section) => section.id === found.node.id) + 1 : sections.length;
  const section = createCanvasSection(page.id, index);
  return { sections: insertSection(sections, section, index), selectId: section.children[0].id, selectKind: 'container' };
}

export function addSectionToPage(
  page: { id: string; sections?: unknown[] },
  selectedId: string | null,
  sectionInput?: Record<string, unknown>
): { sections: CanvasSection[]; selectId: string; selectKind: NodeKind } {
  const sections = normalizeActiveSections(page);
  const found = findNode(sections, selectedId);
  const index = found?.kind === 'section' ? sections.findIndex((section) => section.id === found.node.id) + 1 : sections.length;
  const section = sectionInput
    ? ({
        ...sectionInput,
        id: (sectionInput.id as string) || uuidv4(),
        kind: (sectionInput.kind as CanvasSection['kind']) || 'prebuilt',
        parentId: page.id,
        order: index,
        children: (sectionInput.children as CanvasSection['children']) || [],
        visibility: (sectionInput.visibility as CanvasSection['visibility']) || { desktop: true, tablet: true, mobile: true },
        responsiveStyles: sectionInput.responsiveStyles || {},
        properties: sectionInput.properties || {},
      } as CanvasSection)
    : createCanvasSection(page.id, index);
  return { sections: insertSection(sections, section, index), selectId: section.id, selectKind: 'section' };
}

export function applyNodePatch(page: { id: string; sections?: unknown[] }, id: string, patch: Record<string, unknown>): CanvasSection[] {
  return updateNodeById(normalizeActiveSections(page), id, patch);
}

export function applyStylePatch(
  page: { id: string; sections?: unknown[] },
  id: string,
  device: DeviceId,
  stylePatch: Record<string, unknown>
): CanvasSection[] {
  const sections = normalizeActiveSections(page);
  const found = findNode(sections, id);
  if (!found) return sections;
  const next = patchResponsiveStyles(found.node.styles || {}, found.node.responsiveStyles || {}, device, stylePatch);
  return updateNodeById(sections, id, next);
}

export function applyDelete(page: { id: string; sections?: unknown[] }, id: string): CanvasSection[] {
  return removeNode(normalizeActiveSections(page), id);
}

export function applyDuplicate(page: { id: string; sections?: unknown[] }, id: string): { sections: CanvasSection[]; newId: string } | null {
  return cloneNode(normalizeActiveSections(page), id, page.id);
}

export function applyMove(
  page: { id: string; sections?: unknown[] },
  nodeId: string,
  target: DropTarget
): CanvasSection[] {
  return moveNode(normalizeActiveSections(page), nodeId, {
    parentId: target.parentId,
    parentKind: target.parentKind,
    index: target.edge === 'after' ? target.index + 1 : target.index,
  });
}
