# Live nginx for webstudio.lmsathena.com: two SEO fixes (server team)

`nginx.conf` in this repo has both changes. The live server
(Jenkins deploys to `/var/www/frontend/website-builder/dist`) needs the same
lines in its site config, because today it answers

```
https://webstudio.lmsathena.com/pricing  ->  301  Location: http://webstudio.lmsathena.com/pricing/
```

(same for /services, /about, /blog, /careers, /help, /status, /start). Google
is sent from https to http, and Search Console reports these pages as
"Page with redirect".

## 1. Relative redirects (stops the jump to http)

Inside the `server { }` block for `webstudio.lmsathena.com`:

```nginx
absolute_redirect off;
port_in_redirect off;
```

## 2. One URL per page

Every public page's canonical URL and sitemap entry now ends with `/`
(`/pricing/`, `/features/`, ...). Add, above `location / { ... }`:

```nginx
location ~ ^/(features|templates|resources|privacy-policy|terms-of-service|contact|pricing|services|about|blog|careers|help|status|start)$ {
    return 301 /$1/$is_args$args;
}
```

and make sure `location /` uses the repo's
`try_files $uri $uri/index.html =404;` (not `$uri/ /index.html`).

## Check after `sudo nginx -t && sudo systemctl reload nginx`

```bash
curl -sI https://webstudio.lmsathena.com/pricing | grep -iE '^(HTTP|location)'
# 301, location: /pricing/
curl -s -o /dev/null -w '%{http_code}\n' https://webstudio.lmsathena.com/pricing/   # 200
curl -s https://webstudio.lmsathena.com/sitemap.xml | grep -c '<loc>https://webstudio.lmsathena.com/'   # 15
```

Then in Search Console (property `https://webstudio.lmsathena.com/`) resubmit
`sitemap.xml`.
