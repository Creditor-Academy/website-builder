import { createContext, useContext, type MutableRefObject } from 'react';
import type { DeviceId } from '@/builder/types';
import type { AlignmentGuide } from './guides';
import type { Box } from './resize';

export interface ResizePreview {
  nodeId: string;
  box: Box;
}

export interface LiveGeometry {
  left: number;
  top: number;
  width?: number;
  height?: number;
  rotation?: number;
}

export interface CanvasEngineValue {
  previewMode: boolean;
  hoveredNodeId: string | null;
  setHoveredNodeId: (id: string | null) => void;
  editingNodeId: string | null;
  setEditingNodeId: (id: string | null) => void;
  viewportRef: MutableRefObject<HTMLDivElement | null>;
  frameRef: MutableRefObject<HTMLDivElement | null>;
  overlayRef: MutableRefObject<HTMLDivElement | null>;
  scalerRef: MutableRefObject<HTMLDivElement | null>;
  zoom: number;
  device: DeviceId;
  resizePreview: ResizePreview | null;
  setResizePreview: (value: ResizePreview | null) => void;
  guides: AlignmentGuide[];
  setGuides: (guides: AlignmentGuide[]) => void;
  interacting: boolean;
  setInteracting: (value: boolean) => void;
  clickSuppressRef: MutableRefObject<boolean>;
  liveGeometryRef: MutableRefObject<Record<string, LiveGeometry>>;
}

export const CanvasEngineContext = createContext<CanvasEngineValue | null>(null);

export function useCanvasEngine() {
  const value = useContext(CanvasEngineContext);
  if (!value) {
    throw new Error('useCanvasEngine must be used inside CanvasEngine');
  }
  return value;
}

export function useCanvasEngineOptional() {
  return useContext(CanvasEngineContext);
}
