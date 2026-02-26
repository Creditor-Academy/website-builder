# Project Architecture: Website Builder

## 1. Project Overview and Purpose
This project is a React-based single-page application (SPA) that serves as a drag-and-drop website builder. It allows users to visually construct, edit, and preview websites by composing predefined sections and components. The builder supports multi-page sites, inline text editing, floating component positioning, and provides a property panel for fine-grained control over layout and styling.

## 2. High-Level Architecture Explanation
The architecture follows a clear separation between the "Editor" (the interface used to build the site) and the "Canvas/Preview" (the visual representation of the site being built).
- **Global State Management:** Uses Zustand for a centralized store that manages the complex hierarchy of websites, pages, sections, and floating components.
- **Context API Bridge:** A React Context (`BuilderContext.jsx`) is used to provide localized derived state and actions to the editor's UI components, abstracting direct store manipulations.
- **Dynamic Rendering:** A central dispatcher (`SectionRenderer.jsx`) dynamically renders different section types based on the state data.
- **UI Framework:** Built with React, utilizing Vite as the bundler, Tailwind CSS for styling, and `shadcn/ui` for accessible, reusable editor UI components.

## 3. Folder and File Structure with Explanation
```text
/
├── public/                # Static assets (images, icons, robots.txt)
├── src/
│   ├── components/        # All React components
│   │   ├── editor/        # UI components specific to the builder interface (Toolbars, Panels, etc.)
│   │   ├── preview/       # Components used for site-wide previews (e.g., Navbar, Footer)
│   │   ├── sections/      # The actual building blocks (Hero, Features, Contact, etc.) and the SectionRenderer
│   │   └── ui/            # Reusable primitive UI components (from shadcn/ui)
│   ├── contexts/          # React Contexts (e.g., BuilderContext for editor state)
│   ├── hooks/             # Custom React hooks (e.g., use-mobile, use-toast)
│   ├── lib/               # Utility functions, default data, and configurations (e.g., sectionVariants.js)
│   ├── pages/             # Top-level application routes/pages (Dashboard, Editor, Settings)
│   ├── store/             # Global state management (Zustand store)
│   ├── App.jsx            # Main application component and routing setup
│   ├── index.css          # Global CSS and Tailwind directives
│   └── main.jsx           # Application entry point (ReactDOM.render)
├── package.json           # Project dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
└── vite.config.ts         # Vite bundler configuration
```

## 4. Entry Point and Application Bootstrap Flow
1. **`src/main.jsx`**: The application bootstrap begins here. It sets up the root DOM element and renders the `App` component, usually wrapped in essential providers (like React Router, if used).
2. **`src/App.jsx`**: Defines the routing and structural layout of the application. It directs users to either the application dashboard or the active website editor depending on the current URL route.
3. **Builder Initialization**: When entering the editor route, the `WebsiteEditor` component is mounted. It accesses the `useBuilderStore` (via `BuilderContext`) to load the active website's state (potentially from local storage persistence) and initializes the editing workspace.

## 5. Core Modules and Their Responsibilities
- **`store/useBuilderStore.js`**: The single source of truth. It holds the data structure for websites (Pages -> Sections -> Components), handles state mutations, implements undo/redo history (by snapshotting the pages array), and handles local storage persistence.
- **`contexts/BuilderContext.jsx`**: Acts as an intermediary between the Zustand store and the UI. It provides easy access to the *currently selected* entity (section or component) and exposes focused action methods for the editor UI.
- **`components/editor/WebsiteEditor.jsx`**: The main layout wrapper for the editing experience. It coordinates the left/right panels, top toolbar, and the central canvas.
- **`components/editor/CanvasPreview.jsx`**: The main viewport representing the website being built. It iterates over the page's sections and renders them.
- **`components/sections/SectionRenderer.jsx`**: A critical module that takes a section object from the state and dynamically resolves it to the correct React component (e.g., mapping `{ type: 'Hero' }` to `HeroSection.jsx`).

## 6. Component Hierarchy and Relationships
```text
WebsiteEditor
├── EditorToolbar (Top navigation, Undo/Redo, Publish actions)
├── Left Sidebar (PageManager, SectionsList, MediaLibrary)
├── CanvasPreview (Central workspace)
│   ├── NavbarPreview
│   ├── SectionRenderer (Iterates over sections in the current page)
│   │   ├── [Specific Section Component] (e.g., HeroSection, FeaturesSection)
│   │   │   └── FloatingComponent (Absolute positioned elements within a section)
│   └── FooterPreview
└── Right Sidebar
    └── PropertiesPanel (Context-sensitive settings for the selected element)
```

## 7. State Management Approach
- **Zustand (`useBuilderStore`)**: Chosen for its lightweight, boilerplate-free approach to global state. It perfectly handles the deep, complex nested structures required by a page builder.
- **Local State**: Used within individual UI components for ephemeral UI state (e.g., modal open/close, active tab in a panel).
- **Derived State via Context**: `BuilderContext` calculates things like `activeSection` or `activeComponent` based on IDs stored in Zustand, ensuring components only re-render when their specific data changes.

## 8. Data Flow Between Components/Modules
1. **User Action**: A user clicks a text element in the `CanvasPreview` to edit it.
2. **Local Update**: The specific section component handles the inline editing via `contentEditable`.
3. **State Mutation**: On blur (or specific save action), the component dispatches an action to the `useBuilderStore` (often via `BuilderContext`).
4. **Global State Update**: Zustand updates the nested object tree.
5. **Re-render**: `CanvasPreview` and `SectionRenderer` observe the changed state and re-render the updated section. The `PropertiesPanel` also re-renders to reflect the properties of the newly selected text element.

## 9. Important Utilities, Services, and Helpers
- **`lib/sectionVariants.js`**: Defines structural variations for sections (e.g., a "Hero" section might have a "Left Aligned" variant and a "Center Centered" variant). This allows users to switch layouts without losing content.
- **`lib/defaultPageData.js`**: Provides the initial boilerplate data structure for a new blank page or default templates.
- **`lib/utils.js`**: Common utility functions, typically including Tailwind class merging (`cn` utility from shadcn/ui) to handle conditional styling cleanly.

## 10. External Dependencies and Their Roles
- **React**: Core UI library.
- **Vite**: Fast development server and production bundler.
- **Tailwind CSS**: Utility-first CSS framework used for all styling.
- **Zustand**: Global state management.
- **shadcn/ui (Radix UI + Tailwind)**: Provides unstyled, accessible UI primitives (dialogs, dropdowns, forms) that are styled via Tailwind, heavily used in the editor interface (`src/components/ui/`).
- **Lucide React**: (Inferred) Icon library commonly paired with shadcn/ui.

## 11. Rendering Flow and Lifecycle
1. Store initializes with persisted data.
2. `WebsiteEditor` mounts and retrieves the active page's section array.
3. `CanvasPreview` maps over the section array.
4. For each section, `SectionRenderer` is invoked. It checks the section's `type` and renders the corresponding component from `src/components/sections/`.
5. Within `SectionRenderer`, any "Floating Components" associated with that section are rendered absolutely relative to the section container.
6. User interactions trigger state updates, causing the React reconciliation process to efficiently update only the changed sections or properties panels.

## 12. Patterns Used
- **Dynamic Component Resolution**: The `SectionRenderer` pattern avoids massive `if/else` blocks by dynamically resolving component types.
- **Centralized State + Local Context**: Blending Zustand for the raw data tree with React Context for specialized, localized editor actions.
- **Uncontrolled to Controlled Inputs**: Using `contentEditable` for rich text editing, syncing the final HTML back to the controlled state on blur.

## 13. Suggestions for New Developers
1. **Understand the Data Structure First**: Inspect `src/store/useBuilderStore.js`. Understanding how a "Website" contains "Pages" which contain "Sections" which contain "Components" is crucial.
2. **Follow the Render Flow**: Trace how a section gets rendered starting from `CanvasPreview.jsx` -> `SectionRenderer.jsx` -> Specific Component (e.g., `HeroSection.jsx`).
3. **Creating a New Section**: 
   - Add your new component in `src/components/sections/`.
   - Register it in `SectionRenderer.jsx`.
   - Add it to the sidebar drag-and-drop list (likely in `SectionsList.jsx`).
   - Define any layout variants in `lib/sectionVariants.js`.
4. **Using UI Components**: Leverage the existing components in `src/components/ui/` instead of building custom forms or modals. They are pre-styled and accessible.
5. **State Updates**: Always use the methods provided by `BuilderContext` or `useBuilderStore` to mutate data. Never modify the state directly.