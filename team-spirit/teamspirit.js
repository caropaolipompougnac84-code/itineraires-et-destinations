(function(){
  var d=document, root=d.documentElement; root.classList.add('js');
  var HOME='introduction';
  var KEY='team-spirit-tabs-closed', MKEY='team-spirit-mode';
  function setHeaderH(){var h=d.querySelector('.site-header');if(h)root.style.setProperty('--header-h',h.getBoundingClientRect().height+'px');}
  setHeaderH();window.addEventListener('resize',setHeaderH);window.addEventListener('load',setHeaderH);
  var tabs=[].slice.call(d.querySelectorAll('.tab')), panels=[].slice.call(d.querySelectorAll('.panel'));
  function closed(){try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){return [];}}
  function saveClosed(a){try{localStorage.setItem(KEY,JSON.stringify(a));}catch(e){}}
  function applyClosed(){var c=closed();tabs.forEach(function(t){var id=t.getAttribute('data-tab');t.classList.toggle('closed',c.indexOf(id)>=0);});
    [].forEach.call(d.querySelectorAll('[data-keep]'),function(cb){cb.checked=c.indexOf(cb.getAttribute('data-keep'))<0;});}
  function show(id){
    if(!d.getElementById(id)||closed().indexOf(id)>=0) id=HOME;
    panels.forEach(function(p){p.classList.toggle('on',p.id===id);});
    tabs.forEach(function(t){var on=t.getAttribute('data-tab')===id;t.classList.toggle('on',on);var a=t.querySelector('a');a.setAttribute('aria-current',on?'page':'false');if(on){var r=t.parentNode;r.scrollLeft=t.offsetLeft-r.clientWidth/2+t.offsetWidth/2;}});
  }
  function current(){var h=(location.hash||'#'+HOME).slice(1);var el=d.getElementById(h);
    if(el&&!el.classList.contains('panel')){var p=el.closest('.panel');if(p){show(p.id);el.scrollIntoView();return;}}
    show(h);window.scrollTo(0,0);}
  tabs.forEach(function(t){t.querySelector('a').addEventListener('click',function(e){e.preventDefault();var id=t.getAttribute('data-tab');history.pushState(null,'','#'+id);show(id);window.scrollTo(0,0);});});
  window.addEventListener('popstate',current);window.addEventListener('hashchange',current);
  d.addEventListener('click',function(e){
    var x=e.target.closest('.tab-x');
    if(x){var id=x.getAttribute('data-close');var c=closed();if(c.indexOf(id)<0)c.push(id);saveClosed(c);applyClosed();
      if(location.hash==='#'+id){history.replaceState(null,'','#'+HOME);show(HOME);}return;}
    var b=e.target.closest('.btn-corr');
    if(b){var box=d.getElementById(b.getAttribute('aria-controls'));var open=b.getAttribute('aria-expanded')==='true';
      box.hidden=open;b.setAttribute('aria-expanded',open?'false':'true');b.textContent=open?'Show the answer key':'Hide the answer key';return;}
    var m=e.target.closest('.mode-btn[data-mode]');
    if(m){setMode(m.getAttribute('data-mode'));return;}
    var s=e.target.closest('.subtab');
    if(s){var p=s.closest('.panel');var which=s.getAttribute('data-sub');
      [].forEach.call(p.querySelectorAll('.subtab'),function(o){var on=o===s;o.classList.toggle('on',on);o.setAttribute('aria-selected',on?'true':'false');});
      [].forEach.call(p.querySelectorAll('.sub'),function(o){o.hidden=!o.classList.contains('sub-'+which);});return;}
    var pr=e.target.closest('.btn-print');
    if(pr){d.body.classList.add('print-eleve');window.print();setTimeout(function(){d.body.classList.remove('print-eleve');},500);return;}
    var t=e.target.closest('.pill-time');
    if(t){var n=parseInt(t.getAttribute('data-min'),10);if(n)startTimer(n*60);return;}
  });
  var mb=d.getElementById('manage-btn'), mp=d.getElementById('tab-manage');
  if(mb)mb.addEventListener('click',function(){var o=mp.hidden;mp.hidden=!o;mb.setAttribute('aria-expanded',o?'true':'false');});
  [].forEach.call(d.querySelectorAll('[data-keep]'),function(cb){cb.addEventListener('change',function(){var id=cb.getAttribute('data-keep');var c=closed().filter(function(v){return v!==id;});if(!cb.checked)c.push(id);saveClosed(c);applyClosed();});});
  var rs=d.getElementById('tabs-reset');if(rs)rs.addEventListener('click',function(){saveClosed([]);applyClosed();});
  function setMode(mode){d.body.classList.toggle('mode-eleve',mode==='eleve');d.body.classList.toggle('mode-prof',mode!=='eleve');
    [].forEach.call(d.querySelectorAll('.mode-btn[data-mode]'),function(b){b.setAttribute('aria-pressed',b.getAttribute('data-mode')===mode?'true':'false');});
    try{localStorage.setItem(MKEY,mode);}catch(e){}}
  var saved='prof';try{saved=localStorage.getItem(MKEY)||'prof';}catch(e){}
  setMode(saved);applyClosed();
  if(!location.hash)history.replaceState(null,'','#'+HOME);
  current();
  window.addEventListener('load',function(){var h=(location.hash||'#'+HOME).slice(1);var el=d.getElementById(h);if(!el||el.classList.contains('panel'))setTimeout(function(){window.scrollTo(0,0);},0);});
  /* minuteur */
  var tm=d.getElementById('timer'),tt=d.getElementById('timer-t'),left=0,iv=null,paused=false;
  function fmt(s){var m=Math.floor(s/60),r=s%60;return (m<10?'0':'')+m+':'+(r<10?'0':'')+r;}
  function tick(){if(paused)return;left--;tt.textContent=fmt(Math.max(left,0));if(left<=0){clearInterval(iv);tm.classList.add('done');}}
  function startTimer(s){clearInterval(iv);left=s;paused=false;tm.classList.remove('done');tt.textContent=fmt(left);tm.hidden=false;d.getElementById('timer-pause').textContent='Pause';iv=setInterval(tick,1000);}
  d.getElementById('timer-pause').addEventListener('click',function(){paused=!paused;this.textContent=paused?'Resume':'Pause';});
  d.getElementById('timer-stop').addEventListener('click',function(){clearInterval(iv);tm.hidden=true;});
})();
