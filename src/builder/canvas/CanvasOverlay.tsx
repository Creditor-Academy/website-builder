import { CanvasDrop } from './CanvasDrop';
import { CanvasGuides } from './CanvasGuides';
import { CanvasResize } from './CanvasResize';
import { CanvasRotate } from './CanvasRotate';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasSelection } from './CanvasSelection';
import { CanvasMarquee } from './CanvasMarquee';
import { CanvasContextMenu } from './CanvasContextMenu';
import { CanvasHeightHandle } from './CanvasHeightHandle';
import { useCanvasEngine } from './CanvasEngineContext';

export function CanvasOverlay() {
  const { overlayRef, previewMode } = useCanvasEngine();
  if (previewMode) return null;
  return (
    <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-50 overflow-visible">
      <CanvasSelection />
      <CanvasMarquee />
      <CanvasDrop />
      <CanvasGuides />
      <CanvasResize />
      <CanvasRotate />
      <CanvasToolbar />
      <CanvasHeightHandle />
      <CanvasContextMenu />
    </div>
  );
}
