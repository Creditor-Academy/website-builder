import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const manifest = JSON.parse(fs.readFileSync(path.join(dist, "seo-manifest.json"), "utf8"));

const APP_PREFIXES = ["/dashboard", "/admin", "/builder", "/template-builder", "/editor", "/auth"];
const ASSET_EXT = /\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|mp4|webm|woff|woff2|ttf|eot|map)$/i;

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json",
    ".xml": "application/xml",
    ".txt": "text/plain; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".mp4": "video/mp4",
  };
  return types[ext] || "application/octet-stream";
}

function safeFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const rel = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const file = path.join(dist, rel);
  if (!file.startsWith(dist)) return null;
  return file;
}

function existsFile(file) {
  return Boolean(file && fs.existsSync(file) && fs.statSync(file).isFile());
}

/**
 * mode "preview" falls unknown routes back to index.html so Puppeteer can render the SPA.
 * mode "nginx" follows nginx.conf: app shells stay on app.html, everything else unknown is 404.
 */
function resolveRequest(urlPath, mode) {
  const pathname = decodeURIComponent(urlPath.split("?")[0]) || "/";
  const app = APP_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (app) return { status: 200, file: path.join(dist, "app.html") };

  if (pathname === "/") return { status: 200, file: path.join(dist, "index.html") };

  const direct = safeFile(pathname);
  if (existsFile(direct)) return { status: 200, file: direct };

  const nested = safeFile(path.posix.join(pathname, "index.html"));
  if (existsFile(nested)) return { status: 200, file: nested };

  if (ASSET_EXT.test(pathname)) return { status: 404, file: null };
  if (mode === "nginx") return { status: 404, file: path.join(dist, "404.html") };
  return { status: 200, file: path.join(dist, "index.html") };
}

function startServer(mode) {
  const server = http.createServer((req, res) => {
    const resolved = resolveRequest(req.url || "/", mode);
    if (!resolved.file) {
      res.writeHead(resolved.status);
      res.end();
      return;
    }
    res.writeHead(resolved.status, { "Content-Type": contentType(resolved.file) });
    fs.createReadStream(resolved.file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

function readEnvId() {
  const file = path.join(root, ".env.production");
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^VITE_GTM_ID=(.+)$/m);
  if (!match) throw new Error(".env.production is missing VITE_GTM_ID");
  return match[1].trim();
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countTags(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

function assertDocument(html, { title, canonical, indexable, gtmId, minWords }) {
  const titles = [...html.matchAll(/<title[^>]*>([^<]*)<\/title>/gi)].map((match) => match[1].trim());
  if (titles.length !== 1) throw new Error(`expected 1 title, found ${titles.length}: ${titles.join(" | ")}`);
  if (titles[0] !== title) throw new Error(`title "${titles[0]}" !== "${title}"`);
  if (title.length >= 60) throw new Error(`title is ${title.length} characters`);

  const descriptions = [...html.matchAll(/<meta[^>]*name=["']description["'][^>]*>/gi)];
  if (descriptions.length !== 1) throw new Error(`expected 1 description, found ${descriptions.length}`);
  const description = descriptions[0][0].match(/content=["']([^"']*)["']/i)?.[1] ?? "";
  if (description.length === 0 || description.length >= 155) {
    throw new Error(`description length ${description.length}`);
  }

  const canonicals = [...html.matchAll(/<link[^>]*rel=["']canonical["'][^>]*>/gi)];
  if (canonical) {
    if (canonicals.length !== 1 || !canonicals[0][0].includes(canonical)) {
      throw new Error(`canonical missing ${canonical}`);
    }
  } else if (canonicals.length !== 0) {
    throw new Error("404 document should not declare a canonical");
  }

  for (const name of ["og:title", "og:description", "og:image"]) {
    if (countTags(html, new RegExp(`<meta[^>]*property=["']${name}["'][^>]*>`, "gi")) !== 1) {
      throw new Error(`expected one ${name}`);
    }
  }
  if (canonical && countTags(html, /<meta[^>]*property=["']og:url["'][^>]*>/gi) !== 1) {
    throw new Error("expected one og:url");
  }
  for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
    if (countTags(html, new RegExp(`<meta[^>]*name=["']${name}["'][^>]*>`, "gi")) !== 1) {
      throw new Error(`expected one ${name}`);
    }
  }

  const h1s = [...html.matchAll(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi)];
  if (h1s.length !== 1) throw new Error(`expected 1 h1, found ${h1s.length}`);

  if (!html.includes("noindex") && indexable === false) throw new Error("missing noindex");
  if (indexable && html.includes("noindex")) throw new Error("indexable page is noindex");

  if (!html.includes(`gtm.js?id='+i+dl`)) {
    if (!html.includes(`id=${gtmId}`) && !html.includes(`'${gtmId}'`)) {
      throw new Error("GTM container id from VITE_GTM_ID is missing");
    }
  }
  if (!html.includes(gtmId)) throw new Error("built HTML does not contain the GTM id");
  if (html.includes("googletagmanager.com/gtag") || html.includes("gtag/js")) {
    throw new Error("gtag.js must not be installed");
  }
  const headEnd = html.toLowerCase().indexOf("</head>");
  const gtm = html.indexOf("googletagmanager.com/gtm.js");
  const titleAt = html.toLowerCase().indexOf("<title");
  if (gtm < 0 || gtm > headEnd || gtm > titleAt) {
    throw new Error("GTM script is not in the head before the title");
  }
  const bodyAt = html.toLowerCase().indexOf("<body");
  const noscript = html.indexOf("googletagmanager.com/ns.html");
  const rootAt = html.indexOf('id="root"');
  if (noscript < bodyAt || (rootAt !== -1 && noscript > rootAt)) {
    throw new Error("GTM noscript iframe is not immediately after <body>");
  }

  const words = stripTags(html).split(" ").filter(Boolean);
  if (words.length < minWords) throw new Error(`only ${words.length} words in the document`);
}

async function prerender(origin) {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900 });
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = request.url();
      if (url.startsWith(origin) || url.startsWith("data:") || url.startsWith("blob:")) request.continue();
      else request.abort().catch(() => undefined);
    });

    const jobs = [
      ...manifest.content.map((entry) => ({ ...entry, url: entry.path })),
      { ...manifest.notFound, url: manifest.notFound.path },
    ];

    for (const job of jobs) {
      const target = new URL(job.url, origin).toString();
      console.log(`prerender ${target}`);
      await page.goto(target, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForSelector("h1", { timeout: 20000 });
      await page.evaluate(() => {
        const keepLast = (selector) => {
          const nodes = [...document.head.querySelectorAll(selector)];
          nodes.slice(0, -1).forEach((node) => node.remove());
        };
        keepLast("title");
        keepLast('meta[name="description"]');
        keepLast('meta[name="robots"]');
        keepLast('link[rel="canonical"]');
        keepLast('meta[property="og:title"]');
        keepLast('meta[property="og:description"]');
        keepLast('meta[property="og:type"]');
        keepLast('meta[property="og:url"]');
        keepLast('meta[property="og:image"]');
        keepLast('meta[name="twitter:card"]');
        keepLast('meta[name="twitter:title"]');
        keepLast('meta[name="twitter:description"]');
        keepLast('meta[name="twitter:image"]');
        const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')];
        jsonLd.slice(0, -1).forEach((node) => node.remove());
      });
      const h1Count = await page.$$eval("h1", (nodes) => nodes.length);
      if (h1Count !== 1) {
        const texts = await page.$$eval("h1", (nodes) => nodes.map((node) => node.textContent?.trim() ?? ""));
        throw new Error(`${job.url} rendered ${h1Count} h1 elements: ${texts.join(" | ")}`);
      }
      const html = await page.content();
      fs.writeFileSync(path.join(dist, job.file), html);
    }
  } finally {
    await browser.close();
  }
}

async function fetchText(origin, urlPath) {
  const response = await fetch(new URL(urlPath, origin));
  return { status: response.status, html: await response.text(), type: response.headers.get("content-type") || "" };
}

async function verify(gtmId) {
  const source = fs.readFileSync(path.join(root, "index.html"), "utf8");
  if (source.includes(gtmId)) {
    throw new Error("index.html hardcodes the GTM id. It must come from VITE_GTM_ID at build time.");
  }
  const robots = fs.readFileSync(path.join(dist, "robots.txt"), "utf8");
  if (!robots.includes("Sitemap: https://webstudio.lmsathena.com/sitemap.xml")) {
    throw new Error("robots.txt does not point at the sitemap");
  }
  const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
  for (const blocked of ["/login", "/dashboard", "/builder", "/editor", "/admin", "/reset-password"]) {
    if (sitemap.includes(blocked)) throw new Error(`sitemap includes non-indexable ${blocked}`);
  }
  if (!sitemap.includes("https://webstudio.lmsathena.com/")) {
    throw new Error("sitemap is missing the home page");
  }

  const marketing = new Set(["/", "/features", "/templates", "/resources", "/contact", "/privacy-policy", "/terms-of-service"]);
  for (const entry of manifest.content) {
    const html = fs.readFileSync(path.join(dist, entry.file), "utf8");
    const canonical = entry.path === "/"
      ? "https://webstudio.lmsathena.com/"
      : `https://webstudio.lmsathena.com${entry.path}`;
    const indexable = !["/login", "/reset-password", "/verify-email"].includes(entry.path);
    assertDocument(html, {
      title: entry.title,
      canonical,
      indexable,
      gtmId,
      minWords: marketing.has(entry.path) ? 80 : 12,
    });
    if (entry.path === "/" && !html.includes('"@type":"SoftwareApplication"')) {
      throw new Error("home page is missing SoftwareApplication JSON-LD");
    }
  }

  const notFoundHtml = fs.readFileSync(path.join(dist, manifest.notFound.file), "utf8");
  assertDocument(notFoundHtml, {
    title: manifest.notFound.title,
    canonical: null,
    indexable: false,
    gtmId,
    minWords: 8,
  });

  for (const entry of manifest.shells) {
    const html = fs.readFileSync(path.join(dist, entry.file), "utf8");
    assertDocument(html, {
      title: entry.title,
      canonical: `https://webstudio.lmsathena.com${entry.path}`,
      indexable: entry.indexable,
      gtmId,
      minWords: 8,
    });
    if (html.includes('id="root"></div>') || !html.includes("<h1")) {
      throw new Error(`${entry.path} shell is missing rendered content`);
    }
  }

  const hosted = await startServer("nginx");
  try {
    const missing = await fetchText(hosted.origin, "/this-page-does-not-exist");
    if (missing.status !== 404) throw new Error(`unknown URL returned ${missing.status}, expected 404`);
    if (!missing.html.includes("Page not found") || !missing.html.includes("noindex")) {
      throw new Error("404 response is missing the noindex page");
    }
    const home = await fetchText(hosted.origin, "/");
    if (home.status !== 200 || !home.html.includes(gtmId)) throw new Error("home page did not serve the prerendered HTML");
    const features = await fetchText(hosted.origin, "/features");
    if (features.status !== 200 || !features.html.includes("Features — Web Studio")) {
      throw new Error("features route did not serve its own HTML");
    }
    const dashboard = await fetchText(hosted.origin, "/dashboard");
    if (dashboard.status !== 200 || !dashboard.html.includes("noindex")) {
      throw new Error("dashboard should stay on the noindex app shell");
    }
    const builder = await fetchText(hosted.origin, "/builder/example");
    if (builder.status !== 200 || !builder.html.includes("noindex")) {
      throw new Error("builder should stay on the noindex app shell");
    }
    const asset = await fetchText(hosted.origin, "/assets/missing-file.png");
    if (asset.status !== 404) throw new Error("missing asset should be a real 404");
    console.log("verified titles, canonicals, one h1, GTM id, sitemap, and HTTP 404");
  } finally {
    await new Promise((resolve) => hosted.server.close(resolve));
  }
}

const gtmId = readEnvId();
if (!/^GTM-[A-Z0-9]+$/.test(gtmId)) throw new Error(`invalid VITE_GTM_ID ${gtmId}`);

const preview = await startServer("preview");
try {
  await prerender(preview.origin);
} finally {
  await new Promise((resolve) => preview.server.close(resolve));
}
fs.rmSync(path.join(dist, "seo-manifest.json"), { force: true });
await verify(gtmId);
