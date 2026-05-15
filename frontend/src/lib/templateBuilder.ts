import type { Website } from '@/store/useBuilderStore';
import { createDefaultNavbar, createDefaultFooter } from '@/lib/defaultPageData';

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value ?? {}));

const normalizeNavbar = (raw: any, template: any) => {
  const defaults = createDefaultNavbar();
  const source = raw ?? template.navbar ?? {};
  if (!source || typeof source !== 'object' || !source.styles) {
    // Raw data doesn't have the full navbar structure — use defaults
    // but override logo text if available
    const logoText = typeof source === 'object' && source.logo
      ? (typeof source.logo === 'string' ? source.logo : source.logo?.text)
      : template.name;
    return {
      ...defaults,
      logo: { ...defaults.logo, text: logoText || defaults.logo.text },
    };
  }
  return deepClone(source);
};

const normalizeFooter = (raw: any, template: any) => {
  const defaults = createDefaultFooter();
  const source = raw ?? template.footer ?? {};
  if (!source || typeof source !== 'object' || !source.styles) {
    // Raw data doesn't have the full footer structure — use defaults
    const copyright = typeof source === 'object'
      ? (source.copyright || source.text || defaults.copyright)
      : defaults.copyright;
    const logoText = typeof source === 'object' && source.logo
      ? (typeof source.logo === 'string' ? source.logo : source.logo?.text)
      : template.name;
    return {
      ...defaults,
      logo: { ...defaults.logo, text: logoText || defaults.logo.text },
      copyright,
    };
  }
  return deepClone(source);
};

const normalizeTemplatePage = (pageLike: Record<string, any>, template: any) => ({
  id: typeof pageLike.id === 'string' && pageLike.id.trim() ? pageLike.id : crypto.randomUUID(),
  name: typeof pageLike.name === 'string' && pageLike.name.trim() ? pageLike.name : 'Home',
  slug: typeof pageLike.slug === 'string' && pageLike.slug.trim() ? pageLike.slug : '/',
  sections: Array.isArray(pageLike.sections) ? deepClone(pageLike.sections) : [],
  meta: pageLike.meta && typeof pageLike.meta === 'object'
    ? deepClone(pageLike.meta)
    : {
        title: template.name || 'Template',
        description: template.description || '',
      },
  navbar: normalizeNavbar(pageLike.navbar, template),
  footer: normalizeFooter(pageLike.footer, template),
  globalStyles: deepClone(pageLike.globalStyles ?? pageLike.global_styles ?? template.global_styles ?? {}),
});

export const templateToBuilderWebsite = (template: any): Website => {
  const homeLayout = template?.home_layout && typeof template.home_layout === 'object'
    ? deepClone(template.home_layout)
    : {};

  const rawPages = Array.isArray(homeLayout.pages)
    ? homeLayout.pages
    : [homeLayout];

  const pages = rawPages
    .filter((page) => page && typeof page === 'object')
    .map((page) => normalizeTemplatePage(page as Record<string, any>, template));

  const normalizedPages = pages.length > 0
    ? pages
    : [normalizeTemplatePage({}, template)];

  return {
    id: template.id,
    name: template.name,
    lastEdited: template.updatedAt || template.createdAt || new Date().toISOString(),
    status: 'Draft',
    pages: normalizedPages,
    activePageId: normalizedPages[0]?.id ?? null,
    templateId: template.id,
    sourceTemplateId: template.id,
    builderMeta: {
      mode: 'template',
      templateName: template.name,
    },
  };
};

export const builderWebsiteToTemplatePayload = (website: Website, templateMeta: {
  name: string;
  description: string;
  category: string;
  image?: string | null;
}) => {
  const firstPage = website.pages[0] || {
    navbar: {},
    footer: {},
    globalStyles: {},
  };

  return {
    name: templateMeta.name,
    description: templateMeta.description,
    category: templateMeta.category,
    ...(templateMeta.image ? { image: templateMeta.image } : { image: null }),
    global_styles: deepClone(firstPage.globalStyles || {}),
    navbar: deepClone(firstPage.navbar || {}),
    footer: deepClone(firstPage.footer || {}),
    home_layout: {
      pages: deepClone(website.pages || []),
    },
  };
};