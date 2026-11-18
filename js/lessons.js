// =====================================================================
// lessons.js — уроки режима обучения
// ---------------------------------------------------------------------
// Порядок изучения клавиш:
//   1) основной (домашний) ряд от указательных пальцев к мизинцам;
//   2) верхний ряд — самые частые буквы раньше;
//   3) нижний ряд;
//   4) заглавные буквы (Shift), цифры и итоговый урок.
// Каждый урок добавляет 2–3 новые клавиши. В упражнениях используются
// только уже изученные клавиши, поэтому новичку никогда не попадётся
// буква, которую он ещё не проходил.
//
// Урок засчитывается, если точность не ниже LESSON_PASS_ACCURACY.
// Следующий урок открывается после прохождения предыдущего.
// =====================================================================

const LESSON_PASS_ACCURACY = 90;

// kind: 'keys' — урок новых клавиш, 'shift' — заглавные, 'digits' — цифры,
//       'final' — итоговый урок с предложениями
const LESSON_PLAN = {
  ru: ['ао', 'вл', 'ыд', 'фж', 'пр', 'ен', 'кг', 'мт', 'иь', 'уш', 'сб', 'цщ', 'чю', 'йз', 'я.', 'хэъ', 'ё',
       { kind: 'shift' }, { kind: 'digits' }, { kind: 'final' }],
  en: ['fj', 'dk', 'sl', 'a;', 'gh', 'ei', 'ru', 'ty', 'wo', 'qp', 'vm', 'c,', 'x.', 'bn', 'z/',
       { kind: 'shift' }, { kind: 'digits' }, { kind: 'final' }],
};

// Превращаем план в список уроков с id и накопленными клавишами
function buildLessons(lang) {
  const learned = [];
  return LESSON_PLAN[lang].map((item, index) => {
    const lesson = { id: `${lang}-${index + 1}`, number: index + 1, lang };
    if (typeof item === 'string') {
      lesson.kind = 'keys';
      lesson.keys = Array.from(item);
      learned.push(...lesson.keys);
    } else {
      lesson.kind = item.kind;
      lesson.keys = [];
    }
    lesson.allowed = learned.slice(); // все клавиши, изученные к концу урока
    return lesson;
  });
}

const LESSONS = { ru: buildLessons('ru'), en: buildLessons('en') };

// Дополнительные слова только для уроков (в обычных текстах нет буквы «ё»)
const EXTRA_LESSON_WORDS = {
  ru: ['ёж', 'ёлка', 'мёд', 'лёд', 'всё', 'ещё', 'тётя', 'звёзды', 'полёт', 'берёза', 'жёлтый', 'чёрный'],
  en: [],
};

const isLetter = c => /\p{L}/u.test(c);

const Lessons = {
  list(lang) { return LESSONS[lang]; },

  find(lang, id) { return LESSONS[lang].find(l => l.id === id); },

  // Урок открыт, если это первый урок или предыдущий пройден
  isUnlocked(lang, index, progress) {
    if (index === 0) return true;
    const prev = LESSONS[lang][index - 1];
    return !!(progress[prev.id] && progress[prev.id].passed);
  },

  // Сколько уроков пройдено (в процентах)
  progressPercent(lang) {
    const progress = Storage.getLessons()[lang] || {};
    const passed = LESSONS[lang].filter(l => progress[l.id] && progress[l.id].passed).length;
    return Math.round((passed / LESSONS[lang].length) * 100);
  },

  // Текст упражнения для урока
  generate(lesson) {
    const lang = lesson.lang;
    if (lesson.kind === 'shift') return this.generateShift(lang);
    if (lesson.kind === 'digits') return this.generateDigits(lang);
    if (lesson.kind === 'final') return shuffle(TEXTS[lang].sentences.medium).slice(0, 3).join(' ');

    const newKeys = lesson.keys;
    const letters = lesson.allowed.filter(isLetter);
    const newLetters = newKeys.filter(isLetter);
    const marks = lesson.allowed.filter(c => !isLetter(c)); // знаки: ; , . /
    const parts = [];

    // Часть 1: только новые клавиши («ао оа ааоо»)
    for (let i = 0; i < 8; i++) {
      let group = '';
      const len = randomInt(2, 4);
      for (let j = 0; j < len; j++) group += randomItem(newKeys);
      parts.push(group);
    }

    // Часть 2: «псевдослова» из всех изученных букв, в каждом есть новая буква
    const source = newLetters.length ? newLetters : letters;
    for (let i = 0; i < 8; i++) {
      const len = randomInt(3, 5);
      const chars = [randomItem(source)];
      while (chars.length < len) chars.push(randomItem(letters));
      parts.push(this.addMark(shuffle(chars).join(''), marks, newKeys));
    }

    // Часть 3: настоящие слова, которые состоят только из изученных букв
    const allowedSet = new Set(letters);
    const dictionary = Array.from(new Set(TEXTS[lang].common.concat(TEXTS[lang].rare, EXTRA_LESSON_WORDS[lang])));
    let realWords = dictionary.filter(w => Array.from(w).every(c => allowedSet.has(c)));
    const withNew = realWords.filter(w => newLetters.some(c => w.includes(c)));
    if (withNew.length >= 3) realWords = withNew;
    for (let i = 0; i < 8; i++) {
      const word = realWords.length >= 3 ? randomItem(realWords)
        : Array.from({ length: randomInt(3, 5) }, () => randomItem(letters)).join('');
      parts.push(this.addMark(word, marks, newKeys));
    }

    return parts.join(' ');
  },

  // Иногда добавляет знак препинания в конец слова (если знаки уже изучены).
  // Новый знак добавляется чаще, чтобы его потренировать.
  addMark(word, marks, newKeys) {
    if (!marks.length) return word;
    const mark = randomItem(marks);
    const chance = newKeys.includes(mark) ? 0.5 : 0.15;
    return Math.random() < chance ? word + mark : word;
  },

  generateShift(lang) {
    const words = pickMany(TEXTS[lang].common.filter(w => w.length >= 3), 14)
      .map(w => (Math.random() < 0.7 ? capitalize(w) : w));
    return words.join(' ') + ' ' + shuffle(TEXTS[lang].sentences.easy).slice(0, 2).join(' ');
  },

  generateDigits(lang) {
    const parts = [];
    for (let i = 0; i < 8; i++) parts.push(String(randomInt(10, 999)));
    const words = pickMany(TEXTS[lang].common.filter(w => w.length >= 3), 10);
    words.forEach(w => parts.push(Math.random() < 0.5 ? `${randomInt(1, 99)} ${w}` : w));
    return parts.join(' ');
  },
};
