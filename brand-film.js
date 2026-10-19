(() => {
  'use strict';
  const video = document.getElementById('nomade-brand-film');
  if (!video) return;
  video.muted = true;
  const start = () => { video.play().catch(() => {}); };
  start();
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); else start(); });
})();
