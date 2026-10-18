(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const menuButton = $('.menu-toggle');
  const navigation = $('#navigation');

  function closeMenu(restoreFocus = false) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    if (restoreFocus) menuButton.focus();
  }

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    navigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1040) closeMenu();
  }, { passive: true });

  const tabs = $$('.solution-tab');
  function selectTab(tab, focus = false) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectTab(tabs[next], true);
      }
    });
  });

  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !motionReduced) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06 });
    $$('.reveal').forEach((element) => {
      element.classList.add('reveal-ready');
      observer.observe(element);
    });
  }

  const config = window.NOMADE_CONTACT || {};
  const rawPhone = String(config.whatsapp || '').replace(/\D/g, '');
  const whatsapp = /^[1-9]\d{9,14}$/.test(rawPhone) ? rawPhone : '';
  const rawInstagram = String(config.instagram || '').replace(/^@/, '').trim();
  const instagram = /^[A-Za-z0-9_.]{1,30}$/.test(rawInstagram) ? rawInstagram : '';
  const rawEmail = String(config.email || '').trim();
  const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(rawEmail) ? rawEmail : '';
  const whatsappUrl = (text) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
  const directContact = $('#direct-contact');

  function addContactLink(label, href) {
    const anchor = document.createElement('a');
    anchor.textContent = label;
    anchor.href = href;
    if (href.startsWith('https:')) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    directContact.append(anchor);
    directContact.hidden = false;
  }

  if (whatsapp) {
    const greeting = 'Olá, equipe Nômade Impérius! Vim pelo site e gostaria de conhecer os serviços da agência. Quero fortalecer o marketing da minha empresa. Podemos conversar?';
    $$('[data-contact-link]').forEach((link) => {
      link.href = whatsappUrl(greeting);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
    addContactLink('Conversar no WhatsApp ↗', whatsappUrl(greeting));
    $('#submit-label').textContent = 'Preparar conversa no WhatsApp';
    $('#form-note').textContent = 'Você poderá revisar o resumo antes de abrir a conversa no WhatsApp. Nada é enviado automaticamente.';
  }
  if (instagram) addContactLink('Instagram ↗', `https://www.instagram.com/${encodeURIComponent(instagram)}/`);
  if (email) addContactLink('Enviar e-mail ↗', `mailto:${email}`);

  const form = $('#briefing-form');
  const result = $('#briefing-result');
  const summaryElement = $('#briefing-summary');
  const status = $('#copy-status');
  const shareButton = $('#share-briefing');
  let summary = '';
  let directionContext = '';
  let referenceContext = '';

  function syncContext() {
    $('#brief-context-body').textContent = [directionContext, referenceContext ? `Serviço explorado: ${referenceContext}.` : ''].filter(Boolean).join('\n\n');
    $('#brief-context').hidden = !directionContext && !referenceContext;
  }
  document.addEventListener('nomade:brief', (event) => {
    const detail = event.detail || {};
    if (typeof detail.interest === 'string' && [...$('#interest').options].some((option) => option.value === detail.interest)) {
      $('#interest').value = detail.interest;
      $('#interest').setCustomValidity('');
    }
    if (typeof detail.direction?.contextText === 'string') directionContext = detail.direction.contextText;
    if (typeof detail.reference === 'string') referenceContext = detail.reference;
    form.hidden = false;
    result.hidden = true;
    status.textContent = '';
    syncContext();
    $('#name').focus({ preventScroll: true });
  });
  $('#clear-context').addEventListener('click', () => {
    directionContext = '';
    referenceContext = '';
    syncContext();
    $('#name').focus({ preventScroll: true });
  });

  if (whatsapp) shareButton.textContent = 'Abrir no WhatsApp';
  else if (email) shareButton.textContent = 'Abrir no e-mail';
  else if (typeof navigator.share !== 'function') shareButton.hidden = true;

  form.querySelectorAll('input, textarea, select').forEach((input) => {
    input.addEventListener('input', () => input.setCustomValidity(''));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const name = String(values.get('name') || '').trim();
    const brand = String(values.get('brand') || '').trim();
    const interest = String(values.get('interest') || '').trim();
    const challenge = String(values.get('challenge') || '').trim();
    for (const [id, value] of [['name', name], ['brand', brand], ['interest', interest]]) {
      if (!value) {
        const field = document.getElementById(id);
        field.setCustomValidity('Preencha este campo para continuar.');
        field.reportValidity();
        return;
      }
    }
    summary = window.NomadeExperience.buildBriefing({
      name, brand, interest, challenge,
      segment: values.get('segment'), channel: values.get('channel'),
      timeline: values.get('timeline'), contact: values.get('contact'),
      direction: directionContext, reference: referenceContext
    });
    summaryElement.textContent = summary;
    status.textContent = '';
    form.hidden = true;
    result.hidden = false;
    result.focus({ preventScroll: true });
  });

  $('#edit-briefing').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    $('#name').focus({ preventScroll: true });
  });

  function selectSummary() {
    const range = document.createRange();
    range.selectNodeContents(summaryElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  $('#copy-briefing').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(summary);
      status.textContent = 'Resumo copiado. Cole na conversa com a equipe.';
    } catch {
      selectSummary();
      status.textContent = 'Selecione e copie o texto acima, ou use a opção de compartilhar ou baixar.';
    }
  });

  function downloadSummary() {
    const file = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'meu-projeto-nomade-imperius.txt';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Seu resumo foi preparado para download. Compartilhe o arquivo com a equipe.';
  }

  $('#download-briefing').addEventListener('click', downloadSummary);

  shareButton.addEventListener('click', async () => {
    if (whatsapp) {
      window.open(whatsappUrl(summary), '_blank', 'noopener,noreferrer');
      return;
    }
    if (email) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent('Meu projeto — Nômade Impérius')}&body=${encodeURIComponent(summary)}`;
      return;
    }
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Meu projeto — Nômade Impérius', text: summary });
      } catch (error) {
        if (error.name !== 'AbortError') downloadSummary();
      }
    } else downloadSummary();
  });

  $('#year').textContent = String(new Date().getFullYear());
  $('#briefing-fields').disabled = false;
})();
