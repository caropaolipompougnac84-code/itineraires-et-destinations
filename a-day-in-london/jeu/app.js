(function(){
'use strict';
var G=window.GAME, MS=G.missions, MI={}, AMY=G.amy, LEO=G.leo; MS.forEach(function(m){MI[m.id]=m});
var KEY='aday_v1', RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)');
function reduced(){return !!(RM&&RM.matches)}
function $(s,r){return (r||document).querySelector(s)} function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function X(en,fr){return '<span class="x"><span class="en" lang="en">'+en+'</span><span class="fr" lang="fr">'+fr+'</span></span>'}
function SUB(fr){return fr?'<span class="sub" lang="fr">'+fr+'</span>':''}
function money(p){return '£'+(p/100).toFixed(2)}
function dur(n){return n<60?n+' min':Math.floor(n/60)+' h'+(n%60?' '+('0'+n%60).slice(-2):'')}
function hm(t){var a=t.split(':');return (+a[0])*60+(+a[1])} function fmt(n){return ('0'+Math.floor(n/60)).slice(-2)+':'+('0'+(n%60)).slice(-2)}
var NUMW=['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
var NUMF=['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix'];
/* ---------- state ---------- */
var LANGV=2; /* bump to force English back on every device once */
function fresh(){return {profile:null,pos:'resched',m:{},vocab:{},reviews:0,badges:[],auto:true,finalSeen:false,tr:false,langv:LANGV}}
var S; try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){S=null} if(!S||typeof S!=='object')S=fresh();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
if(S.langv!==LANGV){S.tr=false;S.auto=true;Object.keys(S.m||{}).forEach(function(k){if(S.m[k])delete S.m[k].tr});S.langv=LANGV;save()}
function ms(id){return S.m[id]||(S.m[id]={sel:{},vars:{},step:0,done:false,stars:0,pts:0,max:0,talk:{},tries:0})}
function lvl(){return (S.profile&&S.profile.level)||'a1'}
function nameOf(){return (S.profile&&S.profile.name)||'Leo'}
/* ---------- templates ---------- */
function fixSel(m){var st=ms(m.id),f=m.fixed||{},bad=false;Object.keys(st.sel).forEach(function(g){if(g!=='busy'&&m.groups[g]&&!f[g]&&st.sel[g]!=null&&!opt(m,g,st.sel[g]))bad=true});if(bad){st.sel={};st.step=0;st.talk={};st.vars={}}Object.keys(f).forEach(function(g){st.sel[g]=f[g]});return st}
function opt(m,g,id){var L=m.groups[g]||[];for(var i=0;i<L.length;i++)if(L[i].id===id)return L[i];return null}
function R(t,m,fr){ if(t==null)return ''; var st=ms(m.id);
  return String(t).replace(/\{(\w+)\.(\w+)\}/g,function(a,g,f){var o=opt(m,g,st.sel[g]);if(!o)return '…';var v=o[f];if(v==null)v=o[f.replace(/_fr$/,'')];return esc(v==null?'…':v)})
   .replace(/\{name\}/g,function(){return esc(nameOf())})
   .replace(/\{(\w+)\}/g,function(a,v){var k=fr&&st.vars[v+'_fr']!=null?v+'_fr':v;return st.vars[k]!=null?esc(st.vars[k]):'…'}); }
function B(s){return String(s).replace(/\[([^\]]+)\]/g,'<b class="kw">$1</b>')}
function AK(v,t,m){ if(!t)return null; var st=ms(m.id), bad=false;
  t=String(t).replace(/[\[\]]/g,'').split(', {name}').join(''); if(t.indexOf('{name}')>=0)return null;
  t=t.replace(/\{(\w+)\.(\w+)\}/g,function(a,g,f){var o=opt(m,g,st.sel[g]);if(!o||o[f]==null){bad=true;return ''}return String(o[f])});
  if(bad||t.indexOf('{')>=0)return null; return G.aud[v+'|'+t]||null; }
function cond(c,m){ if(c==null||c===true||c===1)return true; if(c===0||c===false)return false; var st=ms(m.id);
  return String(c).split('&').every(function(p){var mm=p.match(/^(\w+)(!?=)(.+)$/);if(!mm)return false;var cur=st.sel[mm[1]];if(cur==null)cur=st.vars[mm[1]];var hit=mm[3].split('|').indexOf(String(cur))>=0;return mm[2]==='='?hit:!hit}); }
function lvlOK(o){return !o.lvl||o.lvl===lvl()}
function seeded(str){var h=2166136261;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return function(){h^=h<<13;h^=h>>>17;h^=h<<5;return ((h>>>0)%100000)/100000}}
function shuffle(a,seed){var r=seeded(seed),b=a.slice();for(var i=b.length-1;i>0;i--){var j=Math.floor(r()*(i+1));var t=b[i];b[i]=b[j];b[j]=t}return b}
/* ---------- audio (pre-generated neural voices only) ---------- */
try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
var AU=new Audio(); AU.preload='auto'; AU.setAttribute('playsinline',''); var queue=[];
function toast(en,fr){var t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.innerHTML=X(en,fr);t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove('show')},3800)}
function stopAudio(){queue=[];try{AU.pause()}catch(e){} $$('.spk.on,.vcard.on,.rplay.on').forEach(function(b){b.classList.remove('on')})}
function play(f,btn){ if(!f)return; stopAudio(); playOne(f,btn) }
function playOne(f,btn,retry){ AU.src='../audio/'+f; if(btn)btn.classList.add('on');
  AU.onended=function(){if(btn)btn.classList.remove('on'); var n=queue.shift(); if(n)setTimeout(function(){playOne(n)},250)};
  AU.onerror=function(){ if(!retry){AU=new Audio();AU.preload='auto';playOne(f,btn,true)} else {if(btn)btn.classList.remove('on'); if(btn)toast('The sound can\'t load. Check your internet connection and tap 🔊 again.','Le son ne se charge pas. Vérifie ta connexion internet et touche 🔊 à nouveau.')} };
  var p; try{p=AU.play()}catch(e){p=null}
  if(p&&p.catch)p.catch(function(e){ if(e&&e.name==='AbortError')return; if(btn)btn.classList.remove('on');
    if(e&&e.name==='NotAllowedError'){ if(btn)toast('Tap 🔊 again to hear it. No sound? Turn the volume up.','Touche 🔊 encore une fois pour écouter. Pas de son ? Monte le volume.') }
    else if(!retry){AU=new Audio();AU.preload='auto';playOne(f,btn,true)} }); }
function playSeq(list){ list=list.filter(Boolean); if(!list.length||!S.auto)return; stopAudio(); queue=list.slice(1); playOne(list[0]) }
function spk(f,lab){return f?'<button type="button" class="spk" data-au="'+f+'" aria-label="'+(lab||'Listen')+'" title="Listen">🔊</button>':''}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-au]');if(b&&!b.classList.contains('vcard')&&b.dataset.au){e.preventDefault();e.stopPropagation();play(b.dataset.au,b)}},true);
function say(msg){var l=$('#live');l.textContent='';setTimeout(function(){l.textContent=String(msg).replace(/<[^>]+>/g,' ')},30)}
function setTr(on){document.body.classList.toggle('tr',on);document.documentElement.lang=on?'fr':'en';$$('#trBtn,#itr,#trm').forEach(function(b){b.setAttribute('aria-pressed',on?'true':'false')});S.tr=on;save();var rb=document.getElementById('rulesPlay');if(rb&&rb.classList.contains('on')&&G.intro)play(on?G.intro.fr:G.intro.en,rb)}
/* ---------- drag & drop (pointer events: mouse + touch + pen) + tap-to-place ---------- */
var picked=null;
function dnd(root,opts){
  function pick(el){ if(picked===el){unpick();return} unpick(); picked=el; el.classList.add('picked'); el.setAttribute('aria-pressed','true'); root.classList.add('picking');
    say((el.dataset.label||el.textContent)+'. Now tap where it goes.'); }
  function unpick(){ if(picked){picked.classList.remove('picked');picked.setAttribute('aria-pressed','false')} picked=null; root.classList.remove('picking') }
  $$(opts.item,root).forEach(function(el){
    el.setAttribute('aria-pressed','false');
    el.addEventListener('pointerdown',function(e){ if(e.button>0)return; var sx=e.clientX,sy=e.clientY,ghost=null,over=null,drag=false;
      try{el.setPointerCapture(e.pointerId)}catch(_){}
      function mv(ev){ var dx=ev.clientX-sx,dy=ev.clientY-sy;
        if(!drag&&Math.abs(dx)+Math.abs(dy)>6){drag=true;ghost=el.cloneNode(true);ghost.classList.add('dragghost');var r=el.getBoundingClientRect();ghost.style.width=r.width+'px';document.body.appendChild(ghost);el.classList.add('dragging')}
        if(drag){ev.preventDefault();ghost.style.left=(ev.clientX-ghost.offsetWidth/2)+'px';ghost.style.top=(ev.clientY-ghost.offsetHeight/2)+'px';
          var t=document.elementFromPoint(ev.clientX,ev.clientY);t=t&&t.closest(opts.target);if(t&&!root.contains(t))t=null;
          if(over&&over!==t)over.classList.remove('over');if(t)t.classList.add('over');over=t}}
      function up(ev){ el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);
        if(ghost)ghost.remove();el.classList.remove('dragging');if(over)over.classList.remove('over');
        if(drag){ el._dragged=true; setTimeout(function(){el._dragged=false},50); if(over&&ev.type==='pointerup')opts.drop(el,over); }
        else if(ev.type==='pointerup'){ el._tapped=Date.now(); pick(el); } }
      el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
    });
    el.addEventListener('click',function(e){ if(el._dragged)return; if(el._tapped&&Date.now()-el._tapped<700)return; pick(el) });
  });
  $$(opts.target,root).forEach(function(t){ t.addEventListener('click',function(e){ if(picked&&root.contains(picked)&&!t.contains(picked)){var p=picked;unpick();opts.drop(p,t)} });
    t.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&picked&&e.target===t){e.preventDefault();var p=picked;unpick();opts.drop(p,t)}}) });
}
/* ---------- fuzzy answer check ---------- */
function norm(s){return String(s||'').toLowerCase().replace(/[’`]/g,"'").replace(/…/g,'').replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim().replace(/^(a|an|the|to) /,'')}
function lev(a,b){var m=a.length,n=b.length,d=[],i,j;for(i=0;i<=m;i++){d[i]=[i]}for(j=0;j<=n;j++)d[0][j]=j;for(i=1;i<=m;i++)for(j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n]}
function close(ans,list){var a=norm(ans);if(!a)return false;return list.some(function(x){var b=norm(x);if(a===b)return true;var tol=b.length>14?2:b.length>4?1:0;return lev(a,b)<=tol})}
function answersOf(w){return [w.w].concat(w.alt||[]).concat([w.w.replace(/\s*\(.*?\)/g,'')])}
function hintOf(w){return w.w.replace(/\s*\(.*?\)/g,'').split(' ').map(function(x){return x.length<=2?x:x[0]+'_'.repeat(Math.min(x.length-1,8))}).join(' ')}
/* ---------- Leitner spaced review ---------- */
var DAYS=[0,0,1,3,7,14,30];
function vkey(mid,i){return mid+':'+i}
function vbump(k,ok){var v=S.vocab[k]||{b:0,d:0};v.b=ok?Math.min(6,Math.max(1,v.b)+1):1;v.d=Date.now()+DAYS[v.b]*864e5-36e5;S.vocab[k]=v}
function totals(){var s=0,p=0,d=0;MS.forEach(function(m){var st=S.m[m.id];if(st){s+=st.stars||0;p+=st.best||0;if(st.done)d++}});return {stars:s,pts:p,done:d}}
function head(){var t=totals();$('#score').innerHTML='<span title="Stars">⭐ '+t.stars+'</span><span title="Badges">🏅 '+S.badges.length+'</span><span class="pts" title="Points">'+t.pts+' pts</span>'}
var app;
function go(view,arg){ stopAudio(); picked=null; window.scrollTo(0,0); app.className='view-'+view; app.removeAttribute('data-mid');
  if(view!=='mission')document.body.classList.remove('in-mission');
  ({intro:vIntro,welcome:vWelcome,map:vMap,mission:vMission,notebook:vNotebook,final:vFinal,videos:vVideos})[view](arg); head();
  var h=$('h2',app);if(h){h.setAttribute('tabindex','-1');try{h.focus({preventScroll:true})}catch(e){}} }
/* ---------- welcome ---------- */
var AVA=['🧑🏽','👩🏻','👨🏾','👧🏼','🧕🏽','👦🏿','🧑🏻‍🦰','👩🏽‍🦱','🧑🏼‍🦱','👱🏻‍♀️'];
function radio(sel,cls,attr,cb){ $$(sel,app).forEach(function(b){b.onclick=function(){$$(sel,app).forEach(function(x){x.classList.remove('on');x.setAttribute('aria-checked','false')});b.classList.add('on');b.setAttribute('aria-checked','true');cb(b.dataset[attr])}}) }
function vWelcome(){ var p=S.profile?JSON.parse(JSON.stringify(S.profile)):{name:'Leo',avatar:AVA[0],level:'a1'};
  app.innerHTML='<section class="card welcome"><div class="hero-art" aria-hidden="true">🎡🚇🛒🕰️☕</div><h2>'+X('My profile','Mon profil')+'</h2>'+
  '<p class="lead">'+X('You play as Leo, 19, from France. He goes to London, where his friend Amy is waiting for him. You can keep the name Leo or write your own first name.','Tu joues Leo, 19 ans, qui vient de France. Il part à Londres, où son amie Amy l\'attend. Tu peux garder le prénom Leo ou écrire ton propre prénom.')+'</p>'+
  '<label class="lbl" for="nm">'+X('Your first name (it stays on this device)','Ton prénom (il reste sur cet appareil)')+'</label><input id="nm" class="inp" maxlength="20" autocomplete="off" value="'+esc(p.name)+'" placeholder="Leo">'+
  '<p class="lbl" id="avl">'+X('Choose your character','Choisis ton personnage')+'</p><div class="ava" role="radiogroup" aria-labelledby="avl">'+AVA.map(function(a){return '<button type="button" role="radio" class="av'+(a===p.avatar?' on':'')+'" aria-checked="'+(a===p.avatar)+'" data-a="'+a+'">'+a+'</button>'}).join('')+'</div>'+
  '<p class="lbl" id="lvl">'+X('Your level','Ton niveau')+'</p><div class="seg" role="radiogroup" aria-labelledby="lvl">'+
   '<button type="button" role="radio" class="lv'+(p.level==='a1'?' on':'')+'" aria-checked="'+(p.level==='a1')+'" data-l="a1"><b>A1</b> '+X('I\'m starting: more help','Je débute : plus d\'aide')+'</button>'+
   '<button type="button" role="radio" class="lv'+(p.level==='b1'?' on':'')+'" aria-checked="'+(p.level==='b1')+'" data-l="b1"><b>A2→B1</b> '+X('More of a challenge','Plus de défi')+'</button></div>'+
  '<button type="button" class="btn big" id="start">'+X('Let\'s go! →','C\'est parti ! →')+'</button>'+
  '<p class="small c"><a href="prof.html">'+X('Teacher page (in French)','Page enseignant')+'</a> · <a href="fiches.html">'+X('Worksheets to print','Fiches à imprimer')+'</a></p></section>';
  radio('.av','av','a',function(v){p.avatar=v}); radio('.lv','lv','l',function(v){p.level=v});
  $('#start').onclick=function(){var n=$('#nm').value.trim().replace(/[<>{}\[\]]/g,'').slice(0,20);p.name=n||'Leo';S.profile=p;save();introSeen();go('map')};
}
/* ---------- introduction (first screen) ---------- */
function seenIntro(){try{return sessionStorage.getItem('aday_intro')==='1'}catch(e){return false}}
function introSeen(){try{sessionStorage.setItem('aday_intro','1')}catch(e){}}
function coverHTML(){ if(G.cover)return '<img class="cover-img" src="'+esc(G.cover.src)+'" width="'+G.cover.w+'" height="'+G.cover.h+'" alt="A Day in London, with Leo and Amy: Big Ben, the London Eye, Tower Bridge and Covent Garden">';
  return '<div class="cover-fb" role="img" aria-label="A Day in London, with Leo and Amy"><div class="cq q1"><span>🕰️</span></div><div class="cq q2"><span>🎡</span></div><div class="cband"><small>A DAY IN</small><b>LONDON</b><span class="ctag">WITH LEO &amp; AMY</span></div><div class="cq q3"><span>🌉</span></div><div class="cq q4"><span>🎭</span></div></div>' }
/* welcome speech with the rules: English audio (Leo + Amy) by default, French audio (ff_siwis) when « Traduction » is on */
function rulesHTML(){ var I=G.intro; if(!I)return '';
  return '<div class="rules" id="rules"><div class="rh"><h3>'+X('🎙️ Leo and Amy explain the rules','🎙️ Leo et Amy t\'expliquent les règles')+'</h3><button type="button" class="btn sm rplay" id="rulesPlay">🔊 '+X('Listen','Écouter')+'</button></div><ul class="rl">'+
    I.lines.map(function(l){var a=l.who==='amy';return '<li class="'+(a?'amy':'leo')+'"><span class="face" aria-hidden="true">'+(a?AMY.face:LEO.face)+'</span><p><b>'+(a?'Amy':'Leo')+'</b> '+X(esc(l.en),esc(l.fr))+'</p></li>'}).join('')+'</ul></div>' }
function rulesFile(){return document.body.classList.contains('tr')?G.intro.fr:G.intro.en}
function vIntro(){ var p=S.profile||{name:'',avatar:AVA[0],level:'a1'}, on=document.body.classList.contains('tr');
  app.innerHTML='<section class="card intro"><div class="igrid"><div class="icover">'+coverHTML()+'</div><div class="itext">'+
   '<div class="ihead"><h2>'+X('Welcome to London!','Bienvenue à Londres !')+'</h2><button type="button" class="btn trm sm" id="itr" aria-pressed="'+on+'">'+X('🇫🇷 Traduction','🇬🇧 English')+'</button></div>'+
   '<div class="duo"><div class="pp"><span class="face" aria-hidden="true">'+LEO.face+'</span><p>'+X('<b>Leo</b>, 19, from France. It\'s his first day in London!','<b>Leo</b>, 19 ans, vient de France. C\'est son premier jour à Londres !')+'</p></div>'+
   '<div class="pp"><span class="face" aria-hidden="true">'+AMY.face+'</span><p>'+X('<b>Amy</b>, his friend. She lives in London: she welcomes him at the station and helps him.','<b>Amy</b>, son amie. Elle vit à Londres : elle l\'accueille à la gare et l\'aide.')+'</p></div></div>'+
   rulesHTML()+'<p class="lead">'+X('Hi! Come to London with Leo. First, you buy your ticket at the station in your home town and take the train. Amy welcomes you in London. Then you take the Tube, go shopping, see a doctor, ask the way, order lunch and phone your work placement. Everything is in English, with real voices. Don\'t worry: you can try again as many times as you like!','Salut ! Pars à Londres avec Leo. D\'abord, tu achètes ton billet à la gare de ta ville et tu prends le train. Amy t\'accueille à Londres. Ensuite, tu prends le métro, tu fais tes courses, tu vas chez le médecin, tu demandes ton chemin, tu commandes ton déjeuner et tu appelles ton lieu de stage. Tout est en anglais, avec de vraies voix. Pas de panique : tu peux réessayer autant de fois que tu veux !')+'</p>'+
   '<h3>'+X('How to play','Comment jouer')+'</h3><ol class="howto">'+
    [['🗺️','Tap a place on the map: Leo walks there.','Touche un lieu sur le plan : Leo s\'y rend à pied.'],
     ['🎯','Make your own choices: menu, trip, problem, workplace…','Fais tes propres choix : menu, voyage, problème, lieu de stage…'],
     ['🔤','Listen to the words, then choose what you say in the conversation.','Écoute les mots, puis choisis ce que tu dis dans le dialogue.'],
     ['🎮','Play the mini-game, then write or record YOUR conversation.','Joue au mini-jeu, puis écris ou enregistre TON dialogue.'],
     ['🧠','Remember the words without looking and win stars and badges.','Retrouve les mots sans regarder et gagne des étoiles et des badges.'],
     ['🇫🇷','Stuck? Press « Traduction » to see the French.','Bloqué·e ? Appuie sur « Traduction » pour voir le français.']].map(function(x){return '<li><span class="hi-ic" aria-hidden="true">'+x[0]+'</span> '+X(x[1],x[2])+'</li>'}).join('')+'</ol>'+
   '<div class="startbox"><label class="lbl" for="nm">'+X('Play as Leo, or write your first name (it stays on this device):','Joue Leo, ou écris ton prénom (il reste sur cet appareil) :')+'</label><input id="nm" class="inp" maxlength="20" autocomplete="off" value="'+esc(p.name)+'" placeholder="Leo">'+
   '<p class="lbl" id="lvl">'+X('Your level','Ton niveau')+'</p><div class="seg" role="radiogroup" aria-labelledby="lvl">'+
    '<button type="button" role="radio" class="lv'+(p.level==='a1'?' on':'')+'" aria-checked="'+(p.level==='a1')+'" data-l="a1"><b>A1</b> '+X('I\'m starting: more help','Je débute : plus d\'aide')+'</button>'+
    '<button type="button" role="radio" class="lv'+(p.level==='b1'?' on':'')+'" aria-checked="'+(p.level==='b1')+'" data-l="b1"><b>A2→B1</b> '+X('More of a challenge','Plus de défi')+'</button></div>'+
   '<button type="button" class="btn big" id="start">▶ '+X('Start','Commencer')+'</button></div>'+
   '<p class="small c"><a href="#videos" id="ivid">🎬 '+X('Watch the videos','Voir les vidéos')+'</a> · <a href="prof.html">'+X('Teacher page (in French)','Page enseignant')+'</a> · <a href="fiches.html">'+X('Worksheets to print','Fiches à imprimer')+'</a></p>'+
   (G.photoCredits?'<p class="credits">'+G.photoCredits+'</p>':'')+'</div></div></section>';
  var lv=p.level||'a1'; radio('.lv','lv','l',function(v){lv=v});
  $('#itr').onclick=function(){var t=!document.body.classList.contains('tr');setTr(t);this.setAttribute('aria-pressed',t?'true':'false')};
  $('#ivid').onclick=function(e){e.preventDefault();go('videos')};
  var rp=$('#rulesPlay'); if(rp)rp.onclick=function(){ if(rp.classList.contains('on')){stopAudio();return} play(rulesFile(),rp) };
  $('#start').onclick=function(){var n=$('#nm').value.trim().replace(/[<>{}\[\]]/g,'').slice(0,20), pr=S.profile||{avatar:LEO.face};
    pr.name=n||'Leo'; pr.level=lv; if(!pr.avatar)pr.avatar=LEO.face; S.profile=pr; save(); introSeen(); go('map')};
}
/* ---------- videos (episode list) ---------- */
function posterTag(e){return '<button type="button" class="vposter" data-ep="'+e.n+'" aria-label="Play episode '+e.n+'"><img src="'+esc(e.poster)+'" alt="" loading="lazy" width="960" height="540"><span class="bigplay" aria-hidden="true">▶</span></button>'}
/* one player at a time on the Videos page: the other episodes show their poster, so only one video downloads */
function playEp(n){ var E=G.episodes||[], e=null;
  E.forEach(function(o){ var sl=$('#vs'+o.n,app); if(o.n==n){e=o;return} if(sl&&$('video',sl))sl.innerHTML=posterTag(o) });
  var sl=$('#vs'+n,app); if(!sl||!e)return;
  if(!$('video',sl)){ sl.innerHTML='<video controls preload="auto" playsinline webkit-playsinline poster="'+esc(e.poster)+'"><source src="'+esc(e.href)+'" type="../video/mp4"><a href="'+esc(e.href)+'">'+esc(e.href)+'</a></video>'; wireVideos(sl) }
  var v=$('video',sl); try{v.scrollIntoView({block:'center',behavior:'auto'})}catch(x){}
  var p=v.play(); if(p&&p.catch)p.catch(function(x){ if(x&&x.name==='AbortError')return; toast('Tap ▶ on the video to start it.','Touche ▶ sur la vidéo pour la lancer.')}) }
function vVideos(){ var E=G.episodes||[];
  var h='<section class="card videos"><h2>🎬 '+X('A Day in London: the videos','A Day in London : les vidéos')+'</h2><p class="lead">'+X(E.length+' episodes, one for each mission on the map. Watch an episode, repeat the sentences out loud in the pauses, then play the mission.',E.length+' épisodes, un pour chaque mission du plan. Regarde un épisode, répète les phrases à voix haute pendant les pauses, puis joue la mission.')+'</p>';
  E.forEach(function(e){ var M=e.mission&&MI[e.mission];
    h+='<article class="ep ready" id="ep'+e.n+'"><div class="eph"><span class="epn">'+e.n+'</span><div><b lang="en">'+esc(e.title)+'</b>'+(e.fr?'<small class="sub fr" lang="fr">'+esc(e.fr)+'</small>':'')+'</div><button type="button" class="badge ok epplay" data-ep="'+e.n+'">▶ '+X('Watch now','À regarder')+'</button></div>'+
      '<div class="vslot" id="vs'+e.n+'">'+posterTag(e)+'</div>'+vLinks(e)+(M?'<p><button type="button" class="btn sm epgo" data-mid="'+M.id+'">'+M.icon+' '+X('Play the mission: '+esc(M.title[0]),'Jouer la mission : '+esc(M.title[1]))+' →</button></p>':'')+'</article>' });
  h+='<p class="small c more">⏳ '+X('More episodes coming soon.','D\'autres épisodes arrivent bientôt.')+'</p>';
  h+='<p class="row c"><button type="button" class="btn ghost" id="vback">🗺️ '+X('Back to the game','Retour au jeu')+'</button></p></section>';
  app.innerHTML=h;
  app.onclick=function(ev){ if(!app.classList.contains('view-videos'))return; var b=ev.target.closest&&ev.target.closest('.epplay,.vposter'); if(b)playEp(+b.dataset.ep) };
  $$('.epgo',app).forEach(function(b){b.onclick=function(){if(!S.profile){go('intro');return} introSeen(); S.pos=b.dataset.mid; save(); go('mission',b.dataset.mid)}});
  $('#vback').onclick=function(){S.profile&&seenIntro()?go('map'):go('intro')};
}
/* ---------- map ---------- */
var VR=[135,265];
function door(m){return {x:m.pos[0],y:m.pos[2]}}
function route(a,b){ if(a.y===b.y)return [a,b]; var vx=VR.reduce(function(best,x){return Math.abs(x-a.x)+Math.abs(x-b.x)<Math.abs(best-a.x)+Math.abs(best-b.x)?x:best},VR[0]);
  return [a,{x:vx,y:a.y},{x:vx,y:b.y},b] }
function building(m,nx){ var st=S.m[m.id]||{}, x=m.pos[0], y=m.pos[1], w=100, h=78, top=y-h/2, k='stroke="#2b2d42"';
  var s='<g class="bld'+(m.id===nx?' nextb':'')+'" data-mid="'+m.id+'" tabindex="0" role="button" aria-label="Mission '+m.num+': '+esc(m.place[0])+(st.done?' (done)':'')+'">';
  s+='<rect x="'+(x-w/2+4)+'" y="'+(top+18)+'" width="'+w+'" height="'+(h-14)+'" rx="8" fill="#0002"/>';
  s+='<rect x="'+(x-w/2)+'" y="'+(top+14)+'" width="'+w+'" height="'+(h-14)+'" rx="7" fill="'+m.wall+'" '+k+' stroke-width="2"/>';
  s+='<path d="M'+(x-w/2-5)+' '+(top+18)+' L'+x+' '+(top-8)+' L'+(x+w/2+5)+' '+(top+18)+' Z" fill="'+m.roof+'" '+k+' stroke-width="2" stroke-linejoin="round"/>';
  s+='<rect x="'+(x-9)+'" y="'+(y+14)+'" width="18" height="25" rx="3" fill="#6b4f3a" '+k+' stroke-width="1.5"/>';
  s+='<rect x="'+(x-42)+'" y="'+(y+15)+'" width="22" height="15" rx="2" fill="#bde0fe" '+k+' stroke-width="1.5"/><rect x="'+(x+20)+'" y="'+(y+15)+'" width="22" height="15" rx="2" fill="#bde0fe" '+k+' stroke-width="1.5"/>';
  s+='<text x="'+x+'" y="'+(y+11)+'" text-anchor="middle" font-size="19">'+m.icon+'</text>';
  s+='<rect x="'+(x-48)+'" y="'+(top+14)+'" width="96" height="17" rx="8" fill="#fff" '+k+' stroke-width="1.2"/><text x="'+x+'" y="'+(top+26.5)+'" text-anchor="middle" font-size="10.5" font-weight="700" fill="#2b2d42">'+m.num+'. '+esc(m.place[0])+'</text>';
  if(st.done)s+='<circle cx="'+(x+44)+'" cy="'+(top+4)+'" r="13" fill="#ffd166" '+k+' stroke-width="1.5"/><text x="'+(x+44)+'" y="'+(top+9)+'" text-anchor="middle" font-size="13">⭐</text>';
  else if(m.id===nx)s+='<g class="ping"><circle cx="'+(x+44)+'" cy="'+(top+4)+'" r="12" fill="#ef476f" '+k+' stroke-width="1.5"/><text x="'+(x+44)+'" y="'+(top+9)+'" text-anchor="middle" font-size="13" fill="#fff" font-weight="800">!</text></g>';
  return s+'</g>' }
function mapSVG(nx){ var s='<svg class="town" viewBox="0 0 400 600" role="group" aria-label="Map of London">';
  s+='<defs><pattern id="grass" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#b7e4a5"/><circle cx="5" cy="6" r="1.4" fill="#97d184"/><circle cx="17" cy="15" r="1.2" fill="#97d184"/></pattern></defs>';
  s+='<rect width="400" height="600" fill="url(#grass)"/>';
  s+='<path d="M0 0 H400 V30 Q300 44 200 34 Q100 24 0 40 Z" fill="#7fc8f8"/><path d="M0 22 Q100 10 200 20 Q300 30 400 18" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="6 10" opacity=".8"/><text x="200" y="17" text-anchor="middle" font-size="9.5" font-weight="800" fill="#1d4e89" letter-spacing="1">RIVER THAMES</text>';
  [150,330,500].forEach(function(y){s+='<rect x="0" y="'+(y-11)+'" width="400" height="22" fill="#6c757d"/><line x1="0" y1="'+y+'" x2="400" y2="'+y+'" stroke="#fff" stroke-width="2" stroke-dasharray="10 9"/>'});
  VR.forEach(function(x){s+='<rect x="'+(x-11)+'" y="150" width="22" height="350" fill="#6c757d"/><line x1="'+x+'" y1="162" x2="'+x+'" y2="489" stroke="#fff" stroke-width="2" stroke-dasharray="10 9"/>'});
  s+='<rect x="0" y="546" width="400" height="16" fill="#8d6e63"/>';for(var i=0;i<400;i+=14)s+='<rect x="'+i+'" y="544" width="5" height="20" fill="#5d4037"/>';
  s+='<line x1="0" y1="549" x2="400" y2="549" stroke="#495057" stroke-width="2.5"/><line x1="0" y1="559" x2="400" y2="559" stroke="#495057" stroke-width="2.5"/>';
  s+='<g class="train" aria-hidden="true"><text x="0" y="561" font-size="24">🚃🚃🚆</text></g>';
  [[22,205],[112,212],[378,212],[22,385],[112,382],[288,390],[380,384],[248,212],[152,388],[385,585],[20,585],[200,588]].forEach(function(p,i){s+='<text x="'+p[0]+'" y="'+p[1]+'" font-size="'+(16+(i%3)*3)+'" text-anchor="middle" aria-hidden="true">'+(i%4===3?'🌷':'🌳')+'</text>'});
  [[24,34,'🎡',26],[376,34,'🌉',24],[314,206,'🕰️',19],[234,394,'💂',18]].forEach(function(p){s+='<text x="'+p[0]+'" y="'+p[1]+'" font-size="'+p[3]+'" text-anchor="middle" aria-hidden="true">'+p[2]+'</text>'});
  s+='<g class="bus" aria-hidden="true"><text x="0" y="338" font-size="20">🚌</text></g><text x="372" y="158" font-size="17" aria-hidden="true">🚕</text>';
  MS.forEach(function(m){s+=building(m,nx)});
  s+='<g class="clouds" aria-hidden="true"><text class="cl c1" x="10" y="30" font-size="24">☁️</text><text class="cl c2" x="230" y="20" font-size="19">☁️</text></g>';
  s+='<g class="plane" aria-hidden="true"><text x="0" y="0" font-size="20">✈️</text></g>';
  var cur=MI[S.pos]||MI.resched, d=door(cur);
  s+='<g id="hero" style="transform:translate('+d.x+'px,'+(d.y-4)+'px)"><ellipse cx="0" cy="8" rx="12" ry="4" fill="#0003"/><text class="me" x="0" y="6" text-anchor="middle" font-size="28">'+(S.profile?S.profile.avatar:'🧑🏽')+'</text></g>';
  return s+'</svg>' }
function tapMe(nx){ var m=MI[nx]; if(!m)return ''; var ax=m.pos[0]+44, ay=m.pos[1]-39-9, px=Math.max(6,Math.min(94,ax/4));
  return '<button type="button" class="tapme" id="tapme" data-mid="'+m.id+'" style="left:'+px+'%;top:'+(ay/6)+'%;transform:translate(-'+px+'%,-100%)" aria-label="Tap here to start: mission '+m.num+', '+esc(m.place[0])+'"><span class="tapin">👆 '+X('Tap here to start','Touche ici pour commencer')+'</span><span class="tail" style="left:'+px+'%"></span></button>' }
function nextMid(){for(var i=0;i<MS.length;i++){var st=S.m[MS[i].id];if(!st||!st.done)return MS[i].id}return null}
function clock(){var t=totals();var h=9+t.done;return (h>12?h-12:h)+(h>=12?' pm':' am')}
function vMap(){ var t=totals(), nx=nextMid();
  var list=MS.map(function(m){var st=S.m[m.id]||{};var stars=st.stars||0;
    return '<li><button type="button" class="mcard'+(st.done?' done':'')+(m.id===nx?' next':'')+'" data-mid="'+m.id+'"><span class="mi" aria-hidden="true">'+m.icon+'</span><span class="mt"><small>'+X('Mission '+m.num+' · '+esc(m.place[0]),'Mission '+m.num+' · '+esc(m.place[1]))+'</small><b>'+X(esc(m.title[0]),esc(m.title[1]))+'</b></span><span class="ms" aria-label="'+(st.done?stars+' stars':st.step>0?'started':'')+'">'+(st.done?'⭐'.repeat(stars)+'☆'.repeat(3-stars):(st.step>0?'▶':''))+'</span></button></li>'}).join('');
  app.innerHTML='<section class="mapwrap"><div class="maphead"><h2>'+X('A day in London','Une journée à Londres')+'</h2>'+
   '<p class="hi">'+X('Hi '+esc(nameOf())+'! It\'s '+clock()+' in London. Tap a place on the map to start a mission.','Salut '+esc(nameOf())+' ! Il est '+clock()+' à Londres. Touche un lieu sur le plan pour commencer une mission.')+'</p>'+
   '<div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="9" aria-valuenow="'+t.done+'" aria-label="Missions complete"><span style="width:'+(t.done/9*100)+'%"></span></div><p class="small">'+X(t.done+'/9 missions complete','Missions terminées : '+t.done+'/9')+'</p>'+
   (t.done===9?'<button type="button" class="btn" id="toFinal">🏆 '+X('See my certificate','Voir mon diplôme')+'</button>':'')+
   '<div class="lvlsw"><span>'+X('Level:','Niveau :')+'</span> <button type="button" class="chip'+(lvl()==='a1'?' on':'')+'" data-l="a1" aria-pressed="'+(lvl()==='a1')+'">A1</button><button type="button" class="chip'+(lvl()==='b1'?' on':'')+'" data-l="b1" aria-pressed="'+(lvl()==='b1')+'">A2→B1</button> <button type="button" class="chip" id="prof">✏️ '+X('Profile','Profil')+'</button> <button type="button" class="chip" id="mvid">🎬 '+X('Videos','Vidéos')+'</button> <button type="button" class="chip" id="mint">📖 '+X('Introduction','Introduction')+'</button></div></div>'+
   '<div class="mapgrid"><div class="mapbox">'+mapSVG(nx)+tapMe(nx)+'</div><ol class="mlist">'+list+'</ol></div></section>';
  $$('.bld',app).forEach(function(g){g.addEventListener('click',function(){walkTo(g.dataset.mid)});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();walkTo(g.dataset.mid)}})});
  $$('.mcard',app).forEach(function(b){b.onclick=function(){walkTo(b.dataset.mid)}});
  var tm=$('#tapme',app); if(tm)tm.onclick=function(){tm.remove();walkTo(tm.dataset.mid)};
  $$('.lvlsw [data-l]',app).forEach(function(b){b.onclick=function(){S.profile.level=b.dataset.l;save();vMap();head()}});
  $('#prof').onclick=function(){go('welcome')}; $('#mvid').onclick=function(){go('videos')}; $('#mint').onclick=function(){go('intro')}; var tf=$('#toFinal');if(tf)tf.onclick=function(){go('final')};
}
var walking=false;
function walkTo(mid){ if(walking)return; var hero=$('#hero'), m=MI[mid]; if(!hero||!m){go('mission',mid);return}
  var a=door(MI[S.pos]||MI.resched), b=door(m); S.pos=mid; save();
  if(reduced()||!hero.animate||(a.x===b.x&&a.y===b.y)){go('mission',mid);return}
  var pts=route(a,b), dist=[0], tot=0; for(var i=1;i<pts.length;i++){tot+=Math.abs(pts[i].x-pts[i-1].x)+Math.abs(pts[i].y-pts[i-1].y);dist.push(tot)}
  var dur=Math.min(1600,Math.max(500,tot*3)); walking=true; hero.classList.add('walking');
  var bld=$('.bld[data-mid="'+mid+'"]',app); if(bld)bld.classList.add('target');
  var anim=hero.animate(pts.map(function(p,i){return {transform:'translate('+p.x+'px,'+(p.y-4)+'px)',offset:tot?dist[i]/tot:i}}),{duration:dur,easing:'linear',fill:'forwards'});
  anim.onfinish=function(){walking=false;go('mission',mid)}; setTimeout(function(){if(walking){walking=false;go('mission',mid)}},dur+800);
}
/* ---------- mission shell ---------- */
var STEPN={setup:['Make it yours','À toi de choisir','🎯'],vocab:['Words','Les mots','🔤'],talk:['Talk','Dialogue','💬'],game:['Game','Jeu','🎮'],prod:['Your turn','À toi','🎤'],recap:['What I learnt','Ce que j\'ai appris','🧠']};
function vMission(mid){ var m=MI[mid], st=fixSel(m); if(st.done&&st.step>=m.steps.length)restart(mid); st=fixSel(m);
  document.body.classList.add('in-mission'); app.dataset.mid=mid;
  var steps=m.steps.map(function(s,i){var n=STEPN[s.split(':')[0]];return '<li class="'+(i<st.step?'ok':i===st.step?'cur':'')+'"'+(i===st.step?' aria-current="step"':'')+'><span aria-hidden="true">'+(i<st.step?'✅':n[2])+'</span><small>'+X(n[0],n[1])+'</small></li>'}).join('');
  app.innerHTML='<section class="mission" id="msn"><div class="mhead"><button type="button" class="btn ghost sm" id="back">← '+X('Map','Plan')+'</button>'+
   '<h2><span aria-hidden="true">'+m.icon+'</span> '+X('Mission '+m.num+': '+esc(m.title[0]),'Mission '+m.num+' : '+esc(m.title[1]))+'</h2>'+
   '<button type="button" class="btn trm sm" id="trm" aria-pressed="'+document.body.classList.contains('tr')+'">'+X('🇫🇷 Traduction','🇬🇧 English')+'</button></div>'+
   '<ol class="steps" aria-label="Steps">'+steps+'</ol><div class="mbody" id="mbody"></div></section>';
  $('#back').onclick=function(){go('map')};
  $('#trm').onclick=function(){var t=!document.body.classList.contains('tr');setTr(t);this.setAttribute('aria-pressed',t?'true':'false')};
  var key=(m.steps[st.step]||'recap').split(':');
  ({setup:sSetup,vocab:sVocab,talk:sTalk,game:sGame,prod:sProd,recap:sRecap})[key[0]](m,$('#mbody'),key[1]||'main');
}
function restart(mid){var o=S.m[mid];S.m[mid]={sel:o.sel||{},vars:{},step:0,done:false,stars:o.stars,best:o.best,pts:0,max:0,talk:{},tries:0,prodText:o.prodText,reflect:o.reflect,replay:true}}
function nextStep(m){var st=ms(m.id);st.step++;save();vMission(m.id);window.scrollTo(0,0);var h=$('#mbody h3');if(h){h.setAttribute('tabindex','-1');try{h.focus({preventScroll:true})}catch(e){}}}
function amyBox(en,fr,au){return '<div class="npcbox amybox"><span class="face" aria-hidden="true">'+AMY.face+'</span><div><b>'+esc(AMY.name)+'</b> <small>'+X(esc(AMY.role[0]),esc(AMY.role[1]))+'</small><p>'+X(esc(en),esc(fr))+' '+spk(au,'Listen to Amy')+'</p></div></div>'}
function vLinks(V){return '<p class="vlink small">'+(V.vhref?'<a href="'+esc(V.vhref)+'" target="_blank" rel="noopener" class="vvert">📱 '+X('Phone version (vertical)','Version téléphone (verticale)')+'</a> · ':'')+'<a href="'+esc(V.href)+'" target="_blank" rel="noopener">'+X('Video not playing? Open it in full screen','La vidéo ne démarre pas ? Ouvre-la en plein écran')+'</a></p>'}
function videoTag(V,lazy){return '<video controls preload="'+(lazy?'none':'metadata')+'" playsinline webkit-playsinline'+(V.poster?' poster="'+esc(V.poster)+'"':'')+'><source src="'+esc(V.href)+'" type="../video/mp4"><a href="'+esc(V.href)+'">'+esc(V.href)+'</a></video>'+vLinks(V)}
/* free the network connection of videos that leave the screen (old school proxies still use HTTP/1.1, 6 connections per site) */
function releaseVideo(v){try{v.dataset.rel='1';v.pause();$$('source',v).forEach(function(s){s.remove()});v.removeAttribute('src');v.load()}catch(e){}}
function watchVideos(){ if(!window.MutationObserver)return; new MutationObserver(function(ms){ms.forEach(function(r){r.removedNodes.forEach(function(n){if(n.nodeType!==1)return;(n.tagName==='VIDEO'?[n]:$$('video',n)).forEach(releaseVideo)})})}).observe(app,{childList:true,subtree:true}) }
function wireVideos(root){ $$('video',root).forEach(function(v){ v.addEventListener('play',function(){stopAudio();$$('video').forEach(function(o){if(o!==v&&!o.paused)o.pause()})});
  var src=v.querySelector('source'); if(src)src.addEventListener('error',function(){if(v.dataset.rel)return;toast('The video can\'t load here. Use « Open it in full screen » below the video.','La vidéo ne se charge pas ici. Utilise « Ouvre-la en plein écran » sous la vidéo.')}) }) }
function npcBox(m,en,fr){return '<div class="npcbox"><span class="face" aria-hidden="true">'+m.npc.face+'</span><div><b>'+esc(m.npc.name)+'</b> <small>'+X(esc(m.npc.role[0]),esc(m.npc.role[1]))+'</small><p>'+X(en,fr)+'</p></div></div>'}
function pts(m,got,max){var st=ms(m.id);st.pts+=got;st.max+=max;save()}
/* ---------- step: setup ---------- */
function sSetup(m,body){ var st=ms(m.id);
  var h='<div class="brief">'+npcBox(m,esc(m.brief[0]),esc(m.brief[1]))+'<ul class="cando">'+m.cando.map(function(c){return '<li>✅ '+X(esc(c[0]),esc(c[1]))+'</li>'}).join('')+'</ul></div>';
  if(m.amy)h+=amyBox(m.amy[0],m.amy[1],AK(AMY.v,m.amy[0],m));
  if(m.video&&m.video.href){ var V=m.video; h+='<figure class="vid" id="mvideo"><figcaption>🎬 '+X(esc(V.title[0]),esc(V.title[1]))+'</figcaption>'+videoTag(V)+'<p class="small">'+X('Watch, repeat the words out loud, then do the mission. Episode list: ','Regarde, répète les mots à voix haute, puis fais la mission. Liste des épisodes : ')+'<a href="#videos" class="tovid">🎬 '+X('Videos','Vidéos')+'</a></p></figure>' }
  h+='<h3>'+X('Make it yours, '+esc(nameOf())+'!','À toi de choisir, '+esc(nameOf())+' !')+'</h3><p class="small">'+X('Your choices will appear in the conversation, in the game and in your notebook.','Tes choix apparaîtront dans le dialogue, dans le jeu et dans ton carnet.')+'</p>';
  m.setup.forEach(function(q){
    if(q.type==='busy'){ st.sel.busy=st.sel.busy||[];
      h+='<fieldset class="q"><legend>'+X(esc(q.q[0]),esc(q.q[1]))+'</legend>'+weekGrid(m,'busy')+'<p class="small" id="bcount"></p></fieldset>'; return }
    h+='<fieldset class="q"><legend>'+X(esc(q.q[0]),esc(q.q[1]))+'</legend><div class="opts">'+m.groups[q.g].map(function(o){var on=st.sel[q.g]===o.id;
      return '<button type="button" class="ch'+(on?' on':'')+'" aria-pressed="'+on+'" data-g="'+q.g+'" data-id="'+o.id+'"><span class="ic" aria-hidden="true">'+o.icon+'</span><span>'+X(esc(o.en),esc(o.fr))+'</span></button>'}).join('')+'</div></fieldset>'});
  h+='<p class="warn" id="sw" hidden></p><button type="button" class="btn big" id="sok">'+X('Next: the words →','Suite : les mots →')+'</button>';
  body.innerHTML=h; var tv=$('.tovid',body); if(tv)tv.onclick=function(e){e.preventDefault();go('videos')};
  wireVideos(body);
  $$('.ch',body).forEach(function(b){b.onclick=function(){st.sel[b.dataset.g]=b.dataset.id;save();$$('.ch[data-g="'+b.dataset.g+'"]',body).forEach(function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
    if(b.dataset.g==='conf'){var c=$('.wk .cell[data-c="tue_am"] .clb',body);if(c)c.innerHTML=cellLabel(m,'tue_am','busy')}}});
  function bc(){var c=$('#bcount',body);if(c)c.innerHTML=X('Busy times: '+st.sel.busy.length+' (2 to 4)','Moments occupés : '+st.sel.busy.length+' (2 à 4)')}
  $$('.wk .cell',body).forEach(function(c){ if(c.disabled)return; c.onclick=function(){var id=c.dataset.c,i=st.sel.busy.indexOf(id);
     if(i>=0)st.sel.busy.splice(i,1);else if(st.sel.busy.length<4)st.sel.busy.push(id);else{say('Maximum 4');return}
     save();var on=st.sel.busy.indexOf(id)>=0;c.classList.toggle('busy',on);c.setAttribute('aria-pressed',on);c.querySelector('.clb').innerHTML=cellLabel(m,id,'busy');bc()}}); bc();
  $('#sok').onclick=function(){ var miss=m.setup.filter(function(q){return q.type==='busy'?(st.sel.busy.length<q.min):!st.sel[q.g]});
    var w=$('#sw'); if(miss.length){w.hidden=false;w.innerHTML=X('Please answer every question first.','Réponds d\'abord à toutes les questions.');say('Please answer every question first.');return}
    nextStep(m) };
}
var DAYS5=[['mon','Mon','lun.'],['tue','Tue','mar.'],['wed','Wed','mer.'],['thu','Thu','jeu.'],['fri','Fri','ven.']];
function cellLabel(m,id,mode){ var st=ms(m.id), busy=(st.sel.busy||[]).indexOf(id)>=0, slot=opt(m,'slot',id), c=opt(m,'conf',st.sel.conf);
  if(id==='tue_am')return '<span class="tag red">'+(c?c.icon:'📌')+' 10:00 ✗</span>';
  var s='';
  if(busy)s+='<span class="tag busy">🙅 '+X('Busy','Occupé')+'</span>';
  if(mode==='game'&&slot)s+='<span class="tag free">🩺 '+slot.time+'</span>';
  if(mode==='game'&&st.sel.slot===id)s+='<span class="tag appt">✅ '+X('New!','Nouveau !')+'</span>';
  return s||'<span class="tag none">·</span>' }
function weekGrid(m,mode){ var st=ms(m.id), h='<div class="wk" role="group" aria-label="Week"><div class="wh"></div>'+DAYS5.map(function(d){return '<div class="wh">'+X(d[1],d[2])+'</div>'}).join('');
  [['am','Morning','Matin'],['pm','Afternoon','Après-midi']].forEach(function(p){ h+='<div class="wh rowh">'+X(p[1],p[2])+'</div>';
    DAYS5.forEach(function(d){var id=d[0]+'_'+p[0], busy=(st.sel.busy||[]).indexOf(id)>=0, fixed=id==='tue_am';
      h+='<button type="button" class="cell'+(busy?' busy':'')+(fixed?' fixed':'')+(mode==='game'&&opt(m,'slot',id)?' offered':'')+'" data-c="'+id+'" aria-label="'+d[1]+' '+p[1]+(fixed?', your appointment':'')+'"'+(mode==='busy'&&!fixed?' aria-pressed="'+busy+'"':'')+(fixed&&mode==='busy'?' disabled':'')+'><span class="clb">'+cellLabel(m,id,mode)+'</span></button>'})});
  return h+'</div>' }
/* ---------- step: vocab ---------- */
function sVocab(m,body){ var st=ms(m.id); st.heard=st.heard||[];
  var h='<h3>'+X('Learn the words','Apprends les mots')+'</h3><p class="small">'+X('Tap each card to hear it. Try to guess the French before you turn it!','Touche chaque carte pour l\'écouter. Essaie de deviner le français avant de la retourner !')+'</p><p class="heard" id="hd"></p><div class="cards">';
  m.vocab.forEach(function(w,i){ h+='<div class="vc"><button type="button" class="vcard'+(st.heard.indexOf(i)>=0?' seen':'')+'" data-i="'+i+'" data-au="'+(w.au||'')+'"><span class="flip"><span class="front"><span class="em" aria-hidden="true">'+w.e+'</span><b lang="en">'+esc(w.w)+'</b><span class="sub" lang="fr">'+esc(w.fr)+'</span></span>'+
     '<span class="back"><b lang="fr">'+esc(w.fr)+'</b><i lang="en">“'+esc(w.ex)+'”</i></span></span></button>'+
      (w.us&&w.auus?'<button type="button" class="us" data-au="'+w.auus+'" aria-label="American English: '+esc(w.us)+'">🇺🇸 US: '+esc(w.us)+' 🔊</button>':'')+'</div>' });
  h+='</div><div class="tip">💡 '+X('The 🇺🇸 buttons give the American word. In London, people speak British English 🇬🇧.','Les boutons 🇺🇸 donnent le mot américain. À Londres, on parle anglais britannique 🇬🇧.')+'</div>';
  h+='<button type="button" class="btn big" id="vok">'+X('I\'m ready →','Je suis prêt·e →')+'</button>';
  body.innerHTML=h;
  function upd(){$('#hd').innerHTML='🎧 '+X(st.heard.length+'/'+m.vocab.length+' cards heard','Cartes écoutées : '+st.heard.length+'/'+m.vocab.length)}
  $$('.vcard',body).forEach(function(c){c.onclick=function(){var i=+c.dataset.i;c.classList.toggle('turned');c.classList.add('seen');if(st.heard.indexOf(i)<0){st.heard.push(i);save()}upd();play(c.dataset.au,c)}});
  upd(); $('#vok').onclick=function(){m.vocab.forEach(function(w,i){var k=vkey(m.id,i);if(!S.vocab[k])S.vocab[k]={b:0,d:0}});nextStep(m)};
}
/* ---------- step: talk (branching dialogue) ---------- */
function npcLine(m,n){ var v=n.npc; if(!v)return null;
  if(Array.isArray(v)&&v.length&&typeof v[0]==='object'&&!Array.isArray(v[0])){for(var i=0;i<v.length;i++)if(cond(v[i].cond,m))return {en:v[i].en,fr:v[i].fr,a:v[i].a};return null}
  return {en:v[0],fr:v[1],a:n.a} }
function pushNode(m,ts,T){ var n=T.nodes[ts.node]; if(!n)return null; var l=npcLine(m,n), amy=n.who==='amy';
  if(l){var au=AK(amy?AMY.v:m.npc.v,l.a||l.en,m);ts.log.push({w:amy?'amy':'npc',en:R(l.en,m),fr:R(l.fr,m,1),au:au});return au}
  if(n.narr)ts.log.push({w:'narr',en:R(n.narr[0],m),fr:R(n.narr[1],m,1)}); return null }
function sTalk(m,body,key){ var st=ms(m.id), T=m.talk[key]; var ts=st.talk[key], first=null;
  if(!ts){ts=st.talk[key]={node:T.start,log:[],tries:{}};first=pushNode(m,ts,T);save()}
  body.innerHTML='<h3>'+X('Talk to '+esc(m.npc.name),'Parle avec '+esc(m.npc.name))+'</h3><p class="small">'+X('Choose what you say. Think: is it clear, correct and polite? If not, you can try again.','Choisis ce que tu dis. Réfléchis : est-ce clair, correct et poli ? Sinon, tu peux réessayer.')+'</p>'+
    '<div class="chat" id="chat"></div><div class="fb" id="fb" hidden role="status"></div><div class="panel" id="panel"></div>';
  drawChat(m,ts); drawPanel(m,ts,T,key); if(first)playSeq([first]);
}
function bubble(m,l){ var me=l.w==='me', amy=l.w==='amy';
  if(l.w==='narr')return '<p class="narr">🎬 '+X(l.en,l.fr)+'</p>';
  return '<div class="bub '+(me?'me':amy?'npc amy':'npc')+'"><span class="face" aria-hidden="true">'+(me?S.profile.avatar:amy?AMY.face:m.npc.face)+'</span><div class="bt"><small>'+(me?esc(nameOf()):amy?esc(AMY.name)+' · '+X(esc(AMY.role[0]),esc(AMY.role[1])):esc(m.npc.name))+'</small><p lang="en">'+l.en+' '+spk(l.au)+'</p>'+SUB(l.fr)+'</div></div>' }
function drawChat(m,ts){var c=$('#chat');c.innerHTML=ts.log.map(function(l){return bubble(m,l)}).join('');var last=c.lastElementChild;if(last&&last.scrollIntoView&&ts.log.length>2)last.scrollIntoView({block:'nearest',behavior:reduced()?'auto':'smooth'})}
function feedback(ok,en,fr){var f=$('#fb');if(!f)return;f.hidden=false;f.className='fb '+(ok?'good':'try');f.innerHTML=(ok?'👍 ':'🤔 ')+X(en,fr);say(en)}
function advance(m,ts,T,to){ var au=null; ts.node=to||'end'; if(ts.node!=='end')au=pushNode(m,ts,T); save(); return au }
function drawPanel(m,ts,T,key){ var p=$('#panel'), n=T.nodes[ts.node], st=ms(m.id);
  function redraw(au,pre){drawChat(m,ts);drawPanel(m,ts,T,key);playSeq([pre,au])}
  if(!n||ts.node==='end'){ p.innerHTML='<p class="done-msg">✅ '+X('Conversation complete!','Dialogue terminé !')+'</p><button type="button" class="btn big" id="tok">'+X('Continue →','Continuer →')+'</button>'; $('#tok').onclick=function(){nextStep(m)}; return }
  if(n.input){ p.innerHTML='<label class="lbl" for="tin">'+X(esc(n.ask[0]),esc(n.ask[1]))+'</label><div class="row"><input id="tin" class="inp" autocomplete="off" maxlength="40"><button type="button" class="btn" id="tgo">'+X('Say it','Le dire')+'</button></div>';
    $('#tgo').onclick=function(){ var v=$('#tin').value.trim();
      if(n.check==='date'&&!/(january|february|march|april|may|june|july|august|september|october|november|december)/i.test(v)){ts.tries[ts.node]=(ts.tries[ts.node]||0)+1;st.tries++;save();feedback(false,'Write the month in English (January, February, March…) and the year. Example: the 14th of March 2010.','Écris le mois en anglais (January, February, March…) et l\'année. Exemple : the 14th of March 2010.');return}
      if(!/\d/.test(v)){feedback(false,'Add the day and the year in numbers.','Ajoute le jour et l\'année en chiffres.');return}
      st.vars[n.input]=v.replace(/[<>{}\[\]]/g,'').replace(/^\w/,function(c){return c}); pts(m,ts.tries[ts.node]?3:5,5); ts.log.push({w:'me',en:R(n.me[0],m),fr:R(n.me[1],m,1),au:null});
      feedback(true,'Well done! In English, months always start with a capital letter.','Bravo ! En anglais, les mois prennent toujours une majuscule.');
      redraw(advance(m,ts,T,n.go)) };
    $('#tin').addEventListener('keydown',function(e){if(e.key==='Enter')$('#tgo').click()}); return }
  if(n.calc==='change'){ var tot=st.vars.totalp||0, ch=2000-tot, choices=shuffle([ch,ch+100,ch>50?ch-50:ch+50],'chg'+tot);
    p.innerHTML='<p class="q2">'+X('How much change should you get back from £20?','Combien doit-on te rendre sur 20 £ ?')+' <small>('+X('Total: ','Total : ')+money(tot)+')</small></p><div class="opts col">'+choices.map(function(c){return '<button type="button" class="say" data-v="'+c+'">'+money(c)+'</button>'}).join('')+'</div>';
    $$('.say',p).forEach(function(b){b.onclick=function(){ if(+b.dataset.v===ch){ pts(m,ts.tries[ts.node]?4:10,10); st.vars.change=money(ch);
        ts.log.push({w:'npc',en:'Here\'s your change: '+money(ch)+'.',fr:'Voici votre monnaie : '+money(ch)+'.',au:null});
        feedback(true,'Yes! £20.00 − '+money(tot)+' = '+money(ch)+'. Always check your change.','Oui ! 20,00 £ − '+money(tot)+' = '+money(ch)+'. Vérifie toujours ta monnaie.');
        redraw(advance(m,ts,T,n.go));
      } else { ts.tries[ts.node]=(ts.tries[ts.node]||0)+1; st.tries++; save(); b.disabled=true; b.classList.add('no'); feedback(false,'Count again: £20.00 minus your total ('+money(tot)+').','Recompte : 20,00 £ moins ton total ('+money(tot)+').') } } }); return }
  if(!n.opts){ p.innerHTML='<button type="button" class="btn big" id="tnext">'+X('Continue →','Continuer →')+'</button>'; $('#tnext').onclick=function(){redraw(advance(m,ts,T,n.next))}; return }
  var os=n.opts.map(function(o,i){return {o:o,i:i}}).filter(function(x){return cond(x.o.cond,m)&&lvlOK(x.o)}); os=shuffle(os,m.id+ts.node+JSON.stringify(st.sel));
  p.innerHTML='<p class="q2">'+X('What do you say?','Que dis-tu ?')+'</p><div class="opts col">'+os.map(function(x){return '<button type="button" class="say" data-i="'+x.i+'"><span lang="en">'+R(x.o.en,m)+'</span>'+SUB(R(x.o.fr,m,1))+'</button>'}).join('')+'</div>';
  $$('.say',p).forEach(function(b){b.onclick=function(){ var o=n.opts[+b.dataset.i], ok=cond(o.ok,m);
    if(ok){ pts(m,ts.tries[ts.node]?4:10,10);
      if(o.set)Object.keys(o.set).forEach(function(k){st.vars[k]=o.set[k]});
      if(o.addp){st.vars.totalp=(st.vars.totalp||0)+o.addp;st.vars.total=money(st.vars.totalp);st.vars.change=money(2000-st.vars.totalp)}
      var mau=AK(m.me_v,o.a||o.en,m); ts.log.push({w:'me',en:R(o.en,m),fr:R(o.fr,m,1),au:mau});
      var fb=o.fb||['Well said!','Bien dit !']; feedback(true,R(fb[0],m),R(fb[1],m,1));
      redraw(advance(m,ts,T,o.go||n.next),mau);
    } else { ts.tries[ts.node]=(ts.tries[ts.node]||0)+1; st.tries=(st.tries||0)+1; save(); b.disabled=true; b.classList.add('no');
      var f=(typeof o.ok==='string'&&o.fb_no)?o.fb_no:(o.fb||['Not quite. Try another answer!','Pas tout à fait. Essaie une autre réponse !']); feedback(false,R(f[0],m),R(f[1],m,1)) } } });
}
/* ---------- step: game ---------- */
function sGame(m,body){ var g=m.game; body.innerHTML='<h3>'+X('Mini-game','Mini-jeu')+'</h3><p class="gbrief">🎮 '+X(esc(g.brief[0]),esc(g.brief[1]))+'</p><div id="game" class="game g-'+g.type+'"></div><div class="fb" id="fb" hidden role="status"></div><div id="gnext"></div>';
  ({shop:gShop,train:gTrain,flight:gFlight,match:gMatch,calendar:gCal,route:gRoute})[g.type](m,$('#game'));
}
function gameDone(m,mist,en,fr){ pts(m,Math.max(10,30-8*mist),30); feedback(true,en,fr);
  $('#gnext').innerHTML='<button type="button" class="btn big" id="gok">'+X('Continue →','Continuer →')+'</button>'; $('#gok').onclick=function(){nextStep(m)};
  var f=$('#fb'); if(f&&f.scrollIntoView)f.scrollIntoView({block:'center',behavior:reduced()?'auto':'smooth'}) }
function miss(m){var st=ms(m.id);st.tries=(st.tries||0)+1;save()}
function shake(el){el.classList.remove('shake');void el.getBoundingClientRect();el.classList.add('shake')}
function phrase(items,fr){ var L=items.map(function(it){var p=it.p,q=it.q;return fr?(q===1?p.fr:NUMF[q]+' × '+p.fr):(q===1?p.one:(NUMW[q]||q)+' '+p.many)});
  return L.length<2?L.join(''):L.slice(0,-1).join(', ')+(fr?' et ':' and ')+L[L.length-1] }
function gShop(m,el){ var g=m.game, st=ms(m.id); st.basket=st.basket||{}; var mist=0, need=[], forbid=[], people=0, main=null, notes=[];
  m.setup.forEach(function(q){var o=opt(m,q.g,st.sel[q.g]);if(!o)return;notes.push(o);if(o.need)need=need.concat(o.need);if(o.forbid)forbid=forbid.concat(o.forbid);if(o.n)people=o.n;if(o.main)main=o.main});
  var P={};g.products.forEach(function(p){P[p.id]=p}); var showTot=lvl()==='a1', word=g.pay?['basket','panier']:['tray','plateau'];
  function items(){return Object.keys(st.basket).filter(function(k){return st.basket[k]>0&&P[k]}).map(function(k){return {p:P[k],q:st.basket[k]}})}
  function total(){return items().reduce(function(s,it){return s+it.p.p*it.q},0)}
  el.innerHTML='<div class="mission-sum">'+notes.map(function(o){return '<span class="pill">'+o.icon+' '+X(esc(o.en),esc(o.fr))+'</span>'}).join('')+'<span class="pill">💷 '+X('Budget: '+money(g.budget),'Budget : '+money(g.budget))+'</span></div>'+
   '<div class="needs"><b>'+X('You need:','Il te faut :')+'</b> '+need.map(function(c){return '<span class="need" data-c="'+c+'">'+X(g.cats[c][0],g.cats[c][1])+'</span>'}).join(' ')+(main&&people?'<p class="small">'+X('Careful with quantities: look at “serves” on the labels.','Attention aux quantités : regarde « serves » (pour … personnes) sur les étiquettes.')+'</p>':'')+'</div>'+
   '<div class="shopgrid"><div class="shelf">'+g.products.map(function(p){var tags=p.tags||[];
     return '<button type="button" class="prod" data-id="'+p.id+'" data-label="'+esc(p.one)+'"><span class="em" aria-hidden="true">'+p.e+'</span><span class="pn" lang="en">'+esc(p.one)+'</span>'+SUB(esc(p.fr))+'<span class="pr">'+money(p.p)+'</span>'+(p.serves?'<span class="sv">'+X('serves '+p.serves,'pour '+p.serves+' pers.')+'</span>':'')+(tags.length?'<span class="tg">'+X('contains: '+tags.map(function(t){return g.tags[t][0]}).join(', '),'contient : '+tags.map(function(t){return g.tags[t][1]}).join(', '))+'</span>':'')+'</button>'}).join('')+'</div>'+
   '<div class="basket drop" id="basket" tabindex="0" aria-label="My '+word[0]+'"><div class="bh">'+(g.pay?'🧺':'🍽️')+' '+X('My '+word[0],'Mon '+word[1])+'</div><ul id="bl"></ul><p class="tot" id="tot"></p><button type="button" class="btn" id="chk">'+X('Check my '+word[0],'Vérifier mon '+word[1])+'</button></div></div>';
  function draw(){ var its=items(), f0=$('#fb'); if(f0&&f0.classList.contains('try'))f0.hidden=true; $('#bl').innerHTML=its.length?its.map(function(it){return '<li><span aria-hidden="true">'+it.p.e+'</span> <span class="q">'+it.q+' ×</span> <span lang="en">'+esc(it.q===1?it.p.one:it.p.many)+'</span> <span class="pr">'+money(it.p.p*it.q)+'</span><span class="pm"><button type="button" class="mini" data-m="'+it.p.id+'" aria-label="Remove one '+esc(it.p.one)+'">−</button><button type="button" class="mini" data-pl="'+it.p.id+'" aria-label="Add one '+esc(it.p.one)+'">+</button></span></li>'}).join(''):'<li class="empty">'+X('Drag products here, or tap a product and then tap here.','Fais glisser les produits ici, ou touche un produit puis touche ici.')+'</li>';
    var t=total(); $('#tot').innerHTML=showTot?X('Total: ','Total : ')+'<b class="'+(t>g.budget?'over':'')+'">'+money(t)+'</b> / '+money(g.budget):X('Total: ? Work it out in your head!','Total : ? Calcule de tête !');
    $$('[data-m]',el).forEach(function(b){b.onclick=function(e){e.stopPropagation();st.basket[b.dataset.m]--;save();draw()}}); $$('[data-pl]',el).forEach(function(b){b.onclick=function(e){e.stopPropagation();add(b.dataset.pl)}});
    if(showTot)$$('.need',el).forEach(function(n){n.classList.toggle('ok',its.some(function(it){return it.p.cat===n.dataset.c}))}) }
  function add(id){st.basket[id]=Math.min(6,(st.basket[id]||0)+1);save();draw();var b=$('#basket');b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');say('Added: '+P[id].one)}
  dnd(el,{item:'.prod',target:'#basket',drop:function(it){add(it.dataset.id)}});
  draw();
  $('#chk').onclick=function(e){ e.stopPropagation(); var its=items(), t=total(), E=[];
    if(!its.length)E.push(['Your '+word[0]+' is empty!','Ton '+word[1]+' est vide !']);
    need.forEach(function(c){if(!its.some(function(it){return it.p.cat===c}))E.push(['You haven\'t got '+g.cats[c][0]+' yet.','Il te manque '+g.cats[c][1]+'.'])});
    if(main&&people){var mains=its.filter(function(it){return it.p.cat===main&&it.p.serves});var serv=mains.reduce(function(s,it){return s+it.p.serves*it.q},0);
      if(mains.length&&serv<people){var p=mains[0].p;E.push(['One '+p.one.replace(/^an? /,'')+' serves '+p.serves+' people. You\'re '+people+': how many do you need?','« '+p.fr+' » est prévu pour '+p.serves+' personnes. Vous êtes '+people+' : combien en faut-il ?'])}}
    its.forEach(function(it){(it.p.tags||[]).forEach(function(tg){if(forbid.indexOf(tg)>=0){var o=notes.filter(function(n){return n.forbid&&n.forbid.indexOf(tg)>=0})[0];E.push([it.p.one.replace(/^./,function(c){return c.toUpperCase()})+' contains '+g.tags[tg][0]+'. Remember: '+(o?o.en:''),'« '+it.p.fr+' » contient '+g.tags[tg][1]+'. Souviens-toi : '+(o?o.fr:'')])}})});
    if(t>g.budget)E.push(['That\'s '+money(t)+': over your budget of '+money(g.budget)+'. Take something out.','Ça fait '+money(t)+' : c\'est plus que ton budget de '+money(g.budget)+'. Enlève quelque chose.']);
    if(E.length){mist++;miss(m);feedback(false,E.map(function(x){return esc(x[0])}).join('<br>'),E.map(function(x){return esc(x[1])}).join('<br>'));return}
    var v=st.vars; v.totalp=t;v.total=money(t);v.items=phrase(its);v.items_fr=phrase(its,1);v.order=v.items;v.order_fr=v.items_fr;if(g.pay)v.change=money(g.pay-t);save();
    $$('.prod,.mini,#chk',el).forEach(function(b){b.disabled=true});
    gameDone(m,mist,'Perfect! Total: '+money(t)+'. You\'ve still got '+money(g.budget-t)+' left. Everything you need is in your '+word[0]+'.','Parfait ! Total : '+money(t)+'. Il te reste '+money(g.budget-t)+'. Tout ce qu\'il te faut est dans ton '+word[1]+'.') };
}
function gTrain(m,el){ var st=fixSel(m), g=m.game, d=opt(m,'dest',st.sel.dest), ev=opt(m,'event',st.sel.event), pl=opt(m,'plan',st.sel.plan), mist=0, a1=lvl()==='a1', dl=hm(ev.at);
  var rows=m.groups.train.map(function(t){var arr=hm(t.time)+t.dur+t.delay;return '<tr><td><button type="button" class="trow" data-id="'+t.id+'" aria-label="'+t.time+' to '+t.destname+', platform '+t.plat+', '+t.status+'">'+t.time+'</button></td><td>'+t.destname+'</td><td class="c">'+t.plat+'</td><td class="'+(t.cancel?'red':t.delay?'amber':'green')+'">'+X(t.status,t.status_fr)+'</td>'+(a1?'<td>'+(t.cancel?'·':fmt(arr))+'</td>':'')+'</tr>'}).join('');
  el.innerHTML='<div class="mission-sum"><span class="pill">'+d.icon+' '+X('To '+d.name,'Pour '+d.name)+'</span><span class="pill">'+ev.icon+' '+X(esc(ev.en),esc(ev.fr))+'</span><span class="pill">'+pl.icon+' '+X(esc(pl.en),esc(pl.fr))+'</span></div>'+
   '<p class="small">'+X('It\'s '+(g.now||'09:15')+'. Tap the time of the train you want to take.','Il est '+(g.now||'09:15').replace(':',' h ').replace(/^0/,'')+'. Touche l\'heure du train que tu veux prendre.')+'</p>'+(g.hint?'<p class="small">💡 '+X(esc(g.hint[0]),esc(g.hint[1]))+'</p>':'')+
   '<div class="board" role="region" aria-label="Departures board"><div class="bt">'+esc(g.board||'🚉 DEPARTURES')+'</div><table><thead><tr><th>Time</th><th>Destination</th><th>Plat.</th><th>Status</th>'+(a1?'<th>Arrives</th>':'')+'</tr></thead><tbody>'+rows+'</tbody></table></div>'+
   (a1?'':'<div class="jt"><b>'+X('Journey times','Durées du trajet')+'</b> '+(g.legs||m.groups.dest.map(function(x){return [x.name,x.dur]})).map(function(x){return '<span>'+x[0]+': '+dur(x[1])+'</span>'}).join(' · ')+'<p class="small">'+X('Work out the arrival time: departure + journey time (+ delay).','Calcule l\'heure d\'arrivée : départ + durée du trajet (+ retard).')+'</p></div>');
  $$('.trow',el).forEach(function(b){b.onclick=function(){ var t=opt(m,'train',b.dataset.id), arr=hm(t.time)+t.dur+t.delay, tr=b.closest('tr'); $$('tr.sel',el).forEach(function(x){x.classList.remove('sel')}); tr.classList.add('sel');
    var E=null;
    if(t.dest!==d.id)E=g.wrong?[g.wrong[0].replace('{to}',t.destname),g.wrong[1].replace('{to}',t.destname)]:['This train goes to '+t.destname+'. You\'re going to '+d.name+'.','Ce train va à '+t.destname+'. Toi, tu vas à '+d.name+'.'];
    else if(t.cancel)E=['This train is cancelled. Look for another one.','Ce train est supprimé. Cherches-en un autre.'];
    else if(arr>dl)E=[(t.delay?'With the delay, it':'It')+' arrives at '+fmt(arr)+': too late for '+ev.en+'.',(t.delay?'Avec le retard, il':'Il')+' arrive à '+fmt(arr)+' : trop tard pour '+ev.fr+'.'];
    if(E){mist++;miss(m);tr.classList.add('bad');feedback(false,esc(E[0]),esc(E[1]));return}
    st.sel.train=t.id; st.vars.arr=fmt(arr); st.vars.price=pl.id==='back'?d.ret:d.single; save(); $$('.trow',el).forEach(function(x){x.disabled=true}); tr.classList.add('good');
    if(ev.short)gameDone(m,mist,'Good choice! The '+t.time+' arrives in '+t.destname+' at '+fmt(arr)+', '+(dl-arr)+' minutes before check-in closes for '+ev.short+'. Platform '+t.plat+'.','Bon choix ! Le train de '+t.time+' arrive à '+t.destname+' à '+fmt(arr)+', '+(dl-arr)+' minutes avant la fin de l\'enregistrement pour '+ev.short_fr+'. Quai '+t.plat+'.');
    else gameDone(m,mist,'Good choice! The '+t.time+' arrives at '+fmt(arr)+', '+(dl-arr)+' minutes before '+ev.en+'. Platform '+t.plat+'.','Bon choix ! Le train de '+t.time+' arrive à '+fmt(arr)+', '+(dl-arr)+' minutes avant '+ev.fr+'. Quai '+t.plat+'.') }});
}
function gFlight(m,el){ var g=m.game, st=ms(m.id), nd=opt(m,'need',st.sel.need), ds=opt(m,'dest',st.sel.dest), mist=0;
  el.innerHTML='<div class="mission-sum"><span class="pill">'+ds.icon+' '+X('To '+ds.name,'Pour '+esc(ds.fr))+'</span></div><div class="need-box">'+nd.icon+' <b>'+X('My situation:','Ma situation :')+'</b> '+X(esc(nd.en),esc(nd.fr))+'</div>'+
   '<div class="flights">'+m.groups.flight.map(function(f){return '<div class="fl" data-id="'+f.id+'"><div class="fh">'+f.icon+' <b>'+f.code+'</b> <small>'+f.airline+'</small></div><dl>'+
     '<dt>'+X('Departs','Départ')+'</dt><dd>'+f.dep+'</dd><dt>'+X('Arrives','Arrivée')+'</dt><dd>'+f.arr+'</dd><dt>'+X('Duration','Durée')+'</dt><dd>'+f.dur+'</dd><dt>'+X('Stops','Escales')+'</dt><dd>'+X(f.stops,f.stops_fr)+'</dd>'+
     '<dt>'+X('Price','Prix')+'</dt><dd><b>£'+f.price+'</b></dd><dt>'+X('Suitcase','Valise')+'</dt><dd>'+(f.bag?'+£'+f.bag:X('included ✓','incluse ✓'))+'</dd></dl><button type="button" class="btn sm pick" data-id="'+f.id+'">'+X('Choose '+f.code,'Choisir '+f.code)+'</button></div>'}).join('')+'</div><div id="just"></div>';
  $$('.pick',el).forEach(function(b){b.onclick=function(){ var f=b.dataset.id, F=opt(m,'flight',f);
    if(f!==nd.best){mist++;miss(m);var e=g.fb[nd.id][f];shake(b.closest('.fl'));feedback(false,esc(e[0]),esc(e[1]));return}
    st.sel.flight=f; st.vars.price=nd.bag?F.tot1:F.tot0; save(); $$('.pick',el).forEach(function(x){x.disabled=true}); b.closest('.fl').classList.add('good');
    feedback(true,'Yes! Flight '+F.code+' is the best for you. Now explain why.','Oui ! Le vol '+F.code+' est le meilleur pour toi. Maintenant, explique pourquoi.'); justify(f,F.code) }});
  function justify(f,code){ var J=$('#just',el), chosen=[];
    J.innerHTML='<h4>'+X('Explain your choice: pick 1 or 2 true reasons','Explique ton choix : choisis 1 ou 2 raisons vraies')+'</h4><p class="sentence" lang="en">I chose flight '+code+' because it <span id="js">…</span></p><div class="chips">'+
      shuffle(Object.keys(g.chips),'chips').map(function(k){return '<button type="button" class="chip" data-k="'+k+'" aria-pressed="false">'+X(g.chips[k][0],g.chips[k][1])+'</button>'}).join('')+'</div><button type="button" class="btn" id="jok">'+X('Check my sentence','Vérifier ma phrase')+'</button>';
    function upd(){$('#js').textContent=chosen.length?chosen.map(function(k){return g.chips[k][0]}).join(' and it ')+'.':'…'}
    $$('.chip',J).forEach(function(c){c.onclick=function(){var k=c.dataset.k,i=chosen.indexOf(k);if(i>=0)chosen.splice(i,1);else{if(chosen.length>=2)chosen.shift();chosen.push(k)}$$('.chip',J).forEach(function(x){var on=chosen.indexOf(x.dataset.k)>=0;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});upd()}});
    $('#jok').onclick=function(){ if(!chosen.length){feedback(false,'Pick at least one reason.','Choisis au moins une raison.');return}
      var P=g.props[f], wrong=chosen.filter(function(k){return P.indexOf(k)<0});
      if(wrong.length){mist++;miss(m);feedback(false,'Not true for flight '+code+': “it '+g.chips[wrong[0]][0]+'”. Check the table again.','Pas vrai pour le vol '+code+' : « il '+g.chips[wrong[0]][1]+' ». Regarde encore le tableau.');return}
      if(!chosen.some(function(k){return g.rel[nd.id].indexOf(k)>=0})){mist++;miss(m);feedback(false,'True, but that\'s not why it\'s the best for YOU. Read your situation again.','C\'est vrai, mais ce n\'est pas pour ça qu\'il est le meilleur pour TOI. Relis ta situation.');return}
      st.vars.just='I chose it because it '+chosen.map(function(k){return g.chips[k][0]}).join(' and it ')+'.'; st.vars.just_fr='Je l\'ai choisi parce qu\'il '+chosen.map(function(k){return g.chips[k][1]}).join(' et qu\'il ')+'.'; save();
      $$('.chip,#jok',J).forEach(function(x){x.disabled=true});
      gameDone(m,mist,'Great reasoning! “'+st.vars.just+'” Total price for you: '+st.vars.price+'.','Bon raisonnement ! « '+st.vars.just_fr+' » Prix total pour toi : '+st.vars.price+'.') } }
}
function bodySVG(){return '<svg viewBox="0 0 200 330" class="bodyfig" aria-hidden="true"><g stroke="#2b2d42" stroke-width="3" stroke-linejoin="round">'+
  '<rect x="84" y="78" width="32" height="24" rx="6" fill="#ffd8b5"/><path d="M58 100 Q100 92 142 100 L150 200 Q100 210 50 200 Z" fill="#7cc6fe"/>'+
  '<path d="M60 106 L30 180 L24 192" fill="none" stroke-width="15" stroke-linecap="round"/><path d="M60 106 L30 180 L24 192" fill="none" stroke="#ffd8b5" stroke-width="9" stroke-linecap="round"/>'+
  '<path d="M140 106 L170 180 L176 192" fill="none" stroke-width="15" stroke-linecap="round"/><path d="M140 106 L170 180 L176 192" fill="none" stroke="#ffd8b5" stroke-width="9" stroke-linecap="round"/>'+
  '<circle cx="24" cy="198" r="10" fill="#ffd8b5"/><circle cx="176" cy="198" r="10" fill="#ffd8b5"/>'+
  '<path d="M62 198 L68 300 L92 300 L100 220 L108 300 L132 300 L138 198 Z" fill="#3a5a98"/><ellipse cx="80" cy="306" rx="18" ry="8" fill="#2b2d42"/><ellipse cx="120" cy="306" rx="18" ry="8" fill="#2b2d42"/>'+
  '<ellipse cx="137" cy="50" rx="7" ry="11" fill="#ffd8b5"/><ellipse cx="63" cy="50" rx="7" ry="11" fill="#ffd8b5"/><circle cx="100" cy="48" r="36" fill="#ffd8b5"/></g>'+
  '<path d="M64 38 Q100 0 136 38 Q120 18 100 21 Q80 18 64 38Z" fill="#6b4226"/><circle cx="88" cy="46" r="4" fill="#2b2d42"/><circle cx="112" cy="46" r="4" fill="#2b2d42"/><path d="M88 62 Q100 70 112 62" fill="none" stroke="#2b2d42" stroke-width="3" stroke-linecap="round"/></svg>'}
function gMatch(m,el){ var g=m.game, placed={}, mist=0, items=shuffle(g.items,'match'+m.id), lay=g.layout;
  var tg='<div class="targets t-'+lay+'">'+(lay==='body'?bodySVG():'')+g.targets.map(function(t){
    var pos=lay==='body'?' style="left:'+t.x+'%;top:'+t.y+'%"':'';
    return '<div class="tgt drop" tabindex="0" role="button" data-id="'+t.id+'"'+pos+' aria-label="'+esc(t.en)+'">'+(t.e?'<span class="em" aria-hidden="true">'+t.e+'</span>':'')+'<b>'+(lay==='order'?t.en+'.':X(esc(t.en),esc(t.fr)))+'</b><span class="slot"></span></div>'}).join('')+'</div>';
  var tr='<div class="tray">'+items.map(function(it){return '<button type="button" class="tok" data-id="'+it.id+'" data-label="'+esc(it.en)+'">'+(it.e?'<span aria-hidden="true">'+it.e+'</span> ':'')+'<span lang="en">'+esc(it.en)+'</span>'+SUB(esc(it.fr))+'</button>'}).join('')+'</div>';
  el.innerHTML=lay==='order'?'<div class="ogrid">'+tr+tg+'</div>':'<div class="mgrid">'+tg+tr+'</div>';
  dnd(el,{item:'.tok',target:'.tgt',drop:function(it,t){ if(placed[t.dataset.id])return;
    if(it.dataset.id===t.dataset.id){ placed[t.dataset.id]=1; t.classList.add('filled'); var I=g.items.filter(function(x){return x.id===it.dataset.id})[0];
      $('.slot',t).innerHTML='<span lang="en">'+(I.e?I.e+' ':'')+esc(I.en)+'</span>'+(I.au?' '+spk(I.au):''); it.remove(); if(I.au)play(I.au);
      var left=$$('.tok',el).length;
      if(!left)gameDone(m,mist,lay==='order'?'Perfect order! A phone call: greet → ask for the person → say who you are → the reason → useful information → goodbye.':'All correct! Well done.',lay==='order'?'Ordre parfait ! Un appel : saluer → demander la personne → dire qui on est → la raison → l\'information utile → au revoir.':'Tout est juste ! Bravo.');
      else feedback(true,'Correct! '+left+' left.','Juste ! Encore '+left+'.');
    } else { mist++; miss(m); shake(t);
      feedback(false,lay==='order'?'Not this position. Think: how does a phone call start and end?':'Not quite: “'+esc(it.dataset.label)+'” doesn\'t go here. Try another place.',lay==='order'?'Pas à cette place. Réfléchis : comment commence et finit un appel ?':'Pas tout à fait : « '+esc(it.dataset.label)+' » ne va pas ici. Essaie un autre endroit.') } }});
}
function gCal(m,el){ var st=ms(m.id), mist=0;
  el.innerHTML='<button type="button" class="appt tok" data-label="New appointment">🩺 '+X('Appointment with Dr Shah: drag me!','Rendez-vous avec le Dr Shah : fais-moi glisser !')+'</button>'+weekGrid(m,'game')+
   '<p class="legend"><span class="tag free">🩺 '+X('free at the medical centre','libre au cabinet')+'</span> <span class="tag busy">🙅 '+X('you\'re busy','tu es occupé·e')+'</span></p>';
  $$('.wk .cell',el).forEach(function(c){c.classList.add('drop')});
  dnd(el,{item:'.appt',target:'.cell',drop:function(it,c){ var id=c.dataset.c, slot=opt(m,'slot',id), busy=(st.sel.busy||[]).indexOf(id)>=0, conf=opt(m,'conf',st.sel.conf), E=null;
    if(id==='tue_am')E=['That\'s your old appointment: you can\'t make it ('+conf.short+').','C\'est ton ancien rendez-vous : tu ne peux pas venir ('+conf.short_fr+').'];
    else if(!slot)E=['The medical centre has no appointments then. Look for the 🩺 times.','Le cabinet n\'a pas de rendez-vous à ce moment-là. Cherche les horaires 🩺.'];
    else if(busy)E=['The doctor is free, but YOU are busy then (look at your week).','Le médecin est libre, mais TOI tu es occupé·e (regarde ta semaine).'];
    if(E){mist++;miss(m);shake(c);feedback(false,esc(E[0]),esc(E[1]));return}
    st.sel.slot=id; save(); $$('.wk .cell',el).forEach(function(x){x.querySelector('.clb').innerHTML=cellLabel(m,x.dataset.c,'game');x.disabled=true}); it.remove();
    gameDone(m,mist,'Great! '+slot.label+' at '+slot.time+' works for you and for the doctor.','Super ! '+slot.fr+' à '+slot.time_fr+' : ça te convient, et au médecin aussi.') }});
}
function routeSVG(m,interactive){ var g=MI.way.game, s='<svg viewBox="0 0 400 590" class="rmap" role="group" aria-label="Street map"><rect width="400" height="590" fill="#cfe8c4"/>';
  s+='<rect x="188" y="62" width="24" height="510" fill="#8d99ae"/><rect x="0" y="418" width="400" height="24" fill="#8d99ae"/><rect x="0" y="238" width="400" height="24" fill="#8d99ae"/>';
  s+='<line x1="200" y1="70" x2="200" y2="570" stroke="#fff" stroke-dasharray="8 8" stroke-width="2"/><line x1="0" y1="430" x2="400" y2="430" stroke="#fff" stroke-dasharray="8 8" stroke-width="2"/><line x1="0" y1="250" x2="400" y2="250" stroke="#fff" stroke-dasharray="8 8" stroke-width="2"/>';
  g.buildings.forEach(function(b){ s+='<g class="rb'+(interactive?' clickable':'')+'" data-id="'+b.id+'"'+(interactive?' tabindex="0" role="button" aria-label="'+esc(b.en)+'"':'')+'><rect x="'+(b.x-b.w/2)+'" y="'+(b.y-b.h/2)+'" width="'+b.w+'" height="'+b.h+'" rx="6" fill="#fff" stroke="#2b2d42" stroke-width="1.6"/><text x="'+b.x+'" y="'+(b.y-2)+'" text-anchor="middle" font-size="17">'+b.e+'</text><text x="'+b.x+'" y="'+(b.y+15)+'" text-anchor="middle" font-size="9.5" font-weight="700" fill="#2b2d42">'+esc(b.en)+'</text></g>' });
  s+='<text x="200" y="586" text-anchor="middle" font-size="22">⭐</text><text x="222" y="582" font-size="11" font-weight="700" fill="#2b2d42">You are here ↑</text>';
  return s+'</svg>' }
function gRoute(m,el){ var g=m.game, r=0, mist=0, a1=lvl()==='a1';
  el.innerHTML='<div class="rgrid"><div class="rmapbox">'+routeSVG(m,true)+'</div><div class="rinfo" id="rinfo"></div></div>';
  function show(){ var rd=g.rounds[r], au=AK(m.npc.v,rd.dir,m);
    $('#rinfo').innerHTML='<p class="rn">'+X('Directions '+(r+1)+'/'+g.rounds.length,'Indications '+(r+1)+'/'+g.rounds.length)+'</p><div class="npcmini"><span aria-hidden="true">'+m.npc.face+'</span> '+esc(m.npc.name)+'</div>'+(au?'<button type="button" class="btn" data-au="'+au+'">🔊 '+X('Listen','Écouter')+'</button>':'')+
      '<div class="dirtext"'+(a1||!au?'':' hidden')+'><p lang="en">“'+R(rd.dir,m)+'”</p>'+SUB(R(rd.dir_fr,m,1))+'</div>'+(a1||!au?'':'<button type="button" class="btn ghost sm" id="showt">'+X('Show the text','Afficher le texte')+'</button>');
    var s=$('#showt');if(s)s.onclick=function(){$('.dirtext').hidden=false;s.remove()}; playSeq([au]) }
  $$('.rb',el).forEach(function(b){ function hit(){ if(r>=g.rounds.length)return; var ans=R(g.rounds[r].ans,m);
      if(b.dataset.id===ans){ b.classList.add('ok'); r++; if(r>=g.rounds.length){gameDone(m,mist,'You followed all the directions! You\'re a real pathfinder.','Tu as suivi toutes les indications ! Tu sais vraiment t\'orienter.');return}
        feedback(true,'Yes, that\'s it! Next directions…','Oui, c\'est ça ! Indications suivantes…'); setTimeout(show,reduced()?0:700) }
      else { mist++; miss(m); var B=g.buildings.filter(function(x){return x.id===b.dataset.id})[0]; shake(b);
        feedback(false,'That\'s the '+esc(B.en)+'. Listen again and follow the directions from ⭐, step by step.','Ça, c\'est '+esc(B.fr)+'. Réécoute et suis les indications depuis ⭐, étape par étape.') } }
    b.addEventListener('click',hit); b.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();hit()}}) });
  show();
}
/* ---------- step: personal production ---------- */
var rec=null, recChunks=[], recURL=null;
function sProd(m,body){ var st=ms(m.id), P=m.prod, a1=lvl()==='a1', need=a1?12:25;
  var model=P.model.map(function(l){var me=l[0]==='me',au=AK(me?m.me_v:m.npc.v,l[1],m);return '<li class="'+(me?'me':'npc')+'"><b>'+(me?esc(nameOf()):esc(m.npc.name))+':</b> <span lang="en">'+B(R(l[1],m))+'</span> '+spk(au)+'</li>'}).join('');
  var checks=P.check.filter(lvlOK);
  body.innerHTML='<h3>'+X('Your turn!','À toi !')+'</h3><div class="task">🎤 '+X(esc(P.task[0]),esc(P.task[1]))+'</div>'+(P.map?'<details class="mapd"><summary>'+X('See the map','Voir le plan')+'</summary>'+routeSVG(m,false)+'</details>':'')+
   '<details class="model"'+(a1?' open':'')+'><summary>'+X('See a model with YOUR choices','Voir un modèle avec TES choix')+'</summary><ol class="mdl">'+model+'</ol><p class="small">'+X('Key words are in bold. Change things and add details: make it YOUR conversation!','Les mots clés sont en gras. Change des choses et ajoute des détails : fais-en TA conversation !')+'</p></details>'+
   '<label class="lbl" for="ptx">'+X('Write your conversation:','Écris ton dialogue :')+'</label><textarea id="ptx" class="inp" rows="7" placeholder="Hello! …">'+esc(st.prodText||'')+'</textarea><p class="small" id="wc"></p>'+
   '<p class="lbl">'+X('My checklist','Ma liste de vérification')+'</p><ul class="checks" id="cks">'+checks.map(function(c,i){return '<li><label><input type="checkbox" data-i="'+i+'"> '+X(esc(c.en),esc(c.fr))+'</label></li>'}).join('')+'</ul>'+
   '<div class="recbox"><p><b>🎙️ '+X('Or record yourself','Ou enregistre-toi')+'</b> '+X('(the recording stays on your device: nothing is sent)','(l\'enregistrement reste sur ton appareil : rien n\'est envoyé)')+'</p><button type="button" class="btn" id="rec">⏺ '+X('Record','Enregistrer')+'</button> <span id="recst"></span><div id="recout"></div>'+
   '<p class="small">'+X('No microphone? Use your phone\'s voice recorder, then upload your file to the ENT.','Pas de micro ? Utilise le dictaphone de ton téléphone, puis dépose le fichier sur l\'ENT.')+'</p></div>'+
   '<div class="row"><button type="button" class="btn ghost" id="cpy">📋 '+X('Copy my text (for the ENT)','Copier mon texte (pour l\'ENT)')+'</button><a class="btn ghost" href="fiches.html#'+m.id+'" target="_blank" rel="noopener">🖨️ '+X('Worksheet','Fiche à compléter')+'</a></div><p class="warn" id="pw" hidden></p><button type="button" class="btn big" id="pok">'+X('I\'ve finished →','J\'ai fini →')+'</button>';
  var ta=$('#ptx'), recorded=false;
  function chk(){ var t=ta.value, n=(t.match(/[A-Za-z’']+/g)||[]).length; $('#wc').innerHTML=X(n+' words (aim: '+need+' or more)',n+' mots (objectif : '+need+' ou plus)');
    checks.forEach(function(c,i){ if(!c.re)return; var k=(t.match(new RegExp(c.re,'gi'))||[]).length, cb=$('#cks input[data-i="'+i+'"]'), li=cb.closest('li');
      if(k>=(c.min||1)){cb.checked=true;li.classList.add('auto')} else if(li.classList.contains('auto')){cb.checked=false;li.classList.remove('auto')} });
    st.prodText=t; save(); return n }
  ta.addEventListener('input',chk); chk();
  $('#cpy').onclick=function(){var t='Mission '+m.num+': '+m.title[0]+'\n'+nameOf()+'\n\n'+ta.value, b=this;
    function ok(){b.innerHTML='✅ '+X('Copied!','Copié !');say('Copied')}
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(ok,function(){ta.select();try{document.execCommand('copy');ok()}catch(e){}});else{ta.select();try{document.execCommand('copy');ok()}catch(e){}}};
  $('#rec').onclick=function(){ var btn=this;
    if(rec&&rec.state==='recording'){rec.stop();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){$('#recst').innerHTML=X('Recording isn\'t available in this browser: use your phone.','L\'enregistrement n\'est pas disponible dans ce navigateur : utilise ton téléphone.');return}
    navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){ recChunks=[]; rec=new MediaRecorder(s); rec.ondataavailable=function(e){recChunks.push(e.data)};
      rec.onstop=function(){s.getTracks().forEach(function(t){t.stop()}); if(recURL)URL.revokeObjectURL(recURL); var b=new Blob(recChunks,{type:rec.mimeType||'audio/webm'}); recURL=URL.createObjectURL(b); recorded=true; st.recorded=true; save();
        $('#recout').innerHTML='<audio controls src="'+recURL+'"></audio> <a class="btn ghost sm" download="mission'+m.num+'-'+esc(nameOf())+'.webm" href="'+recURL+'">⬇ '+X('Download (for the ENT)','Télécharger (pour l\'ENT)')+'</a>'; btn.innerHTML='⏺ '+X('Record again','Réenregistrer'); $('#recst').textContent=''};
      rec.start(); btn.innerHTML='⏹ '+X('Stop','Arrêter'); $('#recst').innerHTML='<span class="recdot"></span> '+X('Recording…','Enregistrement…');
      setTimeout(function(){if(rec&&rec.state==='recording')rec.stop()},120000) }).catch(function(){$('#recst').innerHTML=X('Microphone not allowed. You can write, or record on your phone.','Micro non autorisé. Tu peux écrire, ou t\'enregistrer avec ton téléphone.')}) };
  $('#pok').onclick=function(){ var n=chk(); if(n<need&&!recorded){var w=$('#pw');w.hidden=false;w.innerHTML=X('Write at least '+need+' words, or record yourself. The model can help you!','Écris au moins '+need+' mots, ou enregistre-toi. Le modèle peut t\'aider !');say('Write at least '+need+' words, or record yourself.');return}
    var ticked=$$('#cks input:checked').length; pts(m,10+Math.round(10*ticked/Math.max(1,checks.length)),20); st.ticks=ticked; save(); nextStep(m) };
}
/* ---------- step: recap (retrieval from memory) ---------- */
function sRecap(m,body){ var st=ms(m.id), a1=lvl()==='a1', idx=m.recap;
  body.innerHTML='<h3>'+X('What I learnt','Ce que j\'ai appris')+'</h3><p class="small">'+X('From memory! Write the English for these 5 words or phrases. Don\'t look back: remembering is how you learn.','De mémoire ! Écris l\'anglais de ces 5 mots ou expressions. Ne regarde pas en arrière : c\'est en se souvenant qu\'on apprend.')+'</p>'+
   '<ol class="recall">'+idx.map(function(i,k){var w=m.vocab[i];return '<li><span class="em" aria-hidden="true">'+w.e+'</span><label for="rc'+k+'"><span lang="fr">'+esc(w.fr)+'</span>'+(a1?' <small class="hint">('+esc(hintOf(w))+')</small>':'')+'</label><input id="rc'+k+'" class="inp" autocomplete="off" autocapitalize="off" spellcheck="false" data-i="'+i+'"><span class="res"></span></li>'}).join('')+'</ol>'+
   '<button type="button" class="btn" id="rck">'+X('Check','Vérifier')+'</button><div class="fb" id="fb" hidden role="status"></div><div id="refl"></div>';
  $('#rck').onclick=function(){ var ok=0; $$('.recall input',body).forEach(function(inp){var i=+inp.dataset.i,w=m.vocab[i],good=close(inp.value,answersOf(w));if(good)ok++;vbump(vkey(m.id,i),good);inp.readOnly=true;inp.classList.add(good?'okv':'nov');
      inp.nextElementSibling.innerHTML=(good?'✅ ':'💡 ')+'<b lang="en">'+esc(w.w)+'</b> '+spk(w.au)});
    save(); pts(m,ok*6,30); this.disabled=true;
    feedback(ok>=3,ok+'/5 from memory. '+(ok===5?'Brilliant!':ok>=3?'Well done! Your notebook will bring back the 💡 words.':'Good effort! Your notebook will bring these words back in a few days.'),ok+'/5 de mémoire. '+(ok===5?'Génial !':ok>=3?'Bravo ! Ton carnet te refera travailler les mots 💡.':'Bel effort ! Ton carnet te reproposera ces mots dans quelques jours.'));
    $('#refl').innerHTML='<label class="lbl" for="rf">'+X('In real life, next time, I will say:','Dans la vraie vie, la prochaine fois, je dirai :')+'</label><input id="rf" class="inp" maxlength="140" placeholder="Next time, I\'ll say…" value="'+esc(st.reflect||'')+'"><button type="button" class="btn big" id="fin">🏁 '+X('Finish the mission','Terminer la mission')+'</button>';
    $('#fin').onclick=function(){st.reflect=$('#rf').value.trim().replace(/[<>]/g,'');finish(m)} };
}
function finish(m){ var st=ms(m.id), r=st.max?st.pts/st.max:1, stars=r>=0.85?3:r>=0.6?2:1;
  st.done=true; st.stars=Math.max(st.stars||0,stars); st.best=Math.max(st.best||0,st.pts); st.step=m.steps.length; st.when=Date.now(); S.pos=m.id;
  if(S.badges.indexOf(m.id)<0)S.badges.push(m.id); save(); head();
  var all=totals().done===9, ov=document.createElement('div'); ov.className='overlay'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.setAttribute('aria-labelledby','ovt');
  ov.innerHTML='<div class="ovc'+(document.body.classList.contains('tr')?' tr':'')+'">'+(reduced()?'':confetti())+'<p class="big-ic" aria-hidden="true">'+m.badge.icon+'</p><h2 id="ovt">'+X('Mission complete!','Mission accomplie !')+'</h2><p class="stars" aria-label="'+stars+' stars">'+'⭐'.repeat(stars)+'<span class="dim">'+'☆'.repeat(3-stars)+'</span></p>'+
   '<p>'+X('New badge: <b>'+esc(m.badge.en)+'</b>','Nouveau badge : <b>'+esc(m.badge.fr)+'</b>')+'</p><p class="small">'+X(st.pts+' points · '+(st.tries?st.tries+' tries that helped you learn':'perfect first time!'),st.pts+' points · '+(st.tries?st.tries+' essais qui t\'ont aidé·e à apprendre':'parfait du premier coup !'))+'</p>'+
   '<div class="row c"><button type="button" class="btn big" id="ovm">'+(all?'🏆 '+X('See my certificate','Voir mon diplôme'):'🗺️ '+X('Back to the map','Retour au plan'))+'</button><a class="btn ghost" href="fiches.html#'+m.id+'" target="_blank" rel="noopener">🖨️ '+X('My worksheet','Ma fiche')+'</a><button type="button" class="btn ghost" id="ovn">📒 '+X('Notebook','Carnet')+'</button></div></div>';
  document.body.appendChild(ov); var b=$('#ovm'); b.focus();
  function shut(v){ov.remove();go(v)} b.onclick=function(){if(all){S.finalSeen=true;save();shut('final')}else shut('map')}; $('#ovn').onclick=function(){shut('notebook')};
  ov.addEventListener('keydown',function(e){if(e.key==='Escape')shut('map')});
}
function confetti(){var s='<div class="confetti" aria-hidden="true">';for(var i=0;i<26;i++)s+='<i style="left:'+(i*37%100)+'%;animation-delay:'+(i%7)*0.12+'s;background:'+['#ef476f','#ffd166','#06d6a0','#118ab2','#7c5cff'][i%5]+'"></i>';return s+'</div>'}
/* ---------- notebook + spaced review ---------- */
function vNotebook(tab){ tab=tab||'words';
  app.innerHTML='<section class="card nb"><h2>📒 '+X('My notebook','Mon carnet')+'</h2><div class="tabs" role="tablist">'+[['words','My words','Mes mots'],['review','Review','Réviser'],['texts','My choices & texts','Mes choix et textes']].map(function(t){return '<button type="button" role="tab" class="tab'+(tab===t[0]?' on':'')+'" aria-selected="'+(tab===t[0])+'" data-t="'+t[0]+'">'+X(t[1],t[2])+'</button>'}).join('')+'</div><div id="nbb" role="tabpanel"></div></section>';
  $$('.tab',app).forEach(function(b){b.onclick=function(){vNotebook(b.dataset.t)}});
  ({words:nbWords,review:nbReview,texts:nbTexts})[tab]($('#nbb'));
}
function seenMissions(){return MS.filter(function(m){var st=S.m[m.id];return st&&(st.done||st.step>=2)})}
function nbWords(nb){ var L=seenMissions(); if(!L.length){nb.innerHTML='<p>'+X('Your words will appear here after the “Words” step of a mission.','Tes mots apparaîtront ici après l\'étape « Les mots » d\'une mission.')+'</p>';return}
  var tot=0; nb.innerHTML=L.map(function(m){return '<h3>'+m.icon+' '+X(esc(m.title[0]),esc(m.title[1]))+'</h3><ul class="wl">'+m.vocab.map(function(w,i){tot++;var v=S.vocab[vkey(m.id,i)]||{b:0},b=Math.min(6,v.b||0);return '<li><span aria-hidden="true">'+w.e+'</span> <b lang="en">'+esc(w.w)+'</b> <span class="frw">'+X('',esc(w.fr))+'</span> '+spk(w.au)+' <span class="box" aria-label="Memory level '+b+' of 6">'+'●'.repeat(b)+'○'.repeat(6-b)+'</span></li>'}).join('')+'</ul>'}).join('')+'<p class="small">'+X('● = memory level. Each good answer in Review moves a word up. '+tot+' words so far.','● = niveau de mémoire. Chaque bonne réponse en révision fait monter le mot. '+tot+' mots pour l\'instant.')+'</p>'+
   '<p><button type="button" class="btn ghost sm" id="reset">↺ '+X('Start again (erase my progress on this device)','Recommencer (effacer ma progression sur cet appareil)')+'</button></p>';
  $('#reset').onclick=function(){if(confirm(document.body.classList.contains('tr')?'Effacer toute ta progression sur cet appareil ?':'Erase all your progress on this device?')){S=fresh();save();go('welcome')}};
}
function pool(){ var out=[]; seenMissions().forEach(function(m){m.vocab.forEach(function(w,i){var k=vkey(m.id,i),v=S.vocab[k]||{b:0,d:0};out.push({m:m,w:w,i:i,k:k,b:v.b||0,d:v.d||0})})}); return out }
function nbReview(nb){ var P=pool(); if(P.length<4){nb.innerHTML='<p>'+X('Finish the “Words” step of a mission first, then come back to review.','Termine d\'abord l\'étape « Les mots » d\'une mission, puis reviens réviser.')+'</p>';return}
  var now=Date.now(), due=P.filter(function(x){return x.d<=now}).length;
  nb.innerHTML='<p>'+X('Spaced review: words come back just before you forget them, and the quiz mixes your missions. Today: <b>'+due+'</b> words to review.','Révision espacée : les mots reviennent juste avant que tu les oublies, et le quiz mélange tes missions. Aujourd\'hui : <b>'+due+'</b> mots à revoir.')+'</p><button type="button" class="btn big" id="rvs">🧠 '+X('Start a review (8 questions)','Lancer une révision (8 questions)')+'</button>';
  $('#rvs').onclick=function(){quiz(nb,P)} }
function quiz(nb,P){ var now=Date.now(), byM={};
  P.slice().sort(function(a,b){var da=a.d<=now?0:1,db=b.d<=now?0:1;return da-db||a.b-b.b||(Math.random()-0.5)}).forEach(function(x){(byM[x.m.id]=byM[x.m.id]||[]).push(x)});
  var keys=Object.keys(byM), Q=[]; while(Q.length<8&&keys.some(function(k){return byM[k].length})){keys.forEach(function(k){if(Q.length<8&&byM[k].length)Q.push(byM[k].shift())})}
  var qi=0, score=0, types=['type','pick','listen'];
  function ask(){ if(qi>=Q.length)return end(); var q=Q[qi], t=types[qi%3]; if(t==='listen'&&!q.w.au)t='pick';
    var others=shuffle(P.filter(function(x){return x.k!==q.k&&x.w.w!==q.w.w}),'o'+qi+q.k+now).slice(0,3).map(function(x){return x.w.w}), ch=shuffle(others.concat([q.w.w]),'c'+qi+now);
    var h='<p class="qn">'+X('Question '+(qi+1)+'/'+Q.length,'Question '+(qi+1)+'/'+Q.length)+' · '+q.m.icon+' '+X(esc(q.m.place[0]),esc(q.m.place[1]))+'</p>';
    if(t==='type')h+='<p class="qq"><span class="em" aria-hidden="true">'+q.w.e+'</span> <span lang="fr">'+esc(q.w.fr)+'</span></p><label class="lbl" for="qa">'+X('Write it in English:','Écris-le en anglais :')+'</label><div class="row"><input id="qa" class="inp" autocomplete="off" autocapitalize="off" spellcheck="false"><button type="button" class="btn" id="qok">OK</button></div>';
    else h+='<p class="qq">'+(t==='listen'?'<button type="button" class="btn" data-au="'+q.w.au+'">🔊 '+X('Listen','Écouter')+'</button> '+X('Which one do you hear?','Lequel entends-tu ?'):'<span class="em" aria-hidden="true">'+q.w.e+'</span> <span lang="fr">'+esc(q.w.fr)+'</span>')+'</p><div class="opts col">'+ch.map(function(c){return '<button type="button" class="say" data-v="'+esc(c)+'"><span lang="en">'+esc(c)+'</span></button>'}).join('')+'</div>';
    nb.innerHTML=h+'<div class="fb" id="fb" hidden role="status"></div><div id="qn"></div>';
    if(t==='listen')play(q.w.au);
    function res(good){ vbump(q.k,good); if(good)score++; save(); feedback(good,good?'Correct!':'The answer is: <b>'+esc(q.w.w)+'</b>',good?'Juste !':'La réponse est : <b>'+esc(q.w.w)+'</b>'); if(t!=='listen')play(q.w.au);
      $('#qn').innerHTML='<button type="button" class="btn" id="qnx">'+X('Next →','Suivant →')+'</button>'; $('#qnx').onclick=function(){qi++;ask()}; $('#qnx').focus() }
    if(t==='type'){ var inp=$('#qa'); try{inp.focus()}catch(e){} $('#qok').onclick=function(){if(inp.readOnly)return;inp.readOnly=true;res(close(inp.value,answersOf(q.w)))}; inp.addEventListener('keydown',function(e){if(e.key==='Enter')$('#qok').click()}) }
    else $$('.say',nb).forEach(function(b){b.onclick=function(){$$('.say',nb).forEach(function(x){x.disabled=true});var good=b.dataset.v===q.w.w;b.classList.add(good?'yes':'no');res(good)}}) }
  function end(){ S.reviews=(S.reviews||0)+1; if(S.reviews>=2&&S.badges.indexOf('memory')<0)S.badges.push('memory'); save(); head();
    nb.innerHTML='<p class="big-ic" aria-hidden="true">🧠</p><h3>'+X(score+'/'+Q.length+' correct','Bonnes réponses : '+score+'/'+Q.length)+'</h3><p>'+X('Come back tomorrow: your words will be waiting for you, at the right moment.','Reviens demain : tes mots t\'attendront, au bon moment.')+'</p>'+(S.badges.indexOf('memory')>=0?'<p>🏅 '+X('Badge: <b>Memory master</b>','Badge : <b>As de la mémoire</b>')+'</p>':'<p class="small">'+X('Do 2 reviews to win the Memory master badge.','Fais 2 révisions pour gagner le badge As de la mémoire.')+'</p>')+'<button type="button" class="btn" id="again">'+X('Another review','Une autre révision')+'</button>';
    $('#again').onclick=function(){vNotebook('review')} }
  ask(); }
function nbTexts(nb){ var L=MS.filter(function(m){var st=S.m[m.id];return st&&(st.prodText||st.step>0||st.done)});
  if(!L.length){nb.innerHTML='<p>'+X('Your choices and texts will appear here.','Tes choix et tes textes apparaîtront ici.')+'</p>';return}
  nb.innerHTML=L.map(function(m){var st=S.m[m.id];var ch=m.setup.filter(function(q){return q.g}).map(function(q){var o=opt(m,q.g,st.sel[q.g]);return o?'<li>'+o.icon+' '+X(esc(o.en),esc(o.fr))+'</li>':''}).join('');
    return '<div class="tx"><h3>'+m.icon+' '+X(esc(m.title[0]),esc(m.title[1]))+'</h3><ul>'+ch+'</ul>'+(st.prodText?'<blockquote lang="en">'+esc(st.prodText).replace(/\n/g,'<br>')+'</blockquote>':'')+(st.reflect?'<p>💡 <i lang="en">'+esc(st.reflect)+'</i></p>':'')+'<a href="fiches.html#'+m.id+'" target="_blank" rel="noopener">🖨️ '+X('Worksheet','Fiche')+'</a></div>'}).join('') }
/* ---------- final screen ---------- */
function vFinal(){ var t=totals(), d=new Date();
  app.innerHTML='<section class="card final">'+(reduced()?'':confetti())+'<p class="big-ic" aria-hidden="true">🏆</p><h2>'+X('Mission complete: what a day!','Mission accomplie : quelle journée !')+'</h2>'+
   '<div class="cert" id="cert"><p class="small">A Day in London · Leo &amp; Amy</p><h3>'+X('Certificate of Everyday English','Diplôme d\'anglais du quotidien')+'</h3><p class="cn">'+esc(nameOf())+'</p><p>'+X('travelled to London with Leo and can take the train and the Tube, shop, see a doctor, ask the way, order food and phone a workplace in English.','est parti·e à Londres avec Leo et sait prendre le train et le métro, faire ses courses, aller chez le médecin, demander son chemin, commander à manger et appeler un lieu de stage en anglais.')+'</p>'+
   '<p class="stars">⭐ '+t.stars+'/27 · 🏅 '+S.badges.length+' · '+t.pts+' pts</p><div class="badges">'+MS.map(function(m){var on=S.badges.indexOf(m.id)>=0;return '<span class="bdg'+(on?'':' off')+'">'+m.badge.icon+'<small>'+X(esc(m.badge.en),esc(m.badge.fr))+'</small></span>'}).join('')+'</div><p class="small">'+d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})+'</p></div>'+
   '<div class="row c"><button type="button" class="btn" id="fpr">🖨️ '+X('Print my certificate','Imprimer mon diplôme')+'</button><button type="button" class="btn ghost" id="fnb">📒 '+X('Review my words','Réviser mes mots')+'</button><button type="button" class="btn ghost" id="fmap">🗺️ '+X('Back to the map','Retour au plan')+'</button></div></section>';
  $('#fpr').onclick=function(){window.print()}; $('#fnb').onclick=function(){go('notebook','review')}; $('#fmap').onclick=function(){go('map')} }
/* ---------- boot ---------- */
function boot(){ app=$('#app'); watchVideos(); if(S.tr)setTr(true);
  $('#trBtn').onclick=function(){setTr(!document.body.classList.contains('tr'))};
  $('#mapBtn').onclick=function(){S.profile?go('map'):go('intro')};
  $('#nbBtn').onclick=function(){S.profile?go('notebook'):go('intro')};
  $('#vidBtn').onclick=function(){go('videos')};
  var br=$('.brand'); if(br)br.onclick=function(e){e.preventDefault();go('intro')};
  var au=$('#auBtn'); function sa(){au.setAttribute('aria-pressed',S.auto?'true':'false');au.innerHTML=(S.auto?'🔊':'🔇')+'<span class="sr">'+(S.auto?'Voices on':'Voices off')+'</span>';au.title=S.auto?'Automatic voices: on':'Automatic voices: off'} sa(); au.onclick=function(){S.auto=!S.auto;save();sa();if(!S.auto)stopAudio();
    toast(S.auto?'🔊 Voices on: the characters speak automatically.':'🔇 Voices off. The 🔊 buttons still work. Tap again to switch the voices back on.',S.auto?'🔊 Voix activées : les personnages parlent tout seuls.':'🔇 Voix coupées. Les boutons 🔊 marchent toujours. Touche encore pour remettre les voix.')};
  var h=location.hash.replace('#','');
  if(h==='videos')go('videos'); else if(h==='intro'||!S.profile)go('intro'); else if(MI[h]){introSeen();go('mission',h)} else if(!seenIntro())go('intro'); else if(h==='notebook')go('notebook'); else go('map');
  window.__game={state:function(){return S},go:go,reload:function(){try{S=JSON.parse(localStorage.getItem(KEY))||fresh()}catch(e){S=fresh()}}};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
