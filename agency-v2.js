(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const phone = String(window.NOMADE_CONTACT?.whatsapp || '5531997046462').replace(/\D/g, '');
  const greeting = 'Olá, equipe Nômade Impérius! Vim pelo site e gostaria de conhecer os serviços da agência. Quero fortalecer o marketing da minha empresa. Podemos conversar?';
  const whatsapp = (message) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  $$('.contact-link').forEach(link => { link.href = whatsapp(greeting); link.target = '_blank'; link.rel = 'noopener noreferrer'; });
  $('#year').textContent = new Date().getFullYear();
  const menuButton = $('.menu-button');
  const nav = $('#main-nav');
  const closeMenu = () => { nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menu'); document.body.classList.remove('menu-open'); };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); document.body.classList.toggle('menu-open', open);
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  matchMedia('(min-width:761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  const heroFilm = $('#hero-film');
  const motionButton = $('#motion-toggle');
  const motion = matchMedia('(prefers-reduced-motion:reduce)');
  const updateMotion = () => { const paused = heroFilm.paused; motionButton.setAttribute('aria-label', paused ? 'Reproduzir animação de abertura' : 'Pausar animação de abertura'); motionButton.innerHTML = paused ? '<span aria-hidden="true">▶</span>' : '<svg aria-hidden="true"><use href="#pause"/></svg>'; };
  if (motion.matches || navigator.connection?.saveData) { heroFilm.autoplay = false; heroFilm.pause(); }
  heroFilm.addEventListener('play', updateMotion); heroFilm.addEventListener('pause', updateMotion); updateMotion();
  motionButton.addEventListener('click', () => { if (heroFilm.paused) heroFilm.play().catch(() => { motionButton.setAttribute('aria-label', 'Reproduzir animação de abertura'); }); else heroFilm.pause(); });
  motion.addEventListener('change', event => { if (event.matches) heroFilm.pause(); });
  const films = $$('.film-screen video');
  films.forEach(video => video.addEventListener('play', () => films.forEach(other => { if (other !== video) other.pause(); })));
  document.addEventListener('visibilitychange', () => { if (document.hidden) { heroFilm.pause(); films.forEach(video => video.pause()); } });
  let ticking = false;
  const progress = () => { const max = document.documentElement.scrollHeight - innerHeight; document.documentElement.style.setProperty('--reading', `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`); ticking = false; };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(progress); ticking = true; } }, { passive: true }); progress();
  $$('.work-filters button').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    $$('.work-filters button').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    let count = 0;
    $$('.work-card').forEach(card => { const visible = filter === 'all' || card.dataset.category === filter; card.hidden = !visible; if (visible) count++; });
    $('#work-status').textContent = `${count} ${count === 1 ? 'exploração visual' : 'explorações visuais'}. Cenas ilustrativas para apresentar as soluções.`;
  }));
  const serviceSelect = $('#service-select');
  $$('.service-link').forEach(link => link.addEventListener('click', () => { serviceSelect.value = link.dataset.service; serviceSelect.dispatchEvent(new Event('change')); }));
  const form = $('#project-form');
  const dialog = $('#briefing-dialog');
  let summary = '';
  let previousFocus;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const name = String(values.get('name') || '').trim();
    const company = String(values.get('company') || '').trim();
    const service = String(values.get('service') || '').trim();
    const goal = String(values.get('goal') || '').trim();
    const profile = String(values.get('profile') || '').trim();
    if (!name || !company || !service || !goal) { alert('Preencha seu nome, empresa, solução e objetivo para preparar a conversa.'); return; }
    const lines = ['Olá, equipe Nômade Impérius! Vim pelo site e gostaria de conversar sobre um projeto.', '', `Meu nome: ${name}`, `Empresa: ${company}`, `Solução de interesse: ${service}`, `Objetivo: ${goal}`];
    if (profile) lines.push(`Site ou perfil: ${profile}`);
    lines.push('', 'Podemos conversar sobre as possibilidades e uma proposta?');
    summary = lines.join('\n');
    $('#briefing-summary').textContent = summary;
    $('#send-whatsapp').href = whatsapp(summary);
    $('#copy-status').textContent = '';
    previousFocus = document.activeElement;
    dialog.showModal(); document.body.classList.add('dialog-open');
  });
  $('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); previousFocus?.focus(); });
  $('#copy-briefing').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(summary); $('#copy-status').textContent = 'Briefing copiado. Você pode colar na conversa com a equipe.'; }
    catch { $('#copy-status').textContent = 'Selecione o texto do resumo e use a opção de copiar do seu dispositivo.'; const range = document.createRange(); range.selectNodeContents($('#briefing-summary')); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); }
  });
})();
