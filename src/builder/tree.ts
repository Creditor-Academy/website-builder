import { v4 as uuidv4 } from 'uuid';
import { CANVAS_PARENT_RULES, type CanvasContainer, type CanvasElement, type CanvasSection, type DeviceId, type NodeKind, type NodeLocation } from './types';

export function cloneData<T>(value: T): T {
  if (value == null) return value;
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      // Fall through to JSON for values structuredClone cannot handle.
    }
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

export function sortByOrder<T extends { order: number }>(nodes: T[]): T[] {
  return [...nodes].sort((a, b) => a.order - b.order);
}

export function reindex<T extends { order: number }>(nodes: T[]): T[] {
  return nodes.map((node, index) => ({ ...node, order: index }));
}

export function canAcceptChild(parentKind: NodeKind | string, childType: string): boolean {
  const allowed = CANVAS_PARENT_RULES[parentKind];
  if (!allowed) return false;
  return allowed.has(childType === 'section' ? 'section' : childType);
}

export function findNode(sections: CanvasSection[], id: string | null): NodeLocation | null {
  if (!id) return null;

  for (const section of sections) {
    if (section.id === id) {
      return { kind: 'section', node: section, section };
    }

    for (const container of section.children || []) {
      if (container.id === id) {
        return { kind: 'container', node: container, section, container };
      }
      for (const element of container.children || []) {
        if (element.id === id) {
          return { kind: 'element', node: element, section, container, element };
        }
      }
    }

    for (const component of (section.components || []) as Array<{ id: string }>) {
      if (component.id === id) {
        return {
          kind: 'element',
          node: component as unknown as CanvasElement,
          section,
          isFloating: true,
        };
      }
    }
  }

  return null;
}

export function collectDescendantIds(sections: CanvasSection[], id: string): Set<string> {
  const found = findNode(sections, id);
  const ids = new Set<string>();
  if (!found) return ids;

  if (found.kind === 'section') {
    const section = found.node as CanvasSection;
    for (const container of section.children || []) {
      ids.add(container.id);
      for (const element of container.children || []) ids.add(element.id);
    }
    for (const component of (section.components || []) as Array<{ id: string }>) {
      ids.add(component.id);
    }
  }

  if (found.kind === 'container') {
    for (const element of (found.node as CanvasContainer).children || []) {
      ids.add(element.id);
    }
  }

  return ids;
}

export function isDescendant(sections: CanvasSection[], ancestorId: string, nodeId: string): boolean {
  return collectDescendantIds(sections, ancestorId).has(nodeId);
}

export function collectAllIds(sections: CanvasSection[]): string[] {
  const ids: string[] = [];
  for (const section of sections) {
    ids.push(section.id);
    for (const container of section.children || []) {
      ids.push(container.id);
      for (const element of container.children || []) ids.push(element.id);
    }
    for (const component of (section.components || []) as Array<{ id: string }>) {
      ids.push(component.id);
    }
  }
  return ids;
}

export function hasDuplicateIds(sections: CanvasSection[]): boolean {
  const ids = collectAllIds(sections);
  return new Set(ids).size !== ids.length;
}

export interface MoveTarget {
  parentId: string;
  parentKind: NodeKind;
  index: number;
}

export function getSourcePosition(sections: CanvasSection[], nodeId: string): { parentId: string; index: number } | null {
  const found = findNode(sections, nodeId);
  if (!found) return null;

  if (found.kind === 'section') {
    return { parentId: found.node.parentId || '', index: sections.findIndex((section) => section.id === nodeId) };
  }
  if (found.kind === 'container' && found.section) {
    return {
      parentId: found.section.id,
      index: (found.section.children || []).findIndex((container) => container.id === nodeId),
    };
  }
  if (found.kind === 'element' && found.container && !found.isFloating) {
    return {
      parentId: found.container.id,
      index: (found.container.children || []).findIndex((element) => element.id === nodeId),
    };
  }
  return null;
}

export function validateMove(sections: CanvasSection[], nodeId: string, target: MoveTarget): boolean {
  if (!nodeId || !target.parentId) return false;
  if (nodeId === target.parentId) return false;
  if (target.index < 0 || Number.isNaN(target.index)) return false;

  const found = findNode(sections, nodeId);
  if (!found) return false;
  if (found.kind === 'page' || found.kind === 'navbar' || found.kind === 'footer') return false;
  if (found.isFloating) return false;
  if (found.node.locked) return false;
  if (isDescendant(sections, nodeId, target.parentId)) return false;

  const childType =
    found.kind === 'section' ? 'section' : found.kind === 'container' ? 'container' : (found.node as CanvasElement).type;
  if (!canAcceptChild(target.parentKind, childType)) return false;

  if (target.parentKind === 'section') {
    const parent = findNode(sections, target.parentId);
    const section = parent?.kind === 'section' ? (parent.node as CanvasSection) : parent?.section;
    if (section?.kind === 'prebuilt' && !(section.children || []).length) return false;
  }

  return true;
}

export function getAncestors(sections: CanvasSection[], id: string): NodeLocation[] {
  const found = findNode(sections, id);
  if (!found) return [];
  const chain: NodeLocation[] = [];
  if (found.section && found.kind !== 'section') {
    chain.push({ kind: 'section', node: found.section, section: found.section });
  }
  if (found.container && found.kind === 'element') {
    chain.push({ kind: 'container', node: found.container, section: found.section, container: found.container });
  }
  chain.push(found);
  return chain;
}

export function updateNodeById<T extends Record<string, unknown>>(
  sections: CanvasSection[],
  id: string,
  patch: T
): CanvasSection[] {
  return sections.map((section) => {
    if (section.id === id) return { ...section, ...patch };

    let childrenChanged = false;
    const children = (section.children || []).map((container) => {
      if (container.id === id) {
        childrenChanged = true;
        return { ...container, ...patch };
      }
      let elementsChanged = false;
      const elements = (container.children || []).map((element) => {
        if (element.id === id) {
          elementsChanged = true;
          return { ...element, ...patch };
        }
        return element;
      });
      if (elementsChanged) {
        childrenChanged = true;
        return { ...container, children: elements };
      }
      return container;
    });

    if (childrenChanged) return { ...section, children };

    const components = section.components as Array<{ id: string }> | undefined;
    if (components?.some((component) => component.id === id)) {
      return {
        ...section,
        components: components.map((component) => (component.id === id ? { ...component, ...patch } : component)),
      };
    }

    return section;
  });
}

export function removeNode(sections: CanvasSection[], id: string): CanvasSection[] {
  const found = findNode(sections, id);
  if (!found) return sections;
  if (found.node.locked) return sections;

  if (found.kind === 'section') {
    return reindex(sections.filter((section) => section.id !== id));
  }

  return sections.map((section) => {
    if (section.id !== found.section?.id) return section;

    if (found.kind === 'container') {
      return {
        ...section,
        children: reindex((section.children || []).filter((container) => container.id !== id)),
      };
    }

    if (found.isFloating) {
      return {
        ...section,
        components: ((section.components || []) as Array<{ id: string }>).filter((component) => component.id !== id),
      };
    }

    return {
      ...section,
      children: (section.children || []).map((container) => {
        if (container.id !== found.container?.id) return container;
        return {
          ...container,
          children: reindex((container.children || []).filter((element) => element.id !== id)),
        };
      }),
    };
  });
}

export function insertSection(sections: CanvasSection[], section: CanvasSection, index?: number): CanvasSection[] {
  const next = [...sections];
  const target = index == null ? next.length : Math.max(0, Math.min(index, next.length));
  next.splice(target, 0, { ...section, parentId: section.parentId, order: target });
  return reindex(next);
}

export function insertContainer(
  sections: CanvasSection[],
  sectionId: string,
  container: CanvasContainer,
  index?: number
): CanvasSection[] {
  return sections.map((section) => {
    if (section.id !== sectionId) return section;
    const children = [...(section.children || [])];
    const target = index == null ? children.length : Math.max(0, Math.min(index, children.length));
    children.splice(target, 0, { ...container, parentId: sectionId });
    return { ...section, kind: 'canvas', children: reindex(children) };
  });
}

export function insertElement(
  sections: CanvasSection[],
  containerId: string,
  element: CanvasElement,
  index?: number
): CanvasSection[] {
  return sections.map((section) => {
    let changed = false;
    const children = (section.children || []).map((container) => {
      if (container.id !== containerId) return container;
      changed = true;
      const elements = [...(container.children || [])];
      const target = index == null ? elements.length : Math.max(0, Math.min(index, elements.length));
      elements.splice(target, 0, { ...element, parentId: containerId });
      return { ...container, children: reindex(elements) };
    });
    return changed ? { ...section, children } : section;
  });
}

export function reorderChildren(sections: CanvasSection[], parentId: string, orderedIds: string[]): CanvasSection[] {
  if (sections.some((section) => orderedIds.includes(section.id)) && orderedIds.length === sections.length) {
    const map = new Map(sections.map((section) => [section.id, section]));
    return reindex(orderedIds.map((id) => map.get(id)).filter(Boolean) as CanvasSection[]);
  }

  return sections.map((section) => {
    if (section.id === parentId) {
      const map = new Map((section.children || []).map((container) => [container.id, container]));
      return { ...section, children: reindex(orderedIds.map((id) => map.get(id)).filter(Boolean) as CanvasContainer[]) };
    }
    return {
      ...section,
      children: (section.children || []).map((container) => {
        if (container.id !== parentId) return container;
        const map = new Map((container.children || []).map((element) => [element.id, element]));
        return {
          ...container,
          children: reindex(orderedIds.map((id) => map.get(id)).filter(Boolean) as CanvasElement[]),
        };
      }),
    };
  });
}

export function moveNode(sections: CanvasSection[], nodeId: string, target: MoveTarget): CanvasSection[] {
  if (!validateMove(sections, nodeId, target)) return sections;

  const found = findNode(sections, nodeId);
  if (!found) return sections;

  const source = getSourcePosition(sections, nodeId);
  let index = target.index;
  if (source && source.parentId === target.parentId && source.index >= 0) {
    if (source.index < index) index -= 1;
    if (source.index === index) return sections;
  }

  const without = removeNode(sections, nodeId);
  if (found.kind === 'section') {
    return insertSection(without, { ...(found.node as CanvasSection), parentId: target.parentId }, index);
  }
  if (found.kind === 'container') {
    return insertContainer(without, target.parentId, { ...(found.node as CanvasContainer), parentId: target.parentId }, index);
  }
  return insertElement(without, target.parentId, { ...(found.node as CanvasElement), parentId: target.parentId }, index);
}

export function cloneElement(element: CanvasElement, parentId: string, order: number): CanvasElement {
  return {
    ...element,
    id: uuidv4(),
    parentId,
    order,
    styles: cloneData(element.styles || {}),
    responsiveStyles: cloneData(element.responsiveStyles || {}),
    content: cloneData(element.content || {}),
    properties: cloneData(element.properties || {}),
    visibility: cloneData(element.visibility || { desktop: true, tablet: true, mobile: true }),
    animation: element.animation ? cloneData(element.animation) : element.animation,
    locked: element.locked,
  };
}

export function cloneContainer(container: CanvasContainer, parentId: string, order: number): CanvasContainer {
  const id = uuidv4();
  return {
    ...container,
    id,
    parentId,
    order,
    styles: cloneData(container.styles || {}),
    responsiveStyles: cloneData(container.responsiveStyles || {}),
    content: cloneData(container.content || {}),
    properties: cloneData(container.properties || {}),
    visibility: cloneData(container.visibility || { desktop: true, tablet: true, mobile: true }),
    animation: container.animation ? cloneData(container.animation) : container.animation,
    locked: container.locked,
    children: (container.children || []).map((element, index) => cloneElement(element, id, index)),
  };
}

export function cloneSection(section: CanvasSection, pageId: string, order: number): CanvasSection {
  const id = uuidv4();
  return {
    ...section,
    id,
    parentId: pageId,
    order,
    name: `${section.name} (Copy)`,
    styles: cloneData(section.styles || {}),
    responsiveStyles: cloneData(section.responsiveStyles || {}),
    content: cloneData(section.content || {}),
    properties: cloneData(section.properties || {}),
    visibility: cloneData(section.visibility || { desktop: true, tablet: true, mobile: true }),
    animation: section.animation ? cloneData(section.animation) : section.animation,
    locked: false,
    children: (section.children || []).map((container, index) => cloneContainer(container, id, index)),
    components: ((section.components || []) as Array<Record<string, unknown>>).map((component) => ({
      ...cloneData(component),
      id: uuidv4(),
    })),
  };
}

export function cloneNode(sections: CanvasSection[], id: string, pageId: string): { sections: CanvasSection[]; newId: string } | null {
  const found = findNode(sections, id);
  if (!found || found.node.locked) return null;

  if (found.kind === 'section') {
    const index = sections.findIndex((section) => section.id === id);
    const cloned = cloneSection(found.node as CanvasSection, pageId, index + 1);
    return { sections: insertSection(sections, cloned, index + 1), newId: cloned.id };
  }

  if (found.kind === 'container' && found.section) {
    const index = (found.section.children || []).findIndex((container) => container.id === id);
    const cloned = cloneContainer(found.node as CanvasContainer, found.section.id, index + 1);
    return { sections: insertContainer(sections, found.section.id, cloned, index + 1), newId: cloned.id };
  }

  if (found.kind === 'element' && found.container && !found.isFloating) {
    const index = (found.container.children || []).findIndex((element) => element.id === id);
    const cloned = cloneElement(found.node as CanvasElement, found.container.id, index + 1);
    return { sections: insertElement(sections, found.container.id, cloned, index + 1), newId: cloned.id };
  }

  return null;
}

export interface LayerTreeNode {
  id: string;
  kind: 'section' | 'container' | 'element';
  type: string;
  name: string;
  visible: boolean;
  locked: boolean;
  children: LayerTreeNode[];
}

export function collectLayerTree(sections: CanvasSection[], device: DeviceId = 'desktop'): LayerTreeNode[] {
  return sortByOrder(sections).map((section) => ({
    id: section.id,
    kind: 'section' as const,
    type: section.type,
    name: section.name,
    visible: section.visible !== false && section.visibility?.[device] !== false,
    locked: Boolean(section.locked),
    children: sortByOrder(section.children || []).map((container) => ({
      id: container.id,
      kind: 'container' as const,
      type: 'container',
      name: container.name,
      visible: container.visibility?.[device] !== false,
      locked: Boolean(container.locked),
      children: sortByOrder(container.children || []).map((element) => ({
        id: element.id,
        kind: 'element' as const,
        type: element.type,
        name: element.name,
        visible: element.visibility?.[device] !== false,
        locked: Boolean(element.locked),
        children: [] as LayerTreeNode[],
      })),
    })),
  }));
}
