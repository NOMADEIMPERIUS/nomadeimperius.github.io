(() => {
  'use strict';
  const video = document.getElementById('nomade-brand-film');
  if (!video) return;
  video.controls = false;
  video.muted = true;
  const start = () => { if (!document.hidden) video.play().catch(() => {}); };
  video.addEventListener('pause', start);
  start();
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); else start(); });
})();
