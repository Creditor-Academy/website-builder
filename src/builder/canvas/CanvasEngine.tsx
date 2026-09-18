import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import useBuilderStore from '@/store/useBuilderStore';
import type { AlignmentGuide } from './guides';
import { CanvasEngineContext, type CanvasEngineValue, type LiveGeometry, type ResizePreview } from './CanvasEngineContext';

export function CanvasEngine({ children }: { children: ReactNode }) {
  const previewMode = useBuilderStore((state) => state.editor.previewMode);
  const zoom = useBuilderStore((state) => state.editor.zoom);
  const device = useBuilderStore((state) => state.editor.device);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [resizePreview, setResizePreview] = useState<ResizePreview | null>(null);
  const [guides, setGuides] = useState<AlignmentGuide[]>([]);
  const [interacting, setInteracting] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const scalerRef = useRef<HTMLDivElement | null>(null);
  const liveGeometryRef = useRef<Record<string, LiveGeometry>>({});
  const clickSuppressRef = useRef(false);

  const setHover = useCallback((id: string | null) => {
    setHoveredNodeId(id);
  }, []);

  const value = useMemo<CanvasEngineValue>(
    () => ({
      previewMode,
      hoveredNodeId,
      setHoveredNodeId: setHover,
      editingNodeId,
      setEditingNodeId,
      viewportRef,
      frameRef,
      overlayRef,
      scalerRef,
      zoom: zoom || 100,
      device: device || 'desktop',
      resizePreview,
      setResizePreview,
      guides,
      setGuides,
      interacting,
      setInteracting,
      liveGeometryRef,
      clickSuppressRef,
    }),
    [previewMode, hoveredNodeId, setHover, editingNodeId, zoom, device, resizePreview, guides, interacting]
  );

  return <CanvasEngineContext.Provider value={value}>{children}</CanvasEngineContext.Provider>;
}
