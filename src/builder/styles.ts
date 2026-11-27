import type { CSSProperties } from 'react';
import { DEVICE_WIDTHS, type CanvasStyles, type DeviceId, type ResponsiveStyles } from './types';

const STYLE_TO_CSS: Record<keyof CanvasStyles, string> = {
  width: 'width',
  height: 'height',
  minHeight: 'minHeight',
  maxWidth: 'maxWidth',
  minWidth: 'minWidth',
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
  fontStyle: 'fontStyle',
  textDecoration: 'textDecoration',
  lineHeight: 'lineHeight',
  letterSpacing: 'letterSpacing',
  textAlign: 'textAlign',
  borderWidth: 'borderWidth',
  borderStyle: 'borderStyle',
  borderColor: 'borderColor',
  borderRadius: 'borderRadius',
  boxShadow: 'boxShadow',
  position: 'position',
  left: 'left',
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  zIndex: 'zIndex',
  transform: 'transform',
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

  const targetWidth = DEVICE_WIDTHS[device] || DEVICE_WIDTHS.desktop;
  const desktopWidth = DEVICE_WIDTHS.desktop;
  const scaleRatio = targetWidth / desktopWidth;

  const isAbsolute = (override.position || base.position) === 'absolute';
  if (isAbsolute) {
    if (override.width === undefined && base.width) {
      const parsedWidth = parseFloat(String(base.width));
      if (Number.isFinite(parsedWidth) && String(base.width).endsWith('px')) {
        const scaledWidth = Math.min(targetWidth - 24, Math.max(32, Math.round(parsedWidth * scaleRatio)));
        merged.width = `${scaledWidth}px`;
      }
    }

    if (override.left === undefined && base.left !== undefined) {
      const parsedLeft = parseFloat(String(base.left));
      if (Number.isFinite(parsedLeft) && String(base.left).endsWith('px')) {
        const currentWidth = parseFloat(String(merged.width || base.width || 0)) || 0;
        let scaledLeft = Math.round(parsedLeft * scaleRatio);
        if (currentWidth > 0 && currentWidth < targetWidth) {
          scaledLeft = Math.max(8, Math.min(scaledLeft, targetWidth - currentWidth - 8));
        } else if (scaledLeft > targetWidth - 24) {
          scaledLeft = Math.max(8, targetWidth - 40);
        }
        merged.left = `${scaledLeft}px`;
      }
    }

    if (override.top === undefined && base.top !== undefined) {
      const parsedTop = parseFloat(String(base.top));
      if (Number.isFinite(parsedTop) && String(base.top).endsWith('px')) {
        merged.top = `${Math.round(parsedTop * (device === 'mobile' ? 0.85 : 0.95))}px`;
      }
    }

    merged.maxWidth = '100%';
  }

  // Scale down huge font sizes on mobile
  if (device === 'mobile' && override.fontSize === undefined && base.fontSize) {
    const parsedFontSize = parseFloat(String(base.fontSize));
    if (Number.isFinite(parsedFontSize) && parsedFontSize > 26 && String(base.fontSize).endsWith('px')) {
      merged.fontSize = `${Math.max(16, Math.round(parsedFontSize * 0.72))}px`;
    }
  }

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

export function responsivePadding(padding?: string, fallback = 'clamp(48px, 6vw, 100px) 0'): string {
  if (!padding || !padding.trim()) return fallback;
  if (padding.includes('clamp') || padding.includes('calc') || padding.includes('rem') || padding.includes('vh')) {
    return padding;
  }
  const parts = padding.trim().split(/\s+/);
  const top = parseFloat(parts[0]);
  if (!Number.isFinite(top) || top <= 48) return padding;
  const min = Math.max(36, Math.round(top * 0.45));
  const horiz = parts[1] || '0';
  return `clamp(${min}px, 6vw, ${top}px) ${horiz}`;
}
