/*
 * Общая обвязка всех страниц: шапка, подвал, нижняя панель на телефоне, cookie-баннер,
 * модальные окна, всплывающие подсказки, иконки и логотип.
 * Страница подключает data.js, затем site.js и помечает <body data-page="...">.
 */
(function () {
  'use strict';

  var SM = window.SM;
  var C = SM.CENTER;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  // ---------- Иконки (линейные, 24×24, цвет = currentColor) ----------
  var P = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9.5 9.5c.3 2 2.2 4 4.5 4.6l1-1.1 1.6.8c-.2.9-1 1.6-2 1.6-3 0-6-3-6-6 0-1 .7-1.8 1.6-2l.8 1.6z"/>',
    vk: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M7 9c.3 3.6 2.2 6 5 6v-2.4c1.1.2 2 1 2.4 2.4H16c-.4-1.7-1.4-2.7-2.3-3.2.9-.5 1.8-1.6 2.1-2.8h-1.6c-.4 1.2-1.3 2.1-2.2 2.2V9h-1.6v4.7c-1-.3-2-1.6-2.1-4.7z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
    door: '<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M3 21h18"/><circle cx="14.5" cy="12" r="1" fill="currentColor"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    // Студии
    sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
    masks: '<path d="M3 4h9v6a4.5 4.5 0 0 1-9 0z"/><path d="M5.5 8h.5M9 8h.5M5.5 11.5c1 1 2.5 1 3.5 0"/><path d="M12 9h9v6a4.5 4.5 0 0 1-9 0"/><path d="M15 13h.5M18 13h.5M15 17.5c1-1 2.5-1 3.5 0"/>',
    dance: '<circle cx="13" cy="4.5" r="2"/><path d="M13 7l-1.5 6 3 3 1 5M11.5 13l-3.5 2.5-3-1M12.5 8.5l4 2.5 3-2M8 8.5l4-1.5"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
    bubble: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10.5h.5M12 10.5h.5M16 10.5h.5"/>',
    cat: '<path d="M5 9V3.5l4 3.5h6l4-3.5V9a7 7 0 0 1-14 0z"/><path d="M9 11h.5M14.5 11h.5M10.5 14.5c.9.7 2.1.7 3 0M3 13.5l4 .5M3 16.5l4-1M21 13.5l-4 .5M21 16.5l-4-1"/>',
    book: '<path d="M3 5.5C6 4 9 4 12 6c3-2 6-2 9-.5V19c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z"/><path d="M12 6v13.5"/>',
    speech: '<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6l-5 4v-4H6a2 2 0 0 1-2-2z"/><path d="M8.5 9.5c1 1.5 2 1.5 3 0s2-1.5 3 0"/>',
    gift: '<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M2.5 9h19M12 9v11M12 9C10 4 6.5 5 7.5 7.5 8.3 9 12 9 12 9zM12 9c2-5 5.5-4 4.5-1.5C15.7 9 12 9 12 9z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'
  };

  function icon(name, cls) {
    return '<svg class="' + (cls || 'ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || '') + '</svg>';
  }

  // ---------- Логотип ----------
  // Пересобран по описанию из TZ.md (раздел 10): оранжевый фон, ряды цветных полос сверху и снизу,
  // синие скобки по бокам, белая надпись «Центр Эстетического Развития» и «СКАЗОЧНЫЙ МИР»
  // округлыми рукописными буквами — белыми с синей обводкой.
  var PALETTE = { orange: '#EE8833', blue: '#2A5CA8', white: '#FFFFFF', pink: '#E455C8', green: '#7CF06A', yellow: '#F5DD4A', lavender: '#B08CF0', mint: '#7EC8B3' };
  var STRIPE_COLORS = ['pink', 'yellow', 'blue', 'green', 'white', 'lavender', 'mint', 'yellow', 'pink', 'blue', 'green', 'lavender', 'white', 'mint'];
  var STRIPE_WIDTHS = [9, 6, 4, 11, 3, 8, 10, 5, 7, 4, 9, 6, 3, 8];

  function stripeRow(x0, x1, y, h, offset) {
    var out = '', x = x0, i = offset || 0;
    while (x < x1) {
      var w = Math.min(STRIPE_WIDTHS[i % STRIPE_WIDTHS.length], x1 - x);
      out += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + PALETTE[STRIPE_COLORS[i % STRIPE_COLORS.length]] + '"/>';
      x += w + 3;
      i++;
    }
    return out;
  }

  function logoBanner(cls) {
    return '<svg class="' + (cls || 'logo-banner') + '" viewBox="0 0 420 210" role="img" aria-label="Центр эстетического развития «Сказочный мир»">' +
      '<rect width="420" height="210" rx="26" fill="' + PALETTE.orange + '"/>' +
      stripeRow(20, 400, 16, 30, 0) + stripeRow(20, 400, 164, 30, 5) +
      '<path d="M48 60H32v90h16M372 60h16v90h-16" fill="none" stroke="' + PALETTE.blue + '" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<text x="210" y="82" text-anchor="middle" fill="#fff" font-family="Nunito, Arial, sans-serif" font-weight="800" font-size="16" letter-spacing=".4">Центр Эстетического Развития</text>' +
      '<text x="210" y="138" text-anchor="middle" fill="#fff" stroke="' + PALETTE.blue + '" stroke-width="6" stroke-linejoin="round" paint-order="stroke" ' +
      'font-family="Caveat, cursive" font-weight="700" font-size="60" textLength="296" lengthAdjust="spacingAndGlyphs">СКАЗОЧНЫЙ МИР</text>' +
      '</svg>';
  }

  // Круглая иконка: полосы по кругу и оранжевый ромб в центре, как на аватарке группы ВК
  var roundId = 0;
  function logoRound(cls) {
    var stripes = '', x = 0, i = 0, clip = 'sm-round-' + (++roundId);
    while (x < 100) {
      var w = STRIPE_WIDTHS[i % STRIPE_WIDTHS.length] * 0.8 + 2;
      stripes += '<rect x="' + x.toFixed(1) + '" y="0" width="' + w.toFixed(1) + '" height="100" fill="' + PALETTE[STRIPE_COLORS[i % STRIPE_COLORS.length]] + '"/>';
      x += w;
      i++;
    }
    return '<svg class="' + (cls || 'brand-icon') + '" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="' + clip + '"><circle cx="50" cy="50" r="50"/></clipPath></defs>' +
      '<g clip-path="url(#' + clip + ')"><rect width="100" height="100" fill="' + PALETTE.orange + '"/>' + stripes + '</g>' +
      '<circle cx="50" cy="50" r="48" fill="none" stroke="#fff" stroke-width="4"/>' +
      '<rect x="25" y="25" width="50" height="50" rx="9" transform="rotate(45 50 50)" fill="' + PALETTE.orange + '" stroke="#fff" stroke-width="3"/>' +
      '<path d="M50 33l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3L50 56.6l-9.3 4.9 1.8-10.3-7.5-7.3 10.4-1.5z" fill="#fff" stroke="' + PALETTE.blue + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '</svg>';
  }

  // ---------- Навигация ----------
  var NAV = [
    { id: 'studii', href: 'studii.html', title: 'Студии', tone: 'orange' },
    { id: 'raspisanie', href: 'raspisanie.html', title: 'Расписание', tone: 'blue' },
    { id: 'pedagogi', href: 'pedagogi.html', title: 'Педагоги', tone: 'green' },
    { id: 'akcii', href: 'akcii.html', title: 'Акции', tone: 'yellow' },
    { id: 'novosti', href: 'novosti.html', title: 'Новости', tone: 'lavender' },
    { id: 'prazdniki', href: 'prazdniki.html', title: 'Праздники', tone: 'pink' },
    { id: 'kontakty', href: 'kontakty.html', title: 'Контакты', tone: 'mint' }
  ];

  function current(item, page) { return item.id === page ? ' aria-current="page"' : ''; }

  function renderHeader(page) {
    var nav = NAV.map(function (n) { return '<a href="' + n.href + '"' + current(n, page) + '>' + n.title + '</a>'; }).join('');
    var mobile = NAV.map(function (n) {
      return '<li><a class="tone-' + n.tone + '" href="' + n.href + '"' + current(n, page) + '><span class="dot"></span>' + n.title + '</a></li>';
    }).join('') + '<li><a href="vhod.html"' + (page === 'vhod' ? ' aria-current="page"' : '') + '>' + icon('user') + 'Вход в кабинет</a></li>';

    return '<div class="demo-ribbon">Демо-версия нового сайта.<span class="long"> Студии, цены и расписание — настоящие; педагоги, акции и отзывы — примеры.</span> <a href="demo.html">Подробнее</a></div>' +
      '<header class="site-header">' +
      '<div class="container header-inner">' +
      '<a class="brand" href="index.html" aria-label="«Сказочный мир» — на главную">' + logoRound() +
      '<span class="brand-text"><small>Центр эстетического развития</small><b>Сказочный мир</b></span></a>' +
      '<nav class="main-nav" aria-label="Основное меню">' + nav + '</nav>' +
      '<div class="header-actions">' +
      '<a class="header-phone" href="' + C.phoneMain.href + '">' + C.phoneMain.text + '</a>' +
      '<a class="btn btn-blue header-cta" href="demo.html?form=probnoe">Записаться</a>' +
      '<button class="burger" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Меню">' + icon('menu') + '</button>' +
      '</div></div>' +
      '<div class="stripes thin"></div>' +
      '<nav class="mobile-nav" id="mobile-nav" aria-label="Меню"><div class="container"><ul>' + mobile + '</ul>' +
      '<div class="mobile-nav-foot">' +
      '<a class="btn btn-blue btn-block" href="demo.html?form=probnoe">Записаться на пробное занятие</a>' +
      '<a class="btn btn-ghost btn-block" href="' + C.phoneMain.href + '">' + icon('phone') + C.phoneMain.text + '</a>' +
      '</div></div></nav>' +
      '</header>';
  }

  function renderFooter() {
    var phones = C.phones.map(function (p) {
      return '<li><a href="' + p.href + '">' + p.text + '</a> <span class="muted">— ' + p.note + '</span></li>';
    }).join('');
    var nav = NAV.map(function (n) { return '<li><a href="' + n.href + '">' + n.title + '</a></li>'; }).join('');
    var year = new Date().getFullYear();
    return '<footer class="site-footer">' +
      '<div class="stripes"></div>' +
      '<div class="container footer-inner">' +
      '<div class="footer-brand"><a class="brand" href="index.html">' + logoRound() +
      '<span class="brand-text"><small>Центр эстетического развития</small><b>Сказочный мир</b></span></a>' +
      '<p>' + esc(C.motto) + '</p>' +
      '<p>' + esc(C.address) + '<br>' + esc(C.entrance) + '</p></div>' +
      '<div class="footer-col"><h4>Разделы</h4><ul>' + nav + '</ul></div>' +
      '<div class="footer-col"><h4>Связаться</h4><ul>' + phones +
      '<li><a href="' + C.whatsapp + '" rel="noopener">Написать в WhatsApp</a></li>' +
      '<li><a href="' + C.vk + '" rel="noopener">Группа ВКонтакте</a></li></ul></div>' +
      '<div class="footer-col"><h4>Родителям и педагогам</h4><ul>' +
      '<li><a href="vhod.html">Вход в личный кабинет</a></li>' +
      '<li><a href="demo.html?form=probnoe">Запись на пробное занятие</a></li>' +
      '<li><a href="politika.html">Политика обработки персональных данных</a></li>' +
      '<li><a href="soglasie.html">Согласие на обработку персональных данных</a></li></ul></div>' +
      '</div>' +
      '<div class="container footer-bottom">' +
      '<div>© ' + year + ' ' + esc(C.fullName) + '. Реквизиты организации (ИП или ООО, ИНН, ОГРН) будут указаны здесь — уточняются у центра.</div>' +
      '<div>При поддержке <a href="' + C.partner.url + '" rel="noopener">' + esc(C.partner.name) + '</a>.</div>' +
      '</div>' +
      '</footer>';
  }

  function renderMobileCta() {
    var bar = document.createElement('div');
    bar.className = 'mobile-cta';
    bar.innerHTML = '<a class="btn btn-ghost" href="' + C.phoneMain.href + '" aria-label="Позвонить ' + C.phoneMain.text + '">' + icon('phone') + 'Позвонить</a>' +
      '<a class="btn btn-blue" href="demo.html?form=probnoe">Записаться на пробное</a>';
    document.body.appendChild(bar);
    document.body.classList.add('has-mobile-cta');
  }

  // ---------- Хранилище браузера (только для удобств посетителя) ----------
  function prefGet(key) { try { return window.localStorage.getItem('sm-pref-' + key); } catch (e) { return null; } }
  function prefSet(key, value) { try { window.localStorage.setItem('sm-pref-' + key, value); } catch (e) { /* ignore */ } }

  function renderCookie() {
    if (prefGet('cookie') === 'ok') return;
    var box = document.createElement('div');
    box.className = 'cookie';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Уведомление о cookie');
    box.innerHTML = '<p>Сайт хранит в браузере ваши настройки (например, выбранный возраст ребёнка). ' +
      'В рабочей версии подключим Яндекс Метрику для статистики посещений — подробнее в ' +
      '<a href="politika.html">политике обработки персональных данных</a>.</p>' +
      '<button class="btn btn-blue" type="button">Понятно</button>';
    box.querySelector('button').addEventListener('click', function () {
      prefSet('cookie', 'ok');
      box.remove();
    });
    document.body.appendChild(box);
  }

  // ---------- Модальное окно и подсказки ----------
  function modal(opts) {
    var back = document.createElement('div');
    back.className = 'modal-backdrop';
    var actions = (opts.actions || [{ text: 'Понятно', cls: 'btn-blue' }]).map(function (a, i) {
      return '<button type="button" class="btn ' + (a.cls || 'btn-soft') + '" data-i="' + i + '">' + esc(a.text) + '</button>';
    }).join('');
    back.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '<h3 id="modal-title">' + esc(opts.title) + '</h3>' + (opts.html || '') +
      '<div class="modal-actions">' + actions + '</div></div>';
    var prevFocus = document.activeElement;
    function close() {
      back.remove();
      document.removeEventListener('keydown', onKey);
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    back.addEventListener('click', function (e) {
      if (e.target === back) { close(); return; }
      var btn = e.target.closest('[data-i]');
      if (!btn) return;
      var a = opts.actions && opts.actions[+btn.dataset.i];
      if (a && a.onClick && a.onClick(back) === false) return;
      close();
    });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(back);
    var first = back.querySelector('.modal-actions button');
    if (first) first.focus();
    return { el: back, close: close };
  }

  var toastTimer = null;
  function toast(text) {
    var old = document.querySelector('.toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.textContent = text;
    document.body.appendChild(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.remove(); }, 3200);
  }

  // ---------- Сборка страницы ----------
  function initLayout() {
    var body = document.body;
    var page = body.dataset.page || '';
    var head = document.getElementById('site-header');
    var foot = document.getElementById('site-footer');
    if (head) head.outerHTML = renderHeader(page);
    if (foot) foot.outerHTML = renderFooter();
    if (body.dataset.mobileCta !== 'off') renderMobileCta();
    renderCookie();

    var burger = document.querySelector('.burger');
    var mnav = document.getElementById('mobile-nav');
    if (burger && mnav) {
      burger.addEventListener('click', function () {
        var open = mnav.classList.toggle('open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.innerHTML = icon(open ? 'close' : 'menu');
      });
    }

    // Логотипы, вставленные в разметку страницы
    Array.prototype.forEach.call(document.querySelectorAll('[data-logo="banner"]'), function (el) { el.innerHTML = logoBanner(); });
  }

  SM.ui = {
    esc: esc, icon: icon, logoBanner: logoBanner, logoRound: logoRound, modal: modal, toast: toast,
    prefGet: prefGet, prefSet: prefSet, NAV: NAV
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLayout);
  else initLayout();
})();
