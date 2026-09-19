export const SECTION_PLANES = {
  background: 0,
  behind: 5,
  content: 10,
  above: 20,
} as const;

export type LayerPlane = 'behind' | 'above';

export type LayeredComponent = {
  id?: string;
  plane?: LayerPlane | string;
  layer?: number;
  style?: { zIndex?: number | string };
};

export function componentPlane(component: LayeredComponent | null | undefined): LayerPlane {
  if (component?.plane === 'behind') return 'behind';
  const z = Number(component?.style?.zIndex);
  if (Number.isFinite(z) && z < SECTION_PLANES.content) return 'behind';
  return 'above';
}

export function componentLayerIndex(component: LayeredComponent | null | undefined): number {
  if (typeof component?.layer === 'number' && Number.isFinite(component.layer)) return component.layer;
  const z = Number(component?.style?.zIndex);
  if (Number.isFinite(z)) return Math.max(0, z - (componentPlane(component) === 'behind' ? SECTION_PLANES.behind : SECTION_PLANES.above));
  return 0;
}

export function stackZIndex(component: LayeredComponent | null | undefined): number {
  const plane = componentPlane(component);
  const layer = componentLayerIndex(component);
  if (plane === 'behind') {
    return Math.min(SECTION_PLANES.content - 1, SECTION_PLANES.behind + layer);
  }
  return SECTION_PLANES.above + layer;
}

export function sortByLayer<T extends LayeredComponent>(components: T[]): T[] {
  return [...components].sort((a, b) => {
    const planeDelta = (componentPlane(a) === 'behind' ? 0 : 1) - (componentPlane(b) === 'behind' ? 0 : 1);
    if (planeDelta !== 0) return planeDelta;
    return componentLayerIndex(a) - componentLayerIndex(b);
  });
}

export function splitByPlane<T extends LayeredComponent>(components: T[]): { behind: T[]; above: T[] } {
  const behind: T[] = [];
  const above: T[] = [];
  for (const component of sortByLayer(components)) {
    if (componentPlane(component) === 'behind') behind.push(component);
    else above.push(component);
  }
  return { behind, above };
}

export function bringForward(component: LayeredComponent): { plane: LayerPlane; layer: number } {
  return { plane: componentPlane(component), layer: componentLayerIndex(component) + 1 };
}

export function sendBackward(component: LayeredComponent): { plane: LayerPlane; layer: number } {
  return { plane: componentPlane(component), layer: Math.max(0, componentLayerIndex(component) - 1) };
}

export function setComponentPlane(component: LayeredComponent, plane: LayerPlane): { plane: LayerPlane; layer: number } {
  return { plane, layer: componentLayerIndex(component) };
}

export function sectionBackgroundImageCss(styles: {
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundColor?: string;
} | null | undefined): {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
} {
  const raw = String(styles?.backgroundImage || '').trim();
  if (!raw || raw === 'none') return {};
  const backgroundImage = raw.startsWith('url(') || raw.startsWith('linear') || raw.startsWith('radial') ? raw : `url(${raw})`;
  return {
    backgroundColor: styles?.backgroundColor,
    backgroundImage,
    backgroundSize: styles?.backgroundSize || 'cover',
    backgroundPosition: styles?.backgroundPosition || 'center',
    backgroundRepeat: 'no-repeat',
  };
}

export function shouldClearInnerSectionFill(styles: { backgroundImage?: string } | null | undefined): boolean {
  const raw = String(styles?.backgroundImage || '').trim();
  return Boolean(raw && raw !== 'none');
}
