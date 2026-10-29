/*
 * Демо-данные прототипа «Сказочный мир».
 * Студии, группы, расписание и цены — реальные, из расписания центра на 2026/2027 учебный год; контакты — из группы ВК.
 * Педагоги, дети, родители, акции, новости и отзывы — вымышленные примеры для показа.
 * Изменения, сделанные в демо-кабинетах, хранятся только в браузере (localStorage).
 */
(function () {
  'use strict';

  var CENTER = {
    name: 'Сказочный мир',
    fullName: 'Центр эстетического развития «Сказочный мир»',
    city: 'Колтуши',
    address: 'Колтуши, ул. Иоанна Кронштадтского, д. 3',
    entrance: 'Вход со стороны магазина «Дикси»',
    mapQuery: 'Колтуши, улица Иоанна Кронштадтского, 3',
    phoneMain: { text: '+7 (921) 319-56-77', href: 'tel:+79213195677', note: 'звонки и WhatsApp' },
    phones: [
      { text: '8 (812) 346-56-52', href: 'tel:+78123465652', note: 'городской' },
      { text: '+7 (921) 319-56-77', href: 'tel:+79213195677', note: 'мобильный, WhatsApp' },
      { text: '+7 (996) 798-03-90', href: 'tel:+79967980390', note: 'администратор' }
    ],
    whatsapp: 'https://wa.me/79213195677',
    vk: 'https://vk.ru/centre_skazka_mir',
    vkRating: '5,0',
    vkFollowers: '1,7 тыс.',
    partner: { name: 'Колтушский строительный комплекс', url: 'https://ksk21.ru' },
    motto: 'Давайте верить в сказку и создавать её вместе!',
    years: 10,
    area: 300,
    halls: 5
  };

  var WEEKDAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  var WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // Источник: расписание занятий на 2026/2027 учебный год (присланное центром) и группа ВК.
  // color — ключ цвета из фирменной палитры (см. style.css, --c-*).
  // plans[].combo — цена абонемента, если ребёнок занимается ещё в одной студии центра.
  var STUDIOS = [
    {
      id: 'ryzhiki', kind: 'Творческий развивающий мини-сад', title: 'Рыжики', color: 'orange', icon: 'sun',
      age: [2.7, 6], ageText: '2,7–6 лет', groups: 2,
      plans: [{ label: '12 посещений в месяц', price: 9600 }, { label: '20 посещений в месяц', price: 12800 }],
      trial: { label: 'Пробное посещение', price: 1000 },
      format: 'Пн–Пт, 9:00–13:00',
      lead: 'Мягкий старт перед детским садом и школой: полдня в кругу сверстников, творчество, музыка и игры.',
      points: ['Пять утр в неделю, с 9:00 до 13:00', 'Две группы: 2,7–4 года и 4–6 лет', 'Рисование, лепка, музыка и движение', 'Праздники и первые выступления на сцене центра'],
      teacher: 'svetlana'
    },
    {
      id: 'oblaka', kind: 'Театральная студия', title: 'Облака', color: 'blue', icon: 'masks',
      age: [6, 17], ageText: 'от 6 лет', groups: 3,
      plans: [{ label: '8 занятий в месяц', price: 5700, combo: 5500 }],
      trial: { label: 'Пробное занятие', price: 900 },
      extra: 'Пятница — день дополнительных репетиций (по приглашению педагога).',
      lead: 'Актёрское мастерство, сценическая речь и пластика. Ставим настоящие спектакли и выходим на большую сцену.',
      points: ['Упражнения на внимание, воображение и уверенность', 'Сценическая речь и работа с голосом', 'Спектакли и концерты несколько раз в год', 'Группы 6–10 лет, 12+ и 14+'],
      teacher: 'anastasia'
    },
    {
      id: 'golosok', kind: 'Студия эстрадного вокала', title: 'ГолосОК', color: 'pink', icon: 'mic',
      age: [5, 16], ageText: '5–16 лет', groups: 3,
      plans: [{ label: '8 занятий в месяц', price: 4500, combo: 4300 }],
      trial: { label: 'Пробное занятие: прослушивание и диагностика', price: 1000 },
      lead: 'Учимся петь легко и чисто: дыхание, слух, работа с микрофоном и выступления на сцене.',
      points: ['Постановка дыхания и распевки', 'Развитие музыкального слуха', 'Работа с микрофоном и фонограммой', 'Группы 5–7, 8–12 и 13–16 лет'],
      teacher: 'irina'
    },
    {
      id: 'chudo-dens', kind: 'Студия современного танца', title: 'Чудо-денс', color: 'yellow', icon: 'dance',
      age: [5, 14], ageText: '5–14 лет', groups: 2,
      plans: [{ label: '8 занятий в месяц', price: 3800, combo: 3600 }],
      trial: { label: 'Пробное занятие', price: 500 },
      lead: 'Современная хореография для детей: ритм, координация и радость от движения под любимую музыку.',
      points: ['Разминка, растяжка и танцевальные связки', 'Постановка номеров к концертам', 'Развитие чувства ритма и координации', 'Группы 5–7 и 8–14 лет'],
      teacher: 'marina'
    },
    {
      id: 'maugli', kind: 'Студия гимнастики и эстрадной пластики', title: 'Маугли', color: 'green', icon: 'star',
      age: [5, 14], ageText: '5–14 лет', groups: 2,
      plans: [{ label: '8 занятий в месяц', price: 3800, combo: 3600 }],
      trial: { label: 'Пробное занятие', price: 500 },
      lead: 'Гибкость, сила и красивые акробатические элементы — для сцены и для здоровья.',
      points: ['Общая физическая подготовка в игровой форме', 'Растяжка и акробатика', 'Эстрадные номера для концертов', 'Группы 5–7 и 8–14 лет'],
      teacher: 'ekaterina'
    },
    {
      id: 'cheshire', kind: 'Арт-студия', title: 'Чеширский Кот', color: 'lavender', icon: 'cat',
      age: [5, 12], ageText: '5–12 лет', groups: 2,
      plans: [{ label: 'Рисунок, 8 занятий в месяц', price: 3300, combo: 3100 }, { label: 'Глина, 8 занятий в месяц', price: 3800, combo: 3600 }],
      trial: { label: 'Разовое занятие', price: 800 },
      lead: 'Два направления: рисунок и лепка из глины. Пробуем разные материалы и уносим домой свои работы.',
      points: ['Рисунок: карандаш, акварель, гуашь', 'Лепка из глины — отдельное направление', 'Можно ходить на оба направления', 'Выставки работ в центре'],
      teacher: 'natalia'
    },
    {
      id: 'say', kind: 'Студия английского языка', title: 'SAY', color: 'mint', icon: 'bubble',
      age: [6, 14], ageText: '6–14 лет', groups: 4,
      plans: [{ label: '8 занятий в месяц', price: 5400, combo: 5200 }],
      trial: { label: 'Пробное занятие', price: 800 },
      lead: 'Английский через общение, игры и песни — без страха ошибиться и с первых занятий вслух.',
      points: ['Разговорная практика с первого занятия', 'Игры, песни и мини-спектакли на английском', 'Четыре группы по возрасту и уровню', 'Учебники и рабочие тетради оплачиваются отдельно'],
      teacher: 'elena'
    },
    {
      id: 'shkola', kind: 'Курсы', title: 'Подготовка к школе', color: 'red', icon: 'book',
      age: [5, 7], ageText: '5–7 лет', groups: 1,
      plans: [{ label: '8 занятий в месяц', price: 4000, combo: 3800 }],
      trial: { label: 'Пробное занятие', price: 600 },
      lead: 'Чтение, счёт, письмо и умение слушать педагога — спокойно и в игре, чтобы в первом классе было легко.',
      points: ['Звуки, буквы и первое чтение', 'Счёт и логические задачи', 'Подготовка руки к письму', 'Учебники и рабочие тетради оплачиваются отдельно'],
      teacher: 'svetlana'
    },
    {
      id: 'logoped', kind: 'Индивидуальные занятия', title: 'Логопед', color: 'green', icon: 'speech',
      age: [4, 8], ageText: '4–8 лет', groups: null, individual: true,
      plans: [{ label: '8 занятий по 30 минут в месяц', price: 7600, combo: 7400 }],
      trial: { label: 'Разовое занятие', price: 1100 },
      format: 'Пн и Ср, 15:00–18:30 — время по записи',
      lead: 'Логопед-дефектолог: постановка звуков, развитие речи и внимания. Занятия один на один по 30 минут.',
      points: ['Диагностика на первой встрече', 'Постановка и автоматизация звуков', 'Развитие связной речи', 'Рекомендации для занятий дома'],
      teacher: 'tatiana'
    }
  ];

  // Общие условия из расписания центра
  var TERMS = [
    'Абонементы оплачиваются помесячно.',
    'Если занятие пропущено по болезни, оно не сгорает: центр компенсирует 50% стоимости одного занятия, и в следующем месяце вы платите на эту сумму меньше.',
    'Для двух детей из одной семьи скидка 10%, для трёх детей — 15% от стоимости любого абонемента.',
    'Учебники и рабочие тетради в стоимость не входят.'
  ];

  var PARTY = { price: 11000 };

  // Педагоги — вымышленные примеры. Реальные профили — после согласия педагогов на публикацию.
  var TEACHERS = [
    { id: 'anastasia', name: 'Анастасия Викторовна', role: 'Руководитель театральной студии «Облака»', edu: 'Высшее театральное образование, режиссура', exp: 12, color: 'blue', studios: ['oblaka'] },
    { id: 'marina', name: 'Марина Сергеевна', role: 'Хореограф студии «Чудо-денс»', edu: 'Хореографическое училище, современный танец', exp: 9, color: 'yellow', studios: ['chudo-dens'] },
    { id: 'ekaterina', name: 'Екатерина Андреевна', role: 'Тренер студии «Маугли»', edu: 'Высшее физкультурное образование, художественная гимнастика', exp: 8, color: 'green', studios: ['maugli'] },
    { id: 'irina', name: 'Ирина Павловна', role: 'Педагог по вокалу студии «ГолосОК»', edu: 'Музыкальное училище, эстрадно-джазовое пение', exp: 15, color: 'pink', studios: ['golosok'] },
    { id: 'elena', name: 'Елена Дмитриевна', role: 'Преподаватель студии английского языка «SAY»', edu: 'Высшее лингвистическое образование', exp: 10, color: 'mint', studios: ['say'] },
    { id: 'natalia', name: 'Наталья Игоревна', role: 'Художник-педагог арт-студии «Чеширский Кот»', edu: 'Художественное училище, декоративно-прикладное искусство', exp: 11, color: 'lavender', studios: ['cheshire'] },
    { id: 'svetlana', name: 'Светлана Юрьевна', role: 'Воспитатель мини-сада «Рыжики», курсы подготовки к школе', edu: 'Высшее, дошкольная педагогика', exp: 14, color: 'orange', studios: ['ryzhiki', 'shkola'] },
    { id: 'tatiana', name: 'Татьяна Михайловна', role: 'Логопед-дефектолог', edu: 'Высшее дефектологическое образование', exp: 20, color: 'green', studios: ['logoped'] }
  ];

  // ageText — как в расписании центра; age — для фильтра по возрасту (верхняя граница включительно)
  var GROUPS = [
    { id: 'r1', studio: 'ryzhiki', name: 'Младшая группа', ageText: '2,7–4 года', age: [2.7, 4] },
    { id: 'r2', studio: 'ryzhiki', name: 'Старшая группа', ageText: '4–6 лет', age: [4, 6] },
    { id: 'o1', studio: 'oblaka', name: 'Младшая группа', ageText: '6–10 лет', age: [6, 10] },
    { id: 'o2', studio: 'oblaka', name: 'Средняя группа', ageText: '12+', age: [12, 17] },
    { id: 'o3', studio: 'oblaka', name: 'Старшая группа', ageText: '14+', age: [14, 17] },
    { id: 'g1', studio: 'golosok', name: 'Младшая группа', ageText: '5–7 лет', age: [5, 7] },
    { id: 'g2', studio: 'golosok', name: 'Средняя группа', ageText: '8–12 лет', age: [8, 12] },
    { id: 'g3', studio: 'golosok', name: 'Старшая группа', ageText: '13–16 лет', age: [13, 16] },
    { id: 'd1', studio: 'chudo-dens', name: 'Младшая группа', ageText: '5–7 лет', age: [5, 7] },
    { id: 'd2', studio: 'chudo-dens', name: 'Старшая группа', ageText: '8–14 лет', age: [8, 14] },
    { id: 'm1', studio: 'maugli', name: 'Младшая группа', ageText: '5–7 лет', age: [5, 7] },
    { id: 'm2', studio: 'maugli', name: 'Старшая группа', ageText: '8–14 лет', age: [8, 14] },
    { id: 'k1', studio: 'cheshire', name: 'Рисунок', ageText: '5–12 лет', age: [5, 12] },
    { id: 'k2', studio: 'cheshire', name: 'Лепка из глины', ageText: '5–12 лет', age: [5, 12] },
    { id: 's1', studio: 'say', name: 'Старт', ageText: '6–8 лет', age: [6, 8] },
    { id: 's2', studio: 'say', name: 'Группа 8–10', ageText: '8–10 лет', age: [8, 10] },
    { id: 's3', studio: 'say', name: 'Группа 9–11', ageText: '9–11 лет', age: [9, 11] },
    { id: 's4', studio: 'say', name: 'Группа 11–14', ageText: '11–14 лет', age: [11, 14] },
    { id: 'p1', studio: 'shkola', name: 'Группа подготовки', ageText: '5–7 лет', age: [5, 7] },
    { id: 'lg', studio: 'logoped', name: 'Индивидуально, 30 минут', ageText: '4–8 лет', age: [4, 8], window: true }
  ];

  // Еженедельные занятия: day 0 = понедельник. Источник — расписание на 2026/2027 учебный год.
  var LESSONS = [];
  function add(group, days, start, end) {
    days.forEach(function (d) {
      LESSONS.push({ id: group + '-' + d, group: group, day: d, start: start, end: end });
    });
  }
  add('r1', [0, 1, 2, 3, 4], '9:00', '13:00');
  add('r2', [0, 1, 2, 3, 4], '9:00', '13:00');
  add('o1', [0, 2], '17:30', '19:00');
  add('o2', [0, 2], '19:00', '20:30');
  add('o3', [1, 3], '19:00', '20:30');
  add('g1', [0, 2], '16:30', '17:30');
  add('g2', [1, 3], '17:00', '18:00');
  add('g3', [1, 3], '18:00', '19:00');
  add('d1', [1, 3], '18:00', '19:00');
  add('d2', [1, 3], '20:00', '21:00');
  add('m1', [0, 2], '19:00', '20:00');
  add('m2', [0, 2], '20:00', '21:00');
  add('k1', [1, 3], '19:00', '20:00');
  add('k2', [0, 2], '19:00', '20:00');
  add('s1', [1, 3], '17:00', '18:00');
  add('s2', [1, 3], '18:00', '19:00');
  add('s3', [1, 3], '19:00', '20:00');
  add('s4', [1, 3], '20:00', '21:00');
  add('p1', [0, 2], '19:00', '20:00');
  add('lg', [0, 2], '15:00', '18:30');

  // Отзывы — пример оформления (вымышленные). Настоящие возьмём из группы ВК с разрешения авторов.
  var REVIEWS = [
    { author: 'Мама Вари, 7 лет', studio: 'oblaka', text: 'Дочка была очень стеснительной, а после года в «Облаках» сама вызвалась читать стихи на утреннике. Спектакли — настоящие, мы с бабушкой плакали.' },
    { author: 'Папа Миши, 5 лет', studio: 'ryzhiki', text: 'Ходим в «Рыжики» перед садом: полдня, рядом с домом, ребёнок бежит туда с радостью. Педагоги всегда расскажут, как прошёл день.' },
    { author: 'Мама Кати, 11 лет', studio: 'golosok', text: 'Занимаемся вокалом и английским в одном здании — удобно забирать, а за вторую студию платим меньше. Катя уже выступала на фестивале.' }
  ];

  // Особые дни без постоянных групп
  var SCHEDULE_NOTES = [
    { day: 4, studio: 'oblaka', text: 'День дополнительных репетиций (по приглашению)' }
  ];

  // ---- Изменяемое демо-состояние (акции, баннеры, заявки, посещаемость и т. п.) ----
  // Даты в виде числа — смещение в днях от сегодняшнего дня, чтобы демо не «устаревало».
  // Даты в виде строки 'YYYY-MM-DD' — фиксированные.
  var DEFAULT_STATE = {
    version: 2,
    promos: [
      { id: 'pr1', title: 'Скидка для семей', text: 'Для двух детей из одной семьи — скидка 10%, для трёх детей — 15% от стоимости любого абонемента.', studios: [], until: null, active: true },
      { id: 'pr2', title: 'Вторая студия — дешевле', text: 'Если ребёнок занимается в двух студиях центра, каждый абонемент стоит на 200 ₽ меньше.', studios: [], until: null, active: true },
      { id: 'pr3', title: 'Набор в группу «Старт» студии SAY', text: 'Английский для 6–8 лет: пробное занятие за 0 ₽ вместо 800 ₽ при записи до конца акции.', studios: ['say'], until: 16, active: true, example: true },
      { id: 'pr4', title: 'Весь сентябрь — пробное бесплатно', text: 'Бесплатное пробное занятие в студиях «Облака», «ГолосОК», «Маугли», «Чудо-денс» и «Чеширский Кот».', studios: ['oblaka', 'golosok', 'maugli', 'chudo-dens', 'cheshire'], until: '2026-09-30', active: true }
    ],
    banners: [
      { id: 'b1', title: 'Записаться на пробное занятие', href: 'demo.html?form=probnoe', color: 'blue', enabled: true },
      { id: 'b2', title: 'Расписание 2026/2027', href: 'raspisanie.html', color: 'orange', enabled: true },
      { id: 'b3', title: 'Детские праздники', href: 'prazdniki.html', color: 'pink', enabled: true },
      { id: 'b4', title: 'Новогодний спектакль «Облаков»', href: 'novosti.html', color: 'lavender', enabled: true },
      { id: 'b5', title: 'Летний лагерь — 2027', href: 'novosti.html', color: 'green', enabled: false }
    ],
    news: [
      { id: 'n1', date: '2026-12-20', tag: 'Спектакль', title: 'Новогодний спектакль театральной студии «Облака»', text: 'Все группы студии готовят большой новогодний спектакль. Приглашаем родителей, бабушек, дедушек и друзей. Вход свободный, места лучше занять заранее.', published: true },
      { id: 'n2', date: '2026-11-15', tag: 'Концерт', title: 'Осенний концерт «Сказочного мира»', text: 'Выступят «ГолосОК», «Чудо-денс» и «Маугли». В фойе — выставка работ арт-студии «Чеширский Кот».', published: true },
      { id: 'n3', date: '2026-10-05', tag: 'Фестиваль', title: '«ГолосОК» — лауреаты районного фестиваля', text: 'Старшая группа студии эстрадного вокала заняла второе место в ансамблевом пении. Поздравляем ребят и педагога!', published: true },
      { id: 'n4', date: '2026-06-01', tag: 'Лагерь', title: 'Летний творческий лагерь', text: 'Две смены по две недели: театр, танец, рисунок и прогулки. Запись на лето 2027 откроется весной.', published: true },
      { id: 'n5', date: '2026-10-20', tag: 'Черновик', title: 'Фотоотчёт с осенней ярмарки', text: 'Черновик: администратор ещё не опубликовал эту новость, поэтому на сайте её нет.', published: false }
    ],
    leads: [
      { id: 'l1', child: 'Соня, 6 лет', parent: 'Анна', phone: '+7 (900) 000-00-11', studio: 'chudo-dens', created: -0, status: 'new', note: '' },
      { id: 'l2', child: 'Тимофей, 9 лет', parent: 'Дмитрий', phone: '+7 (900) 000-00-12', studio: 'oblaka', created: -1, status: 'new', note: '' },
      { id: 'l3', child: 'Алиса, 4 года', parent: 'Ксения', phone: '+7 (900) 000-00-13', studio: 'ryzhiki', created: -2, status: 'contacted', note: 'Перезвонить после 18:00' },
      { id: 'l4', child: 'Лев, 7 лет', parent: 'Ольга', phone: '+7 (900) 000-00-14', studio: 'say', created: -4, status: 'trial', note: 'Пробное во вт 17:00' },
      { id: 'l5', child: 'Ева, 11 лет', parent: 'Игорь', phone: '+7 (900) 000-00-15', studio: 'golosok', created: -6, status: 'enrolled', note: '' },
      { id: 'l6', child: 'Марк, 5 лет', parent: 'Елена', phone: '+7 (900) 000-00-16', studio: 'maugli', created: -8, status: 'declined', note: 'Не подошло время' },
      { id: 'l7', child: 'Полина, 8 лет', parent: 'Мария', phone: '+7 (900) 000-00-17', studio: 'cheshire', created: -3, status: 'contacted', note: '' }
    ],
    // Дети и родители — вымышленные.
    parents: [
      { id: 'par1', name: 'Мария Иванова', phone: '+7 (900) 000-01-01', children: ['ch1', 'ch2'] },
      { id: 'par2', name: 'Павел Смирнов', phone: '+7 (900) 000-01-02', children: ['ch3'] },
      { id: 'par3', name: 'Юлия Кузнецова', phone: '+7 (900) 000-01-03', children: ['ch4'] },
      { id: 'par4', name: 'Алексей Попов', phone: '+7 (900) 000-01-04', children: ['ch5'] },
      { id: 'par5', name: 'Ирина Волкова', phone: '+7 (900) 000-01-05', children: ['ch6'] },
      { id: 'par6', name: 'Наталья Морозова', phone: '+7 (900) 000-01-06', children: ['ch7'] },
      { id: 'par7', name: 'Сергей Лебедев', phone: '+7 (900) 000-01-07', children: ['ch8'] }
    ],
    children: [
      { id: 'ch1', name: 'Варя Иванова', age: 7, parent: 'par1', groups: ['o1', 's1'] },
      { id: 'ch2', name: 'Миша Иванов', age: 5, parent: 'par1', groups: ['d1'] },
      { id: 'ch3', name: 'Катя Смирнова', age: 8, parent: 'par2', groups: ['o1'] },
      { id: 'ch4', name: 'Артём Кузнецов', age: 7, parent: 'par3', groups: ['o1'] },
      { id: 'ch5', name: 'Даша Попова', age: 9, parent: 'par4', groups: ['o1', 'k1'] },
      { id: 'ch6', name: 'Ваня Волков', age: 6, parent: 'par5', groups: ['o1'] },
      { id: 'ch7', name: 'Лиза Морозова', age: 13, parent: 'par6', groups: ['o2'] },
      { id: 'ch8', name: 'Глеб Лебедев', age: 12, parent: 'par7', groups: ['o2'] }
    ],
    // Абонементы: until — дни от сегодня, left — осталось занятий из total
    subscriptions: [
      { id: 'a1', child: 'ch1', studio: 'oblaka', total: 8, left: 3, until: 12, paid: true },
      { id: 'a2', child: 'ch1', studio: 'say', total: 8, left: 1, until: 4, paid: true },
      { id: 'a3', child: 'ch2', studio: 'chudo-dens', total: 8, left: 6, until: 22, paid: true },
      { id: 'a4', child: 'ch3', studio: 'oblaka', total: 8, left: 0, until: -1, paid: true },
      { id: 'a5', child: 'ch4', studio: 'oblaka', total: 8, left: 5, until: 18, paid: true },
      { id: 'a6', child: 'ch5', studio: 'oblaka', total: 8, left: 2, until: 6, paid: true },
      { id: 'a7', child: 'ch6', studio: 'oblaka', total: 8, left: 8, until: 30, paid: false },
      { id: 'a8', child: 'ch7', studio: 'oblaka', total: 8, left: 4, until: 15, paid: true },
      { id: 'a9', child: 'ch8', studio: 'oblaka', total: 8, left: 7, until: 27, paid: true }
    ],
    // Посещаемость: ключ "lessonId|YYYY-MM-DD" → { childId: 'yes' | 'no' | 'excused' }
    attendance: {},
    // Запросы педагогов на перенос/отмену
    requests: [
      { id: 'rq1', teacher: 'marina', group: 'd2', type: 'move', from: 'Чт, 20:00', to: 'Пт, 18:00', reason: 'Генеральная репетиция осеннего концерта', status: 'pending' }
    ],
    // Изменения расписания, о которых уведомлены родители
    changes: [
      { id: 'c1', group: 'o1', text: 'Занятие в среду начнётся в 18:00 вместо 17:30 — в зале монтаж декораций к концерту.', date: 0 }
    ],
    announcements: [
      { id: 'an1', teacher: 'anastasia', group: 'o1', text: 'В пятницу дополнительная репетиция в 17:30. Нужны костюмы: белый верх, тёмный низ.', date: -1 }
    ],
    consents: [
      { id: 'cs1', title: 'Согласие на обработку персональных данных родителя и ребёнка', version: '1.0 от 01.09.2026', date: '2026-09-02', method: 'Галочка при записи на сайте', active: true },
      { id: 'cs2', title: 'Согласие на фото- и видеосъёмку ребёнка на концертах', version: '1.0 от 01.09.2026', date: '2026-09-02', method: 'Бумажный бланк на ресепшене', active: true },
      { id: 'cs3', title: 'Согласие на SMS-уведомления о расписании', version: '1.0 от 01.09.2026', date: '2026-09-02', method: 'Кабинет родителя', active: true }
    ],
    teacherProfiles: {
      anastasia: { status: 'published', draft: null },
      marina: { status: 'review', draft: { edu: 'Хореографическое училище, современный танец; курсы jazz-funk', exp: 9 } }
    },
    accounts: [
      { teacher: 'anastasia', phone: '+7 (900) 000-02-01', active: true },
      { teacher: 'marina', phone: '+7 (900) 000-02-02', active: true },
      { teacher: 'ekaterina', phone: '+7 (900) 000-02-03', active: true },
      { teacher: 'irina', phone: '+7 (900) 000-02-04', active: true },
      { teacher: 'elena', phone: '+7 (900) 000-02-05', active: true },
      { teacher: 'natalia', phone: '+7 (900) 000-02-06', active: true },
      { teacher: 'svetlana', phone: '+7 (900) 000-02-07', active: true },
      { teacher: 'tatiana', phone: '+7 (900) 000-02-08', active: false }
    ],
    // Цены, изменённые в админке: studioId → plans
    priceOverrides: {}
  };

  // ---- Хранилище состояния ----
  var KEY = 'skazka-mir-demo-v1';
  var memory = null;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function load() {
    if (memory) return memory;
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.version === DEFAULT_STATE.version) { memory = parsed; return memory; }
      }
    } catch (e) { /* приватный режим или запрет хранилища — работаем в памяти */ }
    memory = clone(DEFAULT_STATE);
    return memory;
  }

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(memory)); } catch (e) { /* ignore */ }
  }

  function reset() {
    memory = clone(DEFAULT_STATE);
    try { window.localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    return memory;
  }

  // ---- Даты ----
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function addDays(date, n) { var d = new Date(date); d.setDate(d.getDate() + n); return d; }
  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  // 0 = понедельник
  function weekdayIndex(d) { return (d.getDay() + 6) % 7; }
  var MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  function fmtDate(d) { return d.getDate() + ' ' + MONTHS_GEN[d.getMonth()]; }
  function fmtDateShort(d) { return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0'); }
  function parseISO(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }

  // ---- Справочники ----
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function studio(id) { return byId(STUDIOS, id); }
  function group(id) { return byId(GROUPS, id); }
  function teacher(id) { return byId(TEACHERS, id); }
  function studioPlans(s) {
    var o = load().priceOverrides[s.id];
    return o || s.plans;
  }
  function minPrice(s) {
    return Math.min.apply(null, studioPlans(s).map(function (p) { return p.price; }));
  }
  function groupTeacher(g) { return teacher(studio(g.studio).teacher); }
  function lessonsOfGroup(gid) { return LESSONS.filter(function (l) { return l.group === gid; }); }
  function groupsOfStudio(sid) { return GROUPS.filter(function (g) { return g.studio === sid; }); }
  // Страница студии (studiya.html) — одна на все студии, студия выбирается в адресе
  function studioUrl(sid) { return 'studiya.html?id=' + sid; }
  // Запись на пробное из студии: заглушка «Это демо-версия» сразу показывает выбранную студию
  function trialUrl(sid) { return 'demo.html?form=probnoe&studio=' + sid; }

  // Дни словами: «Пн, Ср»; три дня подряд и больше — диапазоном «Пн–Пт»
  function daysText(days) {
    var runs = [];
    days.slice().sort().forEach(function (d) {
      var last = runs[runs.length - 1];
      if (last && d === last[last.length - 1] + 1) last.push(d);
      else runs.push([d]);
    });
    return runs.map(function (r) {
      if (r.length >= 3) return WEEKDAYS_SHORT[r[0]] + '–' + WEEKDAYS_SHORT[r[r.length - 1]];
      return r.map(function (d) { return WEEKDAYS_SHORT[d]; }).join(', ');
    }).join(', ');
  }
  // Расписание группы: занятия с одинаковым временем объединяются в один слот
  // → [{ days: [0, 2], daysText: 'Пн, Ср', time: '17:30–19:00' }]
  function groupSchedule(gid) {
    var slots = [];
    lessonsOfGroup(gid).forEach(function (l) {
      var time = l.start + '–' + l.end;
      var slot = slots.filter(function (s) { return s.time === time; })[0];
      if (!slot) { slot = { days: [], time: time }; slots.push(slot); }
      slot.days.push(l.day);
    });
    slots.forEach(function (s) { s.days.sort(); s.daysText = daysText(s.days); });
    return slots.sort(function (a, b) { return a.days[0] - b.days[0]; });
  }
  function fmtPrice(v) { return v.toLocaleString('ru-RU').replace(/\u00a0/g, '\u202f') + '\u00a0₽'; }
  function fmtAge(a) { return String(a).replace('.', ','); }
  // «1 год», «3 года», «7 лет»
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }
  function yearsText(n) { return n + '\u00a0' + plural(n, 'год', 'года', 'лет'); }

  // Подбор по возрасту: ребёнку «age» полных лет (от age до age+1) подходит группа,
  // если её возрастной диапазон пересекается с этим годом жизни.
  function groupsForAge(age) {
    return GROUPS.filter(function (g) { return g.age[0] < age + 1 && g.age[1] >= age; });
  }
  function studiosForAge(age) {
    var ids = groupsForAge(age).map(function (g) { return g.studio; });
    return STUDIOS.filter(function (s) { return ids.indexOf(s.id) !== -1; });
  }
  // Возрасты для кнопок подбора: от младшей группы до старшей
  function pickerAges() {
    var lo = Math.floor(Math.min.apply(null, GROUPS.map(function (g) { return g.age[0]; })));
    var hi = Math.max.apply(null, GROUPS.map(function (g) { return g.age[1]; }));
    var out = [];
    for (var a = lo; a < hi; a++) out.push(a);
    return out;
  }

  // Дата из демо-состояния: число — смещение от сегодня, строка — ISO-дата
  function stateDate(v) {
    if (v === null || v === undefined) return null;
    return typeof v === 'number' ? addDays(today(), v) : parseISO(v);
  }
  // Акция видна на сайте, пока включена и не закончился срок действия
  function promoIsLive(p) {
    if (!p.active) return false;
    var until = stateDate(p.until);
    return !until || until >= today();
  }
  // Кнопки-баннеры на главной: только включённые в админке, в заданном там порядке
  function liveBanners() {
    return load().banners.filter(function (b) { return b.enabled; });
  }
  function livePromos() {
    return load().promos.filter(promoIsLive);
  }

  window.SM = {
    CENTER: CENTER, STUDIOS: STUDIOS, TERMS: TERMS, SCHEDULE_NOTES: SCHEDULE_NOTES, TEACHERS: TEACHERS, GROUPS: GROUPS, LESSONS: LESSONS, PARTY: PARTY, REVIEWS: REVIEWS,
    WEEKDAYS: WEEKDAYS, WEEKDAYS_SHORT: WEEKDAYS_SHORT,
    state: load, save: save, reset: reset,
    today: today, addDays: addDays, iso: iso, weekdayIndex: weekdayIndex, fmtDate: fmtDate, fmtDateShort: fmtDateShort, parseISO: parseISO,
    studio: studio, group: group, teacher: teacher, byId: byId, studioPlans: studioPlans, minPrice: minPrice, stateDate: stateDate, groupTeacher: groupTeacher,
    lessonsOfGroup: lessonsOfGroup, groupsOfStudio: groupsOfStudio, studioUrl: studioUrl, trialUrl: trialUrl, daysText: daysText, groupSchedule: groupSchedule, fmtPrice: fmtPrice, fmtAge: fmtAge, promoIsLive: promoIsLive,
    plural: plural, yearsText: yearsText, groupsForAge: groupsForAge, studiosForAge: studiosForAge, pickerAges: pickerAges,
    liveBanners: liveBanners, livePromos: livePromos
  };
})();
