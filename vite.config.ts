import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "node:fs";
import { componentTagger } from "lovable-tagger";
import { APP_SHELL, NOT_FOUND_PAGE, SEO_PAGES, renderHead } from "./src/seo/metadata";

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
  plugins: [react(), mode === "development" && componentTagger(), prerenderSeoPlugin()].filter(Boolean),
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

function applySeoHead(html: string, head: string): string {
  if (!SEO_HEAD_PATTERN.test(html)) {
    throw new Error("Built index.html is missing the <!--seo:head:start--> marker");
  }
  return html.replace(
    SEO_HEAD_PATTERN,
    `<!--seo:head:start-->\n    ${head}\n    <!--seo:head:end-->`,
  );
}

/** Writes one HTML file per public route so crawlers see that route's head without JavaScript. */
function prerenderSeoPlugin(): Plugin {
  return {
    name: "prerender-seo-heads",
    apply: "build",
    closeBundle() {
      const dist = path.resolve(process.cwd(), "dist");
      const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
      for (const page of SEO_PAGES) {
        const html = applySeoHead(template, renderHead(page, page.path, page.path === "/"));
        const target = path.join(dist, page.file);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, html);
      }
      fs.writeFileSync(path.join(dist, APP_SHELL.file), applySeoHead(template, renderHead(APP_SHELL, null)));
      fs.writeFileSync(
        path.join(dist, NOT_FOUND_PAGE.file),
        applySeoHead(template, renderHead(NOT_FOUND_PAGE, null)),
      );
    },
  };
}
