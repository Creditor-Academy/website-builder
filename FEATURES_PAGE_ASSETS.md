# Features Page — Asset Inventory

Reference for remapping assets when replacing `src/pages/Features.tsx` UI.  
Paths are relative to `website-builder/src/`.

---

## Unique image files (4)

| File | Import alias | Disk path |
|------|----------------|-----------|
| `drag_drop.png` | `dragDropImg` | `assets/drag_drop.png` |
| `templates_showcase.png` | `templatesImg` | `assets/templates_showcase.png` |
| `components_palette.png` | `componentsImg` | `assets/components_palette.png` |
| `ui_showcase_1.png` | `uiShowcase1` **and** `uiShowcase2` | `assets/ui_showcase_1.png` |

**Note:** `uiShowcase2` currently imports the **same file** as `uiShowcase1` (`ui_showcase_1.png`). There is no separate `ui_showcase_2.png` on disk.

---

## Import block (current)

```ts
import dragDropImg from "../assets/drag_drop.png";
import templatesImg from "../assets/templates_showcase.png";
import componentsImg from "../assets/components_palette.png";
import uiShowcase1 from "../assets/ui_showcase_1.png";
import uiShowcase2 from "../assets/ui_showcase_1.png"; // duplicate of uiShowcase1
```

---

## Where each asset is used

### 1. Hero — tilted scrolling background columns

| Column | Order of images |
|--------|-----------------|
| Left (scroll up) | `dragDropImg` → `templatesImg` → `uiShowcase1` → `componentsImg` |
| Center (scroll reverse) | `uiShowcase2` → `dragDropImg` → `componentsImg` → `templatesImg` |
| Right (lg only, scroll up) | `templatesImg` → `uiShowcase1` → `dragDropImg` → `uiShowcase2` |

**Suggested new-UI role:** hero / marquee / atmosphere background imagery.

---

### 2. Bento feature cards

| Feature id | Title | Image | Placement on current card |
|------------|-------|-------|---------------------------|
| `components` | Components | `componentsImg` | Large bento (col-span-8), absolute bottom-right decorative |
| `templates` | Premium Templates | `templatesImg` | Tall bento (col-span-4), absolute bottom full-width |
| `drag-drop` | Intuitive Drag & Drop | `dragDropImg` | Full-width row, right side media |
| `tokens` | Global Design Tokens | *(none — CSS color dots only)* | — |
| `responsive` | Precision Mobile Control | *(none — Lucide icons only)* | — |
| `deploy` | Instant Global Deployment | *(none — Lucide Globe animation)* | — |

**Suggested new-UI roles:**
- `components_palette.png` → Components / elements feature visual
- `templates_showcase.png` → Templates feature visual
- `drag_drop.png` → Drag & drop feature visual
- `ui_showcase_1.png` → General product / canvas / UI showcase (hero or secondary)

---

### 3. Other Features page media

| Asset | Used? |
|-------|-------|
| Brand logo (`BrandLogo` → typically `assets/Newlogo.svg`) | Nav / brand mark only |
| Footer | No Features-page-specific images (shared `Footer`) |

---

## Related assets on disk (not imported by Features.tsx today)

Useful if the new Features UI needs more templates / motion:

| File | Path |
|------|------|
| `template_saas_1.png` | `assets/template_saas_1.png` |
| `Drag.gif` | `assets/Drag.gif` |
| `create.mp4` | `assets/create.mp4` |
| `brand.mp4` | `assets/brand.mp4` |
| `Libaray.mp4` | `assets/Libaray.mp4` |
| `Portfolio.jpg`, `Ecomm.jpg`, `Bussiness.jpg`, `Hospital.jpg`, `School.jpg`, `Learning.jpg` | `assets/` |

---

## Quick remap checklist

- [ ] Hero tilted bg → `drag_drop`, `templates_showcase`, `components_palette`, `ui_showcase_1`
- [ ] Components block → `components_palette.png`
- [ ] Templates block → `templates_showcase.png`
- [ ] Drag & drop block → `drag_drop.png`
- [ ] Extra UI shot → `ui_showcase_1.png` (consider adding a real second showcase if needed)
- [ ] Design tokens / responsive / deploy → currently icon-only; assign new assets if the redesign needs images

---

*Generated from `src/pages/Features.tsx` — keep this file while rebuilding the page.*
