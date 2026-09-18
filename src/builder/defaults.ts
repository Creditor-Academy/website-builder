import { v4 as uuidv4 } from 'uuid';
import { withFreeContainerPlacement, withFreePlacement } from './freeMove';
import { DEFAULT_VISIBILITY, type CanvasContainer, type CanvasElement, type CanvasSection, type ElementType, type FormField } from './types';

function baseNode(name: string, parentId: string | null, order: number) {
  return {
    id: uuidv4(),
    parentId,
    name,
    order,
    content: {} as Record<string, unknown>,
    styles: {},
    responsiveStyles: {},
    properties: {},
    visibility: { ...DEFAULT_VISIBILITY },
  };
}

export function createTextElement(parentId: string, order = 0): CanvasElement {
  return {
    ...baseNode('Text', parentId, order),
    type: 'text',
    content: { text: 'Edit this text', tag: 'p' },
    styles: {
      fontFamily: 'Inter',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: '0px',
      color: '#0f172a',
      textAlign: 'left',
      width: '100%',
    },
    responsiveStyles: {
      tablet: { fontSize: '16px' },
      mobile: { fontSize: '15px' },
    },
    animation: { duration: 300, easing: 'ease' },
  };
}

export function createHeadingElement(parentId: string, order = 0): CanvasElement {
  return {
    ...baseNode('Heading', parentId, order),
    type: 'text',
    content: { text: 'Add a heading', tag: 'h2' },
    styles: {
      fontFamily: 'Inter',
      fontSize: '36px',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
      color: '#0f172a',
      textAlign: 'left',
      width: '100%',
    },
    responsiveStyles: {
      tablet: { fontSize: '30px' },
      mobile: { fontSize: '26px' },
    },
    animation: { duration: 300, easing: 'ease' },
  };
}

export function createParagraphElement(parentId: string, order = 0): CanvasElement {
  return {
    ...createTextElement(parentId, order),
    name: 'Paragraph',
    content: { text: 'Write a short paragraph that introduces this section.', tag: 'p' },
  };
}

export function createImageElement(parentId: string, order = 0): CanvasElement {
  return {
    ...baseNode('Image', parentId, order),
    type: 'image',
    content: {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
      alt: 'Image',
    },
    styles: {
      width: '100%',
      borderRadius: '12px',
      objectFit: 'cover',
    },
  };
}

export function createButtonElement(parentId: string, order = 0): CanvasElement {
  return {
    ...baseNode('Button', parentId, order),
    type: 'button',
    content: { label: 'Get started', href: '#', target: '_self' },
    styles: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 24px',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '600',
      borderRadius: '999px',
      letterSpacing: '0.02em',
    },
  };
}

export function createIconElement(parentId: string, order = 0): CanvasElement {
  return {
    ...baseNode('Icon', parentId, order),
    type: 'icon',
    content: { icon: 'Sparkles', size: 28 },
    styles: { color: '#0f172a', width: '28px', height: '28px' },
  };
}

export function createVideoElement(parentId: string, order = 0): CanvasElement {
  return {
    ...baseNode('Video', parentId, order),
    type: 'video',
    content: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', provider: 'youtube' },
    styles: { width: '100%', borderRadius: '12px', minHeight: '240px', overflow: 'hidden' },
  };
}

export function createDividerElement(parentId: string, order = 0): CanvasElement {
  return {
    ...baseNode('Divider', parentId, order),
    type: 'divider',
    content: {},
    styles: {
      width: '100%',
      height: '1px',
      backgroundColor: '#e2e8f0',
      margin: '16px 0',
    },
  };
}

export function defaultFormFields(): FormField[] {
  return [
    { id: uuidv4(), type: 'text', label: 'Name', placeholder: 'Your name', required: true },
    { id: uuidv4(), type: 'email', label: 'Email', placeholder: 'you@example.com', required: true },
    { id: uuidv4(), type: 'text', label: 'Message', placeholder: 'How can we help?', required: false },
    { id: uuidv4(), type: 'consent', label: 'I agree to be contacted', required: true },
  ];
}

export function createFormElement(parentId: string, order = 0): CanvasElement {
  return {
    ...baseNode('Form', parentId, order),
    type: 'form',
    content: {
      title: 'Contact us',
      submitLabel: 'Send message',
      fields: defaultFormFields(),
    },
    styles: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '24px',
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
    },
  };
}

export function createPdfElement(parentId: string, order = 0): CanvasElement {
  return {
    ...baseNode('PDF Resource', parentId, order),
    type: 'pdf',
    content: { title: 'Resource', url: '', description: 'Download the PDF' },
    styles: {
      width: '100%',
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: '#f8fafc',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#e2e8f0',
    },
  };
}

export function createHtmlElement(parentId: string, order = 0): CanvasElement {
  return {
    ...baseNode('HTML', parentId, order),
    type: 'html',
    content: { html: '<p>Custom HTML</p>' },
    styles: { width: '100%' },
  };
}

export function createGalleryElement(parentId: string, order = 0): CanvasElement {
  return {
    ...baseNode('Gallery', parentId, order),
    type: 'gallery',
    content: {
      images: [
        { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', alt: 'Gallery image 1' },
        { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Gallery image 2' },
        { src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80', alt: 'Gallery image 3' },
      ],
    },
    styles: {
      width: '100%',
      display: 'grid',
      gap: '12px',
    },
  };
}

export function createSocialElement(parentId: string, order = 0): CanvasElement {
  return {
    ...baseNode('Social', parentId, order),
    type: 'social',
    content: {
      links: [
        { network: 'Twitter', url: '#' },
        { network: 'LinkedIn', url: '#' },
        { network: 'Instagram', url: '#' },
      ],
    },
    styles: { display: 'flex', gap: '12px', alignItems: 'center' },
  };
}

export const ELEMENT_FACTORIES: Record<ElementType, (parentId: string, order?: number) => CanvasElement> = {
  text: createTextElement,
  image: createImageElement,
  button: createButtonElement,
  icon: createIconElement,
  video: createVideoElement,
  divider: createDividerElement,
  form: createFormElement,
  pdf: createPdfElement,
  html: createHtmlElement,
  gallery: createGalleryElement,
  social: createSocialElement,
};

export function createElementByCatalog(catalogId: string, parentId: string, order = 0): CanvasElement {
  let element: CanvasElement;
  if (catalogId === 'heading') element = createHeadingElement(parentId, order);
  else if (catalogId === 'paragraph') element = createParagraphElement(parentId, order);
  else {
    const factory = ELEMENT_FACTORIES[catalogId as ElementType];
    element = factory ? factory(parentId, order) : createTextElement(parentId, order);
  }
  return withFreePlacement(element, { x: 64, y: 64 + order * 40 });
}

export function createLayoutSurface(parentId: string, order = 0): CanvasContainer {
  const id = uuidv4();
  return {
    ...baseNode('Canvas', parentId, order),
    id,
    type: 'container',
    styles: {
      position: 'relative',
      width: '100%',
      minHeight: '800px',
    },
    properties: { placement: 'flow', role: 'surface' },
    children: [],
  };
}

export function createContainer(parentId: string, order = 0, elements: CanvasElement[] = []): CanvasContainer {
  const id = uuidv4();
  const children = elements.map((element, index) => ({ ...element, parentId: id, order: index }));
  return withFreeContainerPlacement(
    {
      ...baseNode('Container', parentId, order),
      id,
      type: 'container',
      styles: {
        padding: '24px',
      },
      children,
    },
    { x: 48, y: 48 + order * 40 }
  );
}

export function createBlankCanvasSection(pageId: string, order = 0): CanvasSection {
  const id = uuidv4();
  const containerId = uuidv4();
  return {
    ...baseNode('Section', pageId, order),
    id,
    type: 'section',
    kind: 'canvas',
    visible: true,
    locked: false,
    styles: {
      position: 'relative',
      width: '100%',
      minHeight: '800px',
      backgroundColor: '#ffffff',
    },
    content: {},
    properties: { placeholder: true },
    children: [
      {
        ...baseNode('Canvas', id, 0),
        id: containerId,
        type: 'container',
        styles: {
          position: 'relative',
          width: '100%',
          minHeight: '800px',
        },
        properties: { placement: 'flow' },
        children: [],
      },
    ],
    components: [],
  };
}

export function createCanvasSection(pageId: string, order = 0, name = 'Section'): CanvasSection {
  const id = uuidv4();
  const container = createLayoutSurface(id, 0);
  return {
    ...baseNode(name, pageId, order),
    id,
    type: 'section',
    kind: 'canvas',
    visible: true,
    locked: false,
    styles: {
      position: 'relative',
      width: '100%',
      minHeight: '800px',
      backgroundColor: '#ffffff',
    },
    content: {},
    children: [container],
    components: [],
  };
}

export function createCanvasSectionWithElement(
  pageId: string,
  type: ElementType,
  order = 0
): CanvasSection {
  return createCanvasSectionWithCatalog(pageId, type, order);
}

export function createCanvasSectionWithCatalog(pageId: string, catalogId: string, order = 0): CanvasSection {
  const section = createCanvasSection(pageId, order);
  const container = section.children[0];
  const element = createElementByCatalog(catalogId, container.id, 0);
  return {
    ...section,
    name: element.name,
    children: [{ ...container, children: [element] }],
  };
}
