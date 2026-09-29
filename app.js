(function () {
  // часы работы: [открытие, закрытие] в часах, 26 = 02:00 следующего дня. Пн = 0
  var HOURS = [[12, 24], [12, 24], [12, 24], [12, 24], [12, 26], [14, 26], [14, 24]];
  var DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  var root = document.documentElement;

  // --- 18+ ---
  document.getElementById('ageYes').addEventListener('click', function () {
    try { localStorage.setItem('bogema-age', 'yes'); } catch (e) {}
    root.classList.add('age-ok');
  });
  document.getElementById('ageNo').addEventListener('click', function () {
    document.getElementById('ageAsk').hidden = true;
    document.getElementById('ageDeny').hidden = false;
  });

  // --- menu ---
  var body = document.getElementById('menuBody');
  var tabs = document.querySelectorAll('.tab');
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(p) { return p.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'; }
  function render(key) {
    body.className = 'menu__body menu__body--' + key;
    body.innerHTML = window.BOGEMA_MENU[key].map(function (g) {
      return '<section class="mgroup"><h3>' + esc(g.title) + (g.note ? ' <small>' + esc(g.note) + '</small>' : '') + '</h3><ul>' +
        g.items.map(function (it) {
          return '<li><span>' + esc(it[0]) + '</span><i aria-hidden="true"></i><b>' + fmt(it[1]) + '</b></li>';
        }).join('') + '</ul></section>';
    }).join('');
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      t.classList.add('is-active'); t.setAttribute('aria-selected', 'true');
      render(t.dataset.tab);
    });
  });
  render('pizza');

  // --- open status (Moscow time) ---
  function hh(h) { return (h % 24 < 10 ? '0' : '') + (h % 24) + ':00'; }
  var msk = new Date(Date.now() + (new Date().getTimezoneOffset() + 180) * 60000);
  var d = (msk.getDay() + 6) % 7, h = msk.getHours() + msk.getMinutes() / 60;
  var prev = HOURS[(d + 6) % 7], cur = HOURS[d];
  var st = document.getElementById('status'), txt, open = false;
  if (prev[1] > 24 && h < prev[1] - 24) { open = true; txt = 'Открыто до ' + hh(prev[1]); }
  else if (h >= cur[0] && h < cur[1]) { open = true; txt = 'Открыто до ' + hh(cur[1]); }
  else if (h < cur[0]) { txt = 'Откроемся сегодня в ' + hh(cur[0]); }
  else { txt = 'Откроемся завтра в ' + hh(HOURS[(d + 1) % 7][0]); }
  st.textContent = 'Кальян-бар · ' + txt;
  st.classList.add(open ? 'is-open' : 'is-closed');

  document.getElementById('week').innerHTML = DAYS.map(function (name, i) {
    return '<li' + (i === d ? ' class="is-today"' : '') + '><span>' + name + (i === d ? ' · сегодня' : '') + '</span><span>' + hh(HOURS[i][0]) + '–' + hh(HOURS[i][1]) + '</span></li>';
  }).join('');

  // --- header ---
  var top = document.querySelector('.top');
  var onScroll = function () { top.classList.toggle('is-solid', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var o = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', o);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { document.body.classList.remove('nav-open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  // --- reveal ---
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
