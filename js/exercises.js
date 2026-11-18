// =====================================================================
// exercises.js — генерация текста для упражнений свободной практики
// ---------------------------------------------------------------------
// Что значат уровни сложности (одинаково для всех языков):
//   Лёгкий  — короткие частые слова, только строчные буквы, без знаков.
//   Средний — все частые слова, иногда заглавная буква.
//   Сложный — длинные и редкие слова, заглавные буквы, знаки
//             препинания и цифры.
// Для предложений и текстов уровень выбирает набор текстов
// (короткие простые -> длинные со знаками препинания и цифрами).
// =====================================================================

// ---------- Маленькие помощники ----------
function randomInt(min, max) { // включая min и max
  return min + Math.floor(Math.random() * (max - min + 1));
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) { // перемешивание Фишера–Йетса, возвращает новый массив
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Выбирает count случайных элементов, стараясь не повторять соседние
function pickMany(pool, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    let item = randomItem(pool);
    if (pool.length > 1 && item === result[result.length - 1]) item = randomItem(pool);
    result.push(item);
  }
  return result;
}

const Exercises = {
  // Набор слов для уровня сложности
  wordPool(lang, difficulty) {
    const { common, rare } = TEXTS[lang];
    if (difficulty === 'easy') return common.filter(w => w.length <= 5);
    if (difficulty === 'medium') return common;
    return common.filter(w => w.length >= 4).concat(rare);
  },

  // Список случайных слов с учётом сложности
  words(lang, difficulty, count) {
    const words = pickMany(this.wordPool(lang, difficulty), count);
    if (difficulty === 'easy') return words.join(' ');

    return words.map(word => {
      if (difficulty === 'medium') {
        return Math.random() < 0.1 ? capitalize(word) : word;
      }
      // Сложный уровень
      if (Math.random() < 0.06) return String(randomInt(1, 2030)); // иногда число
      if (Math.random() < 0.2) word = capitalize(word);
      if (Math.random() < 0.15) word += randomItem([',', ',', '.', '!', '?', ':', ';']);
      return word;
    }).join(' ');
  },

  // Несколько случайных предложений подряд
  sentences(lang, difficulty) {
    const count = { easy: 4, medium: 3, hard: 3 }[difficulty];
    const pool = shuffle(TEXTS[lang].sentences[difficulty]);
    return pool.slice(0, count).join(' ');
  },

  // Один связный текст. Возвращает { title, text }
  text(lang, difficulty) {
    return randomItem(TEXTS[lang].texts[difficulty]);
  },

  // Символы для режима «Клавиши»
  keyGroupChars(lang, group, customKeys) {
    switch (group) {
      case 'home':   return rowChars(lang, 'home').filter(c => /\p{L}/u.test(c) || c === ';');
      case 'top':    return rowChars(lang, 'top').filter(c => /\p{L}/u.test(c));
      case 'bottom': return rowChars(lang, 'bottom').filter(c => /\p{L}/u.test(c));
      case 'digits': return rowChars(lang, 'number').filter(c => /\d/.test(c));
      case 'left':   return handChars(lang, 'l');
      case 'right':  return handChars(lang, 'r');
      case 'custom': {
        // Берём только уникальные символы, которые есть в раскладке
        const chars = Array.from(new Set(Array.from((customKeys || '').toLowerCase())));
        return chars.filter(c => c !== ' ' && layoutHasChar(lang, c));
      }
    }
    return [];
  },

  // Упражнение на группу клавиш: «псевдослова» из выбранных символов,
  // а если из этих букв складываются настоящие слова — подмешиваем и их.
  keys(lang, difficulty, chars, count = 30) {
    if (chars.length === 0) return '';
    const [minLen, maxLen] = { easy: [2, 3], medium: [3, 5], hard: [4, 7] }[difficulty];
    const allowed = new Set(chars);
    const realWords = this.wordPool(lang, 'hard').concat(TEXTS[lang].common)
      .filter(w => Array.from(w).every(c => allowed.has(c)));

    const result = [];
    for (let i = 0; i < count; i++) {
      if (realWords.length >= 3 && Math.random() < 0.4) {
        result.push(randomItem(realWords));
      } else {
        let group = '';
        const len = randomInt(minLen, maxLen);
        for (let j = 0; j < len; j++) group += randomItem(chars);
        result.push(group);
      }
    }
    return result.join(' ');
  },
};
