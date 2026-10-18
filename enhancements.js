(() => {
  'use strict';
  const model = window.NomadeExperience;
  if (!model) return;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const updateBrief = (detail) => document.dispatchEvent(new CustomEvent('nomade:brief', { detail }));

  $$('[data-service-choice]').forEach((link) => {
    link.addEventListener('click', () => {
      const profile = model.profiles[link.dataset.serviceChoice];
      if (profile) updateBrief({ interest: profile.interest });
    });
  });

  const guideRoot = $('#guide-root');
  let questionIndex = 0;
  let answers = {};

  function renderQuestion(moveFocus = false) {
    const question = model.questions[questionIndex];
    const progress = make('div', 'guide-progress');
    model.questions.forEach((_, index) => {
      const segment = make('span', index <= questionIndex ? 'is-done' : '');
      segment.setAttribute('aria-hidden', 'true');
      progress.append(segment);
    });
    progress.append(make('small', '', `PERGUNTA ${questionIndex + 1} DE ${model.questions.length}`));
    const form = make('form', 'guide-form');
    const heading = make('h3', 'guide-question', question.title);
    heading.id = 'guide-question';
    heading.tabIndex = -1;
    const note = make('p', 'guide-question-note', question.note);
    const fieldset = make('fieldset', 'guide-options');
    fieldset.setAttribute('aria-labelledby', heading.id);
    const actions = make('div', 'guide-actions');
    const back = make('button', 'text-link', '← Voltar');
    back.type = 'button';
    back.disabled = questionIndex === 0;
    const next = make('button', 'button button-gold', questionIndex === model.questions.length - 1 ? 'Ver meu direcionamento ↗' : 'Continuar →');
    next.type = 'submit';
    next.disabled = !answers[question.id];

    question.options.forEach((option) => {
      const label = make('label', `guide-option${answers[question.id] === option.value ? ' is-selected' : ''}`);
      const input = make('input', 'sr-only');
      input.type = 'radio';
      input.name = question.id;
      input.value = option.value;
      input.required = true;
      input.checked = answers[question.id] === option.value;
      const radio = make('span', 'guide-radio');
      radio.setAttribute('aria-hidden', 'true');
      const copy = make('span', 'guide-option-copy');
      copy.append(make('strong', '', option.label), make('small', '', option.description));
      label.append(input, radio, copy);
      fieldset.append(label);
      input.addEventListener('change', () => {
        answers[question.id] = option.value;
        fieldset.querySelectorAll('.guide-option').forEach((item) => {
          item.classList.toggle('is-selected', item.querySelector('input').checked);
        });
        next.disabled = false;
      });
    });

    back.addEventListener('click', () => {
      questionIndex -= 1;
      renderQuestion(true);
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!answers[question.id]) return;
      if (questionIndex === model.questions.length - 1) renderRecommendation();
      else {
        questionIndex += 1;
        renderQuestion(true);
      }
    });
    actions.append(back, next);
    form.append(heading, note, fieldset, actions);
    guideRoot.replaceChildren(progress, form);
    $('#guide-announcer').textContent = `Pergunta ${questionIndex + 1} de ${model.questions.length}.`;
    if (moveFocus) heading.focus({ preventScroll: true });
  }

  function renderRecommendation() {
    const direction = model.getRecommendation(answers);
    const result = make('div', 'guide-result');
    const heading = make('h3', '', direction.title);
    heading.tabIndex = -1;
    const steps = make('ol', 'guide-result-steps');
    direction.steps.forEach((step) => steps.append(make('li', '', step)));
    const apply = make('a', 'button button-gold', 'Incluir esse serviço no meu briefing ↗');
    apply.href = '#contato';
    apply.addEventListener('click', () => updateBrief({ direction, interest: direction.interest }));
    const restart = make('button', 'guide-restart', 'Rever minhas respostas');
    restart.type = 'button';
    restart.addEventListener('click', () => {
      questionIndex = 0;
      renderQuestion(true);
    });
    result.append(
      make('p', 'guide-result-label', 'SUA PRIORIDADE INICIAL'), heading,
      make('p', '', direction.intro), steps, apply,
      make('p', 'guide-result-note', 'Sugestão inicial baseada nas respostas. O plano e o escopo são definidos depois de conhecer melhor sua empresa.'), restart
    );
    guideRoot.replaceChildren(result);
    $('#guide-announcer').textContent = `Direcionamento inicial: ${direction.title}.`;
    heading.focus({ preventScroll: true });
  }
  renderQuestion();

  $$('[data-project-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.projectFilter;
      $('.concept-grid').dataset.filter = filter;
      $$('[data-project-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      let count = 0;
      $$('[data-project-category]').forEach((card) => {
        const visible = filter === 'all' || filter === card.dataset.projectCategory;
        card.hidden = !visible;
        if (visible) count += 1;
      });
      $('#study-count').textContent = `${count} ${count === 1 ? 'frente de marketing' : 'frentes de marketing'}`;
    });
  });

  const dialog = $('#project-dialog');
  let projectKey = null;
  let opener = null;
  let restoreFocus = true;

  function afterProjectClose() {
    document.body.classList.remove('dialog-open');
    if (restoreFocus && opener) opener.focus({ preventScroll: true });
  }
  function closeProject(restore = true) {
    restoreFocus = restore;
    if (typeof dialog.close === 'function') dialog.close();
    else {
      dialog.removeAttribute('open');
      afterProjectClose();
    }
  }
  $$('[data-project]').forEach((button) => {
    button.addEventListener('click', () => {
      const project = model.projects[button.dataset.project];
      if (!project) return;
      projectKey = button.dataset.project;
      opener = button;
      restoreFocus = true;
      $('#project-title').textContent = project.title;
      $('#project-label').textContent = project.label;
      $('#project-description').textContent = project.description;
      $('#project-disclosure').textContent = project.disclosure;
      const visual = button.closest('.concept-card').querySelector('.concept-art').cloneNode(true);
      $('#project-visual').replaceChildren(visual);
      $('#project-notes').replaceChildren();
      project.notes.forEach(([title, description]) => {
        const group = make('div');
        group.append(make('dt', '', title), make('dd', '', description));
        $('#project-notes').append(group);
      });
      document.body.classList.add('dialog-open');
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      $('.dialog-close').focus({ preventScroll: true });
    });
  });
  dialog.addEventListener('close', afterProjectClose);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeProject();
  });
  $('.dialog-close').addEventListener('click', () => closeProject());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeProject();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeProject();
    }
    if (event.key === 'Tab') {
      const first = $('.dialog-close');
      const last = $('#project-briefing');
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  $('#project-briefing').addEventListener('click', () => {
    const project = model.projects[projectKey];
    if (!project) return;
    closeProject(false);
    updateBrief({ interest: model.profiles[project.interest].interest, reference: project.reference });
    $('#contato').scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
  });

  if ('IntersectionObserver' in window) {
    const contactObserver = new IntersectionObserver((entries) => {
      document.body.classList.toggle('contact-in-view', entries[0].isIntersecting);
    }, { rootMargin: '-90px 0px -75px 0px', threshold: 0 });
    contactObserver.observe($('#contato'));
  }
})();
