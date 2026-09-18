import type { ElementType, NodeKind } from '../types';
import { getResizeConfig, type ResizeConfig } from './resize';

export interface ElementDefinition {
  id: string;
  type: ElementType;
  name: string;
  allowedParents: NodeKind[];
  resizable: boolean;
  resize: ResizeConfig;
  allowAbsolute: boolean;
  inlineEditable: boolean;
  acceptsChildren: boolean;
}

function define(
  id: string,
  type: ElementType,
  name: string,
  extras: Partial<Pick<ElementDefinition, 'allowAbsolute' | 'inlineEditable' | 'resizable'>> = {}
): ElementDefinition {
  return {
    id,
    type,
    name,
    allowedParents: ['container'],
    resizable: extras.resizable !== false,
    resize: getResizeConfig('element', type, false),
    allowAbsolute: extras.allowAbsolute ?? (type === 'icon' || type === 'image' || type === 'text'),
    inlineEditable: extras.inlineEditable ?? type === 'text',
    acceptsChildren: false,
  };
}

export const ELEMENT_REGISTRY: Record<string, ElementDefinition> = {
  heading: define('heading', 'text', 'Heading', { inlineEditable: true, allowAbsolute: true }),
  text: define('text', 'text', 'Text', { inlineEditable: true, allowAbsolute: true }),
  paragraph: define('paragraph', 'text', 'Paragraph', { inlineEditable: true }),
  image: define('image', 'image', 'Image', { allowAbsolute: true }),
  button: define('button', 'button', 'Button'),
  icon: define('icon', 'icon', 'Icon', { allowAbsolute: true }),
  video: define('video', 'video', 'Video'),
  divider: define('divider', 'divider', 'Divider', { resizable: false }),
  form: define('form', 'form', 'Form'),
  pdf: define('pdf', 'pdf', 'PDF'),
  html: define('html', 'html', 'HTML'),
  gallery: define('gallery', 'gallery', 'Gallery'),
  social: define('social', 'social', 'Social', { allowAbsolute: true }),
};

export function getElementDefinition(typeOrId: string): ElementDefinition {
  return ELEMENT_REGISTRY[typeOrId] || ELEMENT_REGISTRY[typeOrId === 'text' ? 'text' : 'text'];
}

export function nodeAcceptsChild(kind: NodeKind): boolean {
  return kind === 'page' || kind === 'section' || kind === 'container';
}
