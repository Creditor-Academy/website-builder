export type DeviceId = 'desktop' | 'tablet' | 'mobile';

export type NodeKind = 'page' | 'section' | 'container' | 'element' | 'navbar' | 'footer';

export type ElementType =
  | 'text'
  | 'image'
  | 'button'
  | 'icon'
  | 'video'
  | 'divider'
  | 'form'
  | 'pdf';

export type SectionKind = 'canvas' | 'prebuilt';

export type SaveStatus =
  | 'idle'
  | 'saving'
  | 'saved'
  | 'error'
  | 'publishing'
  | 'published'
  | 'publish-error';

export interface CanvasStyles {
  width?: string;
  height?: string;
  minHeight?: string;
  maxWidth?: string;
  padding?: string;
  margin?: string;
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  alignSelf?: string;
  gap?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  color?: string;
  opacity?: number;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  boxShadow?: string;
  position?: string;
  overflow?: string;
  objectFit?: string;
}

export type ResponsiveStyles = Partial<Record<DeviceId, Partial<CanvasStyles>>>;

export interface DeviceVisibility {
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
}

export interface CanvasAnimation {
  hover?: string;
  entrance?: string;
  scroll?: string;
  duration?: number;
  easing?: string;
}

export interface FormField {
  id: string;
  type:
    | 'text'
    | 'email'
    | 'phone'
    | 'checkbox'
    | 'radio'
    | 'dropdown'
    | 'multiselect'
    | 'file'
    | 'consent';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  conditional?: { fieldId: string; value: string };
}

export interface CanvasNodeBase {
  id: string;
  parentId: string | null;
  name: string;
  order: number;
  content: Record<string, unknown>;
  styles: CanvasStyles;
  responsiveStyles: ResponsiveStyles;
  properties: Record<string, unknown>;
  visibility: DeviceVisibility;
  locked?: boolean;
  animation?: CanvasAnimation;
}

export interface CanvasElement extends CanvasNodeBase {
  type: ElementType;
}

export interface CanvasContainer extends CanvasNodeBase {
  type: 'container';
  children: CanvasElement[];
}

export interface CanvasSection extends CanvasNodeBase {
  type: string;
  kind: SectionKind;
  visible: boolean;
  children: CanvasContainer[];
  components?: unknown[];
  variant?: string;
}

export interface DropTarget {
  parentId: string;
  parentKind: NodeKind;
  index: number;
  edge: 'before' | 'after' | 'inside';
  accepts: string[];
}

export interface NodeLocation {
  kind: NodeKind;
  node: CanvasSection | CanvasContainer | CanvasElement;
  section?: CanvasSection;
  container?: CanvasContainer;
  element?: CanvasElement;
  isFloating?: boolean;
}

export const DEVICE_WIDTHS: Record<DeviceId, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 390,
};

export const DEFAULT_VISIBILITY: DeviceVisibility = {
  desktop: true,
  tablet: true,
  mobile: true,
};

export const PREBUILT_SECTION_TYPES = new Set([
  'hero',
  'features',
  'services',
  'about',
  'cta',
  'pricing',
  'testimonials',
  'contact',
  'faq',
  'gallery',
  'blog',
  'logocloud',
  'stats',
  'team',
  'casestudies',
  'content',
  'layout',
  'text',
  'button',
  'html',
  'grid',
  'social',
]);

export const CANVAS_PARENT_RULES: Record<string, ReadonlySet<string>> = {
  page: new Set(['section']),
  section: new Set(['container']),
  container: new Set(['text', 'image', 'button', 'icon', 'video', 'divider', 'form', 'pdf']),
  element: new Set(),
};
