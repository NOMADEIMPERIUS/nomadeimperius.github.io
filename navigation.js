(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const toggles = [...document.querySelectorAll('.nav-group-toggle')];
  const closeGroups = (except = null) => {
    toggles.forEach((toggle) => {
      if (toggle === except) return;
      toggle.setAttribute('aria-expanded', 'false');
      document.getElementById(toggle.getAttribute('aria-controls')).hidden = true;
    });
  };
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const shouldOpen = toggle.getAttribute('aria-expanded') !== 'true';
      closeGroups(toggle);
      toggle.setAttribute('aria-expanded', String(shouldOpen));
      document.getElementById(toggle.getAttribute('aria-controls')).hidden = !shouldOpen;
    });
  });
  document.addEventListener('pointerdown', (event) => {
    if (!header.contains(event.target)) closeGroups();
  });
  header.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeGroups();
  });
  header.addEventListener('focusout', (event) => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) closeGroups();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const open = toggles.find((toggle) => toggle.getAttribute('aria-expanded') === 'true');
    if (open) {
      closeGroups();
      if (window.innerWidth > 1040) open.focus();
    }
  });
  window.addEventListener('resize', () => closeGroups(), { passive: true });
  document.querySelectorAll('[data-select-tab]').forEach((link) => {
    link.addEventListener('click', () => {
      const tab = document.getElementById(link.dataset.selectTab);
      if (tab) tab.click();
    });
  });
})();
