// =====================================================================
// storage.js — сохранение данных в браузере (localStorage)
// ---------------------------------------------------------------------
// Все данные хранятся под ключами с префиксом "protyping.":
//   protyping.settings — настройки (тема, языки и т.д.)
//   protyping.history  — история тренировок (массив результатов)
//   protyping.lessons  — прогресс уроков { en: {...}, ru: {...} }
// localStorage умеет хранить только строки, поэтому объекты
// превращаем в текст через JSON.stringify и обратно через JSON.parse.
// =====================================================================

const Storage = {
  PREFIX: 'protyping.',
  MAX_HISTORY: 1000, // чтобы история не росла бесконечно

  load(key, fallback) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      // Например, если данные повреждены или localStorage выключен
      return fallback;
    }
  },

  save(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Не удалось сохранить данные:', e);
    }
  },

  // ---------- Настройки ----------
  defaultSettings() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      theme: prefersDark ? 'dark' : 'light',
      uiLang: 'ru',          // язык интерфейса
      typingLang: 'ru',      // язык тренировки
      showKeyboard: true,    // показывать виртуальную клавиатуру
      showFingers: true,     // раскрашивать клавиши по пальцам
      showHands: true,       // показывать полупрозрачные руки на клавиатуре
      // последние выбранные параметры свободной практики
      practiceType: 'words',
      difficulty: 'easy',
      timeLimit: 30,
      wordCount: 25,
      keyGroup: 'home',
      customKeys: '',
    };
  },

  getSettings() {
    // Объединяем значения по умолчанию с сохранёнными:
    // так новые настройки появятся даже у старых пользователей.
    return { ...this.defaultSettings(), ...this.load('settings', {}) };
  },

  saveSettings(settings) {
    this.save('settings', settings);
  },

  // ---------- История тренировок ----------
  getHistory() {
    return this.load('history', []);
  },

  addResult(result) {
    const history = this.getHistory();
    history.push(result);
    // Оставляем только последние MAX_HISTORY записей
    this.save('history', history.slice(-this.MAX_HISTORY));
  },

  // ---------- Прогресс уроков ----------
  // Формат: { ru: { 'ru-1': { passed: true, bestWpm: 25, bestAccuracy: 97 } }, en: {...} }
  getLessons() {
    return this.load('lessons', {});
  },

  saveLessonResult(lang, lessonId, wpm, accuracy, passed) {
    const all = this.getLessons();
    if (!all[lang]) all[lang] = {};
    const old = all[lang][lessonId] || { passed: false, bestWpm: 0, bestAccuracy: 0 };
    all[lang][lessonId] = {
      passed: old.passed || passed, // если урок уже был пройден, он остаётся пройденным
      bestWpm: Math.max(old.bestWpm, wpm),
      bestAccuracy: Math.max(old.bestAccuracy, accuracy),
    };
    this.save('lessons', all);
  },

  // ---------- Экспорт / импорт / сброс ----------
  exportAll() {
    return {
      app: 'ProTyping',
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      history: this.getHistory(),
      lessons: this.getLessons(),
    };
  },

  // Возвращает true, если файл подошёл и данные загружены
  importAll(data) {
    if (!data || data.app !== 'ProTyping' || !Array.isArray(data.history)) return false;
    this.save('settings', { ...this.defaultSettings(), ...(data.settings || {}) });
    this.save('history', data.history.slice(-this.MAX_HISTORY));
    this.save('lessons', data.lessons || {});
    return true;
  },

  clearAll() {
    ['settings', 'history', 'lessons'].forEach(key => localStorage.removeItem(this.PREFIX + key));
  },
};
