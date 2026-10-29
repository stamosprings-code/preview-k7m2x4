/* Список студий: карточки всех студий, сводная таблица цен и общие условия. */
(function () {
  'use strict';

  var SM = window.SM;
  var ui = SM.ui;
  var esc = ui.esc;

  function $(id) { return document.getElementById(id); }

  $('studio-grid').innerHTML = SM.STUDIOS.map(ui.studioCard).join('');

  // ---------- Сводная таблица цен ----------
  // На телефоне каждая строка таблицы — карточка, подписи столбцов показываются рядом со значением (data-label)
  var COLS = ['Студия', 'Возраст', 'Абонемент', 'Со второй студией', 'Пробное'];
  function cell(i, html, cls) {
    var value = i === 0 ? html : '<span class="v">' + html + '</span>';
    return '<td class="' + (cls || '') + (html ? '' : ' is-empty') + '" data-label="' + COLS[i] + '">' + value + '</td>';
  }
  var rows = SM.STUDIOS.map(function (s) {
    return SM.studioPlans(s).map(function (p, i) {
      var name = i === 0
        ? '<a href="' + SM.studioUrl(s.id) + '"><span class="studio-hand">' + esc(s.title) + '</span></a><small>' + esc(s.kind) + '</small>'
        : '<small class="cont">«' + esc(s.title) + '»</small>';
      return '<tr class="tone-' + s.color + (i ? ' cont-row' : '') + '">' +
        cell(0, name, 'name') +
        cell(1, i === 0 ? esc(s.ageText) : '', 'age') +
        cell(2, '<b>' + SM.fmtPrice(p.price) + '</b><small>' + esc(p.label) + '</small>') +
        cell(3, p.combo ? '<b class="combo">' + SM.fmtPrice(p.combo) + '</b>' : '<span class="muted">—</span>') +
        cell(4, i === 0 ? '<b>' + SM.fmtPrice(s.trial.price) + '</b><small>' + esc(s.trial.label) + '</small>' : '') +
        '</tr>';
    }).join('');
  }).join('');
  $('price-head').innerHTML = COLS.map(function (c) { return '<th scope="col">' + c + '</th>'; }).join('');
  $('price-table').innerHTML = rows;

  $('terms-list').innerHTML = SM.TERMS.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
})();
