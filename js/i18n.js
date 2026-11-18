// =====================================================================
// i18n.js — переводы интерфейса
// ---------------------------------------------------------------------
// Язык интерфейса не зависит от языка тренировки: можно читать меню
// по-русски и тренироваться на английской раскладке.
//
// Как пользоваться:
//   • в HTML: <span data-i18n="nav.home"></span> — текст подставится сам;
//   • в JS:   t('results.lessonFailed', { n: 90 }) — {n} заменится на 90.
// Чтобы добавить язык интерфейса, скопируйте блок ru и переведите строки.
// =====================================================================

const I18N = {
  ru: {
    'nav.home': 'Главная',
    'nav.learn': 'Обучение',
    'nav.practice': 'Практика',
    'nav.stats': 'Статистика',
    'nav.settings': 'Настройки',
    'theme.toggle': 'Сменить тему',

    'home.title': 'Научитесь печатать вслепую',
    'home.lead': 'Минималистичный тренажёр слепой печати: последовательные уроки для новичков, свободная практика для опытных и честная статистика прогресса.',
    'home.startLearning': 'Начать обучение',
    'home.startPractice': 'Свободная практика',
    'home.quick': 'Быстрый тест на 30 секунд',
    'home.learnTitle': 'Обучение',
    'home.learnText': 'Уроки по 2–3 новые клавиши. Начинаем с основного ряда и постепенно осваиваем всю клавиатуру.',
    'home.practiceTitle': 'Практика',
    'home.practiceText': 'Слова, предложения, тексты, отдельные клавиши и тесты на время или количество слов.',
    'home.statsTitle': 'Статистика',
    'home.statsText': 'Скорость, точность, история тренировок и графики. Всё хранится только в вашем браузере.',
    'home.summary': 'Ваши результаты',

    'learn.title': 'Обучение',
    'learn.lead': 'Проходите уроки по порядку. Урок засчитывается при точности от {n}%, после этого открывается следующий.',
    'learn.howTitle': 'Как держать руки',
    'learn.how1': 'Найдите клавиши с выступами: {left} и {right}. На них лежат указательные пальцы.',
    'learn.how2': 'Остальные пальцы ложатся рядом на основной ряд. Большие пальцы — на пробеле.',
    'learn.how3': 'Каждый палец отвечает за свою зону. Цвета на виртуальной клавиатуре показывают эти зоны.',
    'learn.how4': 'Смотрите на экран, а не на руки. Сначала точность, скорость придёт сама.',
    'learn.progress': 'Пройдено уроков: {done} из {total}',
    'learn.lesson': 'Урок {n}',
    'learn.keys': 'Клавиши {keys}',
    'learn.shift': 'Заглавные буквы',
    'learn.digits': 'Цифры',
    'learn.final': 'Итоговый урок',
    'learn.locked': 'Пока закрыт',
    'learn.best': 'Лучший: {wpm} WPM · {acc}%',
    'learn.shiftHint': 'Заглавная буква: держите Shift мизинцем руки, противоположной букве.',
    'learn.digitsHint': 'Цифры набираются тем же пальцем, что и буква под ними в верхнем ряду.',
    'learn.finalHint': 'Проверьте себя на обычных предложениях.',

    'finger.lp': 'левый мизинец', 'finger.lr': 'левый безымянный', 'finger.lm': 'левый средний',
    'finger.li': 'левый указательный', 'finger.ri': 'правый указательный', 'finger.rm': 'правый средний',
    'finger.rr': 'правый безымянный', 'finger.rp': 'правый мизинец', 'finger.th': 'большой палец',

    'practice.title': 'Свободная практика',
    'practice.lead': 'Выберите упражнение, сложность и язык.',
    'practice.type': 'Упражнение',
    'practice.difficulty': 'Сложность',
    'practice.language': 'Язык',
    'practice.time': 'Время',
    'practice.words': 'Количество слов',
    'practice.keys': 'Клавиши',
    'practice.customKeys': 'Свои клавиши',
    'practice.customPlaceholder': 'Например: фывапролдж',
    'practice.start': 'Начать',
    'practice.noKeys': 'Введите хотя бы одну клавишу текущей раскладки.',
    'practice.diffHint.easy': 'Короткие частые слова, только строчные буквы.',
    'practice.diffHint.medium': 'Все частые слова, иногда заглавные буквы.',
    'practice.diffHint.hard': 'Длинные слова, заглавные, знаки препинания и цифры.',

    'type.words': 'Слова', 'type.sentences': 'Предложения', 'type.text': 'Текст',
    'type.keys': 'Клавиши', 'type.time': 'На время', 'type.count': 'На количество слов',
    'type.lesson': 'Урок',
    'diff.easy': 'Лёгкий', 'diff.medium': 'Средний', 'diff.hard': 'Сложный',
    'lang.ru': 'Русский', 'lang.en': 'English',
    'group.home': 'Основной ряд', 'group.top': 'Верхний ряд', 'group.bottom': 'Нижний ряд',
    'group.digits': 'Цифры', 'group.left': 'Левая рука', 'group.right': 'Правая рука', 'group.custom': 'Свои',
    'unit.sec': '{n} сек', 'unit.words': '{n} слов',

    'train.back': 'Назад',
    'train.restart': 'Заново',
    'train.hint': 'Начните печатать — таймер запустится с первым нажатием',
    'train.shortcuts': 'Esc — начать заново',
    'train.layoutWarning': 'Похоже, в системе включена другая раскладка. Переключите язык ввода (обычно Alt+Shift, Ctrl+Shift или Win+Пробел).',
    'train.capsWarning': 'Включён Caps Lock',
    'train.mobile': 'Тренировка рассчитана на физическую клавиатуру. На телефоне удобно смотреть уроки и статистику.',

    'stats.wpm': 'WPM', 'stats.accuracy': 'Точность', 'stats.errors': 'Ошибки',
    'stats.time': 'Время', 'stats.left': 'Осталось', 'stats.progress': 'Прогресс', 'stats.chars': 'Символов',

    'results.title': 'Результат',
    'results.repeat': 'Повторить',
    'results.new': 'Новое упражнение',
    'results.next': 'Следующий урок',
    'results.back': 'К выбору',
    'results.lessonPassed': 'Урок пройден! Можно переходить к следующему.',
    'results.lessonFailed': 'Для прохождения нужна точность от {n}%. Попробуйте ещё раз, не торопясь.',
    'results.tip.accuracy': 'Совет: снизьте темп. Точность важнее скорости.',
    'results.tip.speed': 'Отличная точность! Можно понемногу ускоряться.',

    'statsPage.title': 'Статистика',
    'statsPage.all': 'Все',
    'statsPage.avgWpm': 'Средняя скорость',
    'statsPage.avgAcc': 'Средняя точность',
    'statsPage.best': 'Лучший результат',
    'statsPage.count': 'Тренировок',
    'statsPage.totalTime': 'Общее время',
    'statsPage.learning': 'Прогресс обучения',
    'statsPage.chart': 'Скорость и точность (последние 30 тренировок)',
    'statsPage.history': 'История тренировок',
    'statsPage.empty': 'Здесь пока пусто. Пройдите первую тренировку, и результаты появятся.',
    'statsPage.noChart': 'Не удалось загрузить библиотеку графиков.',
    'statsPage.date': 'Дата', 'statsPage.exercise': 'Упражнение', 'statsPage.lang': 'Язык',

    'settings.title': 'Настройки',
    'settings.appearance': 'Оформление',
    'settings.theme': 'Тема',
    'settings.light': 'Светлая', 'settings.dark': 'Тёмная',
    'settings.uiLang': 'Язык интерфейса',
    'settings.typingLang': 'Язык тренировок',
    'settings.training': 'Тренировка',
    'settings.showKeyboard': 'Показывать виртуальную клавиатуру',
    'settings.showFingers': 'Раскрашивать клавиши по пальцам',
    'settings.data': 'Данные',
    'settings.dataText': 'Все данные хранятся только в этом браузере. Сохраните их в файл, чтобы перенести на другой компьютер или не потерять.',
    'settings.export': 'Сохранить в файл',
    'settings.import': 'Загрузить из файла',
    'settings.reset': 'Удалить все данные',
    'settings.resetConfirm': 'Удалить всю статистику, прогресс уроков и настройки? Это нельзя отменить.',
    'settings.importOk': 'Данные загружены.',
    'settings.importBad': 'Этот файл не подходит. Выберите файл, сохранённый в ProTyping.',
    'settings.resetDone': 'Все данные удалены.',
    'on': 'Вкл', 'off': 'Выкл',
  },

  en: {
    'nav.home': 'Home',
    'nav.learn': 'Learn',
    'nav.practice': 'Practice',
    'nav.stats': 'Statistics',
    'nav.settings': 'Settings',
    'theme.toggle': 'Toggle theme',

    'home.title': 'Learn to touch type',
    'home.lead': 'A minimalist touch typing trainer: step-by-step lessons for beginners, free practice for experienced typists and honest progress statistics.',
    'home.startLearning': 'Start learning',
    'home.startPractice': 'Free practice',
    'home.quick': 'Quick 30-second test',
    'home.learnTitle': 'Learn',
    'home.learnText': 'Lessons add 2–3 new keys at a time. Start with the home row and gradually master the whole keyboard.',
    'home.practiceTitle': 'Practice',
    'home.practiceText': 'Words, sentences, texts, key drills, and timed or word-count tests.',
    'home.statsTitle': 'Statistics',
    'home.statsText': 'Speed, accuracy, history and charts. Everything stays in your browser only.',
    'home.summary': 'Your results',

    'learn.title': 'Learn',
    'learn.lead': 'Complete lessons in order. A lesson is passed with at least {n}% accuracy, and then the next one unlocks.',
    'learn.howTitle': 'Hand position',
    'learn.how1': 'Find the keys with bumps: {left} and {right}. Your index fingers rest on them.',
    'learn.how2': 'The other fingers rest next to them on the home row. Thumbs rest on the space bar.',
    'learn.how3': 'Each finger has its own zone. The colors on the virtual keyboard show these zones.',
    'learn.how4': 'Look at the screen, not your hands. Accuracy first, speed will follow.',
    'learn.progress': 'Lessons completed: {done} of {total}',
    'learn.lesson': 'Lesson {n}',
    'learn.keys': 'Keys {keys}',
    'learn.shift': 'Capital letters',
    'learn.digits': 'Numbers',
    'learn.final': 'Final lesson',
    'learn.locked': 'Locked',
    'learn.best': 'Best: {wpm} WPM · {acc}%',
    'learn.shiftHint': 'Capital letter: hold Shift with the pinky of the opposite hand.',
    'learn.digitsHint': 'Numbers are typed with the same finger as the letter below them in the top row.',
    'learn.finalHint': 'Test yourself on regular sentences.',

    'finger.lp': 'left pinky', 'finger.lr': 'left ring', 'finger.lm': 'left middle',
    'finger.li': 'left index', 'finger.ri': 'right index', 'finger.rm': 'right middle',
    'finger.rr': 'right ring', 'finger.rp': 'right pinky', 'finger.th': 'thumb',

    'practice.title': 'Free practice',
    'practice.lead': 'Choose an exercise, difficulty and language.',
    'practice.type': 'Exercise',
    'practice.difficulty': 'Difficulty',
    'practice.language': 'Language',
    'practice.time': 'Time',
    'practice.words': 'Number of words',
    'practice.keys': 'Keys',
    'practice.customKeys': 'Custom keys',
    'practice.customPlaceholder': 'For example: asdfjkl',
    'practice.start': 'Start',
    'practice.noKeys': 'Enter at least one key of the current layout.',
    'practice.diffHint.easy': 'Short common words, lowercase only.',
    'practice.diffHint.medium': 'All common words, occasional capital letters.',
    'practice.diffHint.hard': 'Long words, capitals, punctuation and numbers.',

    'type.words': 'Words', 'type.sentences': 'Sentences', 'type.text': 'Text',
    'type.keys': 'Keys', 'type.time': 'Timed', 'type.count': 'Word count',
    'type.lesson': 'Lesson',
    'diff.easy': 'Easy', 'diff.medium': 'Medium', 'diff.hard': 'Hard',
    'lang.ru': 'Русский', 'lang.en': 'English',
    'group.home': 'Home row', 'group.top': 'Top row', 'group.bottom': 'Bottom row',
    'group.digits': 'Numbers', 'group.left': 'Left hand', 'group.right': 'Right hand', 'group.custom': 'Custom',
    'unit.sec': '{n} s', 'unit.words': '{n} words',

    'train.back': 'Back',
    'train.restart': 'Restart',
    'train.hint': 'Start typing — the timer starts with your first keystroke',
    'train.shortcuts': 'Esc — restart',
    'train.layoutWarning': 'Looks like a different keyboard layout is active. Switch your input language (usually Alt+Shift, Ctrl+Shift or Win+Space).',
    'train.capsWarning': 'Caps Lock is on',
    'train.mobile': 'Training is designed for a physical keyboard. On a phone you can browse lessons and statistics.',

    'stats.wpm': 'WPM', 'stats.accuracy': 'Accuracy', 'stats.errors': 'Errors',
    'stats.time': 'Time', 'stats.left': 'Left', 'stats.progress': 'Progress', 'stats.chars': 'Characters',

    'results.title': 'Result',
    'results.repeat': 'Repeat',
    'results.new': 'New exercise',
    'results.next': 'Next lesson',
    'results.back': 'Back',
    'results.lessonPassed': 'Lesson passed! You can move on to the next one.',
    'results.lessonFailed': 'You need at least {n}% accuracy to pass. Try again, slowly.',
    'results.tip.accuracy': 'Tip: slow down a little. Accuracy matters more than speed.',
    'results.tip.speed': 'Great accuracy! You can gradually speed up.',

    'statsPage.title': 'Statistics',
    'statsPage.all': 'All',
    'statsPage.avgWpm': 'Average speed',
    'statsPage.avgAcc': 'Average accuracy',
    'statsPage.best': 'Best result',
    'statsPage.count': 'Sessions',
    'statsPage.totalTime': 'Total time',
    'statsPage.learning': 'Learning progress',
    'statsPage.chart': 'Speed and accuracy (last 30 sessions)',
    'statsPage.history': 'Session history',
    'statsPage.empty': 'Nothing here yet. Complete your first session and the results will appear.',
    'statsPage.noChart': 'Could not load the chart library.',
    'statsPage.date': 'Date', 'statsPage.exercise': 'Exercise', 'statsPage.lang': 'Language',

    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.theme': 'Theme',
    'settings.light': 'Light', 'settings.dark': 'Dark',
    'settings.uiLang': 'Interface language',
    'settings.typingLang': 'Typing language',
    'settings.training': 'Training',
    'settings.showKeyboard': 'Show virtual keyboard',
    'settings.showFingers': 'Color keys by finger',
    'settings.data': 'Data',
    'settings.dataText': 'All data is stored in this browser only. Save it to a file to move it to another computer or keep a backup.',
    'settings.export': 'Save to file',
    'settings.import': 'Load from file',
    'settings.reset': 'Delete all data',
    'settings.resetConfirm': 'Delete all statistics, lesson progress and settings? This cannot be undone.',
    'settings.importOk': 'Data loaded.',
    'settings.importBad': 'This file is not suitable. Choose a file saved by ProTyping.',
    'settings.resetDone': 'All data deleted.',
    'on': 'On', 'off': 'Off',
  },
};

let currentUiLang = 'ru';

// Перевод строки по ключу. Если перевода нет — возвращаем сам ключ,
// так сразу видно, какую строку забыли перевести.
function t(key, params = {}) {
  let str = (I18N[currentUiLang] && I18N[currentUiLang][key]) || I18N.ru[key] || key;
  for (const name in params) str = str.replace(`{${name}}`, params[name]);
  return str;
}

// Подставляет переводы во все элементы с атрибутами data-i18n
function applyTranslations(lang) {
  currentUiLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
    el.setAttribute('aria-label', el.title);
  });
}
