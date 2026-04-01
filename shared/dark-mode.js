// Dark Mode System für alle BioApps
(function() {
  const html = document.documentElement;
  const STORAGE_KEY = 'bioApps_darkMode';

  // Initialisierung: gespeicherte Präferenz oder System-Einstellung
  function initDarkMode() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  // Toggle-Funktion (global verfügbar)
  window.toggleDarkMode = function() {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    // Update alle Toggle-Buttons auf der Seite
    document.querySelectorAll('[data-dark-toggle]').forEach(btn => {
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.title = isDark ? 'Helles Design' : 'Dunkles Design';
      const icon = btn.querySelector('.dark-mode-icon');
      if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    });
  };

  // Status abrufen
  window.isDarkMode = function() {
    return html.classList.contains('dark');
  };

  // Beim Laden initialisieren
  initDarkMode();

  // System-Präferenz-Änderungen beobachten
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem(STORAGE_KEY) === null) {
      if (e.matches) html.classList.add('dark');
      else html.classList.remove('dark');
    }
  });
})();
