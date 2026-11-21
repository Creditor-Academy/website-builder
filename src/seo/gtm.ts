const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/;

/** Public container ids look like GTM-XXXX. Anything else is not injected. */
export function isGtmId(value: string): boolean {
  return GTM_ID_PATTERN.test(value.trim());
}

/**
 * Official Google Tag Manager head snippet.
 * The container id is an argument so the page never hardcodes it.
 * GA4 is not loaded here; it is configured inside the container.
 */
export function renderGtmHead(id: string): string {
  const containerId = id.trim();
  if (!isGtmId(containerId)) return "";
  return `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${containerId}');</script>
<!-- End Google Tag Manager -->`;
}

/** Official Google Tag Manager noscript iframe, placed immediately after <body>. */
export function renderGtmBody(id: string): string {
  const containerId = id.trim();
  if (!isGtmId(containerId)) return "";
  return `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
}
