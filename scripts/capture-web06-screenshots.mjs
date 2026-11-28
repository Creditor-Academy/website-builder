import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const outputDir = path.join(root, "screenshots", "web-06");
const artifactDir = "/Users/tusharraman/.gemini/antigravity/brain/97150b2c-9576-43de-893d-0f5f4f0f4f33";

fs.mkdirSync(outputDir, { recursive: true });

const ASSET_EXT = /\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|mp4|webm|woff|woff2|ttf|eot|map)$/i;

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };
  return types[ext] || "application/octet-stream";
}

function resolveFile(urlPath) {
  const pathname = decodeURIComponent(urlPath.split("?")[0]) || "/";
  if (pathname === "/") return path.join(dist, "index.html");
  const direct = path.join(dist, pathname);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  const nested = path.join(dist, pathname, "index.html");
  if (fs.existsSync(nested) && fs.statSync(nested).isFile()) return nested;
  if (ASSET_EXT.test(pathname)) return null;
  return path.join(dist, "index.html");
}

function startServer() {
  const server = http.createServer((req, res) => {
    const file = resolveFile(req.url || "/");
    if (!file || !fs.existsSync(file)) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType(file) });
    fs.createReadStream(file).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

const VIEWPORTS = [
  { device: "Desktop", width: 1440, height: 900, dpr: 1 },
  { device: "Tablet", width: 768, height: 1024, dpr: 2 },
  { device: "Mobile", width: 390, height: 844, dpr: 3 },
];

const ROUTES = [
  { name: "Templates-All9", path: "/templates", title: "Templates Showcase (All 9 Templates)" },
  { name: "Home-Canvas", path: "/", title: "Homepage & Canvas Builder" },
  { name: "Pricing-Plans", path: "/pricing", title: "Dedicated Pricing Page (WEB-13)" },
];

async function main() {
  console.log("Starting static server on dist...");
  const { server, origin } = await startServer();
  console.log(`Server listening on ${origin}`);

  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });

  try {
    const page = await browser.newPage();

    for (const route of ROUTES) {
      console.log(`\nCapturing screenshots for ${route.name} (${route.path})...`);
      for (const vp of VIEWPORTS) {
        await page.setViewport({
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1, // keep file sizes reasonable
        });

        const url = `${origin}${route.path}`;
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
        // wait extra 500ms for animations
        await new Promise((r) => setTimeout(r, 600));

        const fileName = `WEB-06_${route.name}_${vp.device}_${vp.width}x${vp.height}.png`;
        const localPath = path.join(outputDir, fileName);
        const brainPath = path.join(artifactDir, fileName);

        await page.screenshot({ path: localPath, fullPage: false });
        fs.copyFileSync(localPath, brainPath);

        console.log(`✓ Saved: ${fileName} (${vp.device} ${vp.width}px)`);
      }
    }

    console.log("\nAll device screenshots captured successfully!");
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
