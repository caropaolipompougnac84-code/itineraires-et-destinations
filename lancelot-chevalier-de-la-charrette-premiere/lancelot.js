(function(){
  var d=document, KEY=(d.body.getAttribute('data-pfx')||'x')+'-dys';
  /* Élève DYS : toute la page adaptée, version élève */
  var dbtn=d.querySelector('.dys-mode-btn');
  function setDys(on){d.body.classList.toggle('dys-on',on);if(dbtn)dbtn.setAttribute('aria-pressed',on?'true':'false');
    if(on){var el=d.querySelector('.mode-btn[data-mode="eleve"]');if(el&&!d.body.classList.contains('mode-eleve'))el.click();}
    try{localStorage.setItem(KEY,on?'1':'0');}catch(x){}}
  if(dbtn)dbtn.addEventListener('click',function(){setDys(!d.body.classList.contains('dys-on'));});
  var mp=d.querySelector('.mode-btn[data-mode="prof"]');if(mp)mp.addEventListener('click',function(){setDys(false);});
  try{if(localStorage.getItem(KEY)==='1')setDys(true);}catch(x){}
  /* Écouter : lecture à voix haute du bloc */
  var synth=window.speechSynthesis, cur=null;
  function stop(){if(synth)synth.cancel();if(cur)cur.setAttribute('aria-pressed','false');cur=null;}
  d.addEventListener('click',function(e){
    var b=e.target.closest('.btn-ecouter');
    if(b){if(!synth){b.textContent='Lecture non disponible';return;}
      if(cur===b){stop();return;}stop();
      var box=b.closest('.lisible');var clone=box.cloneNode(true);
      [].forEach.call(clone.querySelectorAll('button,.corr-wrap'),function(x){x.remove();});
      var u=new SpeechSynthesisUtterance(clone.textContent.replace(/\s+/g,' ').trim());u.lang='fr-FR';u.rate=.9;
      u.onend=function(){if(cur===b)stop();};cur=b;b.setAttribute('aria-pressed','true');synth.speak(u);return;}
    var r=e.target.closest('.btn-regle');
    if(r){var on=r.getAttribute('aria-pressed')!=='true';[].forEach.call(d.querySelectorAll('.btn-regle'),function(x){x.setAttribute('aria-pressed',on?'true':'false');});
      rule.hidden=!on;return;}
  });
  /* Règle de lecture : suit le doigt ou la souris */
  var rule=d.getElementById('regle-lecture');
  function move(y){if(rule&&!rule.hidden)rule.style.top=(y-rule.offsetHeight/2)+'px';}
  d.addEventListener('mousemove',function(e){move(e.clientY);});
  d.addEventListener('touchmove',function(e){if(e.touches[0])move(e.touches[0].clientY);},{passive:true});
  /* Météo : message adapté, rien n'est enregistré ni envoyé */
  var AIDE="Il y a toujours un adulte à qui en parler : le professeur principal, le CPE, l’infirmière ou le psychologue de l’Éducation nationale. Si tu as besoin d’aide : le 3018 (harcèlement), le Fil Santé Jeunes au 0 800 235 236, le 119 si tu es en danger. Ces appels sont anonymes et sans frais.";
  var REVOIR="Pour ce qui n’est pas encore clair, relis la leçon correspondante ou demande de l’aide.";
  var MERCI="Merci d’avoir pris cette minute pour toi.";
  [].forEach.call(d.querySelectorAll('[data-meteo]'),function(box){
    box.addEventListener('change',function(){
      function v(k){var x=box.querySelector('.m-q[data-q="'+k+'"] input:checked');return x?parseInt(x.value,10):-1;}
      var msg=[];
      if(v(1)>=1)msg.push(REVOIR);
      if(v(0)>=3||v(3)===2||v(4)===1||v(5)===0)msg.push(AIDE);
      if(!msg.length)msg.push(MERCI);
      var p=box.querySelector('.m-msg');p.textContent=msg.join(' ');p.hidden=false;});
  });
})();
