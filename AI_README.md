# BioApps - AI Architecture & Guidelines

## 1. Project Overview & Philosophy
BioApps is a collection of interactive Biology learning applications (currently 12+ apps). 
The project prioritizes **extreme portability and zero-build simplicity**. 
There is **no Node.js build step, no npm setup, and no Webpack/Vite config**. 

Every application is a **Self-Contained React Application** operating entirely off CDNs (Tailwind, React, Babel) and contained within a single `index.html` file per directory.

## 2. Directory Structure
```
BioApps/
├── index.html                   # Main landing page (Vanilla JS + Tailwind)
├── shared/                      
│   ├── dark-mode.css            # Global CSS overrides for Dark Mode
│   └── tailwind-config.js       # Shared Tailwind palette (Forest theme + animations)
├── [App Name]/                  # e.g., Gametogenese/, Chromosomensätze/, Mendel/
│   └── index.html               # The self-contained React app for this module
└── AI_README.md                 # This file
```

## 3. Technology Stack & CDNs
If you are adding a new App or modifying an existing one, you MUST preserve this `<head>` configuration:
- **Tailwind CSS**: `<script src="https://cdn.tailwindcss.com"></script>`
- **React 18**: `<script crossorigin src="https://unpkg.com/react@18/..."></script>`
- **React DOM 18**: `<script crossorigin src="https://unpkg.com/react-dom@18/..."></script>`
- **Babel Standalone**: `<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>`

React code is written inside `<script type="text/babel">`.
React hooks are destructured from the global React object: 
`const { useState, useEffect, useRef, useMemo, useCallback } = React;`

## 4. UI/UX & Design System (Forest Theme)
The apps strictly adhere to a **Green/Forest** design system.
1. **Fonts:** "Inter" (sans-serif).
2. **Colors:** The `tailwind-config.js` defines a `forest` color palette (`forest-50` to `forest-950`). Use these green variants for primary UI elements.
3. **Animations:** Built-in Tailwind animations `animate-fadeIn` and `animate-slideUp` are configured. Use them on cards and new sections.
4. **Icons:** DO NOT import icon libraries like Lucide or FontAwesome. Icons are written as pure inline functional SVG components (e.g., `const IconHome = () => <svg>...</svg>`).
5. **Dark Mode:** Toggled globally via `data-dark-toggle`. Do not rely solely on Tailwind's `dark:` classes for color logic unless needed; `shared/dark-mode.css` handles most generic dark mode inversions (e.g., `.dark .bg-white { background-color: #14532d !important; }`).

## 5. Architectural Patterns inside `index.html`
When changing or creating a new app, ensure you follow this component structure:
1. **Icons Block**: Define SVG icon components.
2. **Data Block**: Define constants, state data, or quiz questions (`const QUIZ_DATA = [...]`).
3. **Helper Components**: e.g., `ChromosomeSVG`, `Cell`, `SectionWissen` (Knowledge), `SectionLabor` (Interactive Lab).
4. **Main App Component**: The `<App />` component which holds top-level state (e.g., `activeTab`, `sliderValue`).
5. **Render Call**: 
```javascript
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

## 6. How to Implement New Features
- **Adding a new tab/section:** Inside `<App />`, find `renderTabContent()`. Add a new `case 'myNewTab': return <MyNewComponent />;`.
- **Modifying SVG Graphics:** Many apps generate raw `<svg>` elements using React state. Always utilize relative coordinate math (`cx`, `cy`, `r`) based on a fixed viewBox. 
- **Adding an App to the Hub:** To add a new app to the landing page, open `/index.html` and add a new object to the `const projects = []` array (with `id`, `title`, `description`, `link`, `tag`, `iconType`).

## 7. AI Rules for Modification
1. **DO NOT** convert the project to NPM/Node.js or add a `package.json`.
2. **DO NOT** separate React code into `.js` or `.jsx` files. It MUST remain in the `<script type="text/babel">` block of the `index.html` file due to strict CORS rules for local file execution.
3. **KEEP IT STANDALONE:** Everything must work when a student double-clicks `index.html` from their local file system (using `file://` protocol).
