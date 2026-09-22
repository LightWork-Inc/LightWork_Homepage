// Apply the theme before styles paint to avoid a bright flash on dark visits.
(() => {
  const storageKey = 'lightwork-theme';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try {
    preference = localStorage.getItem(storageKey);
  } catch { /* The theme still works when browser storage is unavailable. */ }
  if (!['light', 'dark'].includes(preference)) preference = null;

  function applyTheme() {
    const dark = preference ? preference === 'dark' : systemTheme.matches;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#091827' : '#fafbf8';
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(dark));
      button.title = dark ? '라이트 모드로 전환' : '다크 모드로 전환';
    }
  }

  applyTheme();
  systemTheme.addEventListener('change', () => {
    if (!preference) applyTheme();
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    preference = ['light', 'dark'].includes(event.newValue) ? event.newValue : null;
    applyTheme();
  });
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(storageKey, preference); } catch { /* Session-only fallback. */ }
      applyTheme();
    });
  });
})();
