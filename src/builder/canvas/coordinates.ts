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
