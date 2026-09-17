import { createContext, useContext } from 'react';
import type { BuilderDragData } from '@/builder/dnd';
import type { CalculatedDrop } from '@/builder/canvas/drop';

export interface CanvasDndState {
  isDragging: boolean;
  active: BuilderDragData | null;
  dropIndicator: CalculatedDrop | null;
}

export const CanvasDndContext = createContext<CanvasDndState>({
  isDragging: false,
  active: null,
  dropIndicator: null,
});

export function useCanvasDndState() {
  return useContext(CanvasDndContext);
}
