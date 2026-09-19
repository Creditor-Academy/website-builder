# Backend Changelog — FE `merge_code` Alignment

**Branch:** `version-2`  
**Dates:** 17–19 Sep 2026  
**Scope:** Align Backend with Frontend `merge_code` canvas editor + assets; additive testing-DB migration only  

**Related commits:**
- `33d9fad` — Pexels + Pixabay stock search/import
- `8b43b8d` — Stock cache / S3 import fix
- `5a8d0e0` — Asset visibility + website revision
- `bcc7dec` — Remove deprecated Prisma `driverAdapters` preview flag
- `a8c28a3` — Visibility / revision refinements

---

## 1. Database schema (additive — no data wipe)

**Migration:** `prisma/migrations/20260918120000_add_website_revision_and_asset_meta/`

| Model | Field | Type | Purpose |
|---|---|---|---|
| `Website` | `revision` | `Int @default(1)` | Optimistic concurrency for editor autosave |
| `Asset` | `meta` | `Json?` | Visibility flags (+ future attribution) |

**Safety:**
- Applied on **testing DB** via `prisma migrate deploy` only
- No `migrate reset`, no force-reset, no truncates
- **Main/prod:** apply the same migration at go-live with `prisma migrate deploy` after backup

**Other schema cleanup:**
- Removed deprecated `previewFeatures = ["driverAdapters"]` from Prisma generator (Prisma 7 stable)

---

## 2. Website save / load contract

### Revision (optimistic concurrency)
- GET website / list returns `revision`
- `PATCH /websites/:id` accepts optional `revision`
  - Matching → save + bump `revision + 1`
  - Stale → **409 Conflict**
  - Omitted → save still succeeds and bumps revision (non-breaking for FE)
- Create / duplicate start at `revision = 1`

**Files:**  
`website.validation.ts`, `website.dao.ts`, `website.service.ts`, `constants/website.constants.ts`

### Status casing
- FE may send `Draft` / `Published`
- BE normalizes to Prisma enums `DRAFT` / `PUBLISHED` / `DELETED`

**Files:**  
`website.validation.ts` (+ unit tests)

---

## 3. Content normalize (canvas trees)

**File:** `website-content.utils.ts`

- Still force-stamps top-level `content.schemaVersion = 2`
- Preserves per-page `schemaVersion` when present
- Recursively walks canvas sections: `kind: 'canvas'` → containers → elements
- Upgrades nested node `styles` to breakpoint shape where applicable
- Legacy prebuilt sections (`type` + `components`) still supported

**Tests:** canvas tree + legacy prebuilt cases in `website-content.utils.test.ts`

---

## 4. Publish / Static Site Generator (SSG)

**File:** `static-site-generator.ts`

### Dual render path
- Prebuilt sections → existing `sectionRenderers[type]` (unchanged)
- Canvas sections (`kind: 'canvas'` / `children` tree) → new canvas renderer

### MVP canvas elements rendered
| Element | Behavior |
|---|---|
| `text` | Heading/paragraph HTML from `content.text` / `tag` |
| `image` | `<img>` from `src` / `imageUrl` / `url` |
| `button` | Link styled as button |
| `divider` | `<hr>` |
| `form` | Generated fields → `POST /forms/submit` |

### Placeholders (non-blocking)
`icon`, `video`, `pdf`, `html`, `gallery`, `social`

### Forms on published sites
- Canvas forms use class `canvas-form`
- Submit payload: `{ website_id, page_slug?, form_name, data }`
- Same public endpoint as contact forms: `POST /api/v1/forms/submit`

### Styles
- Resolves flat styles and `{ base, tablet, mobile }` / `responsiveStyles` (desktop-first)
- Honors `visible === false` and `visibility.desktop === false`

**Test:** `static-site-generator.canvas.test.ts`

---

## 5. Assets

### Stock media (already on branch; kept)
| Method | Path | Notes |
|---|---|---|
| `GET` | `/assets/stock/search` | Pexels / Pixabay; keys server-side; 24h cache |
| `POST` | `/assets/stock/import` | Download → Sharp/WebP → S3 → `Asset` row |

### New: visibility
| Method | Path | Body |
|---|---|---|
| `PUT` | `/assets/visibility` | `{ asset_ids: string[] }` |

- `asset_ids` = visible set for user library
- Persists into `Asset.meta`: `{ userVisible, hidden, visibilityUpdatedAt }`
- Ownership / access checks enforced
- List assets now includes `meta`

### Hardened: `POST /assets/import-url`
- URL protocol check (`http`/`https`)
- 20s timeout + browser-like User-Agent (Pexels CDN friendly)
- 25MB size cap
- Rejects `text/html` responses

**Files:**  
`assets.routes.ts`, `assets.validation.ts`, `assets.controller.ts`, `assets.service.ts`

---

## 6. Forms dashboard filters

**Endpoint:** `GET /forms/submissions`

| FE `status` | BE filter |
|---|---|
| `unread` | `is_read = false` |
| `read` | `is_read = true` |
| `replied` | treated as read (`is_read = true`) |
| `all` / omit | no `is_read` filter |

Existing `is_read` / `is_spam` query params still work.

**Files:**  
`forms.validation.ts`, `forms.controller.ts`

---

## 7. Domains

**Endpoint:** `DELETE /domains/:domainId`

- `websiteId` query/param **optional**
- If omitted → resolved from the domain row
- If provided and mismatches → 404

**Files:**  
`domain.service.ts`, `domain.controller.ts`

---

## 8. Documentation

| File | What changed |
|---|---|
| `AGENTS.md` | Revision, status casing, stock, visibility, forms status, domains, SSG MVP, migration note |
| `docs/Version 2/V2_STATUS.md` | Revision / canvas SSG / asset visibility status updates |
| `docs/Version 2/FE_CONTRACT_NOTE.md` | FE handoff contract (new) |

---

## 9. Tests added / updated

- `src/modules/website/website.validation.test.ts` — status casing + revision
- `src/modules/website/website-content.utils.test.ts` — canvas + legacy normalize
- `src/services/static-site-generator.canvas.test.ts` — canvas + prebuilt publish HTML
- Existing stock tests remain green

---

## 10. Explicitly not changed (out of scope)

- Free trial enforcement (30 days / 20 websites)
- Full SSG for every element type + animations
- Prisma `WebsiteVersion` table sync / Page–Section relational migration
- Frontend work (`USE_WEBSITE_API`, Pexels → BE stock client switch)
- Applying this migration to **main/prod** (deferred to go-live)

---

## 11. Go-live checklist (DB)

1. Backup prod DB  
2. Deploy `version-2` (or merged `main`) including migration folder  
3. Run `npx prisma migrate deploy` against prod  
4. `npx prisma generate`  
5. Smoke: login → save canvas → publish → live URL  

---

## 12. FE coordination summary

| BE ready | FE action |
|---|---|
| `revision` on GET/PATCH | Start sending `revision`; handle 409 |
| Status uppercase normalize | Can keep sending `Draft`/`Published` |
| Stock APIs | Prefer BE stock over direct Pexels when ready |
| `PUT /assets/visibility` | Already called; now persists |
| Canvas publish | Flip `USE_WEBSITE_API` and QA publish path |
