// =====================================================================
// trainer.js — «движок» тренировки
// ---------------------------------------------------------------------
// Правила набора (согласованы заранее):
//   • курсор идёт дальше даже после ошибки, ошибочный символ красный;
//   • Backspace разрешён — можно вернуться и исправить;
//   • ошибка всё равно засчитывается, даже если её потом исправили.
//
// Формулы:
//   WPM (слов в минуту) = (верно набранные символы / 5) / минуты.
//     «Слово» — это 5 символов, так считают почти все тренажёры,
//     поэтому результаты можно сравнивать с другими сайтами.
//   Точность = (все нажатия − ошибочные нажатия) / все нажатия × 100%.
// =====================================================================

const Trainer = {
  config: null,     // параметры текущего упражнения (см. App.startPractice / App.startLesson)
  text: '',         // текст упражнения
  sub: '',          // подзаголовок (название текста, подсказка урока)
  spans: [],        // <span> для каждого символа текста
  status: [],       // для каждой позиции: undefined | 'ok' | 'bad'
  pos: 0,           // позиция курсора
  keystrokes: 0,    // всего нажатий символьных клавиш
  errors: 0,        // ошибочных нажатий (исправленные тоже считаются)
  correct: 0,       // сколько символов сейчас стоят верно
  startTime: null,  // когда было первое нажатие
  timerId: null,
  active: false,    // тренировка на экране
  finished: false,

  // DOM-элементы экрана тренировки — находим один раз
  el: {},

  init() {
    const $ = id => document.getElementById(id);
    this.el = {
      title: $('train-title'), sub: $('train-sub'),
      wpm: $('stat-wpm'), acc: $('stat-acc'), err: $('stat-err'), time: $('stat-time'),
      timeLabel: $('stat-time-label'),
      progress: $('progress-fill'), progressText: $('stat-progress'),
      box: $('text-box'), inner: $('text-inner'),
      keyboard: $('keyboard'), hint: $('train-hint'),
      layoutWarning: $('layout-warning'), capsWarning: $('caps-warning'),
      area: $('train-area'), results: $('results'),
    };
    document.addEventListener('keydown', e => this.onKeyDown(e));
  },

  // Начать упражнение. newText = false — повторить тот же текст.
  start(config, newText = true) {
    this.config = config;
    if (newText || !this.text) {
      // generate() возвращает строку или объект { title, text } (для текстов с названием)
      const generated = config.generate();
      this.text = typeof generated === 'string' ? generated : generated.text;
      this.sub = typeof generated === 'string' ? (config.sub || '') : generated.title;
    }
    this.reset();

    const settings = Storage.getSettings();
    this.el.title.textContent = config.title;
    this.el.sub.textContent = this.sub;
    this.el.keyboard.hidden = !settings.showKeyboard;
    if (settings.showKeyboard) Keyboard.render(this.el.keyboard, config.lang, settings.showFingers);
    this.el.timeLabel.textContent = config.type === 'time' ? t('stats.left') : t('stats.time');

    this.el.area.hidden = false;
    this.el.results.hidden = true;
    this.active = true;
    this.renderText();
    this.updateStats();
  },

  reset() {
    clearInterval(this.timerId);
    this.timerId = null;
    this.pos = 0;
    this.status = [];
    this.keystrokes = 0;
    this.errors = 0;
    this.correct = 0;
    this.startTime = null;
    this.finished = false;
    this.el.hint.hidden = false;
    this.el.layoutWarning.hidden = true;
    this.el.capsWarning.hidden = true;
  },

  restart() { this.start(this.config, false); },

  // Вызывается, когда пользователь уходит со страницы тренировки
  stop() {
    clearInterval(this.timerId);
    this.active = false;
  },

  // ---------- Отрисовка текста ----------
  renderText() {
    this.el.inner.innerHTML = '';
    this.spans = [];
    this.appendSpans(this.text);
    this.updateCursor();
  },

  appendSpans(str) {
    const fragment = document.createDocumentFragment();
    for (const ch of str) {
      const span = document.createElement('span');
      span.textContent = ch;
      if (ch === ' ') span.className = 'space';
      fragment.appendChild(span);
      this.spans.push(span);
    }
    this.el.inner.appendChild(fragment);
  },

  // Перемещает «курсор», подсвечивает клавишу и прокручивает текст
  updateCursor() {
    const prev = this.el.inner.querySelector('.current');
    if (prev) prev.classList.remove('current');
    const span = this.spans[this.pos];
    if (span) span.classList.add('current');
    Keyboard.highlight(this.text[this.pos]);

    // Показываем 3 строки: текущая строка всегда вторая (кроме самой первой)
    if (span) {
      const lineHeight = parseFloat(getComputedStyle(this.el.inner).lineHeight);
      const offset = Math.max(0, span.offsetTop - lineHeight);
      this.el.inner.style.transform = `translateY(${-offset}px)`;
    }
  },

  // ---------- Обработка клавиш ----------
  onKeyDown(e) {
    if (!this.active || this.finished) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return; // не мешаем сочетаниям браузера

    // Предупреждение о включённом Caps Lock
    if (e.getModifierState) this.el.capsWarning.hidden = !e.getModifierState('CapsLock');

    if (e.key === 'Escape') { e.preventDefault(); this.restart(); return; }
    if (e.key === 'Tab') { e.preventDefault(); return; } // чтобы фокус не уходил на кнопки
    if (e.key === 'Backspace') { e.preventDefault(); this.backspace(); return; }
    if (e.key.length !== 1) return; // Shift, стрелки, F1 и т.д.

    e.preventDefault(); // чтобы пробел не прокручивал страницу, а «/» не открывал поиск
    this.type(e.key, e.code);
  },

  type(ch, code) {
    // Проверка раскладки: буква из другого алфавита — значит, в системе
    // включён не тот язык. Такое нажатие не считаем ошибкой, а подсказываем.
    if (/\p{L}/u.test(ch) && !layoutHasChar(this.config.lang, ch)) {
      this.el.layoutWarning.hidden = false;
      Keyboard.flash(code, false);
      return;
    }
    this.el.layoutWarning.hidden = true;

    if (this.startTime === null) this.startTimer();

    const ok = ch === this.text[this.pos];
    const span = this.spans[this.pos];
    this.keystrokes++;
    if (ok) {
      this.correct++;
      span.classList.add('ok');
    } else {
      this.errors++;
      span.classList.add('bad');
    }
    this.status[this.pos] = ok ? 'ok' : 'bad';
    Keyboard.flash(code, ok);

    this.pos++;

    // В тесте на время текст не должен закончиться — дописываем слова
    if (this.config.type === 'time' && this.text.length - this.pos < 80) {
      const more = ' ' + this.config.more();
      this.text += more;
      this.appendSpans(more);
    }

    if (this.pos >= this.text.length) {
      this.finish();
      return;
    }
    this.updateCursor();
    this.updateStats();
  },

  backspace() {
    if (this.pos === 0) return;
    this.pos--;
    if (this.status[this.pos] === 'ok') this.correct--;
    this.status[this.pos] = undefined;
    this.spans[this.pos].classList.remove('ok', 'bad');
    // Счётчик ошибок не уменьшаем: исправленная ошибка всё равно ошибка
    this.updateCursor();
    this.updateStats();
  },

  // ---------- Таймер и показатели ----------
  startTimer() {
    this.startTime = Date.now();
    this.el.hint.hidden = true;
    this.timerId = setInterval(() => {
      if (this.config.type === 'time' && this.elapsed() >= this.config.timeLimit) {
        this.finish();
      } else {
        this.updateStats();
      }
    }, 200);
  },

  elapsed() { // секунды с начала
    if (this.startTime === null) return 0;
    const seconds = (Date.now() - this.startTime) / 1000;
    return this.config.type === 'time' ? Math.min(seconds, this.config.timeLimit) : seconds;
  },

  calcWpm() {
    const minutes = this.elapsed() / 60;
    if (minutes < 1 / 60) return 0; // меньше секунды — ещё рано считать
    return Math.round(this.correct / 5 / minutes);
  },

  calcAccuracy() {
    if (this.keystrokes === 0) return 100;
    // Округляем вниз, чтобы при любой ошибке не показывать 100%
    return Math.floor(((this.keystrokes - this.errors) / this.keystrokes) * 100);
  },

  updateStats() {
    this.el.wpm.textContent = this.calcWpm();
    this.el.acc.textContent = this.calcAccuracy() + '%';
    this.el.err.textContent = this.errors;

    const type = this.config.type;
    let percent;
    if (type === 'time') {
      const left = Math.ceil(this.config.timeLimit - this.elapsed());
      this.el.time.textContent = formatTime(left);
      percent = (this.elapsed() / this.config.timeLimit) * 100;
      this.el.progressText.textContent = Math.floor(percent) + '%';
    } else {
      this.el.time.textContent = formatTime(this.elapsed());
      percent = (this.pos / this.text.length) * 100;
      if (type === 'count') {
        const done = this.text.slice(0, this.pos).split(' ').length - 1;
        this.el.progressText.textContent = `${done} / ${this.config.wordCount}`;
      } else {
        this.el.progressText.textContent = Math.floor(percent) + '%';
      }
    }
    this.el.progress.style.width = Math.min(100, percent) + '%';
  },

  // ---------- Завершение ----------
  finish() {
    if (this.finished) return;
    this.finished = true;
    clearInterval(this.timerId);
    Keyboard.highlight(undefined);

    const result = {
      date: new Date().toISOString(),
      mode: this.config.mode,             // 'practice' или 'lesson'
      type: this.config.type,             // вид упражнения
      lang: this.config.lang,
      difficulty: this.config.difficulty || null,
      lessonId: this.config.lesson ? this.config.lesson.id : null,
      wpm: this.calcWpm(),
      accuracy: this.calcAccuracy(),
      errors: this.errors,
      time: Math.round(this.elapsed()),
      chars: this.correct,
    };
    Storage.addResult(result);

    let passed = null;
    if (this.config.lesson) {
      passed = result.accuracy >= LESSON_PASS_ACCURACY;
      Storage.saveLessonResult(result.lang, this.config.lesson.id, result.wpm, result.accuracy, passed);
    }
    this.showResults(result, passed);
  },

  showResults(result, passed) {
    const r = this.el.results;
    r.querySelector('#res-wpm').textContent = result.wpm;
    r.querySelector('#res-acc').textContent = result.accuracy + '%';
    r.querySelector('#res-err').textContent = result.errors;
    r.querySelector('#res-time').textContent = formatTime(result.time);
    r.querySelector('#res-chars').textContent = result.chars;

    // Сообщение под заголовком
    const msg = r.querySelector('#res-message');
    msg.className = 'res-message';
    if (passed === true) {
      msg.textContent = t('results.lessonPassed');
      msg.classList.add('good');
    } else if (passed === false) {
      msg.textContent = t('results.lessonFailed', { n: LESSON_PASS_ACCURACY });
      msg.classList.add('bad');
    } else {
      msg.textContent = t('results.tip.' + (result.accuracy < 95 ? 'accuracy' : 'speed'));
    }

    // Кнопка «Следующий урок» — только если урок пройден и он не последний
    const nextBtn = r.querySelector('#res-next');
    const lesson = this.config.lesson;
    const list = lesson ? Lessons.list(lesson.lang) : [];
    const next = lesson ? list[list.indexOf(lesson) + 1] : null;
    nextBtn.hidden = !(passed && next);
    nextBtn.onclick = () => App.startLesson(next);

    r.querySelector('#res-new').hidden = !!lesson; // для урока «новый текст» не нужен

    this.el.area.hidden = true;
    r.hidden = false;
  },
};

// 75 -> "1:15"
function formatTime(seconds) {
  seconds = Math.max(0, Math.floor(seconds));
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
