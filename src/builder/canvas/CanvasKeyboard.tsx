import { useEffect } from 'react';
import useBuilderStore from '@/store/useBuilderStore';
import { getKeyboardNeighbor } from '@/builder/tree';
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
      const { editor, undo, redo, selectNode, deleteCanvasNode, duplicateCanvasNode, copyCanvasNode, pasteCanvasNode } = store;
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
        if (selectedId) duplicateCanvasNode(selectedId);
        return;
      }
      if (meta && event.key.toLowerCase() === 'c') {
        event.preventDefault();
        copyCanvasNode(selectedId);
        return;
      }
      if (meta && event.key.toLowerCase() === 'v') {
        event.preventDefault();
        pasteCanvasNode();
        return;
      }
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId) {
        event.preventDefault();
        deleteCanvasNode(selectedId);
        return;
      }
      if (event.key === 'Escape') {
        selectNode(null);
        setEditingNodeId(null);
        return;
      }
      if (selectedId && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        const page = store.getActivePage();
        if (!page) return;
        const next = getKeyboardNeighbor(normalizePageSections(page.sections, page.id), selectedId, event.key);
        if (next) {
          event.preventDefault();
          selectNode(next.id, next.kind);
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editingNodeId, previewMode, setEditingNodeId]);

  return null;
}
