/* =========================================================
   foxroute.ru — логика сайта
   ---------------------------------------------------------
   Форма заявки: проверка полей и отправка
   ========================================================= */

(function () {

  /* ---------- Форма заявки ----------
     Оставьте ENDPOINT пустым — заявка откроется в почтовом клиенте на support@foxroute.ru.
     Либо впишите URL своего бэкенда / Formspree / вебхука Telegram-бота — тогда уйдёт POST'ом (JSON). */

  var ENDPOINT = '';
  var MAILTO   = 'support@foxroute.ru';

  var form    = document.getElementById('leadForm');
  var success = document.getElementById('formSuccess');

  function setError(el, on) { el.classList.toggle('error', on); }
  function validPhone(v) { return (v.match(/\d/g) || []).length >= 6; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name    = document.getElementById('name');
    var phone   = document.getElementById('phone');
    var service = form.querySelector('input[name="service"]:checked');
    var consent = document.getElementById('consent');
    var ok = true;

    if (!name.value.trim())        { ok = false; } setError(name.closest('.field'), !name.value.trim());
    if (!validPhone(phone.value))  { ok = false; } setError(phone.closest('.field'), !validPhone(phone.value));
    if (!service)                  { ok = false; } setError(form.querySelector('.choice'), !service);
    if (!consent.checked)          { ok = false; } setError(document.getElementById('consentWrap'), !consent.checked);

    if (!ok) {
      var first = form.querySelector('.error');
      var input = first && first.querySelector('input');
      if (input) input.focus();
      return;
    }

    var data = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      address: document.getElementById('address').value.trim(),
      service: service.value,
      comment: document.getElementById('comment').value.trim(),
      source: 'foxroute.site',
      ts: new Date().toISOString()
    };

    function done() {
      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ block: 'center' });
    }

    if (ENDPOINT) {
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw 0; done(); })
        .catch(function () {
          alert('Заявка не отправилась. Позвоните нам или напишите в Telegram @Fox_Route.');
        });
    } else {
      var body =
        'Заявка на подключение FoxRoute\r\n\r\n' +
        'Имя/компания: ' + data.name + '\r\n' +
        'Телефон: '      + data.phone + '\r\n' +
        'Адрес: '        + (data.address || '—') + '\r\n' +
        'Услуга: '       + data.service + '\r\n' +
        'Комментарий: '  + (data.comment || '—');
      window.location.href = 'mailto:' + MAILTO +
        '?subject=' + encodeURIComponent('Заявка на подключение — ' + data.name) +
        '&body=' + encodeURIComponent(body);
      done();
    }
  });

  document.getElementById('resetForm').addEventListener('click', function () {
    form.reset();
    form.querySelectorAll('.error').forEach(function (f) { f.classList.remove('error'); });
    success.hidden = true;
    form.hidden = false;
    document.getElementById('name').focus();
  });


})();
