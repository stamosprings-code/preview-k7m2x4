/* Главная: цифры о центре, кнопки-баннеры, акции, подбор студии по возрасту, места под фото и видео, отзывы, контакты. */
(function () {
  'use strict';

  var SM = window.SM;
  var C = SM.CENTER;
  var ui = SM.ui;
  var esc = ui.esc;

  function $(id) { return document.getElementById(id); }

  // Ссылка «Все …» в заголовке раздела. Страницы разделов появятся в задачах 3, 5 и 6 (docs/plan.md).
  function addMore(sectionId, href, text) {
    var head = document.querySelector('#' + sectionId + ' .section-head');
    if (head) head.insertAdjacentHTML('beforeend', '<a class="link-more" href="' + href + '">' + esc(text) + '</a>');
  }

  // ---------- Цифры о центре ----------
  $('facts').innerHTML = [
    { tone: 'orange', big: C.years + ' лет', text: 'центру в Колтушах' },
    { tone: 'blue', big: String(SM.STUDIOS.length), text: SM.plural(SM.STUDIOS.length, 'направление', 'направления', 'направлений') + ' для детей' },
    { tone: 'pink', big: String(C.halls), text: 'залов, ' + C.area + ' м²' },
    { tone: 'green', big: C.vkRating, text: 'рейтинг в группе ВКонтакте' }
  ].map(function (f) {
    return '<div class="fact tone-' + f.tone + '"><b>' + esc(f.big) + '</b><span>' + esc(f.text) + '</span></div>';
  }).join('');

  // ---------- Кнопки-баннеры (включаются и выключаются в админке) ----------
  var banners = SM.liveBanners();
  var quick = $('quick-links');
  if (banners.length) {
    quick.innerHTML = banners.map(function (b) {
      return '<a class="quick-link tone-' + b.color + '" href="' + esc(b.href) + '"><span>' + esc(b.title) + '</span>' + ui.icon('arrow') + '</a>';
    }).join('');
  } else {
    quick.closest('section').hidden = true;
  }

  // ---------- Акции (с истёкшим сроком не показываются) ----------
  var promos = SM.livePromos();
  if (promos.length) {
    $('promos').innerHTML = promos.map(function (p) {
      var until = SM.stateDate(p.until);
      var badges = [until ? '<span class="badge">до ' + SM.fmtDate(until) + '</span>' : '<span class="badge badge-ok">постоянно</span>'];
      p.studios.forEach(function (id) {
        var s = SM.studio(id);
        if (s) badges.push('<span class="badge badge-blue">«' + esc(s.title) + '»</span>');
      });
      if (p.example) badges.push('<span class="badge badge-soft">пример</span>');
      return '<article class="promo"><div class="promo-badges">' + badges.join('') + '</div>' +
        '<h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p></article>';
    }).join('');
    addMore('akcii', 'akcii.html', 'Все акции');
  } else {
    $('akcii').hidden = true;
  }

  // ---------- Подбор студии по возрасту ----------
  function studioCard(s) {
    var plans = SM.studioPlans(s);
    var groups = s.individual ? 'индивидуально' : s.groups + ' ' + SM.plural(s.groups, 'группа', 'группы', 'групп');
    var price = plans.length > 1
      ? '<b>от ' + SM.fmtPrice(SM.minPrice(s)) + '</b><small>в месяц</small>'
      : '<b>' + SM.fmtPrice(plans[0].price) + '</b><small>' + esc(plans[0].label) + '</small>';
    return '<a class="studio-card tone-' + s.color + '" href="studii.html#' + s.id + '" data-studio="' + s.id + '">' +
      '<div class="studio-card-top"><span class="studio-icon">' + ui.icon(s.icon) + '</span>' +
      '<div><div class="studio-kind">' + esc(s.kind) + '</div><div class="studio-name">' + esc(s.title) + '</div></div></div>' +
      '<div class="studio-card-body"><p>' + esc(s.lead) + '</p>' +
      '<div class="studio-meta"><span class="pill pill-tone">' + esc(s.ageText) + '</span><span class="pill">' + groups + '</span></div>' +
      '<p class="studio-fit" hidden></p>' +
      '<div class="studio-price"><span>' + price + '</span><span class="arrow">Подробнее →</span></div>' +
      '</div></a>';
  }

  // «Младшая группа, 5–7 лет»; возраст не повторяем, если он уже в названии («Группа 8–10»)
  function groupLabel(g) {
    return g.name.indexOf(g.ageText.split(' ')[0]) !== -1 ? g.name : g.name + ', ' + g.ageText;
  }

  var grid = $('studio-grid');
  grid.innerHTML = SM.STUDIOS.map(studioCard).join('');
  addMore('podbor', 'studii.html', 'Все студии');

  var ages = SM.pickerAges();
  var chips = $('age-chips');
  chips.innerHTML = '<button type="button" class="chip" data-age="">Все</button>' + ages.map(function (a) {
    return '<button type="button" class="chip" data-age="' + a + '">' + SM.yearsText(a) + '</button>';
  }).join('');

  function showAge(age) {
    Array.prototype.forEach.call(chips.querySelectorAll('.chip'), function (c) {
      c.setAttribute('aria-pressed', c.dataset.age === (age === null ? '' : String(age)) ? 'true' : 'false');
    });
    var fit = age === null ? null : SM.groupsForAge(age);
    Array.prototype.forEach.call(grid.querySelectorAll('.studio-card'), function (card) {
      var mine = fit && fit.filter(function (g) { return g.studio === card.dataset.studio; });
      var line = card.querySelector('.studio-fit');
      card.hidden = !!fit && !mine.length;
      line.hidden = !mine || !mine.length;
      if (mine && mine.length) {
        line.textContent = 'Подходит: ' + mine.map(groupLabel).join('; ');
      }
    });
    var n = fit ? SM.studiosForAge(age).length : SM.STUDIOS.length;
    $('age-result').textContent = fit
      ? 'Для ребёнка ' + SM.yearsText(age) + ' — ' + n + ' ' + SM.plural(n, 'студия', 'студии', 'студий') + '.'
      : 'Все ' + n + ' ' + SM.plural(n, 'направление', 'направления', 'направлений') + ' центра.';
  }

  chips.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    ui.prefSet('age', chip.dataset.age);
    showAge(chip.dataset.age === '' ? null : +chip.dataset.age);
  });

  // Возраст, выбранный раньше, запоминается в браузере (см. cookie-баннер)
  var saved = ui.prefGet('age');
  var start = saved && ages.indexOf(+saved) !== -1 ? +saved : null;
  showAge(start);
  // На телефоне кнопки возраста прокручиваются вбок — показать выбранную
  var pressed = chips.querySelector('[aria-pressed="true"]');
  if (start !== null && pressed) chips.scrollLeft = pressed.offsetLeft - chips.offsetLeft - 40;

  // ---------- Места под фото и видео ----------
  var MEDIA = [
    { tone: 'blue', icon: 'masks', video: true, wide: true, title: 'Новогодний спектакль студии «Облака»', note: 'видео, 2025' },
    { tone: 'pink', icon: 'mic', title: '«ГолосОК» на районном фестивале', note: 'фото' },
    { tone: 'yellow', icon: 'dance', video: true, title: 'Номер «Чудо-денс» на осеннем концерте', note: 'видео' },
    { tone: 'lavender', icon: 'cat', title: 'Выставка работ «Чеширского Кота»', note: 'фото' },
    { tone: 'green', icon: 'star', title: 'Акробатика «Маугли»', note: 'фото' }
  ];
  $('gallery').innerHTML = MEDIA.map(function (m, i) {
    var inner = '<span class="art">' + ui.icon(m.icon) + '</span>' + (m.video ? '<span class="play">' + ui.icon('play') + '</span>' : '') +
      '<b>' + esc(m.title) + '<small>Место для ' + esc(m.note) + '</small></b>';
    var cls = 'media-tile tone-' + m.tone + (m.wide ? ' wide' : '');
    return m.video
      ? '<button type="button" class="' + cls + '" data-media="' + i + '" aria-label="Смотреть: ' + esc(m.title) + '">' + inner + '</button>'
      : '<div class="' + cls + '" role="img" aria-label="Место для фото: ' + esc(m.title) + '">' + inner + '</div>';
  }).join('');
  $('gallery').addEventListener('click', function (e) {
    var tile = e.target.closest('[data-media]');
    if (!tile) return;
    ui.modal({
      title: MEDIA[+tile.dataset.media].title,
      html: '<p>Здесь откроется видео с концерта. В демо-версии видео нет: настоящие записи центр пришлёт после согласования с родителями.</p>'
    });
  });

  // ---------- Отзывы (пример оформления) ----------
  $('rating').innerHTML = '<b>' + esc(C.vkRating) + '</b><div><div class="stars" aria-hidden="true">★★★★★</div>' +
    '<span class="muted">рейтинг группы ВКонтакте, ' + esc(C.vkFollowers) + ' подписчиков</span></div>' +
    '<a class="btn btn-soft btn-sm" href="' + C.vk + '" rel="noopener">' + ui.icon('vk') + 'Группа ВК</a>';
  $('reviews').innerHTML = SM.REVIEWS.map(function (r) {
    var s = SM.studio(r.studio);
    return '<blockquote class="review"><div class="stars" aria-label="5 из 5">★★★★★</div><p>' + esc(r.text) + '</p>' +
      '<footer>' + esc(r.author) + ' · «' + esc(s.title) + '» <span class="badge badge-soft">пример</span></footer></blockquote>';
  }).join('');

  // ---------- Адрес и главный телефон ----------
  $('home-contacts').innerHTML =
    '<div class="contact-group"><div class="contact-row"><span class="ic">' + ui.icon('pin') + '</span><div><b>' + esc(C.address) + '</b></div></div>' +
    '<div class="entrance">' + ui.icon('door') + esc(C.entrance) + '</div></div>' +
    '<div class="contact-group"><div class="contact-row"><span class="ic">' + ui.icon('phone') + '</span><div><a href="' + C.phoneMain.href + '"><b>' + esc(C.phoneMain.text) + '</b></a>' +
    '<small>' + esc(C.phoneMain.note) + '</small></div></div>' +
    '<div class="contact-buttons">' +
    '<a class="btn btn-blue" href="' + C.phoneMain.href + '">' + ui.icon('phone') + 'Позвонить</a>' +
    '<a class="btn btn-ghost" href="' + C.whatsapp + '" rel="noopener">' + ui.icon('whatsapp') + 'WhatsApp</a>' +
    '</div></div>';
  addMore('kontakty', 'kontakty.html', 'Все контакты и карта');
})();
