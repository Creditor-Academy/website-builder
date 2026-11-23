import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { absoluteUrl, buildJsonLd, resolveSeo, SITE_ORIGIN } from "./metadata";

/** One title, description, canonical, Open Graph set, Twitter set, and JSON-LD per route. */
export default function DocumentHead() {
  const { pathname } = useLocation();
  const { page, canonicalPath } = resolveSeo(pathname);
  const canonical = canonicalPath ? absoluteUrl(canonicalPath) : undefined;
  const image = `${SITE_ORIGIN}/assets/logo.png`;
  const jsonLd = buildJsonLd(page, canonicalPath);

  return (
    <Helmet>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <meta name="robots" content={page.robots} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:type" content="website" />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={image} />
      {page.path === "/" ? (
        <link rel="preload" as="image" href="/images/hero-canvas.webp" fetchPriority="high" />
      ) : null}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}