import { memo } from 'react';
import type { CSSProperties } from 'react';
import { CanvasElementView } from '@/builder/components/CanvasPrimitives';
import type { CanvasElement } from '@/builder/types';

export const CanvasElementRenderer = memo(function CanvasElementRenderer({
  element,
  css,
  editing = false,
  editingCanvas = false,
  onSaveText,
  onCancelEdit,
}: {
  element: CanvasElement;
  css: CSSProperties;
  editing?: boolean;
  editingCanvas?: boolean;
  onSaveText?: (html: string) => void;
  onCancelEdit?: () => void;
}) {
  return (
    <CanvasElementView
      element={element}
      css={css}
      editing={editing}
      editingCanvas={editingCanvas}
      onSaveText={onSaveText}
      onCancelEdit={onCancelEdit}
    />
  );
});
