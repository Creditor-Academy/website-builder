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

function finish(element: CanvasElement, x: number, y: number, patch?: Partial<CanvasElement['styles']>): CanvasElement {
  const placed = withFreePlacement(element, { x, y });
  return {
    ...placed,
    styles: { ...placed.styles, ...patch, position: 'absolute', left: `${Math.round(x)}px`, top: `${Math.round(y)}px` },
  };
}

function heading(parentId: string, order: number, text: string, x: number, y: number, width = 640, fontSize = '40px'): CanvasElement {
  const element = createHeadingElement(parentId, order);
  element.content = { text, tag: 'h2' };
  return finish(element, x, y, { width: `${width}px`, fontSize, fontWeight: '700' });
}

function paragraph(parentId: string, order: number, text: string, x: number, y: number, width = 560, fontSize = '18px'): CanvasElement {
  const element = createParagraphElement(parentId, order);
  element.content = { text, tag: 'p' };
  return finish(element, x, y, { width: `${width}px`, fontSize, color: '#475569' });
}

function image(parentId: string, order: number, src: string, x: number, y: number, width = 480, alt = 'Image'): CanvasElement {
  const element = createImageElement(parentId, order);
  element.content = { src, alt };
  return finish(element, x, y, { width: `${width}px`, borderRadius: '16px' });
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

function grid(count: number, cols: number, startX: number, startY: number, cellW: number, cellH: number, gap = 24) {
  return Array.from({ length: count }, (_, index) => ({
    x: startX + (index % cols) * (cellW + gap),
    y: startY + Math.floor(index / cols) * (cellH + gap),
  }));
}

function asList(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function textOf(value: unknown, fallback = ''): string {
  return value == null ? fallback : String(value);
}

function explodeContent(type: string, content: Record<string, unknown>, parentId: string): CanvasElement[] {
  const items: CanvasElement[] = [];
  let order = 0;
  const push = (element: CanvasElement) => {
    items.push({ ...element, order: order++ });
  };

  const title = textOf(content.headline || content.title);
  const sub = textOf(content.subheadline || content.description);
  if (title) push(heading(parentId, order, title, 48, 36, 1100, type === 'hero' ? '48px' : '36px'));
  if (sub) push(paragraph(parentId, order, sub, 48, title ? 110 : 36, 720));

  if (type === 'hero') {
    if (content.ctaText) push(button(parentId, order, textOf(content.ctaText), 48, 220));
    if (content.ctaSecondaryText) push(button(parentId, order, textOf(content.ctaSecondaryText), 244, 220));
    if (content.imageUrl) push(image(parentId, order, textOf(content.imageUrl), 640, 36, 500, 'Hero image'));
    else if (content.videoUrl) {
      const video = createVideoElement(parentId, order);
      video.content = { url: textOf(content.videoUrl), provider: 'youtube' };
      push(finish(video, 640, 36, { width: '500px', minHeight: '280px' }));
    }
    return items;
  }

  if (type === 'cta') {
    if (content.ctaText) push(button(parentId, order, textOf(content.ctaText), 48, 200));
    if (content.ctaSecondaryText) push(button(parentId, order, textOf(content.ctaSecondaryText), 244, 200));
    return items;
  }

  if (type === 'about') {
    if (content.badge) push(paragraph(parentId, order, textOf(content.badge), 48, 36, 200, '13px'));
    if (content.imageUrl) push(image(parentId, order, textOf(content.imageUrl), 700, 36, 460, textOf(content.imageAlt, 'About')));
    asList(content.values).forEach((value, index) => {
      const spot = grid(asList(content.values).length, 2, 48, 280, 300, 90, 16)[index];
      if (value.icon) push(icon(parentId, order, textOf(value.icon), spot.x, spot.y));
      push(heading(parentId, order, textOf(value.title), spot.x + 40, spot.y, 250, '18px'));
      push(paragraph(parentId, order, textOf(value.description), spot.x, spot.y + 32, 280, '14px'));
    });
    return items;
  }

  if (type === 'contact') {
    if (content.email) push(paragraph(parentId, order, textOf(content.email), 48, 200, 360));
    if (content.phone) push(paragraph(parentId, order, textOf(content.phone), 48, 240, 360));
    if (content.address) push(paragraph(parentId, order, textOf(content.address), 48, 280, 360));
    const form = createFormElement(parentId, order);
    push(finish(form, 480, 110, { width: '480px' }));
    return items;
  }

  if (type === 'stats') {
    asList(content.stats).forEach((stat, index) => {
      const spot = grid(asList(content.stats).length, 4, 48, 48, 260, 120, 24)[index];
      push(heading(parentId, order, `${textOf(stat.value)}${textOf(stat.suffix)}`, spot.x, spot.y, 240, '40px'));
      push(paragraph(parentId, order, textOf(stat.label), spot.x, spot.y + 56, 240, '16px'));
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

  const cols = type === 'faq' || type === 'pricing' ? (type === 'faq' ? 1 : 3) : cards.length > 4 ? 3 : Math.max(1, Math.min(3, cards.length));
  const cellW = cols === 1 ? 1000 : cols === 2 ? 520 : 360;
  const cellH = type === 'gallery' || type === 'logocloud' ? 180 : 200;
  const spots = grid(cards.length, cols, 48, title || sub ? 200 : 48, cellW, cellH, 24);

  cards.forEach((card, index) => {
    const spot = spots[index];
    const src = textOf(card.imageUrl || card.avatar || card.url || card.src);
    const cardTitle = textOf(card.title || card.name || card.question || card.client);
    const cardBody = textOf(card.description || card.quote || card.answer || card.excerpt || card.role || card.result);
    if (src && (type === 'gallery' || type === 'logocloud' || type === 'team' || type === 'services' || type === 'blog' || type === 'testimonials')) {
      push(image(parentId, order, src, spot.x, spot.y, Math.min(cellW, type === 'team' || type === 'testimonials' ? 120 : cellW), cardTitle));
      if (cardTitle) push(heading(parentId, order, cardTitle, spot.x, spot.y + (type === 'gallery' || type === 'logocloud' ? 140 : 136), cellW, '18px'));
      if (cardBody && type !== 'gallery' && type !== 'logocloud') {
        push(paragraph(parentId, order, cardBody, spot.x, spot.y + 168, cellW, '14px'));
      }
      return;
    }
    if (card.icon) push(icon(parentId, order, textOf(card.icon), spot.x, spot.y));
    if (cardTitle) push(heading(parentId, order, cardTitle, spot.x, spot.y + (card.icon ? 40 : 0), cellW, type === 'pricing' ? '24px' : '18px'));
    if (card.price != null) push(heading(parentId, order, `$${card.price}`, spot.x, spot.y + 40, cellW, '32px'));
    if (cardBody) push(paragraph(parentId, order, cardBody, spot.x, spot.y + (card.price != null ? 88 : 44), cellW, '14px'));
    asList(card.features).slice(0, 4).forEach((feature, featureIndex) => {
      push(paragraph(parentId, order, textOf(feature), spot.x, spot.y + 130 + featureIndex * 22, cellW, '13px'));
    });
  });

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
