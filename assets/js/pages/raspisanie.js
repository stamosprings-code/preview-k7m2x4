/* Расписание: фильтр по возрасту и студии, вид «по дням» (на телефоне — вкладки дней) и «по студиям»,
   отметки «сегодня» и «идёт сейчас», «Мои дети» — у каждого ребёнка свой возраст и группы, пересечения по времени
   и примерная сумма в месяц (цена за вторую студию, семейная скидка). */
(function () {
  'use strict';

  var SM = window.SM;
  var ui = SM.ui;
  var esc = ui.esc;

  function $(id) { return document.getElementById(id); }

  var DAYS = [0, 1, 2, 3, 4];
  var ages = SM.pickerAges();

  var MAX_KIDS = 4;
  function validAge(a) { return a !== null && a !== '' && ages.indexOf(+a) !== -1 ? +a : null; }

  // Выбор посетителя запоминается в браузере: дети (возраст и группы каждого), выбранный ребёнок, вид.
  // Возраст выбранного ребёнка — общий с подбором на главной (sm-pref-age).
  function loadKids() {
    try {
      var list = JSON.parse(ui.prefGet('kids') || 'null');
      if (Array.isArray(list) && list.length) {
        return list.slice(0, MAX_KIDS).map(function (k) {
          return { age: validAge(k.age), groups: (k.groups || []).filter(function (id) { return SM.group(id); }) };
        });
      }
    } catch (e) { /* испорченная запись — начинаем заново */ }
    return [{ age: validAge(ui.prefGet('age')), groups: [] }];
  }
  var kids = loadKids();
  var active = Math.min(+ui.prefGet('kid') || 0, kids.length - 1);
  // Возраст, выбранный на главной после прошлого визита, относится к выбранному ребёнку
  if (ui.prefGet('age') !== null) kids[active].age = validAge(ui.prefGet('age'));
  var filter = { age: kids[active].age, studio: null };
  var view = ui.prefGet('sched-view') === 'studios' ? 'studios' : 'days';
  var day = null;
  var plannerOpen = false;

  function saveKids() {
    ui.prefSet('kids', JSON.stringify(kids));
    ui.prefSet('kid', String(active));
    ui.prefSet('age', kids[active].age === null ? '' : String(kids[active].age));
  }
  function kidName(i) { return 'Ребёнок ' + (i + 1) + (kids[i].age !== null ? ' · ' + SM.yearsText(kids[i].age) : ''); }

  function g(l) { return SM.group(l.group); }
  function st(l) { return SM.studio(g(l).studio); }
  function isPicked(gid) { return kids[active].groups.indexOf(gid) !== -1; }
  function conflictsOf(overlaps) {
    var c = {};
    overlaps.forEach(function (o) { c[o.a.id] = true; c[o.b.id] = true; });
    return c;
  }

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
      (on ? 'Убрать у ребёнка ' + (active + 1) + ': ' : 'Добавить ребёнку ' + (active + 1) + ': ') + esc(title) + '">' + ui.icon(on ? 'check' : 'plus') + '</button>';
  }
  function groupTitle(gr) { return '«' + SM.studio(gr.studio).title + '», ' + ui.groupLabel(gr); }

  // ---------- Фильтры ----------
  // Панель П1 (выбор Андрея 2026-10-29): возраст и студия — выпадающие списки, вид — большой переключатель
  $('age-select').innerHTML = '<option value="">Любой возраст</option>' + ages.map(function (a) {
    return '<option value="' + a + '">' + SM.yearsText(a) + '</option>';
  }).join('');
  $('studio-select').innerHTML = '<option value="">Все студии</option>' + SM.STUDIOS.map(function (s) {
    return '<option value="' + s.id + '">' + esc(s.title) + '</option>';
  }).join('');
  Array.prototype.forEach.call($('view-switch').querySelectorAll('button'), function (b) {
    b.insertAdjacentHTML('afterbegin', ui.icon(b.dataset.view === 'days' ? 'calendar' : 'star'));
  });

  function syncControls() {
    $('age-select').value = filter.age === null ? '' : String(filter.age);
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

  // ---------- «Мои дети» (панель внизу) ----------
  var planner = document.createElement('div');
  planner.className = 'planner';
  planner.setAttribute('role', 'region');
  planner.setAttribute('aria-label', 'Мои дети: неделя и сумма');
  document.body.appendChild(planner);

  function kidWeek(groups, conflicts) {
    return DAYS.map(function (d) {
      var slots = SM.LESSONS.filter(function (l) { return l.day === d && groups.indexOf(l.group) !== -1; })
        .sort(function (a, b) { return SM.minutes(a.start) - SM.minutes(b.start); })
        .map(function (l) {
          return '<div class="planner-slot tone-' + st(l).color + (conflicts[l.id] ? ' conflict' : '') + '">' + l.start + ' ' + esc(st(l).title) + '</div>';
        }).join('');
      return '<div class="planner-day"><b>' + SM.WEEKDAYS_SHORT[d] + '</b>' + slots + '</div>';
    }).join('');
  }

  function kidBlock(i, cost) {
    var k = kids[i];
    var overlaps = SM.weekOverlaps(k.groups);
    var warn = overlaps.length ? '<div class="planner-warn">Пересекаются по времени: ' + overlaps.map(function (o) {
      return SM.WEEKDAYS_SHORT[o.day] + ' ' + o.b.start + ' — «' + esc(st(o.a).title) + '» и «' + esc(st(o.b).title) + '»';
    }).join('; ') + '</div>' : '';
    var lines = cost.lines.map(function (x) {
      // Название абонемента — только если у студии их несколько (мини-сад, рисунок и глина)
      var note = [SM.studioPlans(x.studio).length > 1 ? x.plan.label : '', x.combo ? 'со второй студией' : ''].filter(Boolean).join(', ');
      return '<div><span>«' + esc(x.studio.title) + '» <span class="muted">' + esc(note) + '</span></span><b>' + SM.fmtPrice(x.price) + '</b></div>';
    }).join('');
    var head = kids.length > 1
      ? '<div class="planner-kid-head"><b>' + esc(kidName(i)) + '</b><button type="button" class="link-btn" data-act="remove" data-kid="' + i + '">Убрать ребёнка</button></div>'
      : '';
    var body = k.groups.length
      ? '<div class="planner-week">' + kidWeek(k.groups, conflictsOf(overlaps)) + '</div>' + warn + '<div class="planner-costs">' + lines + '</div>'
      : '<p class="muted">Групп пока нет: выберите этого ребёнка над расписанием и нажмите «+» у занятий.</p>';
    return '<div class="planner-kid">' + head + body + '</div>';
  }

  function renderPlanner() {
    var withGroups = kids.filter(function (k) { return k.groups.length; });
    var show = withGroups.length > 0;
    planner.classList.toggle('show', show);
    planner.classList.toggle('open', show && plannerOpen);
    document.body.classList.toggle('has-planner', show);
    if (!show) { planner.innerHTML = ''; return; }

    var fam = SM.familyCost(kids.map(function (k) { return k.groups; }));
    var nGroups = withGroups.reduce(function (n, k) { return n + k.groups.length; }, 0);
    var anyOverlap = kids.some(function (k) { return SM.weekOverlaps(k.groups).length; });
    var title = withGroups.length > 1
      ? 'Мои дети: ' + withGroups.length + ' · ' + nGroups + ' ' + SM.plural(nGroups, 'группа', 'группы', 'групп')
      : 'Моя неделя: ' + nGroups + ' ' + SM.plural(nGroups, 'группа', 'группы', 'групп');
    var totals = (fam.pct ? '<div><span>Все дети вместе</span><b>' + SM.fmtPrice(fam.subtotal) + '</b></div>' +
      '<div><span>Семейная скидка ' + fam.pct + '%</span><b>−' + SM.fmtPrice(fam.discount) + '</b></div>' : '') +
      '<div class="total"><span>Примерно в месяц</span><span>' + SM.fmtPrice(fam.total) + '</span></div>';
    var windowNote = kids.some(function (k) { return k.groups.some(function (id) { return SM.group(id).window; }); })
      ? ' Время у логопеда (30 минут) выбираете вместе с ним.' : '';

    planner.innerHTML = '<div class="container">' +
      '<div class="planner-bar"><div class="info"><b>' + title + ' · ≈ ' + SM.fmtPrice(fam.total) + '</b>' +
      '<span>' + (anyOverlap ? 'Есть пересечение по времени' : 'Пересечений по времени нет') + '</span></div>' +
      '<button type="button" class="btn btn-orange" data-act="open" aria-expanded="' + plannerOpen + '">' + (plannerOpen ? 'Свернуть' : 'Подробнее') + '</button></div>' +
      '<div class="planner-details">' +
      kids.map(function (k, i) { return kidBlock(i, fam.kids[i]); }).join('') +
      '<div class="planner-costs planner-family">' + totals + '</div>' +
      '<p class="muted">Сумма примерная: без компенсации пропусков по болезни.' + windowNote + '</p>' +
      '<p class="planner-how">Нажмите «Записаться» и оставьте номер телефона, в комментарии — когда удобно позвонить. Возраст и группы каждого ребёнка попадут в заявку сами. ' +
      'Заявка придёт администратору, он перезвонит и подберёт пробное занятие. После договора всё расписание, переносы и отмены будут в личном кабинете родителя.</p>' +
      '<div class="planner-actions"><a class="btn btn-white btn-sm" href="' + SM.signupUrl(kids) + '">Записаться</a>' +
      '<button type="button" class="btn btn-sm btn-soft" data-act="clear">Очистить всё</button></div>' +
      '</div></div>';
  }

  // ---------- Для какого ребёнка ----------
  function renderKids() {
    $('kids-row').innerHTML = '<span class="lbl">Для кого</span>' + kids.map(function (k, i) {
      var n = k.groups.length;
      return '<button type="button" class="kid-chip" data-kid="' + i + '" aria-pressed="' + (i === active) + '">' + esc(kidName(i)) +
        (n ? ' <span class="kid-count">' + n + '</span>' : '') + '</button>';
    }).join('') +
      (kids.length < MAX_KIDS ? '<button type="button" class="kid-add" data-act="add">' + ui.icon('plus') + 'ещё ребёнок</button>' : '');
  }

  function selectKid(i) {
    active = i;
    filter.age = kids[i].age;
    saveKids();
    render();
  }
  function addKid() {
    kids.push({ age: null, groups: [] });
    selectKid(kids.length - 1);
    ui.toast('Ребёнок ' + kids.length + ': выберите возраст');
    $('age-select').focus();
  }
  function removeKid(i) {
    kids.splice(i, 1);
    if (!kids.length) kids.push({ age: null, groups: [] });
    selectKid(Math.min(active >= i && active > 0 ? active - 1 : active, kids.length - 1));
  }

  $('kids-row').addEventListener('click', function (e) {
    if (e.target.closest('[data-act="add"]')) { addKid(); return; }
    var chip = e.target.closest('[data-kid]');
    if (chip) selectKid(+chip.dataset.kid);
  });
  planner.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'open') plannerOpen = !plannerOpen;
    if (b.dataset.act === 'remove') { removeKid(+b.dataset.kid); return; }
    if (b.dataset.act === 'clear') {
      kids = [{ age: kids[active].age, groups: [] }];
      active = 0;
      plannerOpen = false;
      saveKids();
    }
    render();
  });

  // ---------- Сборка ----------
  function render() {
    var w = weekInfo();
    var conflicts = conflictsOf(SM.weekOverlaps(kids[active].groups));
    syncControls();
    renderKids();
    var groups = SM.GROUPS.filter(function (gr) { return SM.groupMatches(gr, filter); });
    var studios = groups.map(function (gr) { return gr.studio; }).filter(function (id, i, a) { return a.indexOf(id) === i; });
    $('sched-summary').textContent = (filter.age !== null ? 'Для ребёнка ' + SM.yearsText(filter.age) + ': ' : 'Все группы: ') +
      groups.length + ' ' + SM.plural(groups.length, 'группа', 'группы', 'групп') + ' в ' +
      studios.length + ' ' + SM.plural(studios.length, 'студии', 'студиях', 'студиях') + '.';
    $('sched').innerHTML = view === 'days' ? renderDays(w, conflicts) : renderStudios(w);
    renderPlanner();
  }

  $('age-select').addEventListener('change', function () {
    filter.age = validAge(this.value);
    kids[active].age = filter.age;
    saveKids();
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
    var k = kids[active];
    k.groups = isPicked(id) ? k.groups.filter(function (x) { return x !== id; }) : k.groups.concat(id);
    saveKids();
    render();
    var again = $('sched').querySelector('.plan-toggle[data-group="' + id + '"]');
    if (again) again.focus();
    ui.toast((isPicked(id) ? 'Добавлено' : 'Убрано') + (kids.length > 1 ? ': ребёнок ' + (active + 1) : ' в «Моей неделе»'));
  });

  $('terms-list').innerHTML = SM.TERMS.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');

  render();
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
