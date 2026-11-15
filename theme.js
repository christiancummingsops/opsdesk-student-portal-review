/* Local presentation preference only; financial and review state is unchanged. */
'use strict';
(() => {
  const root = document.documentElement;
  const requested = new URLSearchParams(location.search).get('theme');
  let saved;
  try { saved = localStorage.getItem('coaching-preview-theme'); } catch {}
  root.dataset.theme = ['light', 'dark'].includes(requested) ? requested
    : ['light', 'dark'].includes(saved) ? saved : 'dark';
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-theme-toggle]');
    if (!button) return;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    button.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} mode`);
    button.title = button.getAttribute('aria-label');
    try { localStorage.setItem('coaching-preview-theme', next); } catch {}
  });
})();
