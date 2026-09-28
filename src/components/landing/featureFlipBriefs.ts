export type FeatureFlipBrief = {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  points: string[];
  tip?: string;
};

/** Friendly technical briefs adapted from WebStudio Product Manual.pdf */
export const featureFlipBriefs: Record<string, FeatureFlipBrief> = {
  "visual-canvas": {
    id: "visual-canvas",
    title: "Visual canvas",
    eyebrow: "Layout & positioning",
    summary:
      "The center of the editor is a live canvas—what you move is what visitors will see. You work visually, then dial in exact values when you need precision.",
    points: [
      "Click any block to show its selection frame, then drag to reorder the layout.",
      "Use the blue corner and edge handles to resize height and width on the fly.",
      "Open Properties on the right for padding, margin, alignment, and hex colors.",
      "Undo with Ctrl+Z or Redo with Ctrl+Y anytime from the top bar.",
    ],
    tip: "Think of the canvas as your real page—not a wireframe. Changes appear instantly.",
  },
  elements: {
    id: "elements",
    title: "Elements",
    eyebrow: "Building blocks",
    summary:
      "Everything you add comes from the Elements rail: small pieces (text, buttons) and full sections (hero, pricing) that drop straight onto the page.",
    points: [
      "Open Elements on the left rail, then click or drag an item onto the canvas.",
      "Core pieces include Heading, Text, Image, Button, Video, Form, Gallery, and more.",
      "Headers come as Simple, Classic, Centered, or Split—picking one replaces the current header.",
      "Sections cover Hero, Features, FAQ, CTA, Contact, Blog, and other ready-made blocks.",
      "Footers include Standard, Newsletter, Mega Columns, Contact Row, and similar presets.",
    ],
    tip: "Regular sections stack down the page. A new Header or Footer replaces the active one.",
  },
  "inline-editing": {
    id: "inline-editing",
    title: "Inline edit & drag-drop",
    eyebrow: "Edit & rearrange",
    summary:
      "Build by feel: drag blocks into place, then click the copy and rewrite it right on the canvas—no separate text dialog.",
    points: [
      "Drag elements from the left rail onto the canvas, or reorder existing blocks by dragging.",
      "Use the selection frame to move and resize; blue handles snap height and width as you go.",
      "Click text once for the floating format bar (Bold, Italic, font, size, color).",
      "Double-click inside text or a button label to type directly on the page.",
      "Click outside the block to save and close the format bar.",
    ],
    tip: "Drop the layout first, then polish the words. Drag to structure, double-click to rewrite.",
  },
  "design-system": {
    id: "design-system",
    title: "Design system",
    eyebrow: "Brand consistency",
    summary:
      "Design keeps every page looking like one product. Set colors and style once; Web Studio applies them site-wide.",
    points: [
      "Open Design from the left rail (or the Palette control in the top bar).",
      "Pick a Color Palette so buttons, accents, and text stay on-brand everywhere.",
      "Choose a Style Preset for shared corner radius and shadow depth.",
      "New pages inherit the same global look automatically.",
    ],
    tip: "Change the palette once instead of restyling every section by hand.",
  },
  templates: {
    id: "templates",
    title: "Blank canvas or templates",
    eyebrow: "Getting started",
    summary:
      "New projects begin on the dashboard. Name the site, then start blank or jump in with a pre-built layout—the editor opens right away.",
    points: [
      "Click New Project and enter a name (up to 100 characters).",
      "Choose Blank for a clean canvas, or pick a pre-designed template.",
      "Create Project launches the canvas editor automatically.",
      "From there, structure the page with Header, Hero, content, and Footer from Elements.",
    ],
    tip: "Templates are a head start, not a lock-in—you can rewrite every block after you open the project.",
  },
  responsive: {
    id: "responsive",
    title: "Desktop, tablet, and mobile",
    eyebrow: "Responsive viewports",
    summary:
      "One layout, three viewports. Switch devices in the top bar and tweak spacing or sizing for that screen only.",
    points: [
      "Use Desktop, Tablet, and Mobile controls in the top toolbar.",
      "Edits made in a viewport save for that screen size automatically.",
      "Switch back to Desktop to confirm the wide layout still looks right.",
      "Zoom with +/−, reset to 100%, or Fit to scale the canvas to your window.",
    ],
    tip: "Check all three viewports before you publish—small spacing fixes here prevent big mobile surprises live.",
  },
  assets: {
    id: "assets",
    title: "Assets and stock",
    eyebrow: "Media library",
    summary:
      "Assets is your media shelf. Upload your own files or pull royalty-free stock, then drop them onto images on the canvas.",
    points: [
      "Open Assets on the left rail.",
      "Upload PNG, JPG, SVG, or MP4—or search stock image libraries.",
      "Select an asset to apply it to the current image, or copy its hosted URL.",
      "Remove uploads you no longer need; shared library stock stays available.",
    ],
    tip: "For images already on the page, Properties also lets you paste a URL or pick from Assets.",
  },
  publish: {
    id: "publish",
    title: "Publish to a live address",
    eyebrow: "Go live",
    summary:
      "When the design feels ready, Publish Site ships it to the web with SSL and hosting included—no separate deploy pipeline.",
    points: [
      "Preview Desktop, Tablet, and Mobile, then click Publish Site in the top bar.",
      "Set a unique subdomain (your-name.webstudio.site) or attach a verified custom domain.",
      "Click Publish Now and wait for the success message.",
      "Copy the live link or open Visit Site. Re-publish anytime after you make edits.",
    ],
    tip: "You need a free subdomain or a connected custom domain before the first publish. SSL is created automatically.",
  },
  "ready-live": {
    id: "ready-live",
    title: "Ready to see your site live?",
    eyebrow: "Zero to live",
    summary:
      "Web Studio is built for a short path: sign in, create a project, design on the canvas, and publish—without writing code.",
    points: [
      "Sign in, then create a project from a blank canvas or a template.",
      "Add Header, sections, and Footer from Elements; edit copy inline.",
      "Add pages like About or Contact and link them from the nav.",
      "Check responsive views, then Publish Site and open your live URL.",
    ],
    tip: "A green save dot in the top bar means your latest edits are synced before you publish again.",
  },
};
