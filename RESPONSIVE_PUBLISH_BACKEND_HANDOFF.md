# Responsive publish handoff — tablet and mobile styles are dropped on the live site

**Audience:** Backend (`static-site-generator`, website content normalize, publish)  
**From:** Frontend canvas editor (`schemaVersion: 2`)  
**Date:** 24 Sep 2026  
**Symptom:** In the editor, switching Desktop / Tablet / Mobile shows the correct layout. After publish / hosting, the live site stays on the desktop layout. Tablet and mobile overrides never appear.

This is a **publish rendering** bug, and it can also be a **save-normalize** bug if `responsiveStyles` is stripped before it is stored. The editor already writes the responsive data. The live HTML must apply it with real CSS breakpoints. Collapsing the tree to one desktop style at publish time will always look broken on a phone.

---

## 1. What the frontend already sends

Every canvas **section**, **container**, and **element** is saved on `PATCH /websites/:id` inside `content.pages[].sections[]`.

Two fields carry style. Both must be stored exactly as sent. Do not drop either one.

| Field | Meaning |
|---|---|
| `styles` | Desktop / base styles. Flat object of CSS values. |
| `responsiveStyles` | Overrides for `tablet` and `mobile` only. Partial objects. Keys that are missing stay on the desktop value. |

`responsiveStyles.desktop` is not used. Desktop edits are written into `styles`.

### Example the editor saves today

A heading whose font size and position were edited on each device:

```json
{
  "id": "el-heading",
  "type": "text",
  "content": { "text": "Welcome", "tag": "h2" },
  "styles": {
    "fontSize": "36px",
    "fontWeight": "700",
    "color": "#0f172a",
    "width": "640px",
    "position": "absolute",
    "left": "64px",
    "top": "80px"
  },
  "responsiveStyles": {
    "tablet": {
      "fontSize": "30px",
      "left": "32px",
      "width": "480px"
    },
    "mobile": {
      "fontSize": "26px",
      "left": "16px",
      "top": "48px",
      "width": "100%"
    }
  },
  "visibility": {
    "desktop": true,
    "tablet": true,
    "mobile": true
  }
}
```

Same shape on the parent section and container (`minHeight`, `padding`, `backgroundColor`, `left`, `top`, and so on).

### Second shape the generator must also accept

Older notes and `website-content.utils.ts` may rewrite `styles` into a breakpoint bag. The editor can **read** this shape on GET and unpack it. If normalize rewrites `styles`, it must **copy** `responsiveStyles` into that bag. It must not replace the node with `{ base }` only.

```json
{
  "styles": {
    "base": { "fontSize": "36px", "color": "#0f172a", "left": "64px", "top": "80px", "width": "640px" },
    "tablet": { "fontSize": "30px", "left": "32px", "width": "480px" },
    "mobile": { "fontSize": "26px", "left": "16px", "top": "48px", "width": "100%" }
  },
  "responsiveStyles": {
    "tablet": { "fontSize": "30px", "left": "32px", "width": "480px" },
    "mobile": { "fontSize": "26px", "left": "16px", "top": "48px", "width": "100%" }
  }
}
```

`styles.base` and `styles.desktop` are the same thing (desktop). Prefer `base` when writing the bag. `styles.tablet` / `styles.mobile` are the same overrides as `responsiveStyles.tablet` / `responsiveStyles.mobile`.

**If both exist, merge them. Do not pick only one.** Tablet keys: `responsiveStyles.tablet` overlaid on `styles.tablet`. Mobile keys: `responsiveStyles.mobile` overlaid on `styles.mobile`. Desktop keys: flat `styles` when it is not a breakpoint bag, otherwise `styles.base` or `styles.desktop`.

---

## 2. How the editor merges a device (this is the spec)

Source: `src/builder/styles.ts` → `resolveStyles`.

```
desktop styles = styles                         // flat desktop object
tablet styles  = desktop styles + responsiveStyles.tablet
mobile styles  = desktop styles + responsiveStyles.mobile
```

Rules:

1. Start from the full desktop object.
2. Overlay only the keys present on that breakpoint.
3. Skip a key when the override is `undefined`, `null`, or `""`. An empty override must not wipe the desktop value.
4. **Mobile does not inherit tablet.** A tablet `fontSize` must not apply on a phone unless `responsiveStyles.mobile.fontSize` is also set.
5. Desktop edits do not delete tablet/mobile overrides. They stay in `responsiveStyles` until the user changes that device.

`properties.freePosition` is a single last-edited position used by the editor. **It is not the responsive source of truth.** Per-device `left`, `top`, `width`, `height`, `transform`, and `zIndex` live in `styles` (desktop) and `responsiveStyles.tablet` / `responsiveStyles.mobile`.

---

## 3. Why the current publish path fails

`BACKEND_CHANGES_FE_MERGE_CODE.md` (styles bullet) says the generator:

- “Resolves flat styles and `{ base, tablet, mobile }` / `responsiveStyles` (desktop-first)”
- “Honors `visible === false` and `visibility.desktop === false`”

That behavior matches a desktop-only site:

| Current behavior | What the live site needs |
|---|---|
| Resolve **one** device (desktop) and inline it as a `style=""` attribute | Emit **three** resolved style sets, each inside its own viewport range |
| Read `visibility.desktop` only | Hide the node on tablet or mobile when that flag is `false` |
| Normalize may wrap flat `styles` as `{ base }` and ignore the sibling `responsiveStyles` | Persist `responsiveStyles` and, if rewriting `styles`, copy tablet/mobile into `styles.tablet` / `styles.mobile` |

A desktop-first `@media (max-width: …)` stack is also wrong if tablet rules are still active inside the mobile range. See section 5. Use **non-overlapping** ranges.

---

## 4. Breakpoints (match the editor frames)

Editor frame widths (`DEVICE_WIDTHS`):

| Device | Editor frame | Published CSS range |
|---|---|---|
| Mobile | 390px | `max-width: 767px` |
| Tablet | 768px | `min-width: 768px` and `max-width: 1024px` |
| Desktop | 1280px | `min-width: 1025px` |

These ranges do not overlap, so a tablet override cannot leak onto a phone.

---

## 5. Required generator output

For every section, container, and element, emit a stable class (for example `n-{id}`) and three blocks. Each block is the **fully merged** style map for that device (section 2), converted to CSS.

```css
/* desktop: styles only */
@media (min-width: 1025px) {
  .n-el-heading {
    font-size: 36px;
    font-weight: 700;
    color: #0f172a;
    width: 640px;
    position: absolute;
    left: 64px;
    top: 80px;
  }
}

/* tablet: styles + responsiveStyles.tablet  — not applied to mobile */
@media (min-width: 768px) and (max-width: 1024px) {
  .n-el-heading {
    font-size: 30px;
    font-weight: 700;
    color: #0f172a;
    width: 480px;
    position: absolute;
    left: 32px;
    top: 80px; /* no tablet top override, desktop top remains */
  }
}

/* mobile: styles + responsiveStyles.mobile  — tablet left/width are NOT used */
@media (max-width: 767px) {
  .n-el-heading {
    font-size: 26px;
    font-weight: 700;
    color: #0f172a;
    width: 100%;
    position: absolute;
    left: 16px;
    top: 48px;
  }
}
```

Do this for **every** node that has styles, not only text. Position, size, padding, gap, flex direction, colors, and typography are all per breakpoint.

Inlining one `style=""` attribute is not enough. Media queries cannot override an inline style unless every breakpoint is also inline (which they cannot be). Put responsive CSS in a `<style>` block in the page `<head>`.

### Visibility

| Stored value | Published result |
|---|---|
| Section `visible === false` | Omit the section, or `display: none` at all widths |
| `visibility.desktop === false` | `display: none` inside the desktop media query only |
| `visibility.tablet === false` | `display: none` inside the tablet media query only |
| `visibility.mobile === false` | `display: none` inside the mobile media query only |
| Missing `visibility` or a missing key | Treat as visible (`!== false`) |

`display: none` for a hidden breakpoint must win over a `display: flex` (or similar) stored in styles. Use `display: none !important` on that breakpoint only.

### CSS property map

JSON keys are camelCase. Emit kebab-case. Same map as `src/builder/styles.ts`:

| JSON key | CSS property | Notes |
|---|---|---|
| `width`, `height`, `minHeight`, `maxWidth`, `minWidth` | same | |
| `padding`, `margin`, `gap` | same | |
| `display`, `flexDirection`, `justifyContent`, `alignItems`, `alignSelf` | same | |
| `backgroundColor` | `background-color` | |
| `backgroundGradient` | `background-image` | Wins over `backgroundImage` when set |
| `backgroundImage` | `background-image` | If the value does not start with `linear` and does not contain `url(`, wrap it: `url(...)` |
| `backgroundSize`, `backgroundPosition` | same | |
| `color` | `color` | |
| `opacity` | `opacity` | Number `0`–`1`. Keep `0`. |
| `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `textAlign` | same | `fontWeight` may be a number (`700`) or a string |
| `borderWidth`, `borderStyle`, `borderColor`, `borderRadius` | same | |
| `boxShadow` | `box-shadow` | |
| `position`, `left`, `top`, `right`, `bottom` | same | Include these. Absolute canvas layout depends on them. |
| `zIndex` | `z-index` | Number |
| `transform` | `transform` | Example: `rotate(12deg)` |
| `overflow` | `overflow` | |
| `objectFit` | `object-fit` | Images |

Skip keys whose value is `undefined`, `null`, or `""`.

`backgroundColor: "transparent"` is a real value. Keep it.

---

## 6. Backend changes

### 6.1 Persist the data — `website-content.utils.ts`

On save normalize, for every section, container, and element:

1. Keep `responsiveStyles` on the node. Do not delete it as an unknown field.
2. If you upgrade `styles` into `{ base, tablet, mobile }`:
   - `base` = the flat desktop `styles` (or existing `styles.base` / `styles.desktop`)
   - `tablet` = merge(`styles.tablet`, `responsiveStyles.tablet`)
   - `mobile` = merge(`styles.mobile`, `responsiveStyles.mobile`)
3. Do not move tablet/mobile keys into `base`.
4. Do not run a whitelist that only allows desktop CSS keys and then drops `responsiveStyles`.
5. Validation (`website.validation.ts`) must allow both `styles` as an object (flat **or** breakpoint bag) and `responsiveStyles` as `{ tablet?, mobile? }`. A strict schema that strips unknown keys is the persistence bug.

**Check after a save:** `GET /websites/:id` and open a node that was edited on mobile. You must still see `responsiveStyles.mobile` (or `styles.mobile` containing those keys). If GET already lost them, fix normalize before touching the generator. Republish cannot recover data that was deleted on save.

### 6.2 Render the data — `static-site-generator.ts`

1. Walk canvas sections (`kind: "canvas"` or a `children` tree): section → containers → elements.
2. Resolve three style maps per node (section 2), accepting both JSON shapes (section 1).
3. Emit the three non-overlapping `@media` blocks (section 5) into the page stylesheet.
4. Apply per-device visibility (section 5).
5. Keep prebuilt sections on their existing renderers. This handoff is for canvas nodes. If a prebuilt node also has `responsiveStyles`, run the same CSS helper so those overrides are not dropped.

Add a test in `static-site-generator.canvas.test.ts`:

- Fixture node with desktop `fontSize: 36px`, tablet `30px`, mobile `26px`, and `visibility.mobile: false`.
- Assert the HTML contains `@media (min-width: 1025px)` with `font-size: 36px`.
- Assert the tablet query (`768px`–`1024px`) contains `font-size: 30px` and does **not** wrap the mobile rule.
- Assert `@media (max-width: 767px)` contains `font-size: 26px` and `display: none`.
- Assert a second fixture where **only tablet** sets `fontSize`. The mobile query must still use the desktop font size (`36px`), not `30px`.

### 6.3 Republish

Existing published sites keep the old HTML until they are published again. After the generator fix, republish (or say so in the deploy notes) so S3 / hosting picks up the new CSS. Sites whose `responsiveStyles` were already stripped in the DB need a new editor save first, then publish.

---

## 7. Frontend changes

**No editor change is required for the live site to become responsive**, as long as the backend stores `responsiveStyles` and emits the CSS above. The canvas already:

- writes desktop into `styles`
- writes tablet/mobile patches into `responsiveStyles[device]` (`patchResponsiveStyles`)
- sends that tree on `PATCH /websites/:id` via `content.pages`
- reads either the flat shape or `{ base, tablet, mobile }` back on GET (`unpackNodeStyles`)

### Optional hardening (frontend, after backend confirms GET keeps the field)

Pack each node at save time so the stored document has one canonical bag **and** the sibling field:

```json
"styles": {
  "base": { "...desktop..." },
  "tablet": { "...tablet overrides only..." },
  "mobile": { "...mobile overrides only..." }
},
"responsiveStyles": {
  "tablet": { "...same tablet overrides..." },
  "mobile": { "...same mobile overrides..." }
}
```

Do this only in addition to the backend fix. Packing on the frontend does not help if normalize or the generator still ignores `tablet` / `mobile`.

Files if we do that later: `src/builder/websiteDocument.ts` (`toWebsiteContent`) and `src/builder/adapter.ts` (add a `packNodeStyles` used only on save; load stays on `unpackNodeStyles`).

---

## 8. Acceptance checklist

1. In the editor, set a heading to 36px on desktop, 30px on tablet, 26px on mobile. Move it to a different `left` / `top` on mobile. Save.
2. `GET` the website. The heading node still has those tablet and mobile values (`responsiveStyles` or `styles.tablet` / `styles.mobile`).
3. Publish. Open the live URL.
4. At ≥ 1025px: 36px and the desktop position.
5. At 768–1024px: 30px and the tablet position. Desktop-only keys (color, font weight) still match desktop.
6. At ≤ 767px: 26px and the mobile position. The tablet font size and tablet `left` are **not** used.
7. Turn **Visible on mobile** off, save, republish. The node is gone on a phone and still visible on desktop and tablet.
8. A node with no `responsiveStyles` still renders its desktop styles at every width (no crash, no empty style).

---

## 9. Files

| Repo | File | Change |
|---|---|---|
| Backend | `website-content.utils.ts` | Keep `responsiveStyles`. When upgrading `styles`, copy tablet and mobile into the breakpoint bag. |
| Backend | `website.validation.ts` | Allow `responsiveStyles` and breakpoint-shaped `styles`. |
| Backend | `static-site-generator.ts` | Emit three non-overlapping media queries per canvas node. Honor `visibility.tablet` and `visibility.mobile`. |
| Backend | `static-site-generator.canvas.test.ts` | Cases in section 6.2. |
| Frontend | none required | Optional save-time pack in section 7. |
