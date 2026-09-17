import type { OverlayBox } from './useOverlayBox';

export const TOOLBAR_GAP = 8;

export function toolbarPosition(box: OverlayBox): { left: number; top: number; transform: string } {
  return {
    left: box.left + box.width / 2,
    top: box.top - TOOLBAR_GAP,
    transform: 'translate(-50%, -100%)',
  };
}
