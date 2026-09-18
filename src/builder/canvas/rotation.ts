export function rotationDelta(
  center: { x: number; y: number },
  start: { x: number; y: number },
  current: { x: number; y: number }
): number {
  const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
  const currentAngle = Math.atan2(current.y - center.y, current.x - center.x);
  return ((currentAngle - startAngle) * 180) / Math.PI;
}

export function normalizeRotation(deg: number): number {
  let next = deg % 360;
  if (next > 180) next -= 360;
  if (next <= -180) next += 360;
  return Math.round(next);
}

export function snapRotation(deg: number, shiftKey = false): number {
  const normalized = normalizeRotation(deg);
  if (!shiftKey) return normalized;
  return Math.round(normalized / 15) * 15;
}

export function parseRotation(transform?: string | null): number {
  if (!transform) return 0;
  const match = transform.match(/rotate\(([-\d.]+)deg\)/);
  return match ? normalizeRotation(Number(match[1])) : 0;
}
