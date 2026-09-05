import type { CSSProperties } from 'react';
import type { CanvasStyles, DeviceId, ResponsiveStyles } from './types';

const STYLE_TO_CSS: Record<keyof CanvasStyles, string> = {
  width: 'width',
  height: 'height',
  minHeight: 'minHeight',
  maxWidth: 'maxWidth',
  padding: 'padding',
  margin: 'margin',
  display: 'display',
  flexDirection: 'flexDirection',
  justifyContent: 'justifyContent',
  alignItems: 'alignItems',
  alignSelf: 'alignSelf',
  gap: 'gap',
  backgroundColor: 'backgroundColor',
  backgroundImage: 'backgroundImage',
  backgroundGradient: 'backgroundImage',
  backgroundSize: 'backgroundSize',
  backgroundPosition: 'backgroundPosition',
  color: 'color',
  opacity: 'opacity',
  fontFamily: 'fontFamily',
  fontSize: 'fontSize',
  fontWeight: 'fontWeight',
  lineHeight: 'lineHeight',
  letterSpacing: 'letterSpacing',
  textAlign: 'textAlign',
  borderWidth: 'borderWidth',
  borderStyle: 'borderStyle',
  borderColor: 'borderColor',
  borderRadius: 'borderRadius',
  boxShadow: 'boxShadow',
  position: 'position',
  overflow: 'overflow',
  objectFit: 'objectFit',
};

export function resolveStyles(
  base: CanvasStyles = {},
  responsive: ResponsiveStyles = {},
  device: DeviceId
): CanvasStyles {
  if (device === 'desktop') return { ...base };
  const override = responsive[device] || {};
  const merged: CanvasStyles = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value !== undefined && value !== null && value !== '') {
      merged[key as keyof CanvasStyles] = value as never;
    }
  }
  return merged;
}

export function stylesToCss(styles: CanvasStyles): CSSProperties {
  const css: Record<string, string | number> = {};

  if (styles.backgroundGradient) {
    css.backgroundImage = styles.backgroundGradient;
  } else if (styles.backgroundImage && !styles.backgroundImage.startsWith('linear')) {
    css.backgroundImage = styles.backgroundImage.includes('url(')
      ? styles.backgroundImage
      : `url(${styles.backgroundImage})`;
  }

  for (const [key, cssKey] of Object.entries(STYLE_TO_CSS) as [keyof CanvasStyles, string][]) {
    if (key === 'backgroundGradient' || key === 'backgroundImage') continue;
    const value = styles[key];
    if (value === undefined || value === null || value === '') continue;
    css[cssKey] = value as string | number;
  }

  if (styles.opacity !== undefined) css.opacity = styles.opacity;
  return css as CSSProperties;
}

export function patchResponsiveStyles(
  styles: CanvasStyles,
  responsive: ResponsiveStyles,
  device: DeviceId,
  patch: Partial<CanvasStyles>
): { styles: CanvasStyles; responsiveStyles: ResponsiveStyles } {
  if (device === 'desktop') {
    return { styles: { ...styles, ...patch }, responsiveStyles: responsive };
  }
  return {
    styles,
    responsiveStyles: {
      ...responsive,
      [device]: { ...(responsive[device] || {}), ...patch },
    },
  };
}

export function spacingShorthand(value: string | undefined, fallback = '0px'): string {
  return value && value.trim() ? value : fallback;
}
