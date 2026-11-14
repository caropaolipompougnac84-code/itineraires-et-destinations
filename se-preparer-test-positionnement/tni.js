(function () {
  var list = document.getElementById('tablist');
  if (!list) return;
  document.documentElement.classList.add('js-tabs');
  function setHeaderH() {
    var h = document.querySelector('.site-header');
    if (h) document.documentElement.style.setProperty('--header-h', h.getBoundingClientRect().height + 'px');
  }
  setHeaderH();
  window.addEventListener('resize', setHeaderH);
  var links = [].slice.call(list.querySelectorAll('a'));
  var panels = [].slice.call(document.querySelectorAll('section.panel'));
  var subList = document.getElementById('subtablist');
  var subLinks = subList ? [].slice.call(subList.querySelectorAll('a')) : [];
  var subpanels = [].slice.call(document.querySelectorAll('.subpanel'));
  var first = 'accueil';
  function showSub(id) {
    if (!document.getElementById(id)) id = 'ecrit';
    subpanels.forEach(function (p) {
      p.classList.toggle('is-active', p.id === id);
    });
    subLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.setAttribute('aria-current', on ? 'true' : 'false');
      a.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }
  function show(id) {
    var subIds = { ecrit: 1, oral: 1, langue: 1 };
    if (subIds[id]) {
      show('entraine');
      showSub(id);
      return;
    }
    if (!document.getElementById(id)) id = first;
    panels.forEach(function (p) {
      var on = p.id === id;
      p.classList.toggle('is-active', on);
      if (on) p.removeAttribute('hidden');
      else p.setAttribute('hidden', '');
    });
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.setAttribute('aria-current', on ? 'true' : 'false');
      a.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) a.scrollIntoView({ inline: 'center', block: 'nearest' });
    });
    if (id === 'entraine' && !subIds[(location.hash || '').slice(1)]) showSub('ecrit');
  }
  function current() {
    var id = (location.hash || '#' + first).slice(1);
    show(id);
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', current);
  function go(id, push) {
    if (location.hash !== '#' + id) {
      if (push) history.pushState(null, '', '#' + id);
      else history.replaceState(null, '', '#' + id);
    }
    show(id);
    window.scrollTo(0, 0);
  }
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      go(a.getAttribute('href').slice(1), true);
    });
  });
  subLinks.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      go(a.getAttribute('href').slice(1), true);
    });
  });
  window.addEventListener('popstate', current);
  if (!location.hash) history.replaceState(null, '', '#' + first);
  current();
  window.addEventListener('load', function () {
    setHeaderH();
    if ((location.hash || '#' + first) === '#' + first) window.scrollTo(0, 0);
  });
  function bindKeys(el, arr) {
    el.addEventListener('keydown', function (e) {
      var i = arr.indexOf(document.activeElement);
      if (i < 0) return;
      var next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % arr.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + arr.length) % arr.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = arr.length - 1;
      if (next < 0) return;
      e.preventDefault();
      arr[next].focus();
      arr[next].click();
    });
  }
  bindKeys(list, links);
  links.forEach(function (a) { a.setAttribute('role', 'tab'); a.setAttribute('tabindex', '0'); });
  list.setAttribute('role', 'tablist');
  panels.forEach(function (p) { p.setAttribute('role', 'tabpanel'); });
  if (subList) {
    bindKeys(subList, subLinks);
    subLinks.forEach(function (a) { a.setAttribute('role', 'tab'); a.setAttribute('tabindex', '0'); });
    subList.setAttribute('role', 'tablist');
    subpanels.forEach(function (p) { p.setAttribute('role', 'tabpanel'); });
  }
  document.querySelectorAll('.qcm').forEach(function (box) {
    var btns = [].slice.call(box.querySelectorAll('.choice'));
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      });
    });
  });
  document.querySelectorAll('.vrai tr').forEach(function (row) {
    var btns = [].slice.call(row.querySelectorAll('button'));
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      });
    });
  });
  document.querySelectorAll('.meteo button').forEach(function (b, _, all) {
    b.addEventListener('click', function () {
      all.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    });
  });
  var main = document.getElementById('contenu');
  if (main) main.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) !== '#') return;
    var id = href.slice(1);
    if (!document.getElementById(id)) return;
    e.preventDefault();
    go(id, true);
  });
  var dys = document.getElementById('dysBtn');
  if (dys) dys.addEventListener('click', function () {
    var on = document.body.classList.toggle('dys');
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
})();
