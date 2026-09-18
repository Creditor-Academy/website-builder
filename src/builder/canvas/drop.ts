import { canAcceptChild, findNode, isDescendant, isFreePositioned, validateMove } from '../tree';
import type { CanvasSection, DropTarget, ElementType, NodeKind } from '../types';
import { ELEMENT_ACCEPTS, parseDragId } from '../dnd';

export type DropEdge = 'before' | 'after' | 'inside';

export interface DropRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  height: number;
  width: number;
}

export interface DropSource {
  source: 'elements-panel' | 'canvas' | 'layers' | 'palette' | 'layer';
  kind: NodeKind | 'element' | 'container' | 'section' | 'prebuilt' | 'footer';
  type?: string;
  nodeId?: string;
  parentId?: string;
  index?: number;
  locked?: boolean;
  elementType?: ElementType;
}

export interface DropOver {
  id: string;
  kind: NodeKind;
  type?: string;
  index: number;
  parentId: string;
  parentKind: NodeKind;
  childCount: number;
  locked?: boolean;
  rect: DropRect;
}

export interface CalculatedDrop {
  targetId: string;
  parentId: string;
  parentKind: NodeKind;
  position: DropEdge;
  index: number;
  edge: DropEdge;
  accepts: string[];
}

export interface SiblingRect {
  id: string;
  index: number;
  rect: DropRect;
}

export function rectContains(rect: DropRect, pointer: { x: number; y: number }): boolean {
  return pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom;
}

export function axisFromRects(rects: SiblingRect[]): 'x' | 'y' {
  if (rects.length < 2) return 'y';
  const dx = Math.abs(rects[1].rect.left - rects[0].rect.left);
  const dy = Math.abs(rects[1].rect.top - rects[0].rect.top);
  return dx > dy ? 'x' : 'y';
}

export function indexAlongAxis(
  pointer: { x: number; y: number },
  siblings: SiblingRect[],
  axis?: 'x' | 'y'
): { index: number; edge: DropEdge; targetId: string } | null {
  if (!siblings.length) return null;
  const ordered = [...siblings].sort((a, b) => a.index - b.index);
  const use = axis || axisFromRects(ordered);
  const value = use === 'x' ? pointer.x : pointer.y;
  for (const sibling of ordered) {
    const mid = use === 'x'
      ? sibling.rect.left + sibling.rect.width / 2
      : sibling.rect.top + sibling.rect.height / 2;
    if (value < mid) {
      return { index: sibling.index, edge: 'before', targetId: sibling.id };
    }
  }
  const last = ordered[ordered.length - 1];
  return { index: last.index, edge: 'after', targetId: last.id };
}

export function closestSibling(pointer: { x: number; y: number }, siblings: SiblingRect[]): SiblingRect | null {
  if (!siblings.length) return null;
  const containing = siblings.filter((item) => rectContains(item.rect, pointer));
  if (containing.length) {
    return containing.reduce((smallest, item) => {
      const area = item.rect.width * item.rect.height;
      const smallestArea = smallest.rect.width * smallest.rect.height;
      return area < smallestArea ? item : smallest;
    });
  }
  return siblings.reduce((best, item) => {
    const cx = (item.rect.left + item.rect.right) / 2;
    const cy = (item.rect.top + item.rect.bottom) / 2;
    const dist = (pointer.x - cx) ** 2 + (pointer.y - cy) ** 2;
    const bestCx = (best.rect.left + best.rect.right) / 2;
    const bestCy = (best.rect.top + best.rect.bottom) / 2;
    const bestDist = (pointer.x - bestCx) ** 2 + (pointer.y - bestCy) ** 2;
    return dist < bestDist ? item : best;
  });
}

export function sameCalculatedDrop(a: CalculatedDrop | null, b: CalculatedDrop | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.targetId === b.targetId &&
    a.parentId === b.parentId &&
    a.parentKind === b.parentKind &&
    a.edge === b.edge &&
    a.index === b.index
  );
}

export function dropIntoContainer(
  pointer: { x: number; y: number },
  container: SiblingRect,
  children: SiblingRect[],
  accepts: string[] = ELEMENT_ACCEPTS
): CalculatedDrop {
  if (!children.length) {
    return {
      targetId: container.id,
      parentId: container.id,
      parentKind: 'container',
      position: 'inside',
      index: 0,
      edge: 'inside',
      accepts,
    };
  }
  const insert = indexAlongAxis(pointer, children);
  return {
    targetId: insert?.targetId || container.id,
    parentId: container.id,
    parentKind: 'container',
    position: insert?.edge || 'after',
    index: insert?.index ?? children.length,
    edge: insert?.edge || 'after',
    accepts,
  };
}

export function refineElementDrop(
  drop: CalculatedDrop,
  pointer: { x: number; y: number },
  containers: SiblingRect[],
  elementsByContainer: Record<string, SiblingRect[]>
): CalculatedDrop {
  if (drop.parentKind === 'container' && (drop.edge === 'before' || drop.edge === 'after')) {
    return drop;
  }
  const hinted =
    drop.parentKind === 'container'
      ? containers.find((item) => item.id === drop.parentId) || closestSibling(pointer, containers)
      : closestSibling(pointer, containers);
  if (!hinted) return drop;
  return dropIntoContainer(pointer, hinted, elementsByContainer[hinted.id] || [], ELEMENT_ACCEPTS);
}

export function rankDroppableId(
  hitId: string,
  source: DropSource,
  activeId: string,
  descendantIds: Set<string> = new Set()
): number {
  if (hitId === activeId) return 1000;
  const parsed = parseDragId(hitId);
  if (!parsed) return 900;
  const sourceKind = sourceNodeKind(source);

  if (parsed.origin === 'drop') return 0;
  if (parsed.origin !== 'node' && parsed.origin !== 'layer') return 800;
  if (source.nodeId && parsed.nodeId === source.nodeId) return 1000;
  if (descendantIds.has(parsed.nodeId)) return 1000;
  if (parsed.kind === 'navbar' || parsed.kind === 'footer') return 1000;

  if (sourceKind === 'section' || source.kind === 'prebuilt') {
    if (parsed.kind === 'section') return 1;
    if (parsed.kind === 'page') return 2;
    return 1000;
  }
  if (sourceKind === 'container' || source.kind === 'container') {
    if (parsed.kind === 'container') return 1;
    if (parsed.kind === 'section') return 2;
    if (parsed.kind === 'page') return 3;
    return 1000;
  }
  if (parsed.kind === 'element') return 1;
  if (parsed.kind === 'container') return 2;
  if (parsed.kind === 'section') return 3;
  if (parsed.kind === 'page') return 4;
  return 800;
}

export function sortCanvasCollisions<T extends { id: string | number }>(
  hits: T[],
  rects: { get: (id: T['id']) => { width: number; height: number } | undefined },
  source: DropSource,
  activeId: string,
  descendantIds: Set<string> = new Set()
): T[] {
  return [...hits]
    .map((hit) => {
      const rect = rects.get(hit.id);
      const area = rect ? Math.max(1, rect.width) * Math.max(1, rect.height) : Number.POSITIVE_INFINITY;
      return {
        hit,
        rank: rankDroppableId(String(hit.id), source, activeId, descendantIds),
        area,
      };
    })
    .filter((entry) => entry.rank < 900)
    .sort((a, b) => a.rank - b.rank || a.area - b.area)
    .map((entry) => entry.hit);
}

function sourceChildType(source: DropSource): string {
  if (source.kind === 'section' || source.kind === 'prebuilt') return 'section';
  if (source.kind === 'container') return 'container';
  if (source.elementType) return source.elementType;
  return source.type || 'text';
}

function sourceNodeKind(source: DropSource): NodeKind | null {
  if (source.kind === 'prebuilt') return 'section';
  if (source.kind === 'section' || source.kind === 'container' || source.kind === 'element' || source.kind === 'page') {
    return source.kind;
  }
  if (source.elementType) return 'element';
  return null;
}

export function canDrop(sections: CanvasSection[], source: DropSource, target: DropOver | CalculatedDrop): boolean {
  if (source.locked) return false;
  if (source.kind === 'navbar' || source.kind === 'footer' || source.kind === 'page') return false;

  const parentKind = 'parentKind' in target ? target.parentKind : (target as DropOver).kind;
  const parentId = 'parentId' in target && 'edge' in target ? target.parentId : (target as DropOver).id;
  const childType = sourceChildType(source);

  if ('kind' in target && (target.kind === 'navbar' || target.kind === 'footer')) return false;
  if ('locked' in target && target.locked) return false;
  if (source.nodeId && parentId === source.nodeId) return false;
  if (source.nodeId && isDescendant(sections, source.nodeId, parentId)) return false;

  const edge = 'edge' in target ? target.edge : 'inside';
  const resolvedParentKind = edge === 'inside' && 'kind' in target ? target.kind : parentKind;
  const resolvedParentId = edge === 'inside' && 'id' in target ? target.id : parentId;

  if (source.kind === 'footer') return false;
  if (ELEMENT_ACCEPTS.includes(childType) && (resolvedParentKind === 'section' || resolvedParentKind === 'page' || resolvedParentKind === 'container')) {
    if (source.nodeId && isDescendant(sections, source.nodeId, resolvedParentId)) return false;
    return true;
  }

  if (source.nodeId) {
    const found = findNode(sections, source.nodeId);
    if (found?.node.locked) return false;
    if (found && isFreePositioned(found.node) && source.source === 'canvas') return false;
    const nodeKind = sourceNodeKind(source);
    if (nodeKind === 'section' || nodeKind === 'container' || nodeKind === 'element') {
      return validateMove(sections, source.nodeId, {
        parentId: resolvedParentId,
        parentKind: resolvedParentKind,
        index: 'index' in target ? target.index : 0,
      });
    }
  }

  return canAcceptChild(resolvedParentKind, childType);
}

export function calculateDropPosition(
  pointer: { x: number; y: number },
  over: DropOver,
  source: DropSource,
  extras?: { siblings?: SiblingRect[] }
): CalculatedDrop | null {
  if (over.kind === 'navbar' || over.kind === 'footer') return null;

  const childType = sourceChildType(source);
  const sourceKind = sourceNodeKind(source);
  const ratio = over.rect.height > 0 ? (pointer.y - over.rect.top) / over.rect.height : 0.5;
  const nearTop = ratio < 0.25;
  const beforeMid = ratio < 0.5;

  if (over.kind === 'page') {
    if (!canAcceptChild('page', childType) && childType !== 'text' && sourceKind !== 'element' && sourceKind !== 'container') {
      return null;
    }
    if (sourceKind === 'section' || childType === 'section' || source.kind === 'prebuilt') {
      return {
        targetId: over.id,
        parentId: over.id,
        parentKind: 'page',
        position: 'inside',
        index: over.childCount,
        edge: 'inside',
        accepts: ['section'],
      };
    }
    return {
      targetId: over.id,
      parentId: over.id,
      parentKind: 'page',
      position: 'inside',
      index: over.childCount,
      edge: 'inside',
      accepts: ['section'],
    };
  }

  if (over.kind === 'section') {
    if (sourceKind === 'section' || childType === 'section' || source.kind === 'prebuilt') {
      const edge: DropEdge = beforeMid ? 'before' : 'after';
      return {
        targetId: over.id,
        parentId: over.parentId,
        parentKind: 'page',
        position: edge,
        index: over.index,
        edge,
        accepts: ['section'],
      };
    }
    if (sourceKind === 'container' || source.kind === 'container') {
      if (nearTop && over.index > 0) {
        return {
          targetId: over.id,
          parentId: over.parentId,
          parentKind: 'page',
          position: 'before',
          index: over.index,
          edge: 'before',
          accepts: ['section'],
        };
      }
      return {
        targetId: over.id,
        parentId: over.id,
        parentKind: 'section',
        position: 'inside',
        index: over.childCount,
        edge: 'inside',
        accepts: ['container'],
      };
    }
    return {
      targetId: over.id,
      parentId: over.id,
      parentKind: 'section',
      position: 'inside',
      index: 0,
      edge: 'inside',
      accepts: ['container', ...ELEMENT_ACCEPTS],
    };
  }

  if (over.kind === 'container') {
    if (sourceKind === 'container') {
      const edge: DropEdge = beforeMid ? 'before' : 'after';
      return {
        targetId: over.id,
        parentId: over.parentId,
        parentKind: 'section',
        position: edge,
        index: over.index,
        edge,
        accepts: ['container'],
      };
    }
    if (sourceKind === 'section') return null;
    if (extras?.siblings?.length) {
      return dropIntoContainer(pointer, { id: over.id, index: over.index, rect: over.rect }, extras.siblings);
    }
    if (nearTop) {
      return {
        targetId: over.id,
        parentId: over.id,
        parentKind: 'container',
        position: 'inside',
        index: 0,
        edge: 'inside',
        accepts: ELEMENT_ACCEPTS,
      };
    }
    return {
      targetId: over.id,
      parentId: over.id,
      parentKind: 'container',
      position: 'inside',
      index: over.childCount,
      edge: 'inside',
      accepts: ELEMENT_ACCEPTS,
    };
  }

  if (over.kind === 'element') {
    if (sourceKind === 'section' || sourceKind === 'container') return null;
    const edge: DropEdge = beforeMid ? 'before' : 'after';
    return {
      targetId: over.id,
      parentId: over.parentId,
      parentKind: 'container',
      position: edge,
      index: over.index,
      edge,
      accepts: ELEMENT_ACCEPTS,
    };
  }

  return null;
}

export function calculatedDropToTarget(drop: CalculatedDrop): DropTarget {
  return {
    parentId: drop.parentId,
    parentKind: drop.parentKind,
    index: drop.index,
    edge: drop.edge,
    accepts: drop.accepts,
  };
}

export function dropLabel(drop: CalculatedDrop, valid = true): string {
  if (!valid) return 'Cannot drop here';
  if (drop.edge === 'inside') return 'Drop here';
  if (drop.parentKind === 'page') return 'Drop section here';
  if (drop.parentKind === 'section') return 'Drop container here';
  return 'Drop here';
}
