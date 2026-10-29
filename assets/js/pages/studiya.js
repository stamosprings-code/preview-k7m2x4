/* Страница одной студии (studiya.html?id=<студия>): описание, возраст, цены, педагог, группы с расписанием, места под фото. */
(function () {
  'use strict';

  var SM = window.SM;
  var ui = SM.ui;
  var esc = ui.esc;

  function $(id) { return document.getElementById(id); }

  var id = new URLSearchParams(window.location.search).get('id');
  var s = id ? SM.studio(id) : null;

  // ---------- Студии нет (ошибка в адресе) ----------
  if (!s) {
    document.title = 'Студия не найдена — «Сказочный мир», Колтуши';
    $('crumb').textContent = 'Не найдена';
    $('studio-hero-inner').innerHTML = '<div><h1>Такой студии нет</h1>' +
      '<p class="studio-hero-lead">Возможно, ссылка устарела. Все студии центра — в списке.</p>' +
      '<a class="btn btn-blue" href="studii.html">Все студии</a></div>';
    ['o-studii', 'gruppy', 'foto', 'drugie'].forEach(function (sec) { $(sec).hidden = true; });
    return;
  }

  var trialHref = SM.trialUrl(s.id);
  document.body.dataset.cta = trialHref;
  document.title = '«' + s.title + '» — ' + s.kind.charAt(0).toLowerCase() + s.kind.slice(1) + ' — «Сказочный мир», Колтуши';
  $('studio-page').classList.add('tone-' + s.color);
  $('crumb').textContent = s.title;

  var groups = SM.groupsOfStudio(s.id);
  var groupsText = s.individual ? 'индивидуально' : groups.length + ' ' + SM.plural(groups.length, 'группа', 'группы', 'групп');

  // ---------- Первый экран и цены ----------
  var pills = ['<span class="pill pill-tone">' + esc(s.ageText) + '</span>', '<span class="pill">' + groupsText + '</span>'];
  if (s.format) pills.push('<span class="pill">' + ui.icon('clock') + esc(s.format) + '</span>');

  var plans = SM.studioPlans(s).map(function (p) {
    var combo = p.combo ? '<span class="combo">' + SM.fmtPrice(p.combo) + ', если ребёнок ходит ещё в одну студию центра</span>' : '';
    return '<div class="price-row"><span>' + esc(p.label) + combo + '</span><b>' + SM.fmtPrice(p.price) + '</b></div>';
  }).join('');

  $('studio-hero-inner').innerHTML =
    '<div>' +
    '<div class="studio-hero-head"><span class="studio-icon">' + ui.icon(s.icon) + '</span>' +
    '<div><div class="studio-kind">' + esc(s.kind) + '</div><h1 class="studio-name">' + esc(s.title) + '</h1></div></div>' +
    '<p class="studio-hero-lead">' + esc(s.lead) + '</p>' +
    '<div class="studio-meta">' + pills.join('') + '</div>' +
    '<div class="hero-actions studio-actions">' +
    '<a class="btn btn-blue btn-lg" href="' + trialHref + '">Записаться на пробное занятие</a>' +
    '<a class="btn btn-ghost" href="#gruppy">Группы и расписание</a></div>' +
    '</div>' +
    '<div class="price-box"><h2 class="price-title">Цены</h2>' + plans +
    '<div class="price-row"><span>' + esc(s.trial.label) + '</span><b>' + SM.fmtPrice(s.trial.price) + '</b></div>' +
    '<p class="price-note">Абонемент — на месяц. Занятие, пропущенное по болезни, не сгорает. <a href="studii.html#ceny">Скидки семьям и общие условия</a></p>' +
    '</div>';

  // ---------- Чем занимаемся ----------
  $('studio-points').innerHTML = s.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('');
  if (s.extra) $('studio-extra').innerHTML = '<div class="callout">' + esc(s.extra) + '</div>';

  // ---------- Педагог (вымышленный пример) ----------
  var t = SM.teacher(s.teacher);
  var initials = t.name.split(' ').map(function (w) { return w.charAt(0); }).join('');
  $('studio-teacher').innerHTML = '<div class="teacher-inline tone-' + t.color + '">' +
    '<span class="avatar" role="img" aria-label="Место для фото педагога">' + esc(initials) + '</span>' +
    '<div><b>' + esc(t.name) + '</b> <span class="badge badge-soft">пример</span>' +
    '<div class="teacher-role">' + esc(t.role) + '</div>' +
    '<ul class="teacher-facts"><li><b>Образование:</b> ' + esc(t.edu) + '</li>' +
    '<li><b>Опыт:</b> ' + SM.yearsText(t.exp) + '</li></ul></div></div>' +
    '<p class="muted small teacher-note">Настоящие фото и сведения о педагогах появятся после их согласия на публикацию.</p>';

  // ---------- Группы и расписание ----------
  var todayIdx = SM.weekdayIndex(SM.today());
  $('studio-groups').innerHTML = groups.map(function (g) {
    var slots = SM.groupSchedule(g.id).map(function (sl) {
      var today = sl.days.indexOf(todayIdx) !== -1;
      return '<span class="slot' + (today ? ' today' : '') + '">' + ui.icon('clock') + esc(sl.daysText) + ' · ' + esc(sl.time) +
        (today ? ' · сегодня' : '') + '</span>';
    }).join('');
    var note = g.window ? '<span class="muted small">Время занятия выбираете вместе с логопедом в этом промежутке.</span>' : '';
    return '<div class="group-item">' +
      '<div class="group-item-head"><b>' + esc(g.name) + '</b><span class="pill pill-tone">' + esc(g.ageText) + '</span></div>' +
      '<div class="slot-list">' + slots + '</div>' + note + '</div>';
  }).join('');
  if (s.individual) $('gruppy').querySelector('h2').textContent = 'Время занятий';
  $('gruppy').querySelector('.section-head').insertAdjacentHTML('beforeend', '<a class="link-more" href="raspisanie.html">Расписание всего центра</a>');

  // ---------- Места под фото ----------
  var PHOTOS = ['На занятии', 'Зал студии', s.individual ? 'Кабинет логопеда' : 'Выступления и работы'];
  $('studio-gallery').innerHTML = PHOTOS.map(function (title) {
    return '<div class="media-tile" role="img" aria-label="Место для фото: ' + esc(title) + '">' +
      '<span class="art">' + ui.icon(s.icon) + '</span><b>' + esc(title) + '<small>Место для фото</small></b></div>';
  }).join('');

  // ---------- Другие студии ----------
  var withCombo = SM.studioPlans(s).filter(function (p) { return p.combo; })[0];
  $('other-note').textContent = withCombo
    ? 'Все студии — в одном здании. Если ребёнок ходит ещё в одну студию центра, абонемент сюда стоит ' +
      SM.fmtPrice(withCombo.combo) + ' вместо ' + SM.fmtPrice(withCombo.price) + '.'
    : 'Все студии — в одном здании: удобно водить детей на несколько занятий.';
  $('other-studios').innerHTML = SM.STUDIOS.filter(function (o) { return o.id !== s.id; }).map(function (o) {
    return '<a class="tag tone-' + o.color + '" href="' + SM.studioUrl(o.id) + '">' + ui.icon(o.icon) + esc(o.title) + '</a>';
  }).join('');
})();
