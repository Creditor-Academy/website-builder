import { createContext, useContext } from 'react';
import type { BuilderDragData } from '@/builder/dnd';

export interface CanvasDndState {
  isDragging: boolean;
  active: BuilderDragData | null;
}

export const CanvasDndContext = createContext<CanvasDndState>({ isDragging: false, active: null });

export function useCanvasDndState() {
  return useContext(CanvasDndContext);
}
