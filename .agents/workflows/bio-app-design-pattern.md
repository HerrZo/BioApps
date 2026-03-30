---
description: Design- und Architektur-Richtlinien für alle interaktiven Biologie-Apps (React + Tailwind)
---

# BioApp Design Guidelines

Alle Biologie-Lernapps in diesem Repository ("BioApps") müssen strikt einem einheitlichen technischen und visuellen Design folgen, damit sich Schüler (z.B. der gymnasialen Oberstufe) plattformübergreifend an das gleiche Interaktionsmuster gewöhnen können.

## 1. Technischer Stack & Architektur
Jede App wird als **Single-File SPA (Single Page Application)** in der Datei `index.html` erstellt.
Es werden keine separaten CSS- oder JS-Dateien verwendet!

**Zwingend einzubindende externe Bibliotheken (via CDN):**
- TailwindCSS (`<script src="https://cdn.tailwindcss.com"></script>`)
- React 18 (`react` und `react-dom` UMD PRODUCTION)
- Babel Standalone (`@babel/standalone/babel.min.js`) für in-browser JSX-Kompilierung.

## 2. Struktur der `index.html`
- **DOCTYPE & Head:** Standard HTML5. Meta-Viewport für Mobile-First. Theme-Color passend zur Hauptfarbe.
- **Styles:** Custom CSS Animationen (`@keyframes`) unter `<style>` für komplexe Micro-Interactions (z.B. Fade-Ins, Pulsen, Floaten).
- **Body:** Nutzt Tailwind-Klassen zur Hintergrundfärbung (z.B. `bg-green-50 text-gray-900 min-h-screen font-sans`). Ein leeres `<div id="root"></div>`.
- **Script:** Ein `<script type="text/babel">` Block, in welchem die komplette React-App geschrieben wird.

## 3. React App-Layout
Die Hauptkomponente (`<App />`) verwaltet den globalen State:
- `currentStation` (welche Lektion/Simulation aktuell geöffnet ist oder 'dashboard')
- `progress` (Objekt, das trackt, welche Stationen bereits abgeschlossen sind)

**Das Dashboard:**
Zeigt eine Willkommensnachricht ("Willkommen! Wähle eine Station...") und rendert z.B. 4 bis 7 "Stationen" als anklickbare Kacheln.
Jede Kachel zeigt:
- Die Nummer der Station (zB. "St. 1")
- Ein SVG Icon
- Titel und kurze Beschreibung
- Einen grünen Haken, wenn abgeschlossen.
- Ganz unten auf dem Dashboard befindet sich ein globaler Fortschrittsbalken.

**Stations-Ansicht:**
- Oben ein **Header** (Sticky): Links ein Zurück-Button ("Zur Übersicht" bzw. "Home Icon") und der Name der App. Rechts ggf. direkt anwählbare Nummern der Stationen zur schnellen Navigation.
- In der Mitte: Der **Content-Bereich** (`<main>`). Hier wird die aktive `StationX`-Komponente gerendert.
- Unten: **Footer** (`Johannes-Scharrer-Gymnasium • Zollfrank • © 202X`).

## 4. Design-Richtlinien (TailwindCSS)
Das Design muss modern, sauber und einladend sein (vermeide dunkle Hacker-Ästhetik für Schul-Apps, es sei denn, spezifisch gewünscht, aber selbst dann das UI-Pattern beibehalten).

- **Farbpalette:** Jede App wählt eine Hauptfarbe (z.B. Grün für Hormone, Indigo für DNA, etc.).
- **Komponenten:**
  - Karten & Kontainer haben abgerundete Ecken (`rounded-xl`, `rounded-2xl`).
  - Leichte Schatten (`shadow-sm`, `shadow-md`, `shadow-xl`) grenzen Tiefe ab.
  - Interaktive Buttons haben Hover-Effekte (`hover:scale-[1.02]`, `hover:border-blue-300`, `transition-all`).
- **Icons:** Inline SVG Icons im Header, auf dem Dashboard und in Buttons! (Kein externes Icon-Paket).

## 5. Didaktik & Interaktivität
Jede Station behandelt ein inhaltliches Teilgebiet.
- Mindestens eine Station muss eine *Simulation / Drag&Drop / Sandbox* sein, in der User etwas chemisch/biologisch ausprobieren können.
- Die letzte Station (oft `Station 7` oder ähnlich) ist zwingend ein **Multiple-Choice-Quiz (Abitur-Niveau)** oder ein Überprüfungs-Formular mit Live-Feedback.
- Live-Rückmeldungen ("Richtig!", "Das war leider falsch") müssen in farblich abgehobenen Feedback-Boxen (rot/grün) dargestellt werden.

Halte dich zukünftig STRICT an dieses Muster (React + Babel + Tailwind via index.html Single-File), wenn du aufgefordert wirst, Apps "nach dem allgemeinen Design" zu bauen oder bestehende Apps anzupassen!
