import { describe, expect, it } from "vitest";
import {
  APP_SHELL,
  NOT_FOUND_PAGE,
  SEO_PAGES,
  renderHead,
  resolveSeo,
} from "./metadata";

const allPages = [...SEO_PAGES, APP_SHELL, NOT_FOUND_PAGE];

describe("route SEO metadata", () => {
  it("gives every route one unique description within the snippet length", () => {
    const descriptions = allPages.map((page) => page.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const description of descriptions) {
      expect(description.length).toBeGreaterThan(40);
      expect(description.length).toBeLessThanOrEqual(160);
    }
  });

  it("marks login noindex with its own canonical", () => {
    const login = resolveSeo("/login");
    expect(login.page.robots).toBe("noindex, nofollow");
    expect(login.canonicalPath).toBe("/login");
    const head = renderHead(login.page, login.canonicalPath);
    expect(head.match(/name="description"/g)).toHaveLength(1);
    expect(head).toContain('href="https://webstudio.lmsathena.com/login"');
    expect(head).toContain("noindex, nofollow");
  });

  it("does not reuse the home description or home canonical on other routes", () => {
    const home = SEO_PAGES[0];
    expect(home).toBeDefined();
    for (const page of SEO_PAGES.slice(1)) {
      expect(page.description).not.toBe(home?.description);
      const resolved = resolveSeo(page.path);
      expect(resolved.canonicalPath).toBe(page.path);
    }
  });

  it("renders one description, Organization, SoftwareApplication, and BreadcrumbList", () => {
    const head = renderHead(SEO_PAGES[0]!, "/", true);
    expect(head.match(/<meta name="description"/g)).toHaveLength(1);
    expect(head).toContain('"@type":"Organization"');
    expect(head).toContain('"name":"Athena LMS"');
    expect(head).toContain("12315 NE 97th Street");
    expect(head).toContain("+1 (425) 400-9246");
    expect(head).toContain("https://lmsathena.com");
    expect(head).toContain('"@type":"SoftwareApplication"');
    expect(head).toContain('"name":"Athena Web Studio"');
    expect(head).toContain('"@type":"BreadcrumbList"');
    expect(head).toContain("/images/hero-canvas.webp");
  });

  it("sends unknown paths to the noindex 404 head and keeps the builder on the app shell", () => {
    expect(resolveSeo("/missing-page").page).toBe(NOT_FOUND_PAGE);
    expect(resolveSeo("/builder/site-1").page).toBe(APP_SHELL);
    expect(resolveSeo("/builder/site-1").canonicalPath).toBe("/builder/site-1");
    expect(resolveSeo("/dashboard/templates").canonicalPath).not.toBe("/");
    const notFound = renderHead(NOT_FOUND_PAGE, null);
    expect(notFound).toContain("noindex, nofollow");
    expect(notFound).not.toContain('rel="canonical"');
  });
});
