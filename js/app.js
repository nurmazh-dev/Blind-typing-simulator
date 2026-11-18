// =====================================================================
// app.js — «склеивает» всё вместе: навигация, страницы, настройки
// ---------------------------------------------------------------------
// Сайт состоит из одной HTML-страницы с несколькими разделами
// (<section class="view">). Какой раздел показать, решает адрес после #:
//   #/ — главная, #/learn — обучение, #/practice — практика,
//   #/train — тренировка, #/stats — статистика, #/settings — настройки.
// Так сайт работает и на GitHub Pages, и просто при открытии файла.
// =====================================================================

const VIEWS = ['home', 'learn', 'practice', 'train', 'stats', 'settings'];

// Рисует группу кнопок-переключателей (выбор одного варианта из нескольких).
// options: [{ value, label }], onChange(value) вызывается при выборе.
function segmented(container, options, current, onChange) {
  container.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = opt.label;
    btn.classList.toggle('active', opt.value === current);
    btn.addEventListener('click', () => {
      container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      btn.blur();
      onChange(opt.value);
    });
    container.appendChild(btn);
  });
}

const langOptions = () => Object.keys(LAYOUTS).map(id => ({ value: id, label: t('lang.' + id) }));
const onOffOptions = () => [{ value: true, label: t('on') }, { value: false, label: t('off') }];

const App = {
  settings: null,
  route: null,
  pendingConfig: null, // упражнение, которое нужно запустить при переходе на #/train

  init() {
    this.settings = Storage.getSettings();
    applyTranslations(this.settings.uiLang);
    this.applyTheme();
    Trainer.init();
    this.bindButtons();
    window.addEventListener('hashchange', () => this.onRoute());
    this.onRoute();
  },

  updateSetting(key, value) {
    this.settings[key] = value;
    Storage.saveSettings(this.settings);
  },

  applyTheme() {
    document.documentElement.dataset.theme = this.settings.theme;
  },

  navigate(route) {
    location.hash = route === 'home' ? '#/' : '#/' + route;
  },

  // ---------- Переключение разделов ----------
  onRoute() {
    const name = location.hash.replace(/^#\/?/, '') || 'home';
    const route = VIEWS.includes(name) ? name : 'home';

    if (this.route === 'train' && route !== 'train') Trainer.stop();
    // На экран тренировки нельзя попасть без выбранного упражнения
    if (route === 'train' && !this.pendingConfig && !Trainer.config) {
      this.navigate('practice');
      return;
    }

    VIEWS.forEach(v => { document.getElementById('view-' + v).hidden = v !== route; });
    document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.dataset.route === route));
    this.route = route;
    window.scrollTo(0, 0);
    this.renderView();
  },

  renderView() {
    switch (this.route) {
      case 'home': this.renderHome(); break;
      case 'learn': this.renderLearn(); break;
      case 'practice': this.renderPractice(); break;
      case 'stats': Stats.render(); break;
      case 'settings': this.renderSettings(); break;
      case 'train':
        Trainer.start(this.pendingConfig || Trainer.config);
        this.pendingConfig = null;
        break;
    }
  },

  // ---------- Запуск тренировок ----------
  startTraining(config) {
    if (this.route === 'train') {
      Trainer.start(config);
    } else {
      this.pendingConfig = config;
      this.navigate('train');
    }
  },

  // Собирает упражнение свободной практики из параметров
  buildPracticeConfig(opts) {
    const { type, lang, difficulty } = opts;
    const config = {
      mode: 'practice', type, lang, difficulty,
      title: t('type.' + type),
      sub: `${t('lang.' + lang)} · ${t('diff.' + difficulty)}`,
    };

    switch (type) {
      case 'words':
        config.generate = () => Exercises.words(lang, difficulty, 40);
        break;
      case 'sentences':
        config.generate = () => Exercises.sentences(lang, difficulty);
        break;
      case 'text':
        config.generate = () => Exercises.text(lang, difficulty);
        break;
      case 'keys': {
        const chars = Exercises.keyGroupChars(lang, opts.keyGroup, opts.customKeys);
        if (chars.length === 0) return null;
        config.sub = chars.join(' ') + ' · ' + t('diff.' + difficulty);
        config.generate = () => Exercises.keys(lang, difficulty, chars);
        break;
      }
      case 'time':
        config.timeLimit = opts.timeLimit;
        config.title += ' · ' + t('unit.sec', { n: opts.timeLimit });
        config.generate = () => Exercises.words(lang, difficulty, 60);
        config.more = () => Exercises.words(lang, difficulty, 30);
        break;
      case 'count':
        config.wordCount = opts.wordCount;
        config.title += ' · ' + t('unit.words', { n: opts.wordCount });
        config.generate = () => Exercises.words(lang, difficulty, opts.wordCount);
        break;
    }
    return config;
  },

  startPractice() {
    const s = this.settings;
    const config = this.buildPracticeConfig({
      type: s.practiceType, lang: s.typingLang, difficulty: s.difficulty,
      timeLimit: s.timeLimit, wordCount: s.wordCount, keyGroup: s.keyGroup, customKeys: s.customKeys,
    });
    const error = document.getElementById('practice-error');
    if (!config) {
      error.textContent = t('practice.noKeys');
      error.hidden = false;
      return;
    }
    error.hidden = true;
    this.startTraining(config);
  },

  startLesson(lesson) {
    this.startTraining({
      mode: 'lesson', type: 'lesson', lang: lesson.lang, lesson,
      title: `${t('learn.lesson', { n: lesson.number })} · ${this.lessonName(lesson)}`,
      sub: this.lessonHint(lesson),
      generate: () => Lessons.generate(lesson),
    });
  },

  lessonName(lesson) {
    if (lesson.kind === 'keys') {
      return t('learn.keys', { keys: lesson.keys.map(k => k.toUpperCase()).join(' ') });
    }
    return t('learn.' + lesson.kind);
  },

  // Подсказка: какими пальцами нажимать новые клавиши
  lessonHint(lesson) {
    if (lesson.kind !== 'keys') return t('learn.' + lesson.kind + 'Hint');
    const map = getCharMap(lesson.lang);
    return lesson.keys
      .map(k => `${k.toUpperCase()} — ${t('finger.' + FINGER_BY_CODE[map[k].code])}`)
      .join(' · ');
  },

  // ---------- Главная ----------
  renderHome() {
    const history = Storage.getHistory();
    const box = document.getElementById('home-summary');
    box.hidden = history.length === 0;
    if (history.length === 0) return;
    const s = Stats.summary(history);
    document.getElementById('home-summary-grid').innerHTML =
      Stats.statHtml(s.avgWpm, t('statsPage.avgWpm') + ', WPM') +
      Stats.statHtml(s.avgAcc + '%', t('statsPage.avgAcc')) +
      Stats.statHtml(s.best, t('statsPage.best') + ', WPM') +
      Stats.statHtml(s.count, t('statsPage.count'));
  },

  // ---------- Обучение ----------
  renderLearn() {
    const lang = this.settings.typingLang;
    segmented(document.getElementById('learn-lang'), langOptions(), lang, value => {
      this.updateSetting('typingLang', value);
      this.renderLearn();
    });

    document.getElementById('learn-lead').textContent = t('learn.lead', { n: LESSON_PASS_ACCURACY });

    // Клавиши с выступами в текущей раскладке (F/J или А/О)
    const keys = LAYOUTS[lang].keys;
    const bumps = HOME_BUMPS.map(code => keys[code][1]);
    document.getElementById('how-list').innerHTML = ['learn.how1', 'learn.how2', 'learn.how3', 'learn.how4']
      .map(k => `<li>${t(k, { left: bumps[0], right: bumps[1] })}</li>`).join('');
    // Новичку раскрываем подсказку сразу
    const progress = Storage.getLessons()[lang] || {};
    const howCard = document.getElementById('how-card');
    howCard.open = Object.keys(progress).length === 0;
    // Клавиатура с руками на основном ряду. Пока подсказка свёрнута, размеров нет,
    // поэтому руки дорисовываются при её раскрытии.
    Keyboard.render(document.getElementById('how-keyboard'), lang, true, true);
    howCard.ontoggle = () => { if (howCard.open) Hands.layout(); };

    const list = Lessons.list(lang);
    const done = list.filter(l => progress[l.id] && progress[l.id].passed).length;
    document.getElementById('learn-progress-text').textContent = t('learn.progress', { done, total: list.length });
    document.getElementById('learn-progress-fill').style.width = (done / list.length) * 100 + '%';

    const container = document.getElementById('lesson-list');
    container.innerHTML = '';
    list.forEach((lesson, index) => {
      const unlocked = Lessons.isUnlocked(lang, index, progress);
      const result = progress[lesson.id];
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'lesson-card';
      if (!unlocked) card.classList.add('locked');
      if (result && result.passed) card.classList.add('passed');
      card.disabled = !unlocked;

      let status = '';
      if (result && result.passed) status = t('learn.best', { wpm: result.bestWpm, acc: result.bestAccuracy });
      else if (!unlocked) status = t('learn.locked');

      card.innerHTML = `
        <span class="lesson-num"></span>
        <span class="lesson-name"></span>
        <span class="lesson-status"></span>`;
      card.querySelector('.lesson-num').textContent = t('learn.lesson', { n: lesson.number });
      card.querySelector('.lesson-name').textContent = this.lessonName(lesson);
      card.querySelector('.lesson-status').textContent = status;
      card.addEventListener('click', () => this.startLesson(lesson));
      container.appendChild(card);
    });
  },

  // ---------- Свободная практика ----------
  renderPractice() {
    const s = this.settings;
    const types = ['words', 'sentences', 'text', 'keys', 'time', 'count'];
    segmented(document.getElementById('opt-type'), types.map(v => ({ value: v, label: t('type.' + v) })),
      s.practiceType, v => { this.updateSetting('practiceType', v); this.updatePracticeRows(); });

    segmented(document.getElementById('opt-time'), [15, 30, 60, 120].map(n => ({ value: n, label: t('unit.sec', { n }) })),
      s.timeLimit, v => this.updateSetting('timeLimit', v));

    segmented(document.getElementById('opt-count'), [25, 50, 100].map(n => ({ value: n, label: String(n) })),
      s.wordCount, v => this.updateSetting('wordCount', v));

    const groups = ['home', 'top', 'bottom', 'digits', 'left', 'right', 'custom'];
    segmented(document.getElementById('opt-keys'), groups.map(v => ({ value: v, label: t('group.' + v) })),
      s.keyGroup, v => { this.updateSetting('keyGroup', v); this.updatePracticeRows(); });

    const custom = document.getElementById('opt-custom');
    custom.value = s.customKeys;
    custom.oninput = () => this.updateSetting('customKeys', custom.value);

    segmented(document.getElementById('opt-diff'), ['easy', 'medium', 'hard'].map(v => ({ value: v, label: t('diff.' + v) })),
      s.difficulty, v => { this.updateSetting('difficulty', v); this.updatePracticeRows(); });

    segmented(document.getElementById('opt-lang'), langOptions(), s.typingLang, v => this.updateSetting('typingLang', v));

    document.getElementById('practice-error').hidden = true;
    this.updatePracticeRows();
  },

  // Показывает только те параметры, которые нужны выбранному упражнению
  updatePracticeRows() {
    const s = this.settings;
    document.getElementById('row-time').hidden = s.practiceType !== 'time';
    document.getElementById('row-count').hidden = s.practiceType !== 'count';
    document.getElementById('row-keys').hidden = s.practiceType !== 'keys';
    document.getElementById('opt-custom').hidden = s.keyGroup !== 'custom';
    document.getElementById('diff-hint').textContent = t('practice.diffHint.' + s.difficulty);
  },

  // ---------- Настройки ----------
  renderSettings() {
    const s = this.settings;
    segmented(document.getElementById('set-theme'),
      [{ value: 'light', label: t('settings.light') }, { value: 'dark', label: t('settings.dark') }],
      s.theme, v => { this.updateSetting('theme', v); this.applyTheme(); });

    segmented(document.getElementById('set-ui-lang'),
      [{ value: 'ru', label: 'Русский' }, { value: 'en', label: 'English' }],
      s.uiLang, v => {
        this.updateSetting('uiLang', v);
        applyTranslations(v);
        this.renderSettings(); // перерисовываем, чтобы обновились подписи кнопок
      });

    segmented(document.getElementById('set-typing-lang'), langOptions(), s.typingLang, v => this.updateSetting('typingLang', v));
    segmented(document.getElementById('set-keyboard'), onOffOptions(), s.showKeyboard, v => this.updateSetting('showKeyboard', v));
    segmented(document.getElementById('set-fingers'), onOffOptions(), s.showFingers, v => this.updateSetting('showFingers', v));
    segmented(document.getElementById('set-hands'), onOffOptions(), s.showHands, v => this.updateSetting('showHands', v));
  },

  showDataMessage(text) {
    const el = document.getElementById('data-message');
    el.textContent = text;
    el.hidden = false;
  },

  // ---------- Кнопки, которые существуют всегда ----------
  bindButtons() {
    const on = (id, handler) => document.getElementById(id).addEventListener('click', e => {
      e.currentTarget.blur(); // чтобы пробел во время печати не «нажимал» кнопку
      handler();
    });

    on('theme-toggle', () => {
      this.updateSetting('theme', this.settings.theme === 'dark' ? 'light' : 'dark');
      this.applyTheme();
      if (this.route === 'settings') this.renderSettings();
      if (this.route === 'stats') Stats.render(); // графики перекрашиваются под тему
    });

    on('quick-test', () => {
      const s = this.settings;
      this.startTraining(this.buildPracticeConfig({ type: 'time', timeLimit: 30, lang: s.typingLang, difficulty: s.difficulty }));
    });

    on('practice-start', () => this.startPractice());

    const back = () => this.navigate(Trainer.config && Trainer.config.lesson ? 'learn' : 'practice');
    on('train-back', back);
    on('res-back', back);
    on('train-restart', () => Trainer.restart());
    on('res-repeat', () => Trainer.restart());
    on('res-new', () => Trainer.start(Trainer.config));

    // Экспорт: создаём файл в памяти и «скачиваем» его
    on('data-export', () => {
      const json = JSON.stringify(Storage.exportAll(), null, 2);
      const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `protyping-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Импорт: открываем окно выбора файла
    const fileInput = document.getElementById('data-file');
    on('data-import', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        let ok = false;
        try { ok = Storage.importAll(JSON.parse(reader.result)); } catch (e) { ok = false; }
        if (ok) {
          this.settings = Storage.getSettings();
          applyTranslations(this.settings.uiLang);
          this.applyTheme();
          this.renderSettings();
        }
        this.showDataMessage(t(ok ? 'settings.importOk' : 'settings.importBad'));
        fileInput.value = '';
      };
      reader.readAsText(file);
    });

    on('data-reset', () => {
      if (!confirm(t('settings.resetConfirm'))) return;
      Storage.clearAll();
      this.settings = Storage.getSettings();
      applyTranslations(this.settings.uiLang);
      this.applyTheme();
      this.renderSettings();
      this.showDataMessage(t('settings.resetDone'));
    });
  },
};

// Запускаем приложение, когда страница загрузилась
document.addEventListener('DOMContentLoaded', () => App.init());
