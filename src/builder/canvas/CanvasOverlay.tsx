import { CanvasDrop } from './CanvasDrop';
import { CanvasGuides } from './CanvasGuides';
import { CanvasResize } from './CanvasResize';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasSelection } from './CanvasSelection';
import { useCanvasEngine } from './CanvasEngineContext';

export function CanvasOverlay() {
  const { overlayRef, previewMode } = useCanvasEngine();
  if (previewMode) return null;
  return (
    <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-30 overflow-visible">
      <CanvasSelection />
      <CanvasDrop />
      <CanvasGuides />
      <CanvasResize />
      <CanvasToolbar />
    </div>
  );
}
