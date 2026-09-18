export function preserveNavbarFlowSlot(node: HTMLElement) {
  if (node.dataset.canvasNode !== 'navbar') return 0;
  const slot = node.previousElementSibling as HTMLElement | null;
  if (!slot?.hasAttribute('data-navbar-slot')) return node.offsetHeight;
  const existing = parseFloat(slot.style.height || '') || 0;
  if (existing > 0) return existing;
  const height = node.offsetHeight;
  if (height > 0) slot.style.height = `${Math.round(height)}px`;
  return height;
}

export function readNavbarFlowHeight(styles?: { flowHeight?: string | number } | null) {
  const node = typeof document === 'undefined' ? null : (document.querySelector('[data-canvas-node="navbar"]') as HTMLElement | null);
  const slot = node?.previousElementSibling?.hasAttribute('data-navbar-slot') ? (node.previousElementSibling as HTMLElement) : null;
  return Math.round(
    parseFloat(slot?.style.height || '') ||
      node?.offsetHeight ||
      parseFloat(String(styles?.flowHeight || '')) ||
      0
  );
}
