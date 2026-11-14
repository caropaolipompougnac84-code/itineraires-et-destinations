(function(){
  var KEY='dse-dys';
  function apply(on){
    document.body.classList.toggle('dys', !!on);
    var b=document.querySelectorAll('[data-dys-toggle]');
    b.forEach(function(el){ el.setAttribute('aria-pressed', on ? 'true' : 'false'); });
  }
  try{ apply(localStorage.getItem(KEY)==='1'); }catch(e){}
  document.addEventListener('click', function(ev){
    var t=ev.target.closest && ev.target.closest('[data-dys-toggle]');
    if(!t) return;
    var on=!document.body.classList.contains('dys');
    apply(on);
    try{ localStorage.setItem(KEY, on?'1':'0'); }catch(e){}
  });
})();

(function(){
  var list = document.getElementById('lesson-tablist');
  if (!list) return;
  document.documentElement.classList.add('js-tabs');
  function setBarH(){
    var bar = document.querySelector('.seq-bar');
    if (bar) document.documentElement.style.setProperty('--seq-bar-h', bar.getBoundingClientRect().height + 'px');
  }
  setBarH();
  window.addEventListener('resize', setBarH);
  var links = [].slice.call(list.querySelectorAll('a[role="tab"], a'));
  var panels = [].slice.call(document.querySelectorAll('section.panel'));
  var first = 'eleves';
  function show(id){
    if (!document.getElementById(id)) id = first;
    panels.forEach(function(p){
      var on = p.id === id;
      p.classList.toggle('is-active', on);
      if (on) p.removeAttribute('hidden');
      else p.setAttribute('hidden', '');
    });
    links.forEach(function(a){
      var on = (a.getAttribute('href') || '') === '#' + id;
      a.setAttribute('aria-selected', on ? 'true' : 'false');
      a.setAttribute('aria-current', on ? 'true' : 'false');
      a.setAttribute('tabindex', on ? '0' : '-1');
      if (on) {
        var row = list;
        var left = a.offsetLeft - (row.clientWidth - a.offsetWidth) / 2;
        row.scrollLeft = Math.max(0, left);
      }
    });
  }
  function current(){
    show((location.hash || '#' + first).slice(1));
  }
  function go(id, push){
    if (location.hash !== '#' + id){
      if (push) history.pushState(null, '', '#' + id);
      else history.replaceState(null, '', '#' + id);
    }
    show(id);
  }
  links.forEach(function(a){
    a.setAttribute('role', 'tab');
    a.addEventListener('click', function(e){
      e.preventDefault();
      go(a.getAttribute('href').slice(1), true);
    });
  });
  list.setAttribute('role', 'tablist');
  panels.forEach(function(p){ p.setAttribute('role', 'tabpanel'); });
  window.addEventListener('hashchange', current);
  window.addEventListener('popstate', current);
  if (!location.hash) history.replaceState(null, '', '#' + first);
  current();
  window.scrollTo(0, 0);
  window.addEventListener('load', setBarH);
  list.addEventListener('keydown', function(e){
    var i = links.indexOf(document.activeElement);
    if (i < 0) return;
    var next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % links.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + links.length) % links.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = links.length - 1;
    if (next < 0) return;
    e.preventDefault();
    links[next].focus();
    links[next].click();
  });
})();

(function(){
  var box = document.querySelector('.qcm');
  if (!box) return;
  box.addEventListener('click', function(ev){
    var b = ev.target.closest('button[data-ok]');
    if (!b) return;
    var item = b.closest('.item');
    if (!item || item.classList.contains('done')) return;
    item.classList.add('done');
    var ok = b.getAttribute('data-ok') === '1';
    b.classList.add(ok ? 'ok' : 'ko');
    if (!ok){
      var good = item.querySelector('button[data-ok="1"]');
      if (good) good.classList.add('ok');
    }
    var fb = item.querySelector('.feedback');
    if (fb) fb.hidden = false;
  });
})();
