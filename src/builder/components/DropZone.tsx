import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { NodeKind } from '@/builder/types';
import { dropZoneId, type DropZoneData } from '@/builder/dnd';
import { useCanvasDndState } from './CanvasDndContext';

interface DropZoneProps {
  parentId: string;
  parentKind: NodeKind;
  index: number;
  edge: 'before' | 'after' | 'inside';
  accepts: string[];
  label?: string;
  empty?: boolean;
}

export function DropZone({ parentId, parentKind, index, edge, accepts, label, empty }: DropZoneProps) {
  const { isDragging } = useCanvasDndState();
  const id = dropZoneId(parentKind, parentId, index, edge);
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'dropzone',
      target: { parentId, parentKind, index, edge, accepts },
    } satisfies DropZoneData,
    disabled: !isDragging,
  });

  if (!isDragging && !empty) return null;

  const showLine = isDragging && isOver && !empty;
  const showEmpty = empty;

  return (
    <div
      ref={setNodeRef}
      data-drop-parent={parentId}
      data-drop-kind={parentKind}
      data-drop-index={index}
      data-drop-edge={edge}
      data-drop-accepts={accepts.join(',')}
      aria-hidden={!isDragging}
      className={cn(
        'select-none',
        showEmpty
          ? cn(
              'flex min-h-[72px] items-center justify-center rounded-lg border border-dashed text-[11px] font-medium',
              isOver
                ? 'border-sky-400 bg-sky-50 text-sky-700'
                : 'border-slate-200 bg-slate-50/70 text-slate-400'
            )
          : cn(
              'pointer-events-auto relative z-10 mx-2 rounded-full',
              isDragging ? 'h-3 -my-0.5' : 'h-0',
              showLine && 'bg-sky-500'
            )
      )}
    >
      {showEmpty ? (isOver ? 'Drop here' : label || 'Drop elements here') : null}
      {showLine && parentKind === 'page' && (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 border-t-2 border-dashed border-[#0F172A] bg-white/90 py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-[#0F172A]">
          Drop section here
        </div>
      )}
    </div>
  );
}
