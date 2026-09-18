import { useEffect } from 'react';
import useBuilderStore from '@/store/useBuilderStore';
import { findNode, getFreePosition, isFreePositioned } from '@/builder/tree';
import { normalizePageSections } from '@/builder/adapter';
import { useCanvasEngine } from './CanvasEngineContext';

function isTypingTarget(target: EventTarget | null) {
  const node = target as HTMLElement | null;
  if (!node) return false;
  return Boolean(node.closest("input, textarea, select, [contenteditable='true']"));
}

export function CanvasKeyboard() {
  const { previewMode, editingNodeId, setEditingNodeId } = useCanvasEngine();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (previewMode) return;
      if (isTypingTarget(event.target) || editingNodeId) {
        if (event.key === 'Escape' && editingNodeId) {
          event.preventDefault();
          setEditingNodeId(null);
        }
        return;
      }

      const store = useBuilderStore.getState();
      const { editor, undo, redo, selectNode, deleteCanvasNode, deleteCanvasNodes, duplicateCanvasNode, duplicateCanvasNodes, copyCanvasNode, pasteCanvasNode, shiftCanvasLayer } = store;
      const selectedIds = editor.selectedNodeIds?.length ? editor.selectedNodeIds : editor.selectedNodeId ? [editor.selectedNodeId] : [];
      const selectedId = editor.selectedNodeId;
      const meta = event.metaKey || event.ctrlKey;

      if (meta && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }
      if (meta && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
        return;
      }
      if (meta && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        if (selectedIds.length > 1) duplicateCanvasNodes(selectedIds);
        else if (selectedId) duplicateCanvasNode(selectedId);
        return;
      }
      if (meta && event.key.toLowerCase() === 'c') {
        event.preventDefault();
        copyCanvasNode();
        return;
      }
      if (meta && event.key.toLowerCase() === 'v') {
        event.preventDefault();
        pasteCanvasNode();
        return;
      }
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedIds.length) {
        event.preventDefault();
        if (selectedIds.length > 1) deleteCanvasNodes(selectedIds);
        else deleteCanvasNode(selectedIds[0]);
        return;
      }
      if (event.key === 'Escape') {
        selectNode(null);
        setEditingNodeId(null);
        return;
      }
      if ((event.key === ']' || event.key === '[') && selectedId) {
        event.preventDefault();
        const action = event.key === ']'
          ? (meta ? 'front' : 'forward')
          : (meta ? 'back' : 'backward');
        shiftCanvasLayer(selectedId, action);
        return;
      }
      if ((event.key === 'a' || event.key === 'A') && meta) {
        event.preventDefault();
        const page = store.getActivePage();
        if (!page) return;
        const sections = normalizePageSections(page.sections, page.id);
        const ids: string[] = [];
        for (const section of sections) {
          for (const container of section.children || []) {
            if (container.properties?.placement === 'absolute' || container.styles?.position === 'absolute') ids.push(container.id);
            for (const element of container.children || []) ids.push(element.id);
          }
        }
        if (ids.length) store.selectNodes(ids);
        return;
      }
      if (selectedIds.length && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        const page = store.getActivePage();
        if (!page) return;
        const sections = normalizePageSections(page.sections, page.id);
        const step = event.shiftKey ? 10 : 1;
        const dx = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;
        const dy = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0;
        const items = selectedIds.flatMap((id) => {
          if (id === 'navbar' && page.navbar) {
            const navStyles = (page.navbar.styles || {}) as { left?: string; top?: string };
            const x = parseFloat(String(navStyles.left || 0)) || 0;
            const y = parseFloat(String(navStyles.top || 0)) || 0;
            return [{ id, position: { x: x + dx, y: y + dy } }];
          }
          const found = findNode(sections, id);
          if (!found || found.node.locked || !isFreePositioned(found.node)) return [];
          const current = getFreePosition(found.node);
          return [{ id, position: { ...current, x: current.x + dx, y: current.y + dy } }];
        });
        if (items.length) {
          event.preventDefault();
          store.updateFreePositions(items);
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editingNodeId, previewMode, setEditingNodeId]);

  return null;
}
