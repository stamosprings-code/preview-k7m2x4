/* Расписание: фильтр по возрасту и студии, вид «по дням» (на телефоне — вкладки дней) и «по студиям»,
   отметки «сегодня» и «идёт сейчас», «Моя неделя» — пересечения по времени и примерная сумма в месяц. */
(function () {
  'use strict';

  var SM = window.SM;
  var ui = SM.ui;
  var esc = ui.esc;

  function $(id) { return document.getElementById(id); }

  var DAYS = [0, 1, 2, 3, 4];
  var ages = SM.pickerAges();

  // Выбор посетителя запоминается в браузере: возраст (общий с главной), вид, «Моя неделя»
  var savedAge = ui.prefGet('age');
  var filter = { age: savedAge && ages.indexOf(+savedAge) !== -1 ? +savedAge : null, studio: null };
  var view = ui.prefGet('sched-view') === 'studios' ? 'studios' : 'days';
  var picked = (ui.prefGet('week') || '').split(',').filter(function (id) { return SM.group(id); });
  var day = null;
  var plannerOpen = false;

  function g(l) { return SM.group(l.group); }
  function st(l) { return SM.studio(g(l).studio); }
  function isPicked(gid) { return picked.indexOf(gid) !== -1; }

  // Неделя на экране: текущая, а в субботу и воскресенье — следующая
  function weekInfo() {
    var now = new Date();
    var todayIdx = SM.weekdayIndex(now);
    var weekend = todayIdx > 4;
    var monday = SM.addDays(SM.today(), weekend ? 7 - todayIdx : -todayIdx);
    return { now: now, todayIdx: weekend ? -1 : todayIdx, weekend: weekend, monday: monday };
  }

  function toggleBtn(gid, title) {
    var on = isPicked(gid);
    return '<button type="button" class="plan-toggle" data-group="' + gid + '" aria-pressed="' + on + '" aria-label="' +
      (on ? 'Убрать из «Моей недели»: ' : 'Добавить в «Мою неделю»: ') + esc(title) + '">' + ui.icon(on ? 'check' : 'plus') + '</button>';
  }
  function groupTitle(gr) { return '«' + SM.studio(gr.studio).title + '», ' + ui.groupLabel(gr); }

  // ---------- Фильтры ----------
  $('age-chips').innerHTML = '<button type="button" class="chip" data-age="">Все</button>' + ages.map(function (a) {
    return '<button type="button" class="chip" data-age="' + a + '">' + SM.yearsText(a) + '</button>';
  }).join('');
  $('studio-select').innerHTML = '<option value="">Все студии</option>' + SM.STUDIOS.map(function (s) {
    return '<option value="' + s.id + '">' + esc(s.title) + ' — ' + esc(s.kind.toLowerCase()) + '</option>';
  }).join('');

  function syncControls() {
    Array.prototype.forEach.call($('age-chips').querySelectorAll('.chip'), function (c) {
      c.setAttribute('aria-pressed', c.dataset.age === (filter.age === null ? '' : String(filter.age)) ? 'true' : 'false');
    });
    $('studio-select').value = filter.studio || '';
    Array.prototype.forEach.call($('view-switch').querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', b.dataset.view === view ? 'true' : 'false');
    });
  }

  function emptyText() {
    if (filter.age !== null && filter.studio) return 'В этот день нет занятий этой студии для ребёнка ' + SM.yearsText(filter.age);
    if (filter.age !== null) return 'В этот день нет занятий для ребёнка ' + SM.yearsText(filter.age);
    if (filter.studio) return 'В этот день у студии нет занятий';
    return 'Занятий нет';
  }

  // ---------- Вид «по дням» ----------
  function lessonCard(l, w, conflicts) {
    var gr = g(l), s = st(l);
    var cls = 'lesson tone-' + s.color + (SM.lessonIsNow(l, w.now) ? ' is-now' : '') + (conflicts[l.id] ? ' conflict' : '');
    return '<div class="' + cls + '"><div class="lesson-time">' + l.start + '<small>до ' + l.end + '</small></div>' +
      '<div class="lesson-title"><a class="studio-hand" href="' + SM.studioUrl(s.id) + '">' + esc(s.title) + '</a>' +
      '<b>' + esc(gr.name) + '</b><span>' + esc(gr.ageText) + (gr.window ? ' · время по записи' : '') + '</span></div>' +
      toggleBtn(gr.id, groupTitle(gr)) + '</div>';
  }

  function notesOfDay(d) {
    return SM.SCHEDULE_NOTES.filter(function (n) { return n.day === d && (!filter.studio || filter.studio === n.studio); }).map(function (n) {
      var s = SM.studio(n.studio);
      return '<div class="lesson note-card tone-' + s.color + '"><div class="lesson-title">' +
        '<a class="studio-hand" href="' + SM.studioUrl(s.id) + '">' + esc(s.title) + '</a><span>' + esc(n.text) + '</span></div></div>';
    }).join('');
  }

  function renderDays(w, conflicts) {
    if (day === null) day = w.todayIdx === -1 ? 0 : w.todayIdx;
    var tabs = DAYS.map(function (d) {
      var isToday = d === w.todayIdx;
      return '<button type="button" class="day-tab" role="tab" id="tab-' + d + '" aria-controls="day-' + d + '" aria-selected="' + (d === day) + '" data-day="' + d + '">' +
        '<b>' + SM.WEEKDAYS_SHORT[d] + (isToday ? '<span class="today-dot"></span>' : '') + '</b>' +
        '<small>' + (isToday ? 'сегодня' : SM.fmtDateShort(SM.addDays(w.monday, d))) + '</small></button>';
    }).join('');
    var cols = DAYS.map(function (d) {
      var isToday = d === w.todayIdx;
      var list = SM.lessonsOfDay(d, filter).map(function (l) { return lessonCard(l, w, conflicts); }).join('');
      var notes = notesOfDay(d);
      return '<div class="day-col' + (isToday ? ' is-today' : '') + '" role="tabpanel" id="day-' + d + '" aria-labelledby="tab-' + d + '"' + (d === day ? '' : ' hidden') + '>' +
        '<h3>' + SM.WEEKDAYS[d] + ' <small>' + SM.fmtDate(SM.addDays(w.monday, d)) + '</small>' + (isToday ? ' <span class="badge">сегодня</span>' : '') + '</h3>' +
        '<div class="lesson-list">' + (list || '<div class="empty">' + emptyText() + '</div>') + notes + '</div></div>';
    }).join('');
    var weekend = w.weekend ? '<div class="callout">Сегодня выходной — занятий нет. Показываем следующую неделю.</div>' : '';
    return weekend + '<div class="day-tabs" role="tablist" aria-label="День недели">' + tabs + '</div><div class="week by-day">' + cols + '</div>';
  }

  // ---------- Вид «по студиям» ----------
  function renderStudios(w) {
    var cards = SM.STUDIOS.map(function (s) {
      var groups = SM.groupsOfStudio(s.id).filter(function (gr) { return SM.groupMatches(gr, filter); });
      if (!groups.length) return '';
      var rows = groups.map(function (gr) {
        var nowLesson = SM.lessonsOfGroup(gr.id).filter(function (l) { return SM.lessonIsNow(l, w.now); })[0];
        var slots = SM.groupSchedule(gr.id).map(function (sl) {
          var today = sl.days.indexOf(w.todayIdx) !== -1;
          return '<span' + (today ? ' class="is-today"' : '') + '><b>' + esc(sl.daysText) + '</b> ' + esc(sl.time) +
            (today ? ' <span class="badge">' + (nowLesson ? 'идёт сейчас' : 'сегодня') + '</span>' : '') + '</span>';
        }).join('');
        var note = gr.window ? '<span class="muted small">время по записи</span>' : '';
        return '<div class="sched-row"><span class="age">' + esc(gr.ageText) + '</span>' +
          '<div><b class="sched-group">' + esc(gr.name) + '</b><div class="days">' + slots + note + '</div></div>' +
          toggleBtn(gr.id, groupTitle(gr)) + '</div>';
      }).join('');
      var prices = SM.studioPlans(s).map(function (p) {
        return '<span>' + esc(p.label) + ': <b>' + SM.fmtPrice(p.price) + '</b>' + (p.combo ? ', со второй студией <b>' + SM.fmtPrice(p.combo) + '</b>' : '') + '</span>';
      }).join('') + '<span>' + esc(s.trial.label) + ': <b>' + SM.fmtPrice(s.trial.price) + '</b></span>';
      var notes = SM.SCHEDULE_NOTES.filter(function (n) { return n.studio === s.id; }).map(function (n) {
        return '<div class="sched-row sched-note"><span class="age">' + SM.WEEKDAYS_SHORT[n.day] + '</span><div class="muted">' + esc(n.text) + '</div></div>';
      }).join('');
      return '<article class="sched-studio tone-' + s.color + '">' +
        '<div class="sched-studio-head"><a href="' + SM.studioUrl(s.id) + '"><span class="studio-kind">' + esc(s.kind) + '</span>' +
        '<span class="studio-name">' + esc(s.title) + '</span></a><span class="pill pill-tone">' + esc(s.ageText) + '</span></div>' +
        '<div class="sched-studio-body">' + rows + notes + '</div>' +
        '<div class="sched-prices">' + prices + '</div></article>';
    }).join('');
    return cards ? '<div class="by-studio">' + cards + '</div>' : '<div class="empty">' + emptyText() + '</div>';
  }

  // ---------- «Моя неделя» ----------
  var planner = document.createElement('div');
  planner.className = 'planner';
  planner.setAttribute('role', 'region');
  planner.setAttribute('aria-label', 'Моя неделя');
  document.body.appendChild(planner);

  function renderPlanner(conflicts, overlaps) {
    var show = picked.length > 0;
    planner.classList.toggle('show', show);
    planner.classList.toggle('open', show && plannerOpen);
    document.body.classList.toggle('has-planner', show);
    if (!show) { planner.innerHTML = ''; return; }

    var cost = SM.weekCost(picked);
    var n = picked.length;
    var week = DAYS.map(function (d) {
      var slots = SM.LESSONS.filter(function (l) { return l.day === d && isPicked(l.group); })
        .sort(function (a, b) { return SM.minutes(a.start) - SM.minutes(b.start); })
        .map(function (l) {
          return '<div class="planner-slot tone-' + st(l).color + (conflicts[l.id] ? ' conflict' : '') + '">' + l.start + ' ' + esc(st(l).title) + '</div>';
        }).join('');
      return '<div class="planner-day"><b>' + SM.WEEKDAYS_SHORT[d] + '</b>' + slots + '</div>';
    }).join('');
    var warn = overlaps.length ? '<div class="planner-warn">Пересекаются по времени: ' + overlaps.map(function (o) {
      return SM.WEEKDAYS_SHORT[o.day] + ' ' + o.b.start + ' — «' + esc(st(o.a).title) + '» и «' + esc(st(o.b).title) + '»';
    }).join('; ') + '</div>' : '';
    var costs = cost.lines.map(function (x) {
      // Название абонемента — только если у студии их несколько (мини-сад, рисунок и глина)
      var note = [SM.studioPlans(x.studio).length > 1 ? x.plan.label : '', x.combo ? 'со второй студией' : ''].filter(Boolean).join(', ');
      return '<div><span>«' + esc(x.studio.title) + '» <span class="muted">' + esc(note) + '</span></span>' +
        '<b>' + SM.fmtPrice(x.price) + '</b></div>';
    }).join('') + '<div class="total"><span>Примерно в месяц</span><span>' + SM.fmtPrice(cost.total) + '</span></div>';
    var windowNote = picked.some(function (id) { return SM.group(id).window; })
      ? ' Время у логопеда (30 минут) выбираете вместе с ним.' : '';

    planner.innerHTML = '<div class="container">' +
      '<div class="planner-bar"><div class="info"><b>Моя неделя: ' + n + ' ' + SM.plural(n, 'группа', 'группы', 'групп') + ' · ≈ ' + SM.fmtPrice(cost.total) + '</b>' +
      '<span>' + (overlaps.length ? 'Есть пересечение по времени' : 'Пересечений по времени нет') + '</span></div>' +
      '<button type="button" class="btn btn-orange" data-act="open" aria-expanded="' + plannerOpen + '">' + (plannerOpen ? 'Свернуть' : 'Подробнее') + '</button></div>' +
      '<div class="planner-details"><div class="planner-week">' + week + '</div>' + warn +
      '<div class="planner-costs">' + costs + '</div>' +
      '<p class="muted">Сумма примерная: без семейной скидки и компенсации пропусков по болезни.' + windowNote + '</p>' +
      '<div class="planner-actions"><a class="btn btn-white btn-sm" href="' + SM.trialUrl(SM.group(picked[0]).studio) + '">Записаться на пробное</a>' +
      '<button type="button" class="btn btn-sm btn-soft" data-act="clear">Очистить</button></div>' +
      '</div></div>';
  }

  planner.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'open') plannerOpen = !plannerOpen;
    if (b.dataset.act === 'clear') { picked = []; plannerOpen = false; ui.prefSet('week', ''); }
    render();
  });

  // ---------- Сборка ----------
  function render() {
    var w = weekInfo();
    var overlaps = SM.weekOverlaps(picked);
    var conflicts = {};
    overlaps.forEach(function (o) { conflicts[o.a.id] = true; conflicts[o.b.id] = true; });
    syncControls();
    var groups = SM.GROUPS.filter(function (gr) { return SM.groupMatches(gr, filter); });
    var studios = groups.map(function (gr) { return gr.studio; }).filter(function (id, i, a) { return a.indexOf(id) === i; });
    $('sched-summary').textContent = (filter.age !== null ? 'Для ребёнка ' + SM.yearsText(filter.age) + ': ' : 'Все группы: ') +
      groups.length + ' ' + SM.plural(groups.length, 'группа', 'группы', 'групп') + ' в ' +
      studios.length + ' ' + SM.plural(studios.length, 'студии', 'студиях', 'студиях') + '.';
    $('sched').innerHTML = view === 'days' ? renderDays(w, conflicts) : renderStudios(w);
    renderPlanner(conflicts, overlaps);
  }

  $('age-chips').addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    ui.prefSet('age', chip.dataset.age);
    filter.age = chip.dataset.age === '' ? null : +chip.dataset.age;
    render();
  });
  $('studio-select').addEventListener('change', function () {
    filter.studio = this.value || null;
    render();
  });
  $('view-switch').addEventListener('click', function (e) {
    var b = e.target.closest('[data-view]');
    if (!b) return;
    view = b.dataset.view;
    ui.prefSet('sched-view', view);
    render();
  });
  $('sched').addEventListener('click', function (e) {
    var tab = e.target.closest('.day-tab');
    if (tab) { day = +tab.dataset.day; render(); return; }
    var t = e.target.closest('.plan-toggle');
    if (!t) return;
    var id = t.dataset.group;
    picked = isPicked(id) ? picked.filter(function (x) { return x !== id; }) : picked.concat(id);
    ui.prefSet('week', picked.join(','));
    render();
    var again = $('sched').querySelector('.plan-toggle[data-group="' + id + '"]');
    if (again) again.focus();
    ui.toast(isPicked(id) ? 'Добавлено в «Мою неделю»' : 'Убрано из «Моей недели»');
  });

  $('terms-list').innerHTML = SM.TERMS.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');

  render();
  // На телефоне вкладки возраста прокручиваются вбок — показать выбранную
  var pressed = $('age-chips').querySelector('[aria-pressed="true"]');
  if (filter.age !== null && pressed) $('age-chips').scrollLeft = pressed.offsetLeft - $('age-chips').offsetLeft - 40;
  // «Идёт сейчас» и «сегодня» проверяются раз в минуту; страница перерисовывается, только если они изменились
  function nowKey() {
    var now = new Date();
    return SM.weekdayIndex(now) + ':' + SM.LESSONS.filter(function (l) { return SM.lessonIsNow(l, now); }).map(function (l) { return l.id; }).join(',');
  }
  var lastKey = nowKey();
  setInterval(function () {
    var key = nowKey();
    if (key !== lastKey) { lastKey = key; render(); }
  }, 60000);
})();
