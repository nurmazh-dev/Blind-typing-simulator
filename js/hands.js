// =====================================================================
// hands.js — полупрозрачные руки поверх виртуальной клавиатуры
// ---------------------------------------------------------------------
// Руки рисуются в SVG (векторная графика прямо в HTML).
// Каждый палец — это толстая линия с круглыми концами:
//   • «основание» пальца (костяшка) неподвижно;
//   • «кончик» пальца лежит на своей клавише основного ряда
//     (Ф Ы В А / О Л Д Ж или A S D F / J K L ;), большие пальцы — на пробеле.
// Когда нужно нажать клавишу, отвечающий за неё палец «тянется» к ней
// и подсвечивается. Остальные пальцы остаются на месте.
//
// Координаты берутся с настоящих клавиш на странице, поэтому руки
// подстраиваются под любой размер экрана.
// =====================================================================

const SVG_NS = 'http://www.w3.org/2000/svg';

const Hands = {
  container: null,   // элемент клавиатуры
  svg: null,
  fingers: {},       // id пальца -> { line, base: {x,y}, home: {x,y} }
  activeCodes: [],   // клавиши, которые сейчас нужно нажать

  // Клавиши, на которых пальцы лежат в исходной позиции
  HOME_KEYS: {
    lp: 'KeyA', lr: 'KeyS', lm: 'KeyD', li: 'KeyF',
    ri: 'KeyJ', rm: 'KeyK', rr: 'KeyL', rp: 'Semicolon',
  },

  // Добавляет руки в контейнер клавиатуры (вызывается после Keyboard.render)
  render(container) {
    this.remove();
    this.container = container;
    this.activeCodes = [];
    this.svg = document.createElementNS(SVG_NS, 'svg');
    this.svg.classList.add('hands');
    this.svg.setAttribute('aria-hidden', 'true');
    container.appendChild(this.svg);
    container.classList.add('with-hands');
    this.layout();
  },

  // Убирает руки (например, если их выключили в настройках)
  remove() {
    if (this.svg) this.svg.remove();
    if (this.container) {
      this.container.classList.remove('with-hands');
      this.container.style.marginBottom = '';
    }
    this.svg = null;
  },

  // Центр клавиши относительно контейнера клавиатуры
  keyCenter(code) {
    const el = Keyboard.keyElements[code];
    const box = this.container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
  },

  // Рассчитывает форму рук по размерам клавиш и рисует их заново
  layout() {
    if (!this.svg || !this.container.isConnected) return;
    const keyRect = Keyboard.keyElements.KeyF.getBoundingClientRect();
    if (keyRect.width === 0) return; // клавиатура скрыта — рисовать пока нечего

    this.svg.innerHTML = '';
    this.fingers = {};
    // Верхний слой: подсвеченные пальцы рисуются поверх полупрозрачных рук
    this.activeLayer = document.createElementNS(SVG_NS, 'g');
    this.activeLayer.classList.add('active-fingers');
    const keyW = keyRect.width;
    const rowH = this.keyCenter('KeyZ').y - this.keyCenter('KeyA').y; // расстояние между рядами
    const fingerW = keyW * 0.5;                                        // толщина пальца
    this.svg.style.setProperty('--finger-w', fingerW + 'px');

    const space = this.keyCenter('Space');
    const sides = {
      l: { ids: ['lp', 'lr', 'lm', 'li'], thumb: 'lt', inward: 1 },  // inward — направление к центру
      r: { ids: ['ri', 'rm', 'rr', 'rp'], thumb: 'rt', inward: -1 },
    };

    for (const side of Object.values(sides)) {
      const group = document.createElementNS(SVG_NS, 'g');
      group.classList.add('hand');
      this.svg.appendChild(group);

      // Кончики пальцев на клавишах основного ряда
      const tips = side.ids.map(id => this.keyCenter(this.HOME_KEYS[id]));
      const centerX = tips.reduce((sum, p) => sum + p.x, 0) / tips.length;
      // Костяшки чуть ниже нижнего ряда и немного ближе к центру ладони
      const knuckleY = tips[0].y + rowH * 1.45;
      const bases = tips.map(p => ({ x: p.x + (centerX - p.x) * 0.15, y: knuckleY }));
      // Мизинец короче остальных пальцев
      const pinkyIndex = side.ids.findIndex(id => id[1] === 'p');
      bases[pinkyIndex].y -= rowH * 0.3;

      // Ладонь: сужается от костяшек к запястью. Скругление углов даёт
      // обводка того же цвета (stroke-linejoin: round в CSS).
      const left = Math.min(...bases.map(p => p.x)) - fingerW * 0.3;
      const right = Math.max(...bases.map(p => p.x)) + fingerW * 0.3;
      const top = knuckleY;
      const bottom = knuckleY + rowH * 1.9;
      const narrow = (right - left) * 0.12;
      const palm = document.createElementNS(SVG_NS, 'path');
      palm.setAttribute('d', `M ${left} ${top} L ${right} ${top} L ${right - narrow} ${bottom} L ${left + narrow} ${bottom} Z`);
      palm.classList.add('palm');
      group.appendChild(palm);

      side.ids.forEach((id, i) => this.addFinger(group, id, bases[i], tips[i]));

      // Большой палец: от нижнего внутреннего угла ладони вверх к пробелу
      const innerX = side.inward === 1 ? right : left;
      this.addFinger(group, side.thumb,
        { x: innerX - side.inward * fingerW * 0.3, y: top + rowH * 1.2 },
        { x: innerX + side.inward * keyW * 0.7, y: space.y });
    }

    this.svg.appendChild(this.activeLayer);
    // Ладони выходят за нижний край клавиатуры — оставляем под ними место
    this.container.style.marginBottom = rowH * 1.1 + 'px';
    this.update(this.activeCodes);
  },

  addFinger(group, id, base, home) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.classList.add('finger');
    line.setAttribute('x1', base.x);
    line.setAttribute('y1', base.y);
    group.appendChild(line);
    // Копия пальца для подсветки (видна, только когда палец нужен)
    const highlight = line.cloneNode();
    highlight.classList.add('active');
    this.activeLayer.appendChild(highlight);
    this.fingers[id] = { line, highlight, base, home };
  },

  // Показывает, какими пальцами нажимать клавиши codes (например ['KeyF'] или ['KeyF', 'ShiftRight'])
  update(codes) {
    this.activeCodes = codes;
    if (!this.svg) return;

    // Какой палец к какой клавише тянется
    const targets = {};
    codes.forEach(code => {
      let finger = FINGER_BY_CODE[code];
      if (finger === 'th') finger = 'rt'; // пробел нажимаем правым большим пальцем
      targets[finger] = code;
    });

    for (const id in this.fingers) {
      const finger = this.fingers[id];
      const tip = targets[id] ? this.keyCenter(targets[id]) : finger.home;
      for (const line of [finger.line, finger.highlight]) {
        line.setAttribute('x2', tip.x);
        line.setAttribute('y2', tip.y);
      }
      finger.highlight.style.display = targets[id] ? '' : 'none';
    }
  },
};

// При изменении размера окна клавиши меняют размер — пересчитываем руки
window.addEventListener('resize', () => Hands.layout());
