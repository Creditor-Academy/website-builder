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

export type SeoPage = {
  path: string;
  title: string;
  description: string;
  robots: RobotsDirective;
  breadcrumb: string;
  /** File written under dist/ at build time. */
  file: string;
};

type PageInput = {
  path: string;
  title: string;
  description: string;
  breadcrumb: string;
  robots?: RobotsDirective;
};

function page(input: PageInput): SeoPage {
  const robots = input.robots ?? "index, follow";
  const file = input.path === "/" ? "index.html" : `${input.path.replace(/^\//, "")}/index.html`;
  return { ...input, robots, file };
}

export const SEO_PAGES: SeoPage[] = [
  page({
    path: "/",
    title: "Athena Web Studio – AI-Powered Website Creation Platform",
    description:
      "Create a professional website with Athena Web Studio. Explore easy website building, customizable designs, and templates to grow your online presence.",
    breadcrumb: "Home",
  }),
  page({
    path: "/features",
    title: "Features — Web Studio",
    description:
      "Explore Web Studio features to build, customize, and manage professional websites with powerful tools, flexible design options, and easy website creation.",
    breadcrumb: "Features",
  }),
  page({
    path: "/templates",
    title: "Templates - Web Studio",
    description:
      "Discover customizable website templates with Athena Web Studio. Choose professional designs to create attractive, responsive websites for your business.",
    breadcrumb: "Templates",
  }),
  page({
    path: "/resources",
    title: "Resources - Web Studio",
    description:
      "Explore Web Studio resources, helpful guides, tips, and insights to build, customize, and improve your website with ease.",
    breadcrumb: "Resources",
  }),
  page({
    path: "/privacy-policy",
    title: "Privacy Policy — Web Studio",
    description:
      "Read the Web Studio Privacy Policy to learn how your personal information is collected, used, protected, and managed when using our website and services.",
    breadcrumb: "Privacy Policy",
  }),
  page({
    path: "/terms-of-service",
    title: "Terms of Service — Web Studio",
    description:
      "Review Web Studio's Terms of Service to understand the rules, conditions, and guidelines for using our website-building platform and services.",
    breadcrumb: "Terms of Service",
  }),
  page({
    path: "/contact",
    title: "Contact Us - Web Studio",
    description:
      "Contact Athena Web Studio for assistance, website-building support, inquiries, and information about creating and managing your professional website.",
    breadcrumb: "Contact",
  }),
  page({
    path: "/pricing",
    title: "Pricing - Web Studio",
    description:
      "See a pricing-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    breadcrumb: "Pricing",
  }),
  page({
    path: "/services",
    title: "Services - Web Studio",
    description:
      "See a services-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    breadcrumb: "Services",
  }),
  page({
    path: "/about",
    title: "About - Web Studio",
    description:
      "See an about-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    breadcrumb: "About",
  }),
  page({
    path: "/blog",
    title: "Blog - Web Studio",
    description:
      "See a blog-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    breadcrumb: "Blog",
  }),
  page({
    path: "/careers",
    title: "Careers - Web Studio",
    description:
      "See a careers-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    breadcrumb: "Careers",
  }),
  page({
    path: "/help",
    title: "Help - Web Studio",
    description:
      "See a help-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    breadcrumb: "Help",
  }),
  page({
    path: "/status",
    title: "Status - Web Studio",
    description:
      "See a status-page layout in Athena Web Studio, the no-code builder for designing and publishing a website.",
    breadcrumb: "Status",
  }),
  page({
    path: "/start",
    title: "Get Started - Web Studio",
    description: "Open the Athena Web Studio builder to start a site from a template or a blank canvas.",
    breadcrumb: "Get Started",
  }),
  page({
    path: "/login",
    title: "Sign in — Athena Web Studio",
    description: "Sign in or create an account to design and publish a website with Athena Web Studio.",
    breadcrumb: "Sign in",
    robots: "noindex, nofollow",
  }),
  page({
    path: "/reset-password",
    title: "Reset password — Athena Web Studio",
    description: "Choose a new password for your Athena Web Studio account.",
    breadcrumb: "Reset password",
    robots: "noindex, nofollow",
  }),
  page({
    path: "/verify-email",
    title: "Verify email — Athena Web Studio",
    description: "Confirm your email address to finish creating an Athena Web Studio account.",
    breadcrumb: "Verify email",
    robots: "noindex, nofollow",
  }),
];

export const APP_SHELL: SeoPage = {
  path: "/app",
  title: "Web Studio",
  description: "Athena Web Studio workspace for designing, editing, and publishing your sites.",
  robots: "noindex, nofollow",
  breadcrumb: "Account",
  file: "app.html",
};

export const NOT_FOUND_PAGE: SeoPage = {
  path: "/404",
  title: "Page not found — Athena Web Studio",
  description: "This address is not a page on Athena Web Studio.",
  robots: "noindex, nofollow",
  breadcrumb: "Page not found",
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

export function absoluteUrl(pathname: string): string {
  if (pathname === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${pathname}`;
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

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "Athena LMS",
        url: ORGANIZATION_URL,
        telephone: "+1 (425) 400-9246",
        address: {
          "@type": "PostalAddress",
          streetAddress: "12315 NE 97th Street",
          addressLocality: "Kirkland",
          addressRegion: "WA",
          addressCountry: "US",
        },
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
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs,
      },
    ],
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Head fragment injected into each built HTML file. Tags use data-rh so Helmet replaces them. */
export function renderHead(page: SeoPage, canonicalPath: string | null, preloadHero = false): string {
  const canonical = canonicalPath ? absoluteUrl(canonicalPath) : null;
  const json = JSON.stringify(buildJsonLd(page, canonicalPath)).replace(/</g, "\\u003c");
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
    `<meta property="og:image" data-rh="true" content="${SITE_ORIGIN}/assets/logo.png" />`,
  );
  if (preloadHero) {
    lines.push(
      `<link rel="preload" as="image" href="/images/hero-canvas.webp" fetchpriority="high" data-rh="true" />`,
    );
  }
  lines.push(`<script type="application/ld+json" data-rh="true">${json}</script>`);
  return lines.join("\n    ");
}
