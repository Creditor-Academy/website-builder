import { cn } from '@/lib/utils';
import type { NodeKind } from '@/builder/types';

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
  return (
    <div
      data-drop-parent={parentId}
      data-drop-kind={parentKind}
      data-drop-index={index}
      data-drop-edge={edge}
      data-drop-accepts={accepts.join(',')}
      className={cn(
        'pointer-events-none select-none transition-all',
        empty
          ? 'min-h-[72px] rounded-lg border border-dashed border-sky-300/80 bg-sky-50/50 flex items-center justify-center text-[11px] font-medium text-sky-700/80'
          : 'h-1.5 mx-2 rounded-full bg-transparent data-[active=true]:bg-sky-500'
      )}
    >
      {empty ? label || 'Drop elements here' : null}
    </div>
  );
}
