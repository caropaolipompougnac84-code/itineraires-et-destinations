(function(){
  var d=document, root=d.documentElement; root.classList.add('js');
  var PFX=d.body.getAttribute('data-pfx')||'edp', MKEY=PFX+'-mode';
  function setH(){var h=d.querySelector('.site-header');if(h)root.style.setProperty('--header-h',h.getBoundingClientRect().height+'px');
    var t=d.querySelector('.stp-tabs');if(t)root.style.setProperty('--tabs-h',t.getBoundingClientRect().height+'px');}
  setH();window.addEventListener('resize',setH);window.addEventListener('load',setH);
  var tabs=[].slice.call(d.querySelectorAll('.tab')), panels=[].slice.call(d.querySelectorAll('.panel'));
  var FIRST=panels[0].id;
  function revealImgs(el){if(!el)return;[].forEach.call(el.querySelectorAll('img[loading="lazy"]'),function(im){im.loading='eager';var s=im.getAttribute('src');if(s)im.src=s;});}
  function show(id){
    if(!d.getElementById(id)||!d.getElementById(id).classList.contains('panel')) id=FIRST;
    if(d.body.classList.contains('mode-eleve')){var el=d.getElementById(id);if(el&&el.classList.contains('prof-only')) id=FIRST;}
    panels.forEach(function(p){p.classList.toggle('on',p.id===id);});
    d.body.classList.toggle('tab-presentation',id==='presentation');
    tabs.forEach(function(t){var on=t.getAttribute('data-tab')===id;t.classList.toggle('on',on);var a=t.querySelector('a');a.setAttribute('aria-current',on?'page':'false');
      if(on){var r=t.parentNode;r.scrollLeft=t.offsetLeft-r.clientWidth/2+t.offsetWidth/2;}});
    revealImgs(d.getElementById(id));
  }
  function current(){var h=(location.hash||'#'+FIRST).slice(1);var el=d.getElementById(h);
    if(el&&!el.classList.contains('panel')){var p=el.closest('.panel');if(p){show(p.id);if(el.classList.contains('sub'))openSub(el);el.scrollIntoView();return;}}
    show(h);}
  tabs.forEach(function(t){t.querySelector('a').addEventListener('click',function(e){e.preventDefault();var id=t.getAttribute('data-tab');history.pushState(null,'','#'+id);show(id);
    var top=d.querySelector('.stp-tabs').getBoundingClientRect().top+window.scrollY-(parseFloat(getComputedStyle(root).getPropertyValue('--header-h'))||0);
    if(window.scrollY>top)window.scrollTo(0,top);});});
  window.addEventListener('popstate',current);window.addEventListener('hashchange',function(){current();top0();});
  function scopeOf(el){var q=el.parentElement;return (q&&q.closest('.subscope'))||el.closest('.panel');}
  function selectSub(s){var p=scopeOf(s);var which=s.getAttribute('data-sub');
    [].forEach.call(p.querySelectorAll('.subtab'),function(o){if(scopeOf(o)!==p)return;var on=o===s;o.classList.toggle('on',on);o.setAttribute('aria-selected',on?'true':'false');});
    [].forEach.call(p.querySelectorAll('.sub'),function(o){if(scopeOf(o)!==p)return;o.hidden=!o.classList.contains('sub-'+which);});}
  function openSub(el){var sc=scopeOf(el);if(!sc)return;var cls=[].filter.call(el.classList,function(c){return c.indexOf('sub-')===0;})[0];if(!cls)return;
    var t=[].filter.call(sc.querySelectorAll('.subtab[data-sub="'+cls.slice(4)+'"]'),function(o){return scopeOf(o)===sc;})[0];if(t)selectSub(t);}
  function setPalier(box,k){
    [].forEach.call(box.querySelectorAll('.palier-btn'),function(b){var on=b.getAttribute('data-palier')===String(k);b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');});
    [].forEach.call(box.querySelectorAll('.palier'),function(s){s.hidden=!(k===0||s.getAttribute('data-p')===String(k));});}
  [].forEach.call(d.querySelectorAll('.sub-langue'),function(b){setPalier(b,1);});
  d.addEventListener('click',function(e){
    var b=e.target.closest('.btn-corr');
    if(b){var box=d.getElementById(b.getAttribute('aria-controls'));var open=b.getAttribute('aria-expanded')==='true';
      box.hidden=open;b.setAttribute('aria-expanded',open?'false':'true');b.textContent=(open?'Afficher':'Cacher')+(b.getAttribute('data-l')||'');return;}
    var m=e.target.closest('.mode-btn[data-mode]'); if(m){setMode(m.getAttribute('data-mode'));return;}
    var s=e.target.closest('.subtab'); if(s){selectSub(s);return;}
    var pb=e.target.closest('.palier-btn'); if(pb){setPalier(pb.closest('.sub'),parseInt(pb.getAttribute('data-palier'),10));return;}
    var f=e.target.closest('.flash'); if(f){f.setAttribute('aria-pressed',f.getAttribute('aria-pressed')==='true'?'false':'true');return;}
    var pr=e.target.closest('.btn-print'); if(pr){window.print();return;}
    var t=e.target.closest('.pill-time'); if(t){var n=parseInt(t.getAttribute('data-min'),10);if(n)startTimer(n*60);return;}
    var df=e.target.closest('.dys-font'); if(df){setFont(df.getAttribute('data-font'));return;}
  });
  function setMode(mode){if(mode!=='prof')mode='eleve';d.body.classList.toggle('mode-eleve',mode==='eleve');d.body.classList.toggle('mode-prof',mode!=='eleve');
    [].forEach.call(d.querySelectorAll('.mode-btn[data-mode]'),function(b){b.setAttribute('aria-pressed',b.getAttribute('data-mode')===mode?'true':'false');});
    if(mode==='eleve'){[].forEach.call(d.querySelectorAll('.subtab.on.prof-only'),function(on){var sc=scopeOf(on);var el=[].filter.call(sc.querySelectorAll('.subtab[data-sub="eleve"]'),function(o){return scopeOf(o)===sc;})[0];if(el)selectSub(el);});
      var h=(location.hash||'#'+FIRST).slice(1);var pel=d.getElementById(h);if(pel&&pel.classList.contains('prof-only')){history.replaceState(null,'','#'+FIRST);show(FIRST);}}
    try{localStorage.setItem(MKEY,mode);}catch(x){}}
  var saved='eleve';try{saved=localStorage.getItem(MKEY)||'eleve';}catch(x){}
  setMode(saved);
  var FONTS={arial:'Arial, Helvetica, sans-serif',opendyslexic:'"OpenDyslexic", Arial, sans-serif'};
  function setFont(k){if(!FONTS[k])k='arial';root.style.setProperty('--dys-font',FONTS[k]);
    [].forEach.call(d.querySelectorAll('.dys-font'),function(b){b.setAttribute('aria-pressed',b.getAttribute('data-font')===k?'true':'false');});
    try{localStorage.setItem(PFX+'-dys-font',k);}catch(x){}}
  var sf='arial';try{sf=localStorage.getItem(PFX+'-dys-font')||'arial';}catch(x){}setFont(sf);
  if(!location.hash)history.replaceState(null,'','#'+FIRST);
  if('scrollRestoration' in history)history.scrollRestoration='manual';
  current();
  function top0(){var h=(location.hash||'').slice(1);var el=d.getElementById(h);if(!el||el.classList.contains('panel'))window.scrollTo(0,0);}
  top0();window.addEventListener('load',function(){setTimeout(top0,0);});
  var tm=d.getElementById('timer'),tt=d.getElementById('timer-t'),left=0,iv=null,paused=false;
  function fmt(s){var m=Math.floor(s/60),r=s%60;return (m<10?'0':'')+m+':'+(r<10?'0':'')+r;}
  function tick(){if(paused)return;left--;tt.textContent=fmt(Math.max(left,0));if(left<=0){clearInterval(iv);tm.classList.add('done');}}
  function startTimer(s){clearInterval(iv);left=s;paused=false;tm.classList.remove('done');tt.textContent=fmt(left);tm.hidden=false;d.getElementById('timer-pause').textContent='Pause';iv=setInterval(tick,1000);}
  d.getElementById('timer-pause').addEventListener('click',function(){paused=!paused;this.textContent=paused?'Reprendre':'Pause';});
  d.getElementById('timer-stop').addEventListener('click',function(){clearInterval(iv);tm.hidden=true;});
})();
