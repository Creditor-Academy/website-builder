import type { CSSProperties } from 'react';
import type { CanvasStyles, NodeKind } from './types';

export type TemplateStyleBag = CanvasStyles & {
  headingColor?: string;
  paragraphColor?: string;
  buttonPrimaryBg?: string;
  buttonPrimaryText?: string;
  buttonSecondaryBg?: string;
  buttonSecondaryText?: string;
  useGradient?: boolean;
  cardBackgroundColor?: string;
  logoHeight?: string;
};

export function resolveTemplateSectionBackground(
  styles: TemplateStyleBag | null | undefined,
  fallback = '#ffffff'
): string {
  const bag = styles || {};
  if (bag.useGradient && bag.backgroundGradient) return bag.backgroundGradient;
  if (bag.backgroundGradient && (!bag.backgroundColor || bag.backgroundColor === 'transparent')) {
    return bag.backgroundGradient;
  }
  if (bag.backgroundColor && bag.backgroundColor !== 'transparent') return bag.backgroundColor;
  return fallback;
}

export function templateResizePatch(kind: NodeKind, width: number, height: number): Record<string, unknown> {
  const roundedHeight = `${Math.round(Math.max(40, height))}px`;
  if (kind === 'section') {
    return { minHeight: roundedHeight };
  }
  return {
    width: `${Math.round(Math.max(40, width))}px`,
    height: roundedHeight,
  };
}

export function stylesToPrebuiltHostCss(styles: CanvasStyles | null | undefined): CSSProperties {
  const bag = styles || {};
  const css: CSSProperties = {};
  if (bag.minHeight) css.minHeight = bag.minHeight;
  if (bag.height) css.minHeight = bag.height;
  return css;
}

export function floaterStyle(component: { style?: Record<string, unknown>; styles?: Record<string, unknown> } | null | undefined): Record<string, unknown> {
  return { ...(component?.styles || {}), ...(component?.style || {}) };
}

export function floaterImageSrc(content: Record<string, unknown> | null | undefined): string {
  return String(content?.imageUrl || content?.src || '');
}

export function floaterText(content: Record<string, unknown> | null | undefined): string {
  return String(content?.text || content?.label || '');
}

export function normalizeLiftedPiece(component: Record<string, unknown>): Record<string, unknown> {
  const style = { ...((component.style as Record<string, unknown>) || {}), ...((component.styles as Record<string, unknown>) || {}) };
  const content = { ...((component.content as Record<string, unknown>) || {}) };
  if (content.src && !content.imageUrl) content.imageUrl = content.src;
  if (content.imageUrl && !content.src) content.src = content.imageUrl;
  if (content.label && !content.text) content.text = content.label;
  if (content.text && !content.label) content.label = content.text;
  return { ...component, style, styles: style, content };
}

export function sectionForTemplateRenderer(section: { type?: string; variant?: string; content?: Record<string, unknown> } & Record<string, unknown>) {
  if (section.type !== 'process') return section;
  const content = { ...(section.content || {}) };
  if (!Array.isArray(content.features) && Array.isArray(content.steps)) {
    content.features = (content.steps as Array<Record<string, unknown>>).map((step) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      icon: step.icon,
    }));
  }
  return {
    ...section,
    type: 'features',
    variant: section.variant === 'timeline' ? 'list' : section.variant || 'list',
    content,
  };
}
