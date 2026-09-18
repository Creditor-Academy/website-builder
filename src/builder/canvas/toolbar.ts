import type { OverlayBox } from './useOverlayBox';

export const TOOLBAR_GAP = 8;
const TOOLBAR_WIDTH = 220;
const TOP_SAFE = 8;

export function toolbarPosition(
  box: OverlayBox,
  viewport?: { width: number; height: number } | null
): { left: number; top: number; transform: string } {
  let left = box.left + box.width / 2;
  let top = box.top - TOOLBAR_GAP;
  let transform = 'translate(-50%, -100%)';

  if (viewport) {
    const minLeft = TOOLBAR_WIDTH / 2 + 8;
    const maxLeft = Math.max(minLeft, viewport.width - TOOLBAR_WIDTH / 2 - 8);
    left = Math.min(Math.max(left, minLeft), maxLeft);
    if (top < TOP_SAFE) {
      top = Math.max(TOP_SAFE, box.top + TOOLBAR_GAP);
      transform = 'translate(-50%, 0)';
    }
  }

  return { left, top, transform };
}
