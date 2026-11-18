// =====================================================================
// keyboard.js — виртуальная клавиатура
// ---------------------------------------------------------------------
// Умеет:
//   render()    — нарисовать клавиатуру нужной раскладки;
//   highlight() — подсветить клавишу (и Shift), которую нужно нажать;
//   flash()     — коротко мигнуть зелёным/красным после нажатия.
// =====================================================================

const Keyboard = {
  container: null,
  layoutId: 'ru',
  keyElements: {}, // code -> DOM-элемент клавиши
  highlighted: [], // какие клавиши сейчас подсвечены

  render(container, layoutId, showFingers, showHands) {
    this.container = container;
    this.layoutId = layoutId;
    this.keyElements = {};
    this.highlighted = [];
    container.innerHTML = '';
    container.classList.toggle('no-fingers', !showFingers);

    const keys = LAYOUTS[layoutId].keys;

    KEY_ROWS.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'kb-row';

      row.forEach(key => {
        const el = document.createElement('div');
        el.className = `kb-key finger-${FINGER_BY_CODE[key.code]}`;
        el.dataset.code = key.code;
        if (key.width) el.style.flexGrow = key.width;
        if (HOME_BUMPS.includes(key.code)) el.classList.add('bump');

        if (key.label !== undefined) {
          // Служебная клавиша (Shift, Enter...)
          el.classList.add('kb-special');
          el.textContent = key.label;
        } else {
          const [normal, shifted] = keys[key.code];
          if (normal.toUpperCase() === shifted) {
            // Буква: показываем одну заглавную, как на настоящей клавиатуре
            el.textContent = shifted;
          } else {
            // Символ: сверху — с Shift, снизу — без
            el.innerHTML = `<span class="kb-shift"></span><span class="kb-normal"></span>`;
            el.querySelector('.kb-shift').textContent = shifted;
            el.querySelector('.kb-normal').textContent = normal;
          }
        }

        this.keyElements[key.code] = el;
        rowEl.appendChild(el);
      });

      container.appendChild(rowEl);
    });

    // Полупрозрачные руки поверх клавиш (см. hands.js)
    this.showHands = showHands;
    if (showHands) Hands.render(container);
    else if (Hands.container === container) Hands.remove();
  },

  // Подсвечивает клавишу для символа ch. Для заглавных — ещё и Shift
  // на противоположной руке (так правильно по методике слепой печати).
  highlight(ch) {
    this.highlighted.forEach(el => el.classList.remove('target'));
    this.highlighted = [];
    if (!this.container) return;

    const info = ch === undefined ? null : getCharMap(this.layoutId)[ch];
    if (!info) {
      if (this.showHands) Hands.update([]); // пальцы возвращаются на основной ряд
      return;
    }

    const codes = [info.code];
    if (info.shift) {
      const leftHand = FINGER_BY_CODE[info.code][0] === 'l';
      codes.push(leftHand ? 'ShiftRight' : 'ShiftLeft');
    }
    codes.forEach(code => {
      const el = this.keyElements[code];
      if (el) {
        el.classList.add('target');
        this.highlighted.push(el);
      }
    });
    if (this.showHands) Hands.update(codes);
  },

  // Короткая вспышка на нажатой физической клавише
  flash(code, ok) {
    const el = this.keyElements[code];
    if (!el) return;
    const cls = ok ? 'flash-ok' : 'flash-bad';
    el.classList.remove('flash-ok', 'flash-bad');
    void el.offsetWidth; // «перезапуск» CSS-анимации
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 250);
  },
};
