(function(){
  var d=document, root=d.documentElement; root.classList.add('js');
  var PFX=d.body.getAttribute('data-pfx')||'am';var KEY=PFX+'-tabs-closed', MKEY=PFX+'-mode';
  function setHeaderH(){var h=d.querySelector('.site-header');if(h)root.style.setProperty('--header-h',h.getBoundingClientRect().height+'px');}
  setHeaderH();window.addEventListener('resize',setHeaderH);window.addEventListener('load',setHeaderH);
  var tabs=[].slice.call(d.querySelectorAll('.tab')), panels=[].slice.call(d.querySelectorAll('.panel'));
  function closed(){try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){return [];}}
  function saveClosed(a){try{localStorage.setItem(KEY,JSON.stringify(a));}catch(e){}}
  function applyClosed(){var c=closed();tabs.forEach(function(t){var id=t.getAttribute('data-tab');t.classList.toggle('closed',c.indexOf(id)>=0);});
    [].forEach.call(d.querySelectorAll('[data-keep]'),function(cb){cb.checked=c.indexOf(cb.getAttribute('data-keep'))<0;});}
  function show(id){
    if(!d.getElementById(id)||closed().indexOf(id)>=0) id='accueil';
    panels.forEach(function(p){p.classList.toggle('on',p.id===id);});
    tabs.forEach(function(t){var on=t.getAttribute('data-tab')===id;t.classList.toggle('on',on);var a=t.querySelector('a');a.setAttribute('aria-current',on?'page':'false');if(on){var r=t.parentNode;r.scrollLeft=t.offsetLeft-r.clientWidth/2+t.offsetWidth/2;}});
  }
  function current(){var h=(location.hash||'#accueil').slice(1);var el=d.getElementById(h);
    if(el&&!el.classList.contains('panel')){var p=el.closest('.panel');if(p){show(p.id);el.scrollIntoView();return;}}
    show(h);window.scrollTo(0,0);}
  tabs.forEach(function(t){t.querySelector('a').addEventListener('click',function(e){e.preventDefault();var id=t.getAttribute('data-tab');history.pushState(null,'','#'+id);show(id);window.scrollTo(0,0);});});
  window.addEventListener('popstate',current);window.addEventListener('hashchange',current);
  d.addEventListener('click',function(e){
    var x=e.target.closest('.tab-x');
    if(x){var id=x.getAttribute('data-close');var c=closed();if(c.indexOf(id)<0)c.push(id);saveClosed(c);applyClosed();
      if(location.hash==='#'+id){history.replaceState(null,'','#accueil');show('accueil');}return;}
    var b=e.target.closest('.btn-corr');
    if(b){var box=d.getElementById(b.getAttribute('aria-controls'));var open=b.getAttribute('aria-expanded')==='true';
      box.hidden=open;b.setAttribute('aria-expanded',open?'false':'true');b.textContent=(open?'Show the key':'Hide the key')+(b.getAttribute('data-l')||'');return;}
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
  function setMode(mode){d.body.classList.toggle('mode-eleve',mode==='eleve');d.body.classList.toggle('mode-prof',mode==='prof');d.body.classList.toggle('mode-absent',mode==='absent');
    [].forEach.call(d.querySelectorAll('.mode-btn[data-mode]'),function(b){b.setAttribute('aria-pressed',b.getAttribute('data-mode')===mode?'true':'false');});
    try{localStorage.setItem(MKEY,mode);}catch(e){}}
  var saved='eleve';try{saved=localStorage.getItem(MKEY)||'eleve';}catch(e){} if(saved!=='prof'&&saved!=='absent') saved='eleve'; setMode(saved);applyClosed();
  if(!location.hash)history.replaceState(null,'','#accueil');
  current();
  window.addEventListener('load',function(){var h=(location.hash||'#accueil').slice(1);var el=d.getElementById(h);if(!el||el.classList.contains('panel'))setTimeout(function(){window.scrollTo(0,0);},0);});
  /* minuteur */
  var tm=d.getElementById('timer'),tt=d.getElementById('timer-t'),left=0,iv=null,paused=false;
  function fmt(s){var m=Math.floor(s/60),r=s%60;return (m<10?'0':'')+m+':'+(r<10?'0':'')+r;}
  function tick(){if(paused)return;left--;tt.textContent=fmt(Math.max(left,0));if(left<=0){clearInterval(iv);tm.classList.add('done');}}
  function startTimer(s){clearInterval(iv);left=s;paused=false;tm.classList.remove('done');tt.textContent=fmt(left);tm.hidden=false;d.getElementById('timer-pause').textContent='Pause';iv=setInterval(tick,1000);}
  d.getElementById('timer-pause').addEventListener('click',function(){paused=!paused;this.textContent=paused?'Resume':'Pause';});
  d.getElementById('timer-stop').addEventListener('click',function(){clearInterval(iv);tm.hidden=true;});

  /* QCM */
  d.addEventListener('click',function(e){
    var o=e.target.closest('.qcm-opt');
    if(o){var li=o.closest('.qcm-q');if(li.classList.contains('done'))return;li.classList.add('done');
      var ok=o.getAttribute('data-ok')==='1';o.classList.add(ok?'ok':'ko');
      if(!ok){var g=li.querySelector('.qcm-opt[data-ok="1"]');if(g)g.classList.add('ok');}
      if(ok)li.setAttribute('data-score','1');
      var ol=li.closest('ol');var sc=ol.parentNode.querySelector('.qcm-n');if(sc)sc.textContent=ol.querySelectorAll('[data-score="1"]').length;return;}
    var r=e.target.closest('.qcm-reset');
    if(r){var sec=r.closest('section');[].forEach.call(sec.querySelectorAll('.qcm-q'),function(q){q.classList.remove('done');q.removeAttribute('data-score');});
      [].forEach.call(sec.querySelectorAll('.qcm-opt'),function(b){b.classList.remove('ok','ko');});sec.querySelector('.qcm-n').textContent='0';return;}
    var f=e.target.closest('.dys-font');
    if(f){setFont(f.getAttribute('data-font'));return;}
    var st=e.target.closest('.dys-step');
    if(st){var z=st.closest('.sub,.panel').querySelector('.dys-zone');if(!z)return;var on=!z.classList.contains('one-step');z.classList.toggle('one-step',on);st.setAttribute('aria-pressed',on?'true':'false');
      var nav=z.querySelector('.dys-nav');if(on){if(!nav){nav=d.createElement('p');nav.className='dys-nav';nav.innerHTML='<button type="button" class="btn-sec dys-prev">Previous</button><button type="button" class="btn-sec dys-next">Next</button>';var ol=z.querySelector('ol');if(ol)ol.parentNode.insertBefore(nav,ol.nextSibling);}step(z,0);}return;}
    var nx=e.target.closest('.dys-next,.dys-prev');
    if(nx){var z2=nx.closest('.dys-zone');step(z2,nx.classList.contains('dys-next')?1:-1);return;}
    var ap=e.target.closest('.v-apply');
    if(ap){var box=ap.closest('.video-embed');var s1=sec2(box.querySelector('.v-start').value),s2=sec2(box.querySelector('.v-end').value);
      setVid(box,s1,s2);try{localStorage.setItem(PFX+'-'+box.getAttribute('data-key'),JSON.stringify([s1,s2]));}catch(x){}return;}
  });
  function step(z,dir){var lis=[].slice.call(z.querySelectorAll('ol>li'));if(!lis.length)return;var i=lis.findIndex(function(l){return l.classList.contains('cur');});
    i=i<0?0:Math.max(0,Math.min(lis.length-1,i+dir));lis.forEach(function(l,k){l.classList.toggle('cur',k===i);});}
  var FONTS={arial:'Arial, Helvetica, sans-serif',verdana:'Verdana, Geneva, sans-serif',opendyslexic:'"OpenDyslexic", Arial, sans-serif'};
  function setFont(k){if(!FONTS[k])k='arial';root.style.setProperty('--dys-font',FONTS[k]);
    [].forEach.call(d.querySelectorAll('.dys-font'),function(b){b.setAttribute('aria-pressed',b.getAttribute('data-font')===k?'true':'false');});
    try{localStorage.setItem(PFX+'-dys-font',k);}catch(x){}}
  var sf='arial';try{sf=localStorage.getItem(PFX+'-dys-font')||'arial';}catch(x){}setFont(sf);
  function sec2(v){v=String(v).trim();var m=v.match(/^(\d+)(?::(\d{1,2}))?$/);if(!m)return 0;return m[2]!==undefined?parseInt(m[1],10)*60+parseInt(m[2],10):parseInt(m[1],10)*60;}
  function fm(s){return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2);}
  function setVid(box,s1,s2){var f=box.querySelector('iframe');var id=box.getAttribute('data-vid');
    f.src='https://www.youtube-nocookie.com/embed/'+id+'?start='+s1+(s2>s1?'&end='+s2:'')+'&rel=0';
    box.querySelector('.v-start').value=fm(s1);box.querySelector('.v-end').value=fm(s2);
    var t=box.querySelector('.video-src');if(t){var a=t.querySelector('a');t.innerHTML='';t.appendChild(a);t.appendChild(d.createTextNode(' · extract '+fm(s1)+' to '+fm(s2)));}}
  [].forEach.call(d.querySelectorAll('.video-embed'),function(box){try{var v=JSON.parse(localStorage.getItem(PFX+'-'+box.getAttribute('data-key'))||'null');if(v)setVid(box,v[0],v[1]);}catch(x){}});
})();
