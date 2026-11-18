// =====================================================================
// texts.js — слова, предложения и тексты для тренировок
// ---------------------------------------------------------------------
// Все тексты написаны специально для ProTyping, поэтому их можно
// свободно использовать. В русских текстах нет буквы «ё» и «ёлочек»,
// чтобы любой символ можно было набрать на стандартной раскладке.
// Буква «ё» тренируется отдельно — в уроке.
//
// Для каждого языка:
//   common    — частые слова (из них собираются лёгкий и средний уровни)
//   rare      — длинные и редкие слова (добавляются на сложном уровне)
//   sentences — предложения по уровням сложности
//   texts     — связные тексты по уровням сложности
// =====================================================================

const TEXTS = {
  ru: {
    common: `
      и в не на я он с что а по это она к но они мы как из у за свой весь год от так о для ты же все тот
      вы такой его только или бы себя один когда уже до время если сам нет другой вот наш мой знать стать
      при чтобы дело жизнь кто первый очень два день новый рука даже раз где там под можно какой после их
      работа без самый потом надо хотеть слово идти большой место сейчас тут лицо каждый друг теперь глаз
      тоже тогда видеть вопрос через да здесь дом потому сторона думать сделать страна жить мир последний
      голова делать смотреть просто конечно сила конец перед несколько стоить город вода окно стол книга
      утро ночь свет снег река море небо путь сад поле школа урок текст нога час хлеб чай суп сон мама папа
      брат сестра кот пес лес гора парк звук цвет белый черный красный синий зеленый мало много быстро тихо
      громко рано поздно легко трудно хорошо плохо новое старый молодой добрый умный чистый теплый холодный
      весна лето осень зима неделя месяц минута музыка песня игра фильм письмо ответ задача пример помощь
      начало вечер обед завтрак ужин сказка мечта радость улыбка правда голос дорога поезд машина билет
      писать читать слушать говорить учить знать любить ждать ехать лететь бежать играть петь рисовать
      думать помнить искать найти открыть закрыть начать кончить пить есть спать мыть сидеть стоять
    `,
    rare: `
      клавиатура тренировка упражнение внимательность предложение сосредоточенность информация возможность
      путешествие достопримечательность исследование характеристика последовательность удивительный
      производительность ответственность электричество программирование библиотека университет
      преподаватель расписание обстоятельство впечатление взаимодействие необходимость представление
      разнообразие приключение вдохновение синхронизация концентрация эффективность самостоятельно
      одновременно действительно значительный архитектура математика лаборатория эксперимент наблюдение
      справедливость благодарность предприятие государство достижение землетрясение подъезд объявление
      разъяснение щедрость чешуя жюри фейерверк шоколад экзамен юбилей ящик вьюга бульон компьютер
      интерфейс алгоритм переменная функция документ сообщение подсказка клавиша выносливость
      любознательность съедобный объективность сэкономить цивилизация энциклопедия хризантема
    `,
    sentences: {
      easy: [
        'Мама мыла раму.',
        'Кот спит на окне.',
        'На улице идет снег.',
        'Мы пьем чай с хлебом.',
        'Дом стоит у реки.',
        'Папа читает книгу.',
        'Утро было тихим.',
        'Мой друг любит музыку.',
        'В саду растут цветы.',
        'Летом мы едем на море.',
        'Сегодня теплый день.',
        'Брат играет в парке.',
        'Я учу новые слова.',
        'Над лесом светит луна.',
      ],
      medium: [
        'Каждое утро я начинаю с короткой тренировки на клавиатуре.',
        'Если печатать медленно, но точно, скорость придет сама.',
        'Вечером мы гуляли по парку и слушали, как шумят деревья.',
        'Моя сестра решила выучить английский язык за один год.',
        'Поезд отправляется ровно в семь часов, не опаздывай.',
        'В библиотеке было тихо, и только часы громко тикали на стене.',
        'Хорошая привычка появляется тогда, когда повторяешь ее каждый день.',
        'Мы долго спорили, но в конце концов нашли общее решение.',
        'Старый мост через реку недавно покрасили в синий цвет.',
        'Пальцы должны возвращаться на основной ряд после каждой клавиши.',
        'Зимой на этой горе катаются на лыжах почти все жители города.',
        'Учитель попросил нас написать небольшое сочинение о лете.',
      ],
      hard: [
        'Слепая печать - это навык, который экономит часы работы: вы смотрите на экран, а не на клавиши.',
        'В 1868 году Кристофер Шоулз получил патент на пишущую машинку, и с тех пор раскладки почти не изменились.',
        'Сколько раз нужно повторить упражнение, чтобы пальцы "запомнили" путь? Обычно больше, чем кажется!',
        'Программист, журналист и переводчик - все они, так или иначе, проводят за клавиатурой по 6-8 часов в день.',
        'Объявление на двери гласило: "Съемка фильма продлится до 22:00, просим соблюдать тишину".',
        'Чем выше точность, тем меньше времени уходит на исправления; поэтому сначала точность, потом скорость.',
        'Щедрый фейерверк осветил площадь, и толпа (около 3000 человек) дружно закричала: "Ура!"',
        'Эффективность тренировки зависит не от ее длительности, а от регулярности и внимательности.',
        'Вьюга не утихала три дня подряд; дороги замело, и поезда шли с опозданием на 40-50 минут.',
        'Любознательность - лучший двигатель обучения: кто задает вопросы, тот быстрее находит ответы.',
      ],
    },
    texts: {
      easy: [
        {
          title: 'Утро',
          text: 'Утром в доме тихо. Мама ставит чайник, а кот сидит у окна и смотрит на птиц. Папа читает новости. Я беру книгу и иду в школу. На улице свежо, светит солнце. Это будет хороший день.',
        },
        {
          title: 'Сад',
          text: 'У бабушки есть сад. Там растут яблоки, груши и сливы. Летом мы собираем ягоды и пьем сок. Вечером в саду поют птицы. Мы сидим на лавке и слушаем их. В саду всегда спокойно и тепло.',
        },
        {
          title: 'Река',
          text: 'За городом течет река. Вода в ней чистая и холодная. Дети играют на берегу, а рыбаки сидят с удочками. Летом там много людей. Зимой река спит под толстым льдом и ждет весну.',
        },
      ],
      medium: [
        {
          title: 'Первая клавиатура',
          text: 'Когда я впервые сел за компьютер, я искал каждую букву глазами. Пальцы бегали по клавишам, как потерянные, а текст набирался очень медленно. Тогда старший брат показал мне, где должны лежать руки и какой палец отвечает за какую клавишу. Сначала было непривычно и даже трудно, но через месяц я уже печатал, не глядя вниз. Теперь мне кажется странным, что когда-то было иначе.',
        },
        {
          title: 'Путешествие на поезде',
          text: 'Поезд медленно отошел от перрона, и город за окном начал уплывать назад. Мы ехали к морю целые сутки. В вагоне пахло чаем и свежим хлебом, соседи рассказывали истории, а за окном менялись поля, леса и маленькие станции. Ночью я долго не мог уснуть и смотрел на огни деревень. Утром проводник сказал, что до конечной станции осталось всего два часа.',
        },
        {
          title: 'Как растет привычка',
          text: 'Новая привычка похожа на тропинку в траве. В первый раз идти трудно, ноги путаются, и легко свернуть в сторону. Но если ходить по одному и тому же пути каждый день, тропинка становится заметнее, а шаги увереннее. С печатью то же самое: короткие, но регулярные занятия дают больше, чем одна долгая тренировка раз в неделю.',
        },
      ],
      hard: [
        {
          title: 'История раскладки',
          text: 'Раскладка ЙЦУКЕН появилась еще во времена пишущих машинок. Буквы на ней расположены так, чтобы самые частые из них (например, "о", "а", "е" и "и") оказались под сильными пальцами в центре клавиатуры. В отличие от английской раскладки, которую часто критикуют за неудобство, русская раскладка считается довольно удачной: при наборе обычного текста около 30-35% нажатий приходится на основной ряд. Тем не менее, многие знаки препинания на ней требуют нажатия двух клавиш, и к этому нужно привыкнуть.',
        },
        {
          title: 'Точность против скорости',
          text: 'Почему опытные тренеры советуют сначала думать о точности, а уже потом о скорости? Ответ прост: каждая ошибка стоит дорого. Нужно заметить опечатку, остановиться, стереть лишнее и набрать символ заново; на это уходит в 3-4 раза больше времени, чем на правильное нажатие. Кроме того, ошибки закрепляются так же, как и верные движения. Если сегодня вы печатаете 40 слов в минуту с точностью 98%, вы фактически быстрее того, кто печатает 55 слов, но ошибается в каждом десятом символе.',
        },
      ],
    },
  },

  en: {
    common: `
      the be to of and a in that have it for not on with he as you do at this but his by from they we say
      her she or an will my one all would there their what so up out if about who get which go me when make
      can like time no just him know take people into year your good some could them see other than then now
      look only come its over think also back after use two how our work first well way even new want
      because any these give day most us find tell ask seem feel try leave call hand keep help talk turn
      start show hear play run move live hold bring write sit stand lose pay meet learn read open walk grow
      cat dog sun sky sea tree book door home road car bus city park game song food milk tea cake bread fish
      bird rain snow wind fire water light night morning school class friend family mother father sister
      brother child world music story word line page key letter type fast slow happy small big long short
      red blue green black white warm cold early late easy hard simple quiet loud kind clean fresh
    `,
    rare: `
      keyboard practice exercise attention sentence concentration information opportunity adventure
      characteristic consequence remarkable productivity responsibility electricity programming library
      university professor schedule circumstance impression interaction necessity representation variety
      inspiration synchronization efficiency independently simultaneously significant architecture
      mathematics laboratory experiment observation reflection gratitude enterprise government achievement
      earthquake announcement explanation generosity chocolate examination anniversary blizzard computer
      interface algorithm variable function document message keystroke endurance curiosity objectivity
      civilization encyclopedia chrysanthemum rhythm psychology quizzical juxtapose zephyr
    `,
    sentences: {
      easy: [
        'The cat is on the mat.',
        'I like to read books.',
        'It is a cold day.',
        'We play in the park.',
        'The sun is up.',
        'My dog can run fast.',
        'She has a red hat.',
        'Tea is hot and sweet.',
        'He walks to school.',
        'The sky is blue today.',
        'I see a big tree.',
        'We sing a happy song.',
        'Snow is white and soft.',
        'Mom bakes good bread.',
      ],
      medium: [
        'Every morning I start the day with a short typing session.',
        'If you type slowly but carefully, speed will come with time.',
        'We walked through the park and listened to the wind in the trees.',
        'My sister decided to learn a new language in one year.',
        'The train leaves at seven, so please do not be late.',
        'The library was quiet, and only the clock was ticking on the wall.',
        'A good habit grows when you repeat it a little every day.',
        'We argued for a long time, but in the end we found a solution.',
        'Your fingers should return to the home row after each key.',
        'The old bridge over the river was painted blue last spring.',
        'Our teacher asked us to write a short story about summer.',
        'There is nothing like a cup of tea on a rainy afternoon.',
      ],
      hard: [
        'Touch typing is a skill that saves hours: you look at the screen, not at your hands.',
        'In 1868, Christopher Sholes patented a typewriter, and the layout has barely changed since.',
        'How many times must you repeat a drill before your fingers "remember" the path? More than you think!',
        "Programmers, writers, and translators often spend 6-8 hours a day at the keyboard; that's a lot of keystrokes.",
        'The sign on the door read: "Filming until 10:00 p.m. - please keep quiet (thank you)."',
        'The higher your accuracy, the less time you waste on corrections; accuracy first, speed second.',
        'A quick brown fox jumps over the lazy dog, and the zebra quietly watches from 50 yards away.',
        "Efficiency doesn't depend on how long you practice, but on how regularly and carefully you do it.",
        'The blizzard raged for three days; roads were closed, and trains ran 40-50 minutes behind schedule.',
        'Curiosity is the best engine of learning: those who ask questions find answers sooner.',
      ],
    },
    texts: {
      easy: [
        {
          title: 'Morning',
          text: 'The house is quiet in the morning. Mom makes tea, and the cat sits by the window and looks at the birds. Dad reads the news. I take my book and go to school. It is fresh outside and the sun is warm. It will be a good day.',
        },
        {
          title: 'The Garden',
          text: 'My grandma has a garden. Apples, pears and plums grow there. In summer we pick berries and drink juice. In the evening the birds sing. We sit on a bench and listen to them. The garden is always calm and warm.',
        },
        {
          title: 'The River',
          text: 'A river runs near our town. The water is clean and cold. Kids play on the bank, and old men sit with their fishing rods. In summer there are many people there. In winter the river sleeps under thick ice and waits for spring.',
        },
      ],
      medium: [
        {
          title: 'My First Keyboard',
          text: 'When I first sat down at a computer, I had to search for every letter with my eyes. My fingers wandered over the keys, and the text appeared very slowly. Then my older brother showed me where my hands should rest and which finger is responsible for which key. At first it felt strange and even difficult, but a month later I could type without looking down. Now it seems odd that it was ever different.',
        },
        {
          title: 'A Train Journey',
          text: 'The train slowly pulled away from the platform, and the city began to drift behind us. We travelled to the sea for a whole day. The carriage smelled of tea and fresh bread, our neighbours told stories, and outside the window fields, forests and small stations went by. At night I could not sleep for a long time and watched the lights of the villages. In the morning the conductor said we had only two hours left.',
        },
        {
          title: 'How Habits Grow',
          text: 'A new habit is like a path through tall grass. The first time it is hard to walk, your feet get tangled, and it is easy to wander off. But if you walk the same way every day, the path becomes clearer and your steps more confident. Typing works the same way: short but regular sessions give you more than one long session once a week.',
        },
      ],
      hard: [
        {
          title: 'The QWERTY Story',
          text: 'The QWERTY layout dates back to the age of mechanical typewriters. A popular (though disputed) story says its letters were arranged to keep the type bars from jamming when common pairs were struck quickly. Whatever the truth, the layout survived the transition to computers, and today more than 90% of English keyboards still use it. Alternatives such as Dvorak and Colemak claim to reduce finger travel by 30-50%, yet few people switch: habits, it turns out, are stronger than efficiency.',
        },
        {
          title: 'Accuracy vs. Speed',
          text: "Why do experienced coaches say you should focus on accuracy before speed? The answer is simple: every mistake is expensive. You have to notice the typo, stop, press Backspace and type the character again; that takes 3-4 times longer than a correct keystroke. What's more, mistakes become habits just like correct movements do. If you type 40 words per minute with 98% accuracy, you're effectively faster than someone who types 55 words but misses every tenth character.",
        },
      ],
    },
  },
};

// Превращаем строки со словами в массивы (делим по пробелам и переносам строк)
for (const lang in TEXTS) {
  TEXTS[lang].common = TEXTS[lang].common.trim().split(/\s+/);
  TEXTS[lang].rare = TEXTS[lang].rare.trim().split(/\s+/);
}
