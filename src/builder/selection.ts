import { findNode } from './tree';
import type { CanvasSection, NodeKind } from './types';

export type SelectMode = 'replace' | 'add' | 'toggle';

export const MARQUEE_THRESHOLD = 4;
export const DRAG_THRESHOLD = 6;

export interface SelectionRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function pointerSelectMode(event: { shiftKey: boolean; metaKey: boolean; ctrlKey: boolean }): SelectMode {
  return event.shiftKey || event.metaKey || event.ctrlKey ? 'toggle' : 'replace';
}

export function isMultiSelectableKind(kind: string | null | undefined): boolean {
  return kind === 'element' || kind === 'container';
}

export function selectionCanJoin(existingKind: string | null | undefined, nextKind: string | null | undefined, existingCount: number): boolean {
  if (existingCount <= 0) return true;
  return isMultiSelectableKind(existingKind) && isMultiSelectableKind(nextKind);
}

export function nextSelectedIds(
  current: string[],
  id: string | null,
  mode: SelectMode,
  canJoin = true
): string[] {
  if (!id) return [];
  if (mode === 'replace' || !canJoin) return [id];
  if (mode === 'add') return current.includes(id) ? current : [...current, id];
  return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
}

export function selectedIdsOf(editor: { selectedNodeId?: string | null; selectedNodeIds?: string[] }): string[] {
  if (editor.selectedNodeIds?.length) return editor.selectedNodeIds;
  return editor.selectedNodeId ? [editor.selectedNodeId] : [];
}

export function rectsIntersect(a: SelectionRect, b: SelectionRect): boolean {
  return a.left < b.left + b.width && a.left + a.width > b.left && a.top < b.top + b.height && a.top + a.height > b.top;
}

export function normalizeMarqueeBox(x0: number, y0: number, x1: number, y1: number): SelectionRect {
  const left = Math.min(x0, x1);
  const top = Math.min(y0, y1);
  return { left, top, width: Math.abs(x1 - x0), height: Math.abs(y1 - y0) };
}

export function unionRects(rects: SelectionRect[]): SelectionRect | null {
  if (!rects.length) return null;
  const left = Math.min(...rects.map((rect) => rect.left));
  const top = Math.min(...rects.map((rect) => rect.top));
  const right = Math.max(...rects.map((rect) => rect.left + rect.width));
  const bottom = Math.max(...rects.map((rect) => rect.top + rect.height));
  return { left, top, width: right - left, height: bottom - top };
}

export function pruneNestedSelection(sections: CanvasSection[], ids: string[]): string[] {
  const selected = new Set(ids);
  return ids.filter((id) => {
    const found = findNode(sections, id);
    if (!found) return false;
    let parentId = found.node.parentId;
    while (parentId) {
      if (selected.has(parentId)) return false;
      parentId = findNode(sections, parentId)?.node.parentId || null;
    }
    return true;
  });
}

export function resolveNodeKind(sections: CanvasSection[], id: string, fallback: NodeKind | null = null): NodeKind | null {
  if (id === 'navbar' || id.startsWith('navbar-')) return 'navbar';
  if (id === 'footer') return 'footer';
  return findNode(sections, id)?.kind || fallback;
}
