export const SITE_ORIGIN = "https://webstudio.lmsathena.com";
export const ORGANIZATION_URL = "https://lmsathena.com";
export const ORGANIZATION_ID = `${ORGANIZATION_URL}/#organization`;
export const SOFTWARE_ID = `${SITE_ORIGIN}/#software`;

/** Authenticated app routes stay on the SPA shell and are not indexable. */
export const APP_PREFIXES = [
  "/dashboard",
  "/admin",
  "/builder",
  "/template-builder",
  "/editor",
  "/auth",
] as const;

export type RobotsDirective = "index, follow" | "noindex, nofollow";

/**
 * content: Puppeteer writes the rendered page into dist.
 * shell: the route mounts the website editor; the build writes head tags and one heading.
 */
export type CaptureMode = "content" | "shell";

export type SeoPage = {
  path: string;
  title: string;
  description: string;
  /** Visible or fallback h1. Exactly one per document. */
  heading: string;
  robots: RobotsDirective;
  breadcrumb: string;
  capture: CaptureMode;
  /** File written under dist/ at build time. */
  file: string;
};

type PageInput = {
  path: string;
  title: string;
  description: string;
  heading: string;
  breadcrumb: string;
  robots?: RobotsDirective;
  capture?: CaptureMode;
};

function page(input: PageInput): SeoPage {
  const robots = input.robots ?? "index, follow";
  const capture = input.capture ?? "content";
  const file = input.path === "/" ? "index.html" : `${input.path.replace(/^\//, "")}/index.html`;
  return { ...input, robots, capture, file };
}

/** Editor demo routes: indexable on main; Puppeteer keeps a shell snapshot only. */
function shellPage(input: Omit<PageInput, "capture" | "robots">): SeoPage {
  return page({ ...input, capture: "shell" });
}

export const SEO_PAGES: SeoPage[] = [
  page({
    path: "/",
    title: "Athena Web Studio – AI-Powered Website Creation Platform",
    description:
      "Create a professional website with Athena Web Studio. Explore easy website building, customizable designs, and templates to grow your online presence.",
    heading: "Design. Build. Publish.",
    breadcrumb: "Home",
  }),
  page({
    path: "/features",
    title: "Features — Web Studio",
    description:
      "Explore Web Studio features to build, customize, and manage professional websites with powerful tools, flexible design options, and easy website creation.",
    heading: "Everything you need to design, build, and publish.",
    breadcrumb: "Features",
  }),
  page({
    path: "/templates",
    title: "Templates - Web Studio",
    description:
      "Discover customizable website templates with Athena Web Studio. Choose professional designs to create attractive, responsive websites for your business.",
    heading: "Start with a blank canvas or template.",
    breadcrumb: "Templates",
  }),
  page({
    path: "/resources",
    title: "Resources - Web Studio",
    description:
      "Explore Web Studio resources, helpful guides, tips, and insights to build, customize, and improve your website with ease.",
    heading: "Learn the Web Studio workflow.",
    breadcrumb: "Resources",
  }),
  page({
    path: "/privacy-policy",
    title: "Privacy Policy — Web Studio",
    description:
      "Read the Web Studio Privacy Policy to learn how your personal information is collected, used, protected, and managed when using our website and services.",
    heading: "Privacy Policy",
    breadcrumb: "Privacy Policy",
  }),
  page({
    path: "/terms-of-service",
    title: "Terms of Service — Web Studio",
    description:
      "Review Web Studio's Terms of Service to understand the rules, conditions, and guidelines for using our website-building platform and services.",
    heading: "Terms of Service",
    breadcrumb: "Terms of Service",
  }),
  page({
    path: "/contact",
    title: "Contact Us - Web Studio",
    description:
      "Contact Athena Web Studio for assistance, website-building support, inquiries, and information about creating and managing your professional website.",
    heading: "Get in touch",
    breadcrumb: "Contact",
  }),
  shellPage({
    path: "/pricing",
    title: "Pricing - Web Studio",
    description:
      "See a pricing-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    heading: "Pricing",
    breadcrumb: "Pricing",
  }),
  shellPage({
    path: "/services",
    title: "Services - Web Studio",
    description:
      "See a services-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    heading: "Services",
    breadcrumb: "Services",
  }),
  shellPage({
    path: "/about",
    title: "About - Web Studio",
    description:
      "See an about-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    heading: "About",
    breadcrumb: "About",
  }),
  shellPage({
    path: "/blog",
    title: "Blog - Web Studio",
    description:
      "See a blog-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    heading: "Blog",
    breadcrumb: "Blog",
  }),
  shellPage({
    path: "/careers",
    title: "Careers - Web Studio",
    description:
      "See a careers-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    heading: "Careers",
    breadcrumb: "Careers",
  }),
  shellPage({
    path: "/help",
    title: "Help - Web Studio",
    description:
      "See a help-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    heading: "Help",
    breadcrumb: "Help",
  }),
  shellPage({
    path: "/status",
    title: "Status - Web Studio",
    description:
      "See a status-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    heading: "Status",
    breadcrumb: "Status",
  }),
  shellPage({
    path: "/start",
    title: "Get Started - Web Studio",
    description: "Open the Athena Web Studio builder to start a site from a template or a blank canvas.",
    heading: "Get started",
    breadcrumb: "Get Started",
  }),
  page({
    path: "/login",
    title: "Sign in — Athena Web Studio",
    description: "Sign in or create an account to design and publish a website with Athena Web Studio.",
    heading: "Sign in",
    breadcrumb: "Sign in",
    robots: "noindex, nofollow",
    capture: "shell",
  }),
  page({
    path: "/reset-password",
    title: "Reset password — Athena Web Studio",
    description: "Choose a new password for your Athena Web Studio account.",
    heading: "Set new password",
    breadcrumb: "Reset password",
    robots: "noindex, nofollow",
    capture: "shell",
  }),
  page({
    path: "/verify-email",
    title: "Verify email — Athena Web Studio",
    description: "Confirm your email address to finish creating an Athena Web Studio account.",
    heading: "Verify email",
    breadcrumb: "Verify email",
    robots: "noindex, nofollow",
    capture: "shell",
  }),
];

export const APP_SHELL: SeoPage = {
  path: "/app",
  title: "Web Studio",
  description: "Athena Web Studio workspace for designing, editing, and publishing your sites.",
  heading: "Web Studio",
  robots: "noindex, nofollow",
  breadcrumb: "Account",
  capture: "shell",
  file: "app.html",
};

export const NOT_FOUND_PAGE: SeoPage = {
  path: "/404",
  title: "Page not found — Athena Web Studio",
  description: "This address is not a page on Athena Web Studio.",
  heading: "Page not found",
  robots: "noindex, nofollow",
  breadcrumb: "Page not found",
  capture: "content",
  file: "404.html",
};

export type ResolvedSeo = {
  page: SeoPage;
  /** Path used for canonical and og:url. Null when the URL should not declare a canonical. */
  canonicalPath: string | null;
};

export function normalizePath(pathname: string): string {
  const raw = (pathname.split("?")[0] ?? "/").split("#")[0] ?? "/";
  if (raw.length > 1 && raw.endsWith("/")) return raw.slice(0, -1);
  return raw.length > 0 ? raw : "/";
}

export function isAppPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return APP_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function resolveSeo(pathname: string): ResolvedSeo {
  const path = normalizePath(pathname);
  const exact = SEO_PAGES.find((entry) => entry.path === path);
  if (exact) return { page: exact, canonicalPath: exact.path };
  if (isAppPath(path)) return { page: APP_SHELL, canonicalPath: path };
  return { page: NOT_FOUND_PAGE, canonicalPath: null };
}

export function headingFor(pathname: string): string {
  return resolveSeo(pathname).page.heading;
}

/** Matches canonical trailing slashes already used on main for these marketing routes. */
const TRAILING_SLASH_CANONICAL = new Set([
  "/contact",
  "/features",
  "/privacy-policy",
  "/resources",
  "/templates",
  "/terms-of-service",
]);

export function absoluteUrl(pathname: string): string {
  if (pathname === "/") return `${SITE_ORIGIN}/`;
  if (TRAILING_SLASH_CANONICAL.has(pathname)) return `${SITE_ORIGIN}${pathname}/`;
  return `${SITE_ORIGIN}${pathname}`;
}

export function indexablePages(): SeoPage[] {
  return SEO_PAGES.filter((entry) => entry.robots === "index, follow");
}

type JsonLdNode = Record<string, unknown>;

export function buildJsonLd(page: SeoPage, canonicalPath: string | null): JsonLdNode {
  const home = absoluteUrl("/");
  const crumbs: JsonLdNode[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: home,
    },
  ];

  if (page.path !== "/") {
    const crumb: JsonLdNode = {
      "@type": "ListItem",
      position: 2,
      name: page.breadcrumb,
    };
    if (canonicalPath) crumb.item = absoluteUrl(canonicalPath);
    crumbs.push(crumb);
  }

  const graph: JsonLdNode[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs,
    },
  ];

  if (page.path === "/") {
    graph.unshift(
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "Athena LMS",
        url: ORGANIZATION_URL,
      },
      {
        "@type": "SoftwareApplication",
        "@id": SOFTWARE_ID,
        name: "Athena Web Studio",
        applicationCategory: "DesignApplication",
        operatingSystem: "Web",
        url: home,
        image: `${SITE_ORIGIN}/assets/logo.png`,
        description: "No-code website builder for designing pages and publishing them to a live address.",
        publisher: { "@id": ORGANIZATION_ID },
      },
    );
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** One heading and the route description, for HTML served before JavaScript. */
export function renderFallbackBody(page: SeoPage): string {
  return `<main><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.description)}</p></main>`;
}

/** Head fragment injected into each built HTML file. Tags use data-rh so Helmet replaces them. */
export function renderHead(page: SeoPage, canonicalPath: string | null, preloadHero = false): string {
  const canonical = canonicalPath ? absoluteUrl(canonicalPath) : null;
  const json = JSON.stringify(buildJsonLd(page, canonicalPath)).replace(/</g, "\\u003c");
  const image = `${SITE_ORIGIN}/assets/logo.png`;
  const lines = [
    `<title data-rh="true">${escapeHtml(page.title)}</title>`,
    `<meta name="description" data-rh="true" content="${escapeHtml(page.description)}" />`,
    `<meta name="robots" data-rh="true" content="${page.robots}" />`,
  ];
  if (canonical) {
    lines.push(`<link rel="canonical" data-rh="true" href="${escapeHtml(canonical)}" />`);
  }
  lines.push(
    `<meta property="og:title" data-rh="true" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" data-rh="true" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:type" data-rh="true" content="website" />`,
  );
  if (canonical) {
    lines.push(`<meta property="og:url" data-rh="true" content="${escapeHtml(canonical)}" />`);
  }
  lines.push(
    `<meta property="og:image" data-rh="true" content="${image}" />`,
    `<meta name="twitter:card" data-rh="true" content="summary_large_image" />`,
    `<meta name="twitter:title" data-rh="true" content="${escapeHtml(page.title)}" />`,
    `<meta name="twitter:description" data-rh="true" content="${escapeHtml(page.description)}" />`,
    `<meta name="twitter:image" data-rh="true" content="${image}" />`,
  );
  if (preloadHero) {
    lines.push(
      `<link rel="preload" as="image" href="/images/hero-canvas.webp" fetchpriority="high" data-rh="true" />`,
    );
  }
  lines.push(`<script type="application/ld+json" data-rh="true">${json}</script>`);
  return lines.join("\n    ");
}

export function renderSitemap(pages: SeoPage[] = indexablePages()): string {
  const urls = pages
    .map((entry) => {
      const freq = entry.path === "/" ? "weekly" : "monthly";
      return `  <url>\n    <loc>${absoluteUrl(entry.path)}</loc>\n    <changefreq>${freq}</changefreq>\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}