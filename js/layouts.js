// =====================================================================
// layouts.js — раскладки клавиатуры и распределение пальцев
// ---------------------------------------------------------------------
// Идея: физическая клавиатура одна и та же, меняются только символы
// на клавишах. Поэтому:
//   1) KEY_ROWS описывает физические клавиши (их код из event.code);
//   2) FINGER_BY_CODE говорит, каким пальцем нажимать каждую клавишу;
//   3) LAYOUTS хранит, какой символ стоит на клавише в каждой раскладке.
// Чтобы добавить новый язык, достаточно добавить ещё одну запись в LAYOUTS.
// =====================================================================

// Коды клавиш по рядам (только клавиши с символами)
const CODE_ROWS = {
  number: ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6',
           'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal'],
  top:    ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO',
           'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  home:   ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL',
           'Semicolon', 'Quote'],
  bottom: ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma',
           'Period', 'Slash'],
};

// Полный вид клавиатуры: ряды с учётом служебных клавиш.
// width — ширина клавиши в «обычных» клавишах (1 = стандартная).
const KEY_ROWS = [
  [...CODE_ROWS.number.map(code => ({ code })), { code: 'Backspace', label: 'Backspace', width: 2 }],
  [{ code: 'Tab', label: 'Tab', width: 1.5 }, ...CODE_ROWS.top.map(code => ({ code }))],
  [{ code: 'CapsLock', label: 'Caps', width: 1.8 }, ...CODE_ROWS.home.map(code => ({ code })),
   { code: 'Enter', label: 'Enter', width: 2.2 }],
  [{ code: 'ShiftLeft', label: 'Shift', width: 2.4 }, ...CODE_ROWS.bottom.map(code => ({ code })),
   { code: 'ShiftRight', label: 'Shift', width: 2.6 }],
  [{ code: 'Space', label: '', width: 7 }],
];

// Пальцы. Короткие коды используются как CSS-классы (finger-lp и т.д.)
//   l/r — левая/правая рука; p — мизинец, r — безымянный, m — средний,
//   i — указательный, t — большой палец.
const FINGERS = ['lp', 'lr', 'lm', 'li', 'ri', 'rm', 'rr', 'rp', 'th'];

const FINGER_BY_CODE = {
  Backquote: 'lp', Digit1: 'lp', Tab: 'lp', KeyQ: 'lp', CapsLock: 'lp', KeyA: 'lp', ShiftLeft: 'lp', KeyZ: 'lp',
  Digit2: 'lr', KeyW: 'lr', KeyS: 'lr', KeyX: 'lr',
  Digit3: 'lm', KeyE: 'lm', KeyD: 'lm', KeyC: 'lm',
  Digit4: 'li', Digit5: 'li', KeyR: 'li', KeyT: 'li', KeyF: 'li', KeyG: 'li', KeyV: 'li', KeyB: 'li',
  Digit6: 'ri', Digit7: 'ri', KeyY: 'ri', KeyU: 'ri', KeyH: 'ri', KeyJ: 'ri', KeyN: 'ri', KeyM: 'ri',
  Digit8: 'rm', KeyI: 'rm', KeyK: 'rm', Comma: 'rm',
  Digit9: 'rr', KeyO: 'rr', KeyL: 'rr', Period: 'rr',
  Digit0: 'rp', Minus: 'rp', Equal: 'rp', KeyP: 'rp', BracketLeft: 'rp', BracketRight: 'rp',
  Backslash: 'rp', Semicolon: 'rp', Quote: 'rp', Slash: 'rp', Enter: 'rp', ShiftRight: 'rp', Backspace: 'rp',
  Space: 'th',
};

// Клавиши с выступами (на них лежат указательные пальцы)
const HOME_BUMPS = ['KeyF', 'KeyJ'];

// Вспомогательная функция: «склеивает» ряд кодов с двумя строками символов.
// normal — символы без Shift, shifted — символы с Shift.
function mapRow(codes, normal, shifted) {
  const result = {};
  const a = Array.from(normal);
  const b = Array.from(shifted);
  codes.forEach((code, i) => { result[code] = [a[i], b[i]]; });
  return result;
}

// ---------------------------------------------------------------------
// Раскладки. Для каждой: название, символы на клавишах.
// ---------------------------------------------------------------------
const LAYOUTS = {
  ru: {
    id: 'ru',
    name: 'Русский (ЙЦУКЕН)',
    keys: {
      ...mapRow(CODE_ROWS.number, 'ё1234567890-=', 'Ё!"№;%:?*()_+'),
      ...mapRow(CODE_ROWS.top,    'йцукенгшщзхъ\\', 'ЙЦУКЕНГШЩЗХЪ/'),
      ...mapRow(CODE_ROWS.home,   'фывапролджэ',    'ФЫВАПРОЛДЖЭ'),
      ...mapRow(CODE_ROWS.bottom, 'ячсмитьбю.',     'ЯЧСМИТЬБЮ,'),
    },
  },
  en: {
    id: 'en',
    name: 'English (QWERTY)',
    keys: {
      ...mapRow(CODE_ROWS.number, '`1234567890-=', '~!@#$%^&*()_+'),
      ...mapRow(CODE_ROWS.top,    'qwertyuiop[]\\', 'QWERTYUIOP{}|'),
      ...mapRow(CODE_ROWS.home,   "asdfghjkl;'",    'ASDFGHJKL:"'),
      ...mapRow(CODE_ROWS.bottom, 'zxcvbnm,./',     'ZXCVBNM<>?'),
    },
  },
};

// Кэш «символ -> клавиша», чтобы не искать каждый раз заново
const charMapCache = {};

// Возвращает объект: { 'а': {code:'KeyF', shift:false}, 'А': {code:'KeyF', shift:true}, ... }
function getCharMap(layoutId) {
  if (charMapCache[layoutId]) return charMapCache[layoutId];
  const map = { ' ': { code: 'Space', shift: false } };
  const keys = LAYOUTS[layoutId].keys;
  for (const code in keys) {
    const [normal, shifted] = keys[code];
    if (!(normal in map)) map[normal] = { code, shift: false };
    if (!(shifted in map)) map[shifted] = { code, shift: true };
  }
  charMapCache[layoutId] = map;
  return map;
}

// Можно ли набрать символ в этой раскладке
function layoutHasChar(layoutId, ch) {
  return ch in getCharMap(layoutId);
}

// Символы ряда (без Shift) — нужно для упражнений «по рядам»
function rowChars(layoutId, rowName) {
  const keys = LAYOUTS[layoutId].keys;
  return CODE_ROWS[rowName].map(code => keys[code][0]);
}

// Все символы, которые нажимаются одной рукой ('l' или 'r')
function handChars(layoutId, hand) {
  const keys = LAYOUTS[layoutId].keys;
  const result = [];
  for (const row of ['top', 'home', 'bottom']) {
    for (const code of CODE_ROWS[row]) {
      if (FINGER_BY_CODE[code][0] === hand && /\p{L}/u.test(keys[code][0])) result.push(keys[code][0]);
    }
  }
  return result;
}
