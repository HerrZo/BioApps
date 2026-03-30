---
description: Blueprint und Best-Practices zur Erstellung neuer interaktiver Biologie-Apps (React + Tailwind)
---

# BioApp Design Guidelines

Alle Biologie-Lernapps in diesem Repository ("BioApps") müssen ZWINGEND dem unten stehenden exakten technischen, mobilen und visuellen Vorbild folgen.

## 1. Technischer Stack & Struktur
Jede App wird als **Single-File SPA (Single Page Application)** in der Datei `index.html` erstellt.
- Bibliotheken (via CDN): React 18, Babel Standalone (für JSX), TailwindCSS (`<script src="https://cdn.tailwindcss.com"></script>`).
- `<body class="bg-green-50 text-gray-900 min-h-screen font-sans">` -> Es gibt ein `<div id="root"></div>`.
- Die gesamte Logik lebt in `<script type="text/babel">`.

## 2. Visuelles Design: IMMER GRÜN
- **Farbpalette:** Das Thema ist IMMER grün, um zu den anderen Biologie-Apps zu passen! Die Akzentfarben sind `green-500`, `green-600`, `green-700`, `green-800` für Text, Buttons und Rahmen. Hintergründe nutzen `green-50` oder `green-100`.
- **Ecken & Schatten:** Boxen haben große Rundungen (`rounded-xl` oder `rounded-2xl`).- **Header & Navigation**: Oben ein Sticky-Header (`sticky top-2 z-50`). 
  - Die Navigation erfolgt **nicht** über ein Kachel-Dashboard, sondern über eine horizontale **Tab-Navigation (Scrolled Mobile)** im oder unter dem Header. (Beispiel: `<nav className="flex bg-black/10 p-1 rounded-xl overflow-x-auto max-w-full">`). Dies ist der Standard der meisten BioApps! Aktive Tabs sollen deutlich hervorgehoben sein (z.B. weißer Hintergrund, Schatten, und Icon).
- **Icons**: Verwende saubere SVG-Icons (z.B. von FeatherIcons / Lucide).
- **Hintergrund & Layout-Shell**:
  Der gesamte SPA-Container bekommt z.B.:
  `<div className="container mx-auto max-w-5xl p-2 md:p-4 h-screen flex flex-col">` oder `min-h-screen`.

### Header (Sticky Navigation)
Der Header oben bleibt über `sticky top-2 z-50` beim Scrollen sichtbar und passt sich der Screen-Größe an:
```jsx
<header className="flex justify-between items-center mb-4 md:mb-6 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-green-100 sticky top-2 z-50">
    <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => setCurrentStation('dashboard')}>
        <div className="bg-green-100 p-2 rounded-lg text-green-700">
            <IconHome className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
            {/* Responsiver Titel */}
            <h1 className="text-lg md:text-2xl font-bold text-green-800 leading-tight">Themenname</h1>
            {/* Subtitel verschwindet auf Mobile! */}
            <p className="text-xs text-green-600 hidden md:block">Untertitel</p>
        </div>
    </div>
    
    <div className="flex items-center gap-2">
        {currentStation !== 'dashboard' && (
            <button onClick={() => setCurrentStation('dashboard')} className="text-xs md:text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium hover:bg-green-200 transition">
                Zur Übersicht
            </button>
        )}
        {/* Die Mini-Navigationsobjekte als Kreise sind NUR auf Desktop sichtbar */}
        {currentStation !== 'dashboard' && (
            <div className="hidden md:flex gap-1">
                {/* <button className="... w-7 h-7 rounded-full ...">1</button> etc. */}
            </div>
        )}
    </div>
</header>
```

### Main Area Layout
Der Inhaltsbereich, der das Dashboard oder die aktive Station rendert:
```jsx
<main className="flex-grow bg-white rounded-2xl shadow-xl p-4 md:p-8 border border-green-50 relative overflow-hidden min-h-[400px]">
    {renderContent()}
</main>
```

### Footer
```jsx
<footer className="text-center text-xs text-gray-400 mt-4 md:mt-6 pb-4">
    Johannes-Scharrer-Gymnasium &bull; Zollfrank &bull; &copy; {new Date().getFullYear()}
</footer>
```

## 4. Dashboard (Startansicht)
Auf dem Dashboard gibt es Kacheln (Cards) für verschiedene Stationen.
- Mobile First Grid: `<div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">` (2 nebeneinander auf Mobile, 3 auf Desktop).
- Große Touchflächen (`p-4 md:p-5`), kleine Schriften (`text-xs md:text-sm`).
- Aktiver Zustand (z.B. Station Abgeschlossen) erhält eine kreisrunde, grüne Badge mit Häkchen oben rechts an der Kachel.

## 5. Stationen & Inhalt
- Ansichten einer Station beginnen immer mit: `<div className="animate-fade-in space-y-4 md:space-y-6">`
- Überschriften nutzen den Stil: `<h2 className="text-xl md:text-2xl font-bold text-green-800 border-b pb-2">...</h2>`
- Jede Station wird nach Abschluss (`onComplete()`) markiert, sodass der globale Progressbar (`Fortschritt: X/Y`) wächst.
- Das Quiz am Ende nutzt Multiple-Choice, gibt grünes/rotes Feedback und präsentiert auf einem Result-Screen einen großen `<IconCheck />`.

Halte dich zukünftig EXACT an dieses Template. Ändere die primäre Farbe niemals von Grün weg. Skaliere Padding, Typographie und Abstand für Mobile (Basis) -> und Desktop `md:`.
