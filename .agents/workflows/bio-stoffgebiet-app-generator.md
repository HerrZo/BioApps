---
description: Blueprint und Best-Practices zur Erstellung neuer interaktiver Biologie-Apps (Vanilla JS/CSS/HTML)
---

# Generierung einer neuen Biologie-App

Immer wenn du (Antigravity) eine neue biologische Lern-App in diesem Repository generieren sollst, MUSST du strikt nach diesen Vorgaben vorgehen. Nutze diesen Architektur-Blueprint als "Best Practice", um ein **Premium-Frontend-Design** zu gewährleisten.

## 1. Zero-Build Architektur & Design-Philosophie
Verwende Vanilla HTML, CSS und JavaScript. **Keine Build-Tools (npm, Vite, Webpack).**
- **Aesthetik**: Wähle eine klare Richtung (z.B. *Organic/Natural*, *Refined/Scientific* oder *Minimalist*). Vermeide "AI-Slop" (Standard-Blau/Lila-Gradients).
- **Farbpalette**: Nutze ein sattes **Bio-Grün** (`Primary`) mit frischen Akzenten wie **Lime, Mint oder Moos**. Verwende CSS-Variablen für ein konsistentes Theme (Light/Dark).
- **Typography**: Nutze charakterstarke Google Fonts (z.B. *Outfit*, *Fraunces*, *DM Sans*). Keine Standard-System-Fonts. Kombiniere eine markante Display-Schrift für Headings mit einer hochlesbaren Body-Schrift.

## 2. Struktur und Dateianforderungen
Erstelle für jede neue App einen eigenen Ordner im Root-Verzeichnis:
- **`index.html`**: Semantisches HTML5. Header mit Titel, Fortschrittsanzeige (Smooth Transition), Score-Display und einer Sidebar für Kapitel. Inkludiere einen Theme-Toggle.
- **`style.css`**: Implementiere ein modernes Layout (Spatial Composition):
  - **Asymmetrie & Overlap**: Nutze überlappende Elemente und großzügiges White-Space.
  - **Glassmorphism & Gradients**: Nutze subtile Unschärfe-Effekte (`backdrop-filter`) und sanfte, organische Verläufe oder Mesh-Gradients.
  - **Micro-Animations**: Page-Loads mit `staggered reveals`. Hover-Effekte auf Karten mit `transform: translateY(-5px)` und subtilen Schatten.
  - **Visuals**: Biologische Strukturen (Zellen, DNA, Organelle) werden **exklusiv mit CSS/SVG** erstellt. Keine statischen Bilder, sondern interaktive, animierte Elemente.
- **`app.js`**: Saubere ES6-Architektur (Kapselung):
  - `ThemeManager`, `ProgressController`, `ContentRenderer`, `ScoringSystem`.
  - Trennung von Logik und Inhalten: Alle Texte, Bilder (SVG-Code) und Quiz-Fragen befinden sich im `TOPICS_DATA` Objekt.

## 3. Didaktische Exzellenz & Gamification
1. **Interactive Storytelling**: Führe den Schüler durch "Interaktive Karten", die biologische Prozesse visualisieren.
2. **Präzises Feedback**: Bei Fehlern zeigt der "Feedback-Hub" nicht nur "Falsch" an, sondern erklärt den spezifischen biologischen Missverständnis-Aspekt.
3. **Gamification**: Jede App endet mit einer "Bio-Challenge" (Drag & Drop, Labeling, Sorting). Implementiere ein Highscore-System.

## 4. Workflow beim Erstellen
1. Verzeichnis für das neue Thema anlegen.
2. `index.html`, `style.css` und `app.js` iterativ generieren.
3. Die neue App in der Haupt-Navigation des Repositories verlinken.
// turbo-all
4. Commit & Push: `git add .`, `git commit -m "feat: add [Thema] biology app"`, `git push`.

**WICHTIG**: Jede App muss ein Unikat sein. Variiere die Layouts und Effekte, damit sich das Toolset lebendig und modern anfühlt.
