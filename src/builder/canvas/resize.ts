import type { ElementType, NodeKind } from '../types';

export type ResizeHandle =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left';

export interface ResizeConfig {
  handles: ResizeHandle[];
  aspectRatio: boolean;
  minWidth: number;
  minHeight: number;
  lockHeight?: boolean;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ALL_HANDLES: ResizeHandle[] = [
  'top-left',
  'top',
  'top-right',
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
  'left',
];

const DEFAULT_CONFIG: ResizeConfig = {
  handles: ['left', 'right', 'bottom', 'bottom-right'],
  aspectRatio: false,
  minWidth: 24,
  minHeight: 16,
};

export const RESIZE_BY_TYPE: Record<string, ResizeConfig> = {
  image: { handles: ALL_HANDLES, aspectRatio: true, minWidth: 40, minHeight: 40 },
  video: { handles: ALL_HANDLES, aspectRatio: true, minWidth: 120, minHeight: 80 },
  button: { handles: ['left', 'right'], aspectRatio: false, minWidth: 48, minHeight: 32 },
  icon: { handles: ALL_HANDLES, aspectRatio: true, minWidth: 16, minHeight: 16 },
  container: { handles: ALL_HANDLES, aspectRatio: false, minWidth: 80, minHeight: 40 },
  section: { handles: ['bottom'], aspectRatio: false, minWidth: 120, minHeight: 80 },
  html: { handles: ALL_HANDLES, aspectRatio: false, minWidth: 80, minHeight: 40 },
  gallery: { handles: ['left', 'right', 'bottom', 'bottom-right'], aspectRatio: false, minWidth: 120, minHeight: 80 },
};

export function getResizeConfig(kind: NodeKind, type?: ElementType | string, freePosition = false): ResizeConfig {
  if (freePosition) {
    return { handles: ALL_HANDLES, aspectRatio: type === 'image' || type === 'icon', minWidth: 16, minHeight: 16 };
  }
  if (kind === 'navbar') return { handles: ALL_HANDLES, aspectRatio: false, minWidth: 200, minHeight: 48 };
  if (kind === 'section') return RESIZE_BY_TYPE.section;
  if (kind === 'container') return RESIZE_BY_TYPE.container;
  if (type && RESIZE_BY_TYPE[type]) return RESIZE_BY_TYPE[type];
  if (kind === 'element') return DEFAULT_CONFIG;
  return { handles: [], aspectRatio: false, minWidth: 1, minHeight: 1 };
}

export function applyResizeDelta(
  start: Box,
  handle: ResizeHandle,
  delta: { x: number; y: number },
  config: ResizeConfig
): Box {
  let width = start.width;
  let height = start.height;
  const ratio = start.width / Math.max(1, start.height);

  if (handle.includes('right')) width += delta.x;
  if (handle.includes('left')) width -= delta.x;
  if (handle.includes('bottom') && !config.lockHeight) height += delta.y;
  if (handle.includes('top') && !config.lockHeight) height -= delta.y;

  if (config.aspectRatio) {
    if (handle === 'left' || handle === 'right') {
      height = width / ratio;
    } else if (handle === 'top' || handle === 'bottom') {
      width = height * ratio;
    } else {
      height = width / ratio;
    }
  }

  width = Math.max(config.minWidth, width);
  height = Math.max(config.minHeight, height);

  if (config.aspectRatio) {
    if (handle === 'left' || handle === 'right') {
      height = Math.max(config.minHeight, width / ratio);
    } else if (handle === 'top' || handle === 'bottom') {
      width = Math.max(config.minWidth, height * ratio);
    } else {
      height = Math.max(config.minHeight, width / ratio);
      width = Math.max(config.minWidth, height * ratio);
    }
  }

  const x = handle.includes('left') ? start.x + start.width - width : start.x;
  const y = handle.includes('top') ? start.y + start.height - height : start.y;

  return { x, y, width, height };
}

export function boxToStylePatch(
  box: Box,
  kind: NodeKind,
  freePosition: boolean
): Record<string, string | number> {
  if (freePosition) {
    return {
      width: `${Math.round(box.width)}px`,
      height: `${Math.round(box.height)}px`,
      left: `${Math.round(box.x)}px`,
      top: `${Math.round(box.y)}px`,
    };
  }
  if (kind === 'section') {
    return { minHeight: `${Math.round(box.height)}px` };
  }
  if (kind === 'button') {
    return { width: `${Math.round(box.width)}px` };
  }
  return {
    width: `${Math.round(box.width)}px`,
    height: `${Math.round(box.height)}px`,
  };
}
