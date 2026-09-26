import { v4 as uuidv4 } from 'uuid';
import {
  createButtonElement,
  createFormElement,
  createHeadingElement,
  createIconElement,
  createImageElement,
  createParagraphElement,
  createVideoElement,
} from './defaults';
import { growSurfacesToFit, withFreePlacement } from './freeMove';
import { DEFAULT_VISIBILITY, type CanvasContainer, type CanvasElement, type CanvasSection } from './types';

function slideContainer(sectionId: string, minHeight: string): CanvasContainer {
  const id = uuidv4();
  return {
    id,
    type: 'container',
    parentId: sectionId,
    name: 'Canvas',
    order: 0,
    content: {},
    styles: {
      position: 'relative',
      width: '100%',
      minHeight,
      padding: '32px',
    },
    responsiveStyles: {},
    properties: { placement: 'flow' },
    visibility: { ...DEFAULT_VISIBILITY },
    children: [],
  };
}

const MARGIN = 48;
const CONTENT = 1184;

function finish(element: CanvasElement, x: number, y: number, patch?: Partial<CanvasElement['styles']>): CanvasElement {
  const placed = withFreePlacement(element, { x, y });
  const styles = { ...placed.styles, ...patch, position: 'absolute', left: `${Math.round(x)}px`, top: `${Math.round(y)}px` };
  const width = parseFloat(String(styles.width || '')) || undefined;
  const height = parseFloat(String(styles.height || '')) || undefined;
  const stored = (placed.properties?.freePosition || {}) as { x: number; y: number; width?: number; height?: number; zIndex?: number };
  return {
    ...placed,
    styles,
    properties: {
      ...placed.properties,
      placement: 'absolute',
      freePosition: {
        ...stored,
        x: Math.round(x),
        y: Math.round(y),
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
      },
    },
  };
}

function blockHeight(text: string, width: number, fontSize: number, lineHeight: number): number {
  const charsPerLine = Math.max(8, Math.floor(width / (fontSize * 0.56)));
  const lines = Math.max(1, Math.ceil((text || ' ').length / charsPerLine));
  return Math.ceil(lines * fontSize * lineHeight + 16);
}

function heading(parentId: string, order: number, text: string, x: number, y: number, width = 640, fontSize = '40px'): CanvasElement {
  const size = parseFloat(fontSize) || 40;
  const element = createHeadingElement(parentId, order);
  element.content = { text, tag: 'h2' };
  return finish(element, x, y, {
    width: `${width}px`,
    height: `${blockHeight(text, width, size, 1.25)}px`,
    fontSize,
    fontWeight: '700',
    lineHeight: '1.25',
  });
}

function paragraph(parentId: string, order: number, text: string, x: number, y: number, width = 560, fontSize = '18px'): CanvasElement {
  const size = parseFloat(fontSize) || 18;
  const element = createParagraphElement(parentId, order);
  element.content = { text, tag: 'p' };
  return finish(element, x, y, {
    width: `${width}px`,
    height: `${blockHeight(text, width, size, 1.55)}px`,
    fontSize,
    lineHeight: '1.55',
    color: '#475569',
  });
}

function image(parentId: string, order: number, src: string, x: number, y: number, width = 480, alt = 'Image', height = 300): CanvasElement {
  const element = createImageElement(parentId, order);
  element.content = { src, alt };
  return finish(element, x, y, { width: `${width}px`, height: `${height}px`, borderRadius: '16px', objectFit: 'cover' });
}

function button(parentId: string, order: number, label: string, x: number, y: number): CanvasElement {
  const element = createButtonElement(parentId, order);
  element.content = { ...element.content, label };
  return finish(element, x, y, { width: '180px' });
}

function icon(parentId: string, order: number, name: string, x: number, y: number): CanvasElement {
  const element = createIconElement(parentId, order);
  element.content = { icon: name || 'Sparkles', size: 28 };
  return finish(element, x, y, { width: '32px', height: '32px' });
}

function asList(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function textOf(value: unknown, fallback = ''): string {
  return value == null ? fallback : String(value);
}

function columnWidth(columns: number, gap = 24): number {
  return Math.floor((CONTENT - gap * (columns - 1)) / columns);
}

function explodeContent(type: string, content: Record<string, unknown>, parentId: string): CanvasElement[] {
  const items: CanvasElement[] = [];
  let order = 0;
  const push = (element: CanvasElement) => {
    items.push({ ...element, order: order++ });
  };

  const title = textOf(content.headline || content.title);
  const sub = textOf(content.subheadline || (type === 'about' ? '' : content.description));

  const placeIntro = (titleWidth: number, subWidth: number, titleSize = '36px') => {
    let y = 40;
    if (title) {
      push(heading(parentId, order, title, MARGIN, y, titleWidth, type === 'hero' ? '48px' : titleSize));
      y += blockHeight(title, titleWidth, type === 'hero' ? 48 : parseFloat(titleSize), 1.25) + 14;
    }
    if (sub) {
      push(paragraph(parentId, order, sub, MARGIN, y, subWidth, '18px'));
      y += blockHeight(sub, subWidth, 18, 1.55) + 20;
    }
    return y;
  };

  if (type === 'hero') {
    const textW = 540;
    const imageX = MARGIN + textW + 48;
    const imageW = CONTENT - textW - 48;
    const y = placeIntro(textW, textW);
    if (content.ctaText) push(button(parentId, order, textOf(content.ctaText), MARGIN, y));
    if (content.ctaSecondaryText) push(button(parentId, order, textOf(content.ctaSecondaryText), MARGIN + 196, y));
    const mediaH = Math.max(320, y + 56 - 40);
    if (content.imageUrl) push(image(parentId, order, textOf(content.imageUrl), imageX, 40, imageW, 'Hero image', mediaH));
    else if (content.videoUrl) {
      const video = createVideoElement(parentId, order);
      video.content = { url: textOf(content.videoUrl), provider: 'youtube' };
      push(finish(video, imageX, 40, { width: `${imageW}px`, height: `${mediaH}px`, minHeight: `${mediaH}px` }));
    }
    return items;
  }

  if (type === 'cta') {
    const y = placeIntro(760, 640);
    if (content.ctaText) push(button(parentId, order, textOf(content.ctaText), MARGIN, y));
    if (content.ctaSecondaryText) push(button(parentId, order, textOf(content.ctaSecondaryText), MARGIN + 196, y));
    return items;
  }

  if (type === 'about') {
    const textW = 540;
    const imageX = MARGIN + textW + 40;
    const imageW = CONTENT - textW - 40;
    let y = 40;
    if (content.badge) {
      const badge = textOf(content.badge);
      push(paragraph(parentId, order, badge, MARGIN, y, 240, '13px'));
      y += blockHeight(badge, 240, 13, 1.4) + 12;
    }
    if (title) {
      push(heading(parentId, order, title, MARGIN, y, textW, '36px'));
      y += blockHeight(title, textW, 36, 1.25) + 16;
    }
    const description = textOf(content.description);
    if (description) {
      push(paragraph(parentId, order, description, MARGIN, y, textW, '16px'));
      y += blockHeight(description, textW, 16, 1.55) + 8;
    }
    const imageH = Math.max(280, y - 40);
    if (content.imageUrl) push(image(parentId, order, textOf(content.imageUrl), imageX, 40, imageW, textOf(content.imageAlt, 'About'), imageH));
    const values = asList(content.values);
    if (values.length) {
      const cols = 2;
      const gap = 28;
      const cellW = columnWidth(cols, gap);
      const valueStack = (value: Record<string, unknown>) => {
        const titleH = blockHeight(textOf(value.title), cellW - 44, 18, 1.25);
        const bodyTop = Math.max(44, titleH + 10);
        return bodyTop + blockHeight(textOf(value.description), cellW, 15, 1.55);
      };
      const rowHeights = Array.from({ length: Math.ceil(values.length / cols) }, (_, row) =>
        Math.max(...values.slice(row * cols, row * cols + cols).map(valueStack))
      );
      const rowTop = Math.max(y, 40 + imageH) + 36;
      values.forEach((value, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = MARGIN + col * (cellW + gap);
        const spotY = rowTop + rowHeights.slice(0, row).reduce((sum, height) => sum + height + gap, 0);
        const titleH = blockHeight(textOf(value.title), cellW - 44, 18, 1.25);
        if (value.icon) push(icon(parentId, order, textOf(value.icon), x, spotY));
        push(heading(parentId, order, textOf(value.title), x + 44, spotY, cellW - 44, '18px'));
        push(paragraph(parentId, order, textOf(value.description), x, spotY + Math.max(44, titleH + 10), cellW, '15px'));
      });
    }
    return items;
  }

  if (type === 'contact') {
    let y = placeIntro(500, 480);
    const details = [content.email, content.phone, content.address].map((value) => textOf(value)).filter(Boolean);
    details.forEach((line) => {
      push(paragraph(parentId, order, line, MARGIN, y, 460, '16px'));
      y += blockHeight(line, 460, 16, 1.55) + 8;
    });
    const form = createFormElement(parentId, order);
    push(finish(form, MARGIN + 540, 40, { width: `${CONTENT - 540}px`, height: '420px' }));
    return items;
  }

  if (type === 'stats') {
    const stats = asList(content.stats);
    const cols = Math.max(1, Math.min(4, stats.length || 1));
    const gap = 24;
    const cellW = columnWidth(cols, gap);
    stats.forEach((stat, index) => {
      const x = MARGIN + (index % cols) * (cellW + gap);
      const y = 56 + Math.floor(index / cols) * 140;
      const value = `${textOf(stat.value)}${textOf(stat.suffix)}`;
      push(heading(parentId, order, value, x, y, cellW, '40px'));
      push(paragraph(parentId, order, textOf(stat.label), x, y + blockHeight(value, cellW, 40, 1.2) + 8, cellW, '16px'));
    });
    return items;
  }

  const cards =
    asList(content.features).length ? asList(content.features)
      : asList(content.services).length ? asList(content.services)
        : asList(content.testimonials).length ? asList(content.testimonials)
          : asList(content.plans).length ? asList(content.plans)
            : asList(content.faqs).length ? asList(content.faqs)
              : asList(content.members).length ? asList(content.members)
                : asList(content.posts).length ? asList(content.posts)
                  : asList(content.cases).length ? asList(content.cases)
                    : asList(content.images).length ? asList(content.images)
                      : asList(content.logos).length ? asList(content.logos)
                        : [];

  const cols = type === 'faq' ? 1 : type === 'pricing' ? Math.min(3, Math.max(1, cards.length)) : cards.length > 4 ? 3 : Math.max(1, Math.min(3, cards.length || 1));
  const gap = 28;
  const cellW = columnWidth(cols, gap);
  const introBottom = placeIntro(Math.min(760, CONTENT), Math.min(680, CONTENT));
  const media = type === 'gallery' || type === 'logocloud' || type === 'team' || type === 'services' || type === 'blog' || type === 'testimonials';
  const avatar = type === 'team' || type === 'testimonials';
  const mediaHeight = avatar ? 96 : type === 'logocloud' ? 56 : 168;

  const cardStack = (card: Record<string, unknown>) => {
    const src = textOf(card.imageUrl || card.avatar || card.url || card.src);
    const cardTitle = textOf(card.title || card.name || card.question || card.client);
    const cardBody = textOf(card.description || card.quote || card.answer || card.excerpt || card.role || card.result);
    const features = asList(card.features).slice(0, 4).map((feature) => textOf(feature));
    const titleSize = type === 'pricing' ? 24 : 18;
    let height = 0;
    if (src && media) height += mediaHeight + 16;
    if (card.icon && !media) height += 44;
    if (cardTitle) height += blockHeight(cardTitle, cellW, titleSize, 1.25) + 8;
    if (card.price != null) height += blockHeight(`$${card.price}`, cellW, 32, 1.2) + 8;
    if (cardBody && type !== 'gallery' && type !== 'logocloud') height += blockHeight(cardBody, cellW, 15, 1.55) + 8;
    features.forEach((feature) => {
      height += blockHeight(feature, cellW, 14, 1.45) + 4;
    });
    return { src, cardTitle, cardBody, features, height: Math.max(height, 48) };
  };

  const stacks = cards.map(cardStack);
  let rowTop = Math.max(introBottom, 40) + (title || sub ? 12 : 0);
  for (let index = 0; index < stacks.length; index += cols) {
    const row = stacks.slice(index, index + cols);
    const rowHeight = Math.max(...row.map((entry) => entry.height));
    row.forEach((entry, column) => {
      const x = MARGIN + column * (cellW + gap);
      let y = rowTop;
      if (entry.src && media) {
        const mediaW = avatar ? 96 : cellW;
        push(image(parentId, order, entry.src, x, y, mediaW, entry.cardTitle || 'Image', mediaHeight));
        y += mediaHeight + 16;
      }
      if (!media && cards[index + column]?.icon) {
        push(icon(parentId, order, textOf(cards[index + column].icon), x, y));
        y += 44;
      }
      if (entry.cardTitle) {
        const size = type === 'pricing' ? 24 : 18;
        push(heading(parentId, order, entry.cardTitle, x, y, cellW, `${size}px`));
        y += blockHeight(entry.cardTitle, cellW, size, 1.25) + 8;
      }
      if (cards[index + column]?.price != null) {
        const price = `$${cards[index + column].price}`;
        push(heading(parentId, order, price, x, y, cellW, '32px'));
        y += blockHeight(price, cellW, 32, 1.2) + 8;
      }
      if (entry.cardBody && !(type === 'gallery' || type === 'logocloud')) {
        push(paragraph(parentId, order, entry.cardBody, x, y, cellW, '15px'));
        y += blockHeight(entry.cardBody, cellW, 15, 1.55) + 8;
      }
      entry.features.forEach((feature) => {
        push(paragraph(parentId, order, feature, x, y, cellW, '14px'));
        y += blockHeight(feature, cellW, 14, 1.45) + 4;
      });
    });
    rowTop += rowHeight + gap;
  }

  return items;
}

export function needsPrebuiltExplode(section: { kind?: string; children?: unknown[] }): boolean {
  return section.kind !== 'canvas' && !(Array.isArray(section.children) && section.children.length > 0);
}

export function explodePrebuiltSection(raw: Record<string, unknown>, pageId: string, order: number): CanvasSection {
  const id = String(raw.id || uuidv4());
  const type = String(raw.type || 'section');
  const styles = { ...((raw.styles as CanvasSection['styles']) || {}) };
  const minHeight = String(styles.minHeight || '800px');
  const container = slideContainer(id, minHeight);
  const content = (raw.content as Record<string, unknown>) || {};
  container.children = explodeContent(type, content, container.id).map((element, index) => ({
    ...element,
    parentId: container.id,
    order: index,
  }));

  const section: CanvasSection = {
    id,
    type,
    kind: 'canvas',
    parentId: pageId,
    name: String(raw.name || type),
    order,
    visible: raw.visible !== false,
    locked: Boolean(raw.locked),
    content: {},
    styles: {
      ...styles,
      position: 'relative',
      width: '100%',
      minHeight,
      backgroundColor: styles.backgroundColor || styles.backgroundGradient || '#ffffff',
    },
    responsiveStyles: (raw.responsiveStyles as CanvasSection['responsiveStyles']) || {},
    properties: { ...((raw.properties as Record<string, unknown>) || {}), explodedFrom: type },
    visibility: (raw.visibility as CanvasSection['visibility']) || { ...DEFAULT_VISIBILITY },
    children: [container],
    components: [],
    variant: raw.variant as string | undefined,
  };
  return growSurfacesToFit([section])[0];
}

export function explodePrebuiltSections(sections: CanvasSection[], pageId: string): CanvasSection[] | null {
  let changed = false;
  const next = sections.map((section, index) => {
    if (!needsPrebuiltExplode(section)) return section;
    changed = true;
    return explodePrebuiltSection(section as unknown as Record<string, unknown>, pageId, index);
  });
  return changed ? growSurfacesToFit(next) : null;
}
