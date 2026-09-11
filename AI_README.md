# BioApps - AI Architecture & Guidelines

## 1. Project Overview & Philosophy
BioApps is a collection of interactive Biology learning applications (currently 15 apps) created for students at the Johannes-Scharrer-Gymnasium. 

The architecture balances **clean modular development** with **instant, zero-latency execution on GitHub Pages & offline**:
- **Modular Directory Structure:** Each app is an independent, isolated subfolder. There is **no root `package.json` and no monorepo**. Apps can be added, modified, or removed independently.
- **Modern TypeScript & React:** Source code is written in clean, modern TypeScript and React 18 inside `src/`.
- **Pre-Bundled Standalone Output (`vite-plugin-singlefile`):** When built (`npm run build`), Vite packages the app into a single, compact, self-contained `index.html` per folder where JS and CSS are fully inlined.
- **GitHub Pages & Offline Ready:** Because the deployed `index.html` contains all necessary code, it loads instantly on GitHub Pages (1 single HTTP request, no module loading delays) and works offline via `file://` double-click.

---

## 2. Directory Structure
```
BioApps/
├── index.html                   # Main landing page / app hub (Vanilla JS + Tailwind)
├── shared/                      
│   ├── dark-mode.css            # Global CSS overrides for Dark Mode
│   ├── dark-mode.js             # Global toggleDarkMode() implementation & localStorage
│   ├── animations.css           # Keyframe animations (fadeIn, slideUp, float)
│   └── tailwind-config.js       # Shared Tailwind palette (Forest theme + animations)
├── [App Name]/                  # e.g., Gametogenese/, Enzyme/, Mendel/, Insektenflug/
│   ├── package.json             # Local Vite & React dependencies
│   ├── vite.config.ts           # Singlefile build config
│   ├── tsconfig.json            # TypeScript configuration
│   ├── index.html               # The deployed, pre-bundled standalone app
│   ├── index_dev.html           # Dev template referencing /src/main.tsx
│   └── src/
│       ├── main.tsx             # React DOM root render
│       ├── App.tsx              # Main React application component
│       ├── data.ts              # (Optional) Statics, quizzes, glossary datasets
│       └── index.css            # Local styling additions
├── build_all.py                 # Optional helper script to build all apps
└── AI_README.md                 # This file
```

---

## 3. Technology Stack
Each app folder uses:
- **React 18** (`react`, `react-dom`)
- **TypeScript** (`typescript`, `@types/react`, `@types/react-dom`)
- **Vite 5** (`vite`, `@vitejs/plugin-react`, `vite-plugin-singlefile`)
- **Tailwind CSS**: Loaded in `<head>` via CDN + `shared/tailwind-config.js` + `shared/dark-mode.css`
- **Dark Mode**: Managed via `shared/dark-mode.js` (`data-dark-toggle` button in navigation).

---

## 4. UI/UX & Design System (Forest Theme)
The apps strictly adhere to the **Green/Forest** design system:
1. **Fonts:** "Inter" (sans-serif).
2. **Colors:** The `tailwind-config.js` defines the `forest` color palette (`forest-50` to `forest-950`). Use these green variants for primary UI elements.
3. **Animations:** Tailwind animations `animate-fadeIn` and `animate-slideUp` from `shared/tailwind-config.js` and `shared/animations.css`.
4. **Icons:** DO NOT import heavy external icon libraries. Use pure inline functional SVG components (e.g., `const IconHome = () => <svg>...</svg>`).
5. **Dark Mode:** Toggled globally via `data-dark-toggle`. Do not rely solely on Tailwind's `dark:` classes for color logic; `shared/dark-mode.css` handles central color inversions.
6. **Navigation Bar:** Every app should provide the standard sticky top navigation bar with a link back to `../index.html` and the dark mode toggle button.

---

## 5. Development & Build Workflow
When making changes to an app:
1. Edit the source code in `[App Name]/src/App.tsx` (and `src/data.ts`).
2. Run the build in the app's directory:
   ```bash
   cd "[App Name]"
   npm run build
   copy dist\index.html index.html   # On Windows (or cp dist/index.html index.html on Linux/macOS)
   ```
3. Test that `[App Name]/index.html` opens directly in a browser without any dev server.

---

## 6. Rules for AI Coding Assistants
1. **DO NOT CREATE A ROOT PACKAGE.JSON:** The project intentionally keeps each app folder self-contained and modular. Do not turn the project into an npm monorepo or workspace.
2. **PRESERVE FOLDER NAMES & URLS:** Never rename existing app folders (e.g., `KaryogrammAnalse` must keep its exact folder name), because students, teachers, and QR codes link to them.
3. **KEEP OUTPUT STANDALONE:** Always compile to singlefile `index.html` via `vite-plugin-singlefile` so that every app runs directly without a server on GitHub Pages and local disk.
4. **ADDING A NEW APP:**
   - Create a new directory `[NewApp]/`.
   - Add standard `package.json`, `vite.config.ts`, `tsconfig.json`, `src/main.tsx`, `src/App.tsx`.
   - Build into standalone `index.html`.
   - Register the app in the root `index.html` in the `const projects = []` array with `id`, `title`, `description`, `link`, `tag`, and `iconType`.
