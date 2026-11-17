(function(){
  var d=document, root=d.documentElement; root.classList.add('js');
  function setH(){var h=d.querySelector('.site-header');if(h)root.style.setProperty('--header-h',h.getBoundingClientRect().height+'px');
    var t=d.querySelector('.stp-tabs');if(t)root.style.setProperty('--tabs-h',t.getBoundingClientRect().height+'px');}
  setH();window.addEventListener('resize',setH);window.addEventListener('load',setH);
  var tabs=[].slice.call(d.querySelectorAll('.tab')), panels=[].slice.call(d.querySelectorAll('.panel'));
  var FIRST=panels[0].id;
  /* Les images des onglets cachés ne se chargent pas toujours dans Chrome : on les force à l'ouverture. */
  function revealImgs(el){if(!el)return;[].forEach.call(el.querySelectorAll('img[loading="lazy"]'),function(im){im.loading='eager';var s=im.getAttribute('src');if(s)im.src=s;});}
  function show(id){
    if(!d.getElementById(id)||!d.getElementById(id).classList.contains('panel')) id=FIRST;
    panels.forEach(function(p){p.classList.toggle('on',p.id===id);});
    revealImgs(d.getElementById(id));
    d.body.classList.toggle('tab-presentation',id==='presentation');
    tabs.forEach(function(t){var on=t.getAttribute('data-tab')===id;t.classList.toggle('on',on);var a=t.querySelector('a');a.setAttribute('aria-current',on?'page':'false');
      if(on){var r=t.parentNode;r.scrollLeft=t.offsetLeft-r.clientWidth/2+t.offsetWidth/2;}});
  }
  function current(){var h=(location.hash||'#'+FIRST).slice(1);var el=d.getElementById(h);
    if(el&&!el.classList.contains('panel')){var p=el.closest('.panel');if(p){show(p.id);el.scrollIntoView();return;}}
    show(h);}
  function goTop(){var bar=d.querySelector('.stp-tabs');var top=bar.getBoundingClientRect().top+window.scrollY-(parseFloat(getComputedStyle(root).getPropertyValue('--header-h'))||0);
    if(window.scrollY>top)window.scrollTo(0,top);}
  tabs.forEach(function(t){t.querySelector('a').addEventListener('click',function(e){e.preventDefault();var id=t.getAttribute('data-tab');history.pushState(null,'','#'+id);show(id);goTop();});});
  d.addEventListener('click',function(e){
    var c=e.target.closest('a.carte[href^="#"]');
    if(c){e.preventDefault();var id=c.getAttribute('href').slice(1);history.pushState(null,'','#'+id);show(id);goTop();return;}
    var pr=e.target.closest('.btn-print'); if(pr){window.print();return;}
  });
  window.addEventListener('popstate',current);window.addEventListener('hashchange',current);
  if(!location.hash)history.replaceState(null,'','#'+FIRST);
  if('scrollRestoration' in history)history.scrollRestoration='manual';
  current();
  window.addEventListener('load',function(){var h=(location.hash||'').slice(1);var el=d.getElementById(h);if(!el||el.classList.contains('panel'))setTimeout(function(){window.scrollTo(0,0);},0);});
})();
