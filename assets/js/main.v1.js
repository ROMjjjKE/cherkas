/* ИП Черкас И.И. — меню, разрез потолка, расчёт полотна и света, заявка */
(function () {
  'use strict';

  var WA = 'https://wa.me/375298967521';

  /* ---------- шапка ---------- */
  var head = document.querySelector('.head');
  function onScroll() {
    if (!head) return;
    var solid = head.classList.contains('head--solid');
    head.classList.toggle('is-stuck', window.scrollY > 30 || solid);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- меню ---------- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var closeBtn = document.getElementById('drawer-close');
  var lastFocus = null;

  function focusables() {
    if (!drawer) return [];
    return Array.prototype.slice.call(
      drawer.querySelectorAll('a[href],button:not([disabled]),input,select,textarea')
    ).filter(function (el) { return el.offsetParent !== null; });
  }
  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.hidden = false;
    document.body.classList.add('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    var f = focusables();
    if (f.length) f[0].focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.hidden = true;
    document.body.classList.remove('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (burger) burger.addEventListener('click', function () {
    if (drawer && drawer.hidden) openDrawer(); else closeDrawer();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.addEventListener('click', function (e) { if (e.target === drawer) closeDrawer(); });
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('is-locked');
        if (burger) burger.setAttribute('aria-expanded', 'false');
      });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && !drawer.hidden) closeDrawer();
  });

  /* ---------- появление блоков ---------- */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && rv.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- разрез: полотно + свет ---------- */
  var xs = document.getElementById('xs');
  if (xs) {
    var FIN = {
      matte: { name: 'Матовое полотно', short: 'матовое', text: 'не бликует и не даёт отражений: ровная светлая плоскость, как хорошо покрашенный потолок.', tag: 'без блика' },
      satin: { name: 'Сатин', short: 'сатин', text: 'между матовым и глянцем: мягкий перламутровый отблеск и свет, который как будто остаётся на потолке.', tag: 'мягкий отблеск' },
      gloss: { name: 'Глянец', short: 'глянец', text: 'отражает комнату — потолок кажется выше, а света в комнате больше. Заметнее всего вечером, когда включены лампы.', tag: 'отражение' },
      fabric: { name: 'Тканевое полотно', short: 'тканевое', text: 'без ПВХ: дышит, почти не пахнет, можно перекрашивать. Матовая фактура, похожая на штукатурку.', tag: 'без ПВХ' }
    };
    var LIG = {
      line: { name: 'световая линия', short: 'световая линия', text: 'Световая линия делает свет частью потолка: ровная полоса вместо люстры, без видимых светильников.', tag: 'свет без люстры' },
      spots: { name: 'точечные светильники', short: 'точечные', text: 'Точечные светильники — аккуратные круги в полотне, свет направлен вниз. Количество считаем по площади.', tag: 'свет по зонам' },
      track: { name: 'трек', short: 'трек', text: 'Трек встроен в полотно: светильники двигаются по линии и направляются туда, где нужен свет.', tag: 'светильники двигаются' },
      none: { name: 'без света', short: 'без света', text: 'Только полотно, без встроенного света: остаются существующие люстры и бра.', tag: 'только полотно' }
    };
    var title = document.getElementById('xs-title');
    var desc = document.getElementById('xs-desc');
    var tag1 = document.getElementById('xs-tag1');
    var tag2 = document.getElementById('xs-tag2');

    function paintXs() {
      var f = FIN[xs.dataset.finish] || FIN.matte;
      var l = LIG[xs.dataset.light] || LIG.none;
      if (title) title.innerHTML = f.name + ' + <em>' + l.name + '</em>';
      if (desc) desc.textContent = f.text.charAt(0).toUpperCase() + f.text.slice(1) + ' ' + l.text;
      if (tag1) tag1.textContent = f.tag;
      if (tag2) tag2.textContent = l.tag;
    }
    function bindGroup(attr, key) {
      var btns = Array.prototype.slice.call(document.querySelectorAll('[' + attr + ']'));
      btns.forEach(function (b) {
        b.addEventListener('click', function () {
          btns.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          xs.dataset[key] = b.getAttribute(attr);
          paintXs();
        });
      });
    }
    bindGroup('data-finish-btn', 'finish');
    bindGroup('data-light-btn', 'light');
    paintXs();
  }

  /* ---------- расчёт полотна и света ---------- */
  var len = document.getElementById('len');
  if (len) {
    var wid = document.getElementById('wid');
    var lenOut = document.getElementById('lenOut');
    var widOut = document.getElementById('widOut');
    var oArea = document.getElementById('o-area');
    var oPer = document.getElementById('o-per');
    var oLight = document.getElementById('o-light');
    var send = document.getElementById('calc-send');
    var lightBtns = Array.prototype.slice.call(document.querySelectorAll('[data-cl]'));
    var curLight = 'line';

    function nf(v, d) {
      return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', ',');
    }
    function lightInfo(L, W) {
      var area = L * W;
      var big = Math.max(L, W);
      if (curLight === 'line') {
        var meters = Math.round(big * 0.8 * 10) / 10;
        return { name: 'Световая линия', text: 'около ' + nf(meters, 1) + ' м, одна или две линии по длине комнаты', meters: meters };
      }
      if (curLight === 'spots') {
        var n = Math.max(2, Math.round(area / 3));
        return { name: 'Точечные светильники', text: 'примерно ' + n + ' шт. — из расчёта один светильник на 3 м²', count: n };
      }
      if (curLight === 'track') {
        var rail = Math.round(big * 0.7 * 10) / 10;
        var heads = Math.max(3, Math.round(area / 5));
        return { name: 'Трековая система', text: 'трек около ' + nf(rail, 1) + ' м и ' + heads + ' светильников на нём', rail: rail, heads: heads };
      }
      return { name: 'Без света', text: 'только полотно, свет остаётся на люстрах и бра' };
    }
    var area = 0, per = 0, light = null;

    function paintCalc() {
      var L = parseFloat(len.value), W = parseFloat(wid.value);
      area = Math.round(L * W * 10) / 10;
      per = Math.round(2 * (L + W) * 10) / 10;
      light = lightInfo(L, W);
      lenOut.textContent = nf(L, 1) + ' м';
      widOut.textContent = nf(W, 1) + ' м';
      oArea.textContent = nf(area, 1);
      oPer.textContent = nf(per, 1);
      if (oLight) oLight.innerHTML = '<b>' + light.name + '</b> — ' + light.text + '.';
      if (send) {
        send.href = WA + '?text=' + encodeURIComponent(
          'Расчёт с сайта\nРазмер комнаты: ' + nf(L, 1) + ' × ' + nf(W, 1) + ' м\n' +
          'Полотно: ' + nf(area, 1) + ' м²\nПрофиль по стенам: ' + nf(per, 1) + ' м\n' +
          'Свет: ' + light.name + '\nХочу уточнить стоимость.');
      }
    }
    len.addEventListener('input', paintCalc);
    wid.addEventListener('input', paintCalc);
    lightBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        lightBtns.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        curLight = b.getAttribute('data-cl');
        paintCalc();
      });
    });
    paintCalc();
  }

  /* ---------- заявка ---------- */
  var form = document.getElementById('lead');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (sel) { var el = form.querySelector(sel); return el ? el.value : ''; };
      var name = g('#f-name'), phone = g('#f-phone'), obj = g('#f-obj'), what = g('#f-what'), note = g('#f-note');
      var ok = form.querySelector('.form__ok');
      if (name.trim().length < 2 || phone.replace(/\D/g, '').length < 9) {
        if (ok) { ok.hidden = false; ok.textContent = 'Укажите имя и телефон, чтобы мы могли ответить.'; }
        return;
      }
      var text = 'Заявка на замер\nИмя: ' + name.trim() + '\nТелефон: ' + phone.trim() +
        (obj ? '\nОбъект: ' + obj : '') + (what ? '\nЧто нужно: ' + what : '') +
        (note.trim() ? '\nКомментарий: ' + note.trim() : '');
      var url = WA + '?text=' + encodeURIComponent(text);
      if (ok) {
        ok.hidden = false;
        ok.innerHTML = 'Заявка собрана. Если WhatsApp не открылся, <a href="' + url + '" target="_blank" rel="noopener">нажмите здесь</a>.';
      }
      window.open(url, '_blank', 'noopener');
    });
  }
})();
