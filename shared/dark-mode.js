// Dark Mode System für alle BioApps
(function() {
  const html = document.documentElement;
  const STORAGE_KEY = 'bioApps_darkMode';

  // Hilfsfunktion: Alle Toggle-Buttons auf der Seite mit aktuellem Status synchronisieren
  function updateToggleButtons(isDark) {
    document.querySelectorAll('[data-dark-toggle]').forEach(btn => {
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.title = isDark ? 'Helles Design' : 'Dunkles Design';
      btn.setAttribute('aria-label', isDark ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren');
      
      const icon = btn.querySelector('.dark-mode-icon');
      if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
      } else {
        // Fallback für Buttons ohne .dark-mode-icon span (Textknoten mit Emoji)
        btn.childNodes.forEach(node => {
          if (node.nodeType === 3 && (node.nodeValue.includes('☀️') || node.nodeValue.includes('🌙'))) {
            node.nodeValue = node.nodeValue.replace(/☀️|🌙/g, isDark ? '☀️' : '🌙');
          }
        });
      }
    });
  }

  // Initialisierung: gespeicherte Präferenz oder System-Einstellung
  function initDarkMode() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const isDark = (saved === 'dark' || (saved === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches));
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => updateToggleButtons(isDark));
    } else {
      updateToggleButtons(isDark);
    }
  }

  // Debounce-Guard gegen doppelte Ausführung (z. B. inline onclick + delegierter Event-Listener)
  let lastToggleTime = 0;

  // Toggle-Funktion (global verfügbar)
  window.toggleDarkMode = function() {
    const now = Date.now();
    if (now - lastToggleTime < 180) {
      return; // Verhindere doppelt ausgelöstes Umschalten
    }
    lastToggleTime = now;

    const isDark = html.classList.toggle('dark');
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch (e) {}

    updateToggleButtons(isDark);

    // Custom Event für dynamische & reaktive Frameworks (React, Vue, Alpine)
    window.dispatchEvent(new CustomEvent('bioApps_theme_change', { detail: { isDark } }));
  };

  // Status abrufen
  window.isDarkMode = function() {
    return html.classList.contains('dark');
  };

  // Beim Laden initialisieren
  initDarkMode();

  // System-Präferenz-Änderungen beobachten
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem(STORAGE_KEY) === null) {
        const isDark = e.matches;
        if (isDark) html.classList.add('dark');
        else html.classList.remove('dark');
        updateToggleButtons(isDark);
        window.dispatchEvent(new CustomEvent('bioApps_theme_change', { detail: { isDark } }));
      }
    });
  }

  // Globaler Delegierter Click-Listener für alle data-dark-toggle Buttons
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.closest && target.closest('[data-dark-toggle]')) {
      window.toggleDarkMode();
    }
  });
})();
