/* Страница-заглушка «Это демо-версия»: текст зависит от того, какая кнопка сюда привела (?form=...). */
(function () {
  'use strict';

  var SM = window.SM;
  var C = SM.CENTER;
  var ui = SM.ui;

  var VARIANTS = {
    probnoe: {
      title: 'Запись на пробное занятие',
      lead: 'Это демо-версия сайта: заявка здесь пока не отправляется. Ниже — как запись будет работать, когда сайт заработает по-настоящему.',
      steps: [
        'Родитель выбирает студию или группы в расписании, оставляет контактный телефон и комментарий — когда удобно позвонить, ставит галочку согласия. Возраст и выбранные группы каждого ребёнка подставляются в заявку сами — детей может быть несколько.',
        'Заявка сразу появляется у администратора центра со статусом «Новая».',
        'Администратор перезванивает, отвечает на вопросы, подбирает группу и время пробного занятия.',
        'После пробного занятия администратор заключает с родителем договор — и только тогда открывается личный кабинет родителя.'
      ]
    },
    prazdnik: {
      title: 'Заявка на детский праздник',
      lead: 'Это демо-версия сайта: заявка здесь пока не отправляется. Ниже — как это будет работать.',
      steps: [
        'Родитель указывает желаемую дату, возраст и количество детей, оставляет телефон и ставит галочку согласия.',
        'Заявка попадает к администратору центра.',
        'Администратор связывается, обсуждает программу и подтверждает дату.'
      ]
    },
    kabinet: {
      title: 'Вход в личный кабинет',
      lead: 'В демо-версии вход понарошку: никакие номера и коды не проверяются.',
      steps: [
        'Родитель или педагог входит по номеру телефона — приходит SMS-код.',
        'Можно войти через VK ID, Яндекс ID или Госуслуги.',
        'Каждый видит только своё: родитель — своих детей, педагог — свои группы.'
      ]
    }
  };

  var params = new URLSearchParams(window.location.search);
  var v = VARIANTS[params.get('form')] || VARIANTS.probnoe;
  var studioId = params.get('studio');
  var studio = studioId ? SM.studio(studioId) : null;

  document.getElementById('demo-title').textContent = v.title;
  document.getElementById('demo-lead').textContent = v.lead;
  document.getElementById('demo-steps').innerHTML = v.steps.map(function (s) { return '<li>' + ui.esc(s) + '</li>'; }).join('');
  if (studio) {
    document.getElementById('mock-studio').textContent = studio.kind + ' «' + studio.title + '»';
    document.getElementById('mock-studio').classList.add('filled');
  }
  // Дети, их возраст и группы из «Моей недели» на странице расписания
  var kids = SM.parseKidsParam(params.get('kids'));
  if (kids.length) {
    document.getElementById('mock-studio-label').textContent = kids.length > 1 ? 'Дети и выбранные группы' : 'Выбранные группы';
    document.getElementById('mock-studio').classList.add('filled');
    document.getElementById('mock-studio').innerHTML = kids.map(function (k, i) {
      var who = (kids.length > 1 ? 'Ребёнок ' + (i + 1) : 'Ребёнок') + (k.age !== null ? ', ' + SM.yearsText(k.age) : '');
      return '<b>' + ui.esc(who) + '</b><br>' + k.groups.map(function (id) {
        var g = SM.group(id);
        return ui.esc('«' + SM.studio(g.studio).title + '», ' + ui.groupLabel(g));
      }).join('<br>');
    }).join('<br>');
    // Возраст уже указан у каждого ребёнка
    document.getElementById('mock-age').parentNode.hidden = true;
  }
  document.title = v.title + ' — демо-версия «Сказочный мир»';

  document.getElementById('demo-contacts').innerHTML =
    '<a class="btn btn-blue" href="' + C.phoneMain.href + '">' + ui.icon('phone') + 'Позвонить</a>' +
    '<a class="btn btn-ghost" href="' + C.whatsapp + '" rel="noopener">' + ui.icon('whatsapp') + 'WhatsApp</a>';
})();
