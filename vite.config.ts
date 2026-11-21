import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "node:fs";
import { componentTagger } from "lovable-tagger";
import { renderGtmBody, renderGtmHead } from "./src/seo/gtm";
import { APP_SHELL, NOT_FOUND_PAGE, SEO_PAGES, renderFallbackBody, renderHead, renderSitemap } from "./src/seo/metadata";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const pexelsKey = (env.PEXELS_API_KEY || env.VITE_PEXELS_API_KEY || "").trim();
  if (!pexelsKey) {
    console.warn("[pexels] PEXELS_API_KEY is missing. Stock photos will return 401 until you add it to .env.local and restart the dev server.");
  }

  return {
  server: {
    host: "::",
    port: 8080,
    strictPort: false,
    proxy: {
      '/pexels-api': {
        target: 'https://api.pexels.com',
        changeOrigin: true,
        secure: true,
        headers: pexelsKey ? { Authorization: pexelsKey } : {},
        rewrite: (requestPath) => {
          if (requestPath.startsWith('/pexels-api/videos')) {
            return requestPath.replace(/^\/pexels-api/, '');
          }
          return requestPath.replace(/^\/pexels-api/, '/v1');
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            if (pexelsKey) proxyReq.setHeader('Authorization', pexelsKey);
          });
        },
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger(), gtmSnippetPlugin(env.VITE_GTM_ID || ""), prerenderSeoPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip', '@radix-ui/react-tabs', '@radix-ui/react-popover'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        },
      },
    },
  },
};
});

const SEO_HEAD_PATTERN = /<!--seo:head:start-->[\s\S]*?<!--seo:head:end-->/;
const SEO_BODY_PATTERN = /<!--seo:body:start-->[\s\S]*?<!--seo:body:end-->/;

function applySeoDocument(html: string, head: string, body: string): string {
  if (!SEO_HEAD_PATTERN.test(html)) {
    throw new Error("Built index.html is missing the <!--seo:head:start--> marker");
  }
  if (!SEO_BODY_PATTERN.test(html)) {
    throw new Error("Built index.html is missing the <!--seo:body:start--> marker");
  }
  return html
    .replace(SEO_HEAD_PATTERN, `<!--seo:head:start-->\n    ${head}\n    <!--seo:head:end-->`)
    .replace(SEO_BODY_PATTERN, `<!--seo:body:start-->${body}<!--seo:body:end-->`);
}

/** Inserts the GTM snippet from VITE_GTM_ID. An empty or invalid id leaves the markers blank. */
function gtmSnippetPlugin(gtmId: string): Plugin {
  return {
    name: "gtm-snippet",
    transformIndexHtml(html) {
      return html
        .replace("<!--gtm:head-->", renderGtmHead(gtmId))
        .replace("<!--gtm:body-->", renderGtmBody(gtmId));
    },
  };
}

/**
 * Writes one HTML file per public route.
 * Shell routes (the website editor) keep a single heading in the file.
 * Content routes are replaced after the build by scripts/prerender.mjs.
 */
function prerenderSeoPlugin(): Plugin {
  return {
    name: "prerender-seo-heads",
    apply: "build",
    closeBundle() {
      const dist = path.resolve(process.cwd(), "dist");
      const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
      const writePage = (page: typeof SEO_PAGES[number], canonicalPath: string | null) => {
        const html = applySeoDocument(
          template,
          renderHead(page, canonicalPath, page.path === "/"),
          renderFallbackBody(page),
        );
        const target = path.join(dist, page.file);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, html);
      };
      for (const page of SEO_PAGES) writePage(page, page.path);
      writePage(APP_SHELL, null);
      writePage(NOT_FOUND_PAGE, null);
      fs.writeFileSync(path.join(dist, "sitemap.xml"), renderSitemap());
      fs.writeFileSync(
        path.join(dist, "seo-manifest.json"),
        JSON.stringify({
          content: SEO_PAGES.filter((page) => page.capture === "content").map((page) => ({
            path: page.path,
            file: page.file,
            title: page.title,
          })),
          notFound: {
            path: "/seo-audit-missing-page",
            file: NOT_FOUND_PAGE.file,
            title: NOT_FOUND_PAGE.title,
          },
          shells: SEO_PAGES.filter((page) => page.capture === "shell").map((page) => ({
            path: page.path,
            file: page.file,
            title: page.title,
            indexable: page.robots.startsWith("index"),
          })),
        }),
      );
    },
  };
}
