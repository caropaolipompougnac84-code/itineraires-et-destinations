(function(){
  var d=document, root=d.documentElement; root.classList.add('js');
  var PFX=d.body.getAttribute('data-pfx')||'verbes-analyse';
  function setH(){var h=d.querySelector('.site-header');if(h)root.style.setProperty('--header-h',h.getBoundingClientRect().height+'px');
    var t=d.querySelector('.stp-tabs');if(t)root.style.setProperty('--tabs-h',t.getBoundingClientRect().height+'px');}
  setH();window.addEventListener('resize',setH);window.addEventListener('load',setH);
  var tabs=[].slice.call(d.querySelectorAll('.tab')), panels=[].slice.call(d.querySelectorAll('.panel'));
  var FIRST=panels[0].id;
  function revealImgs(el){if(!el)return;[].forEach.call(el.querySelectorAll('img[loading="lazy"]'),function(im){im.loading='eager';var s=im.getAttribute('src');if(s)im.src=s;});}
  function show(id){
    if(!d.getElementById(id)||!d.getElementById(id).classList.contains('panel')) id=FIRST;
    if(d.body.classList.contains('mode-eleve')||d.body.classList.contains('mode-dys')){
      var el=d.getElementById(id);if(el&&el.classList.contains('prof-only')&&!d.body.classList.contains('mode-absent')) id=FIRST;
    }
    panels.forEach(function(p){p.classList.toggle('on',p.id===id);});
    revealImgs(d.getElementById(id));
    d.body.classList.toggle('tab-presentation',id==='presentation');
    tabs.forEach(function(t){var on=t.getAttribute('data-tab')===id;t.classList.toggle('on',on);var a=t.querySelector('a');if(a)a.setAttribute('aria-current',on?'page':'false');
      if(on){var r=t.parentNode;r.scrollLeft=t.offsetLeft-r.clientWidth/2+t.offsetWidth/2;}});
  }
  function current(){var h=(location.hash||'#'+FIRST).slice(1);var el=d.getElementById(h);
    if(el&&!el.classList.contains('panel')){var p=el.closest('.panel');if(p){show(p.id);el.scrollIntoView();return;}}
    show(h);}
  function goTop(){var bar=d.querySelector('.stp-tabs');if(!bar)return;var top=bar.getBoundingClientRect().top+window.scrollY-(parseFloat(getComputedStyle(root).getPropertyValue('--header-h'))||0);
    if(window.scrollY>top)window.scrollTo(0,top);}
  tabs.forEach(function(t){var a=t.querySelector('a');if(!a)return;a.addEventListener('click',function(e){e.preventDefault();var id=t.getAttribute('data-tab');history.pushState(null,'','#'+id);show(id);goTop();});});
  function setAnswers(open){
    var isProf=d.body.classList.contains('mode-prof');
    [].forEach.call(d.querySelectorAll('.corrige'),function(box){
      if(box.closest('.prof-only')&&!isProf) return;
      box.hidden=!open;
    });
    [].forEach.call(d.querySelectorAll('.btn-corr'),function(b){
      var box=d.getElementById(b.getAttribute('aria-controls'));
      if(box&&box.closest('.prof-only')&&!isProf) return;
      b.setAttribute('aria-expanded',open?'true':'false');
      var lab=b.getAttribute('data-l')||' les réponses';
      b.textContent=(open?'Cacher':'Afficher')+lab;
    });
    [].forEach.call(d.querySelectorAll('[data-act="reponses"]'),function(b){
      b.setAttribute('aria-pressed',open?'true':'false');
    });
  }
  function setMode(mode){
    if(['eleve','prof','dys','absent'].indexOf(mode)<0) mode='eleve';
    d.body.classList.toggle('mode-eleve',mode==='eleve');
    d.body.classList.toggle('mode-prof',mode==='prof');
    d.body.classList.toggle('mode-dys',mode==='dys');
    d.body.classList.toggle('mode-absent',mode==='absent');
    if(mode!=='dys') d.body.classList.remove('dys-opendys');
    else if(!d.body.getAttribute('data-dys-font')||d.body.getAttribute('data-dys-font')==='opendyslexic'){
      d.body.classList.add('dys-opendys');
    }
    [].forEach.call(d.querySelectorAll('.mode-btn[data-mode]'),function(b){b.setAttribute('aria-pressed',b.getAttribute('data-mode')===mode?'true':'false');});
    if(mode!=='prof'&&mode!=='absent'){
      [].forEach.call(d.querySelectorAll('.prof-only .corrige, .corrige-devoir'),function(c){c.hidden=true;});
      var h=(location.hash||'#'+FIRST).slice(1);var pel=d.getElementById(h);
      if(pel&&pel.classList.contains('prof-only')){history.replaceState(null,'','#'+FIRST);show(FIRST);}
    }
    setH();
  }
  function setDysFont(k){
    if(k!=='opendyslexic'&&k!=='arial') k='opendyslexic';
    d.body.setAttribute('data-dys-font',k);
    d.body.classList.toggle('dys-opendys',k==='opendyslexic'&&d.body.classList.contains('mode-dys'));
    [].forEach.call(d.querySelectorAll('.dys-font'),function(b){b.setAttribute('aria-pressed',b.getAttribute('data-font')===k?'true':'false');});
  }
  d.addEventListener('click',function(e){
    var c=e.target.closest('a.carte[href^="#"]');
    if(c){e.preventDefault();var id=c.getAttribute('href').slice(1);history.pushState(null,'','#'+id);show(id);goTop();return;}
    var pr=e.target.closest('.btn-print'); if(pr){window.print();return;}
    var m=e.target.closest('.mode-btn[data-mode]'); if(m){setMode(m.getAttribute('data-mode'));return;}
    var df=e.target.closest('.dys-font'); if(df){setDysFont(df.getAttribute('data-font'));return;}
    var ar=e.target.closest('[data-act="reponses"]');
    if(ar){var on=ar.getAttribute('data-on')==='true';setAnswers(on);return;}
    var b=e.target.closest('.btn-corr');
    if(b){
      var box=d.getElementById(b.getAttribute('aria-controls'));
      if(!box)return;
      if(box.closest('.prof-only')&&!d.body.classList.contains('mode-prof')&&!d.body.classList.contains('mode-absent')) return;
      var open=b.getAttribute('aria-expanded')==='true';
      box.hidden=open;
      b.setAttribute('aria-expanded',open?'false':'true');
      var lab=b.getAttribute('data-l')||' les réponses';
      b.textContent=(open?'Afficher':'Cacher')+lab;
      return;
    }
  });
  window.addEventListener('popstate',current);
  window.addEventListener('hashchange',current);
  setMode('eleve');
  setDysFont('opendyslexic');
  setAnswers(false);
  if(!location.hash)history.replaceState(null,'','#'+FIRST);
  if('scrollRestoration' in history)history.scrollRestoration='manual';
  current();
  window.addEventListener('load',function(){var h=(location.hash||'').slice(1);var el=d.getElementById(h);if(!el||el.classList.contains('panel'))setTimeout(function(){window.scrollTo(0,0);},0);});
})();

(function(){
  var d=document;
  function canSeeAnswers(){return d.body.classList.contains('mode-prof')||d.body.classList.contains('mode-absent');}
  d.addEventListener('click',function(e){
    var on=e.target.closest('.paire-rep .rep-on');
    var off=e.target.closest('.paire-rep .rep-off');
    if(on||off){
      if(!canSeeAnswers()) return;
      var box=e.target.closest('.corrige'); if(!box) return;
      box.classList.toggle('ouvert',!!on);
      var bOn=box.querySelector('.rep-on'), bOff=box.querySelector('.rep-off');
      if(bOn)bOn.setAttribute('aria-pressed',box.classList.contains('ouvert')?'true':'false');
      if(bOff)bOff.setAttribute('aria-pressed',box.classList.contains('ouvert')?'false':'true');
      return;
    }
    var v=e.target.closest('.verifier');
    if(!v) return;
    if(!canSeeAnswers()) return;
    var exo=v.closest('.exo'); if(!exo) return;
    var total=0,ok=0;
    [].forEach.call(exo.querySelectorAll('[data-rep]'),function(n){
      var pts=parseFloat(n.getAttribute('data-pts')||'1')||1; total+=pts;
      var expected=(n.getAttribute('data-rep')||'').trim();
      var val=(n.value||'').trim();
      var good=val.toLowerCase()===expected.toLowerCase();
      if(good) ok+=pts;
      n.classList.toggle('bon',good);
      n.classList.toggle('faux',!good);
    });
    var sc=exo.querySelector('.score');
    if(sc) sc.textContent=ok+' / '+total;
  });
})();
