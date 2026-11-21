import { describe, expect, it } from "vitest";
import { renderGtmBody, renderGtmHead } from "./gtm";
import {
  APP_SHELL,
  CONTACT_EMAIL,
  HOME_DESCRIPTION,
  NOT_FOUND_PAGE,
  SEO_PAGES,
  indexablePages,
  renderHead,
  renderSitemap,
  resolveSeo,
} from "./metadata";

const allPages = [...SEO_PAGES, APP_SHELL, NOT_FOUND_PAGE];

describe("route SEO metadata", () => {
  it("gives every route a unique title and description within the snippet limits", () => {
    const titles = allPages.map((page) => page.title);
    const descriptions = allPages.map((page) => page.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const page of allPages) {
      expect(page.title.length).toBeGreaterThan(0);
      expect(page.title.length).toBeLessThan(60);
      expect(page.description.length).toBeGreaterThan(40);
      expect(page.description.length).toBeLessThan(155);
      expect(page.heading.length).toBeGreaterThan(0);
      expect(page.heading.length).toBeLessThan(125);
    }
  });

  it("marks login noindex with its own canonical, Open Graph, and Twitter tags", () => {
    const login = resolveSeo("/login");
    expect(login.page.robots).toBe("noindex, nofollow");
    expect(login.canonicalPath).toBe("/login");
    const head = renderHead(login.page, login.canonicalPath);
    expect(head.match(/name="description"/g)).toHaveLength(1);
    expect(head).toContain('href="https://webstudio.lmsathena.com/login"');
    expect(head).toContain('property="og:url"');
    expect(head).toContain('name="twitter:title"');
    expect(head).toContain('name="twitter:description"');
    expect(head).toContain("noindex, nofollow");
    expect(head).not.toContain("SoftwareApplication");
  });

  it("does not reuse the home description or home canonical on other routes", () => {
    const home = SEO_PAGES[0];
    expect(home).toBeDefined();
    for (const page of SEO_PAGES.slice(1)) {
      expect(page.description).not.toBe(home?.description);
      const resolved = resolveSeo(page.path);
      expect(resolved.canonicalPath).toBe(page.path);
      const head = renderHead(page, page.path);
      expect(head).toContain(`href="https://webstudio.lmsathena.com${page.path}"`);
      expect(head).not.toContain('href="https://webstudio.lmsathena.com/"');
    }
  });

  it("puts SoftwareApplication JSON-LD on the home page using on-site facts only", () => {
    const home = SEO_PAGES[0]!;
    const head = renderHead(home, "/", true);
    expect(head.match(/<meta name="description"/g)).toHaveLength(1);
    expect(head).toContain('"@type":"SoftwareApplication"');
    expect(head).toContain('"name":"Athena Web Studio"');
    expect(head).toContain(HOME_DESCRIPTION);
    expect(head).toContain(CONTACT_EMAIL);
    expect(head).toContain("/images/hero-canvas.webp");
    expect(head).not.toContain("12315 NE 97th Street");
    expect(head).not.toContain("+1 (425) 400-9246");
    expect(head).not.toContain('"@type":"Organization"');
    expect(head).not.toContain("gtag");
  });

  it("sends unknown paths to the noindex 404 head and keeps the builder on the app shell", () => {
    expect(resolveSeo("/missing-page").page).toBe(NOT_FOUND_PAGE);
    expect(resolveSeo("/builder/site-1").page).toBe(APP_SHELL);
    expect(resolveSeo("/builder/site-1").page.robots).toBe("noindex, nofollow");
    expect(resolveSeo("/editor").page.robots).toBe("noindex, nofollow");
    expect(resolveSeo("/dashboard/templates").canonicalPath).not.toBe("/");
    const notFound = renderHead(NOT_FOUND_PAGE, null);
    expect(notFound).toContain("noindex, nofollow");
    expect(notFound).not.toContain('rel="canonical"');
  });

  it("lists only indexable public URLs in the sitemap", () => {
    const xml = renderSitemap();
    for (const page of indexablePages()) {
      expect(xml).toContain(`<loc>${page.path === "/" ? "https://webstudio.lmsathena.com/" : `https://webstudio.lmsathena.com${page.path}`}</loc>`);
    }
    expect(xml).not.toContain("/login");
    expect(xml).not.toContain("/reset-password");
    expect(xml).not.toContain("/verify-email");
    expect(xml).not.toContain("/dashboard");
    expect(xml).not.toContain("/builder");
    expect(xml).not.toContain("/editor");
    expect(xml).not.toContain("/admin");
    expect(xml).not.toContain("/about");
    expect(xml).not.toContain("/pricing");
    expect(xml).not.toContain("/start");
    expect(resolveSeo("/about").page.robots).toBe("noindex, nofollow");
    expect(resolveSeo("/editor").page.capture).toBe("shell");
  });
});

describe("Google Tag Manager snippet", () => {
  it("reads the container id from the argument and does not load gtag.js", () => {
    const head = renderGtmHead("GTM-TEST123");
    const body = renderGtmBody("GTM-TEST123");
    expect(head).toContain("GTM-TEST123");
    expect(head).toContain("https://www.googletagmanager.com/gtm.js?id=");
    expect(head).not.toContain("gtag/js");
    expect(head).not.toContain("googletagmanager.com/gtag");
    expect(body).toContain("https://www.googletagmanager.com/ns.html?id=GTM-TEST123");
    expect(body.startsWith("<noscript>")).toBe(false);
    expect(body).toContain("<noscript>");
    expect(renderGtmHead("")).toBe("");
    expect(renderGtmHead("G-ABCDEF")).toBe("");
    expect(renderGtmBody("not-a-container")).toBe("");
  });
});
