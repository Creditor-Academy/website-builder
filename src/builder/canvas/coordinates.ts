export interface ViewportMetrics {
  zoom: number;
  canvasLeft: number;
  canvasTop: number;
  scrollLeft: number;
  scrollTop: number;
  deviceWidth: number;
}

export interface Point {
  x: number;
  y: number;
}

export function zoomFactor(zoomPercent: number): number {
  return Math.max(0.25, Math.min(2, (zoomPercent || 100) / 100));
}

export function screenToCanvas(clientX: number, clientY: number, metrics: ViewportMetrics): Point {
  const zoom = metrics.zoom || 1;
  return {
    x: (clientX - metrics.canvasLeft) / zoom,
    y: (clientY - metrics.canvasTop) / zoom,
  };
}

export function canvasToScreen(x: number, y: number, metrics: ViewportMetrics): Point {
  const zoom = metrics.zoom || 1;
  return {
    x: metrics.canvasLeft + x * zoom,
    y: metrics.canvasTop + y * zoom,
  };
}

export function clientDeltaToCanvas(deltaX: number, deltaY: number, zoomPercent: number): Point {
  const zoom = zoomFactor(zoomPercent);
  return { x: deltaX / zoom, y: deltaY / zoom };
}

export function clientPointInElement(clientX: number, clientY: number, element: HTMLElement, zoomPercent: number): Point {
  const rect = element.getBoundingClientRect();
  const zoom = zoomFactor(zoomPercent);
  return {
    x: (clientX - rect.left) / zoom,
    y: (clientY - rect.top) / zoom,
  };
}

export function metricsFromFrame(
  frame: Pick<DOMRect, 'left' | 'top' | 'width'>,
  zoomPercent: number,
  deviceWidth: number,
  scroll?: { scrollLeft: number; scrollTop: number }
): ViewportMetrics {
  return {
    zoom: zoomFactor(zoomPercent),
    canvasLeft: frame.left,
    canvasTop: frame.top,
    scrollLeft: scroll?.scrollLeft || 0,
    scrollTop: scroll?.scrollTop || 0,
    deviceWidth,
  };
}

export interface OverlaySpace {
  parent: {
    left: number;
    top: number;
    width: number;
    height: number;
    offsetWidth: number;
    offsetHeight: number;
    clientLeft?: number;
    clientTop?: number;
  };
  overlay: { left: number; top: number };
}

export function overlaySpaceFromElements(parent: HTMLElement, overlay: HTMLElement): OverlaySpace {
  const parentRect = parent.getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();
  return {
    parent: {
      left: parentRect.left,
      top: parentRect.top,
      width: parentRect.width,
      height: parentRect.height,
      offsetWidth: parent.offsetWidth,
      offsetHeight: parent.offsetHeight,
      clientLeft: parent.clientLeft,
      clientTop: parent.clientTop,
    },
    overlay: { left: overlayRect.left, top: overlayRect.top },
  };
}

export function parentLocalToOverlay(local: number, axis: 'x' | 'y', space: OverlaySpace): number {
  const { parent, overlay } = space;
  if (axis === 'x') {
    const scale = parent.offsetWidth ? parent.width / parent.offsetWidth : 1;
    return parent.left - overlay.left + ((parent.clientLeft || 0) + local) * scale;
  }
  const scale = parent.offsetHeight ? parent.height / parent.offsetHeight : 1;
  return parent.top - overlay.top + ((parent.clientTop || 0) + local) * scale;
}

export function rectToParentLocal(
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
  parent: OverlaySpace['parent']
): { x: number; y: number; width: number; height: number } {
  const scaleX = parent.offsetWidth ? parent.width / parent.offsetWidth : 1;
  const scaleY = parent.offsetHeight ? parent.height / parent.offsetHeight : 1;
  return {
    x: scaleX ? (rect.left - parent.left) / scaleX - (parent.clientLeft || 0) : 0,
    y: scaleY ? (rect.top - parent.top) / scaleY - (parent.clientTop || 0) : 0,
    width: scaleX ? rect.width / scaleX : rect.width,
    height: scaleY ? rect.height / scaleY : rect.height,
  };
}
