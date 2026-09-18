import type { OverlayBox } from './useOverlayBox';

export const TRANSFORM_HANDLE_SIZE = 32;
export const TRANSFORM_HANDLE_GAP = 12;
export const TRANSFORM_HANDLE_OFFSET_Y = 10;

export function bottomHandlePositions(box: OverlayBox): {
  rotate: { left: number; top: number };
  move: { left: number; top: number };
} {
  const midX = box.left + box.width / 2;
  const top = box.top + box.height + TRANSFORM_HANDLE_OFFSET_Y;
  const spread = TRANSFORM_HANDLE_SIZE / 2 + TRANSFORM_HANDLE_GAP / 2;
  return {
    rotate: { left: midX - spread, top },
    move: { left: midX + spread, top },
  };
}
