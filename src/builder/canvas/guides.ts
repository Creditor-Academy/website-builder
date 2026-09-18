export interface GuideBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AlignmentGuide {
  axis: 'x' | 'y';
  position: number;
  type: 'left' | 'right' | 'center' | 'top' | 'bottom' | 'middle';
}

const SNAP_THRESHOLD = 6;

export function snapValue(value: number, targets: number[], threshold = SNAP_THRESHOLD): { value: number; snapped: number | null } {
  let best: number | null = null;
  let bestDist = threshold;
  for (const target of targets) {
    const dist = Math.abs(value - target);
    if (dist <= bestDist) {
      best = target;
      bestDist = dist;
    }
  }
  return { value: best == null ? value : best, snapped: best };
}

export function snapToGrid(value: number, grid = 8): number {
  return Math.round(value / grid) * grid;
}

export function computeAlignmentGuides(
  moving: GuideBox,
  others: GuideBox[],
  container?: GuideBox,
  options?: { snapToGrid?: boolean; grid?: number }
): { x: number; y: number; guides: AlignmentGuide[] } {
  const guides: AlignmentGuide[] = [];
  const movingCenterX = moving.x + moving.width / 2;
  const movingCenterY = moving.y + moving.height / 2;
  const movingRight = moving.x + moving.width;
  const movingBottom = moving.y + moving.height;

  const xTargets: Array<{ value: number; type: AlignmentGuide['type']; apply: (snapped: number) => number }> = [];
  const yTargets: Array<{ value: number; type: AlignmentGuide['type']; apply: (snapped: number) => number }> = [];

  const addBox = (box: GuideBox) => {
    xTargets.push(
      { value: box.x, type: 'left', apply: (snapped) => snapped },
      { value: box.x + box.width, type: 'right', apply: (snapped) => snapped - moving.width },
      { value: box.x + box.width / 2, type: 'center', apply: (snapped) => snapped - moving.width / 2 }
    );
    yTargets.push(
      { value: box.y, type: 'top', apply: (snapped) => snapped },
      { value: box.y + box.height, type: 'bottom', apply: (snapped) => snapped - moving.height },
      { value: box.y + box.height / 2, type: 'middle', apply: (snapped) => snapped - moving.height / 2 }
    );
  };

  for (const box of others) {
    if (box.id === moving.id) continue;
    addBox(box);
  }
  if (container) addBox(container);

  let nextX = moving.x;
  let nextY = moving.y;

  const leftSnap = snapValue(moving.x, xTargets.filter((item) => item.type === 'left').map((item) => item.value));
  const rightSnap = snapValue(movingRight, xTargets.filter((item) => item.type === 'right').map((item) => item.value));
  const centerSnap = snapValue(movingCenterX, xTargets.filter((item) => item.type === 'center').map((item) => item.value));
  const topSnap = snapValue(moving.y, yTargets.filter((item) => item.type === 'top').map((item) => item.value));
  const bottomSnap = snapValue(movingBottom, yTargets.filter((item) => item.type === 'bottom').map((item) => item.value));
  const middleSnap = snapValue(movingCenterY, yTargets.filter((item) => item.type === 'middle').map((item) => item.value));

  if (centerSnap.snapped != null) {
    nextX = centerSnap.snapped - moving.width / 2;
    guides.push({ axis: 'x', position: centerSnap.snapped, type: 'center' });
  } else if (leftSnap.snapped != null) {
    nextX = leftSnap.snapped;
    guides.push({ axis: 'x', position: leftSnap.snapped, type: 'left' });
  } else if (rightSnap.snapped != null) {
    nextX = rightSnap.snapped - moving.width;
    guides.push({ axis: 'x', position: rightSnap.snapped, type: 'right' });
  }

  if (middleSnap.snapped != null) {
    nextY = middleSnap.snapped - moving.height / 2;
    guides.push({ axis: 'y', position: middleSnap.snapped, type: 'middle' });
  } else if (topSnap.snapped != null) {
    nextY = topSnap.snapped;
    guides.push({ axis: 'y', position: topSnap.snapped, type: 'top' });
  } else if (bottomSnap.snapped != null) {
    nextY = bottomSnap.snapped - moving.height;
    guides.push({ axis: 'y', position: bottomSnap.snapped, type: 'bottom' });
  }

  if (options?.snapToGrid && !guides.length) {
    nextX = snapToGrid(nextX, options.grid);
    nextY = snapToGrid(nextY, options.grid);
  }

  return { x: nextX, y: nextY, guides };
}
