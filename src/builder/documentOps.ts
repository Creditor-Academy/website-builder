import { v4 as uuidv4 } from 'uuid';
import { normalizePageSections } from './adapter';
import { createCanvasSection, createCanvasSectionWithElement, createContainer, ELEMENT_FACTORIES } from './defaults';
import type { PaletteDragData } from './dnd';
import {
  cloneContainer,
  cloneElement,
  cloneNode,
  cloneSection,
  findNode,
  insertContainer,
  insertElement,
  insertSection,
  moveNode,
  removeNode,
  updateNodeById,
  validateMove,
} from './tree';
import { patchResponsiveStyles } from './styles';
import type { CanvasContainer, CanvasElement, CanvasSection, DeviceId, DropTarget, ElementType, NodeKind } from './types';

export interface CanvasClipboard {
  kind: 'section' | 'container' | 'element';
  node: CanvasSection | CanvasContainer | CanvasElement;
}

export function normalizeActiveSections(page: { id: string; sections?: unknown[] } | null): CanvasSection[] {
  if (!page) return [];
  return normalizePageSections(page.sections, page.id);
}

function dropIndex(target: DropTarget): number {
  if (target.edge === 'after') return target.index + 1;
  return target.index;
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

  if (found?.kind === 'container' && found.section) {
    const index = (found.section.children || []).findIndex((container) => container.id === found.node.id) + 1;
    const container = createContainer(found.section.id, index);
    return { sections: insertContainer(sections, found.section.id, container, index), selectId: container.id, selectKind: 'container' };
  }

  if (found?.kind === 'element' && found.section) {
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
  sectionInput?: Record<string, unknown>,
  insertAt?: number
): { sections: CanvasSection[]; selectId: string; selectKind: NodeKind } {
  const sections = normalizeActiveSections(page);
  const found = findNode(sections, selectedId);
  const index =
    insertAt != null
      ? insertAt
      : found?.kind === 'section'
        ? sections.findIndex((section) => section.id === found.node.id) + 1
        : sections.length;
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

export function addItemAtDropTarget(
  page: { id: string; sections?: unknown[] },
  item: PaletteDragData,
  target: DropTarget | null
): { sections: CanvasSection[]; selectId: string; selectKind: NodeKind } {
  if (item.itemKind === 'element' && item.elementType && !target) {
    return addElementToPage(page, null, item.elementType);
  }
  if (item.itemKind === 'container' && !target) {
    return addContainerToPage(page, null);
  }
  if (item.itemKind === 'prebuilt' && !target) {
    return addSectionToPage(page, null);
  }

  if (!target) {
    if (item.elementType) return addElementToPage(page, null, item.elementType);
    if (item.itemKind === 'container') return addContainerToPage(page, null);
    return addSectionToPage(page, null);
  }

  const sections = normalizeActiveSections(page);
  const index = dropIndex(target);

  if (item.itemKind === 'element' && item.elementType) {
    if (target.parentKind === 'container') {
      const element = ELEMENT_FACTORIES[item.elementType](target.parentId, index);
      return { sections: insertElement(sections, target.parentId, element, index), selectId: element.id, selectKind: 'element' };
    }
    if (target.parentKind === 'section') {
      const found = findNode(sections, target.parentId);
      if (found?.section?.kind === 'prebuilt' && !(found.section.children || []).length) {
        const indexAfter = sections.findIndex((entry) => entry.id === target.parentId) + 1;
        const section = createCanvasSectionWithElement(page.id, item.elementType, indexAfter);
        const elementId = section.children[0]?.children[0]?.id;
        return { sections: insertSection(sections, section, indexAfter), selectId: elementId || section.id, selectKind: elementId ? 'element' : 'section' };
      }
      const existing = found?.section?.children?.[0];
      if (existing) {
        const element = ELEMENT_FACTORIES[item.elementType](existing.id, existing.children.length);
        return { sections: insertElement(sections, existing.id, element), selectId: element.id, selectKind: 'element' };
      }
      const container = createContainer(target.parentId, found?.section?.children?.length || 0);
      const element = ELEMENT_FACTORIES[item.elementType](container.id, 0);
      container.children = [element];
      return { sections: insertContainer(sections, target.parentId, container, index), selectId: element.id, selectKind: 'element' };
    }
    if (target.parentKind === 'page') {
      const section = createCanvasSectionWithElement(page.id, item.elementType, index);
      const elementId = section.children[0]?.children[0]?.id;
      return { sections: insertSection(sections, section, index), selectId: elementId || section.id, selectKind: elementId ? 'element' : 'section' };
    }
    return addElementToPage(page, null, item.elementType);
  }

  if (item.itemKind === 'container') {
    if (target.parentKind === 'section') {
      const found = findNode(sections, target.parentId);
      if (found?.section?.kind === 'prebuilt' && !(found.section.children || []).length) {
        const section = createCanvasSection(page.id, sections.findIndex((entry) => entry.id === target.parentId) + 1);
        return { sections: insertSection(sections, section, sections.findIndex((entry) => entry.id === target.parentId) + 1), selectId: section.children[0].id, selectKind: 'container' };
      }
      const container = createContainer(target.parentId, index);
      return { sections: insertContainer(sections, target.parentId, container, index), selectId: container.id, selectKind: 'container' };
    }
    if (target.parentKind === 'page') {
      const section = createCanvasSection(page.id, index);
      return { sections: insertSection(sections, section, index), selectId: section.children[0].id, selectKind: 'container' };
    }
    return addContainerToPage(page, null);
  }

  return addSectionToPage(page, null, undefined, target.parentKind === 'page' ? index : undefined);
}

export function addPrebuiltAtDropTarget(
  page: { id: string; sections?: unknown[] },
  sectionInput: Record<string, unknown>,
  target: DropTarget | null
): { sections: CanvasSection[]; selectId: string; selectKind: NodeKind } {
  const index = target?.parentKind === 'page' ? dropIndex(target) : undefined;
  return addSectionToPage(page, null, sectionInput, index);
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

export function applyDelete(page: { id: string; sections?: unknown[] }, id: string): CanvasSection[] | null {
  const sections = normalizeActiveSections(page);
  const found = findNode(sections, id);
  if (!found || found.node.locked) return null;
  return removeNode(sections, id);
}

export function applyDuplicate(page: { id: string; sections?: unknown[] }, id: string): { sections: CanvasSection[]; newId: string } | null {
  return cloneNode(normalizeActiveSections(page), id, page.id);
}

export function applyMove(
  page: { id: string; sections?: unknown[] },
  nodeId: string,
  target: DropTarget
): CanvasSection[] | null {
  const sections = normalizeActiveSections(page);
  const mapped = {
    parentId: target.parentId,
    parentKind: target.parentKind,
    index: target.edge === 'after' ? target.index + 1 : target.index,
  };
  if (!validateMove(sections, nodeId, mapped)) return null;
  const next = moveNode(sections, nodeId, mapped);
  return next === sections ? null : next;
}

export function copyNodeToClipboard(
  page: { id: string; sections?: unknown[] },
  id: string
): CanvasClipboard | null {
  const found = findNode(normalizeActiveSections(page), id);
  if (!found || found.kind === 'navbar' || found.kind === 'footer' || found.isFloating) return null;
  if (found.kind === 'section') return { kind: 'section', node: found.node as CanvasSection };
  if (found.kind === 'container') return { kind: 'container', node: found.node as CanvasContainer };
  return { kind: 'element', node: found.node as CanvasElement };
}

export function pasteClipboard(
  page: { id: string; sections?: unknown[] },
  clipboard: CanvasClipboard,
  selectedId: string | null
): { sections: CanvasSection[]; selectId: string; selectKind: NodeKind } | null {
  const sections = normalizeActiveSections(page);
  const found = findNode(sections, selectedId);

  if (clipboard.kind === 'section') {
    const index = found?.kind === 'section' ? sections.findIndex((section) => section.id === found.node.id) + 1 : sections.length;
    const cloned = cloneSection(clipboard.node as CanvasSection, page.id, index);
    return { sections: insertSection(sections, cloned, index), selectId: cloned.id, selectKind: 'section' };
  }

  if (clipboard.kind === 'container') {
    if (found?.kind === 'container' && found.section) {
      const index = (found.section.children || []).findIndex((container) => container.id === found.node.id) + 1;
      const cloned = cloneContainer(clipboard.node as CanvasContainer, found.section.id, index);
      return { sections: insertContainer(sections, found.section.id, cloned, index), selectId: cloned.id, selectKind: 'container' };
    }
    if (found?.kind === 'section' && found.section) {
      const cloned = cloneContainer(clipboard.node as CanvasContainer, found.section.id, found.section.children.length);
      return { sections: insertContainer(sections, found.section.id, cloned), selectId: cloned.id, selectKind: 'container' };
    }
    if (found?.kind === 'element' && found.section) {
      const cloned = cloneContainer(clipboard.node as CanvasContainer, found.section.id, found.section.children.length);
      return { sections: insertContainer(sections, found.section.id, cloned), selectId: cloned.id, selectKind: 'container' };
    }
    if (sections[0]) {
      const cloned = cloneContainer(clipboard.node as CanvasContainer, sections[0].id, sections[0].children?.length || 0);
      return { sections: insertContainer(sections, sections[0].id, cloned), selectId: cloned.id, selectKind: 'container' };
    }
    const section = createCanvasSection(page.id, 0);
    const cloned = cloneContainer(clipboard.node as CanvasContainer, section.id, 0);
    return { sections: insertSection(sections, { ...section, children: [cloned] }, 0), selectId: cloned.id, selectKind: 'container' };
  }

  const type = (clipboard.node as CanvasElement).type;
  if (found?.kind === 'container') {
    const cloned = cloneElement(clipboard.node as CanvasElement, found.node.id, (found.node as CanvasContainer).children?.length || 0);
    return { sections: insertElement(sections, found.node.id, cloned), selectId: cloned.id, selectKind: 'element' };
  }
  if (found?.kind === 'element' && found.container) {
    const index = (found.container.children || []).findIndex((element) => element.id === found.node.id) + 1;
    const cloned = cloneElement(clipboard.node as CanvasElement, found.container.id, index);
    return { sections: insertElement(sections, found.container.id, cloned, index), selectId: cloned.id, selectKind: 'element' };
  }
  if (found?.kind === 'section' && found.section?.children?.[0]) {
    const container = found.section.children[0];
    const cloned = cloneElement(clipboard.node as CanvasElement, container.id, container.children.length);
    return { sections: insertElement(sections, container.id, cloned), selectId: cloned.id, selectKind: 'element' };
  }
  if (type) {
    return addElementToPage(page, selectedId, type);
  }
  return null;
}
