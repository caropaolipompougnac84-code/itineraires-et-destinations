(function(){
  var panels=[].slice.call(document.querySelectorAll('section.panel'));
  var list=document.getElementById('tablist');
  if(list){
    panels.forEach(function(p){
      if(!p.id && p.dataset.tab) p.id=p.dataset.tab;
      var a=document.createElement('a');
      a.href='#'+p.id;
      a.textContent=p.dataset.label || p.id;
      list.appendChild(a);
    });
  }
  document.addEventListener('click',function(e){
    var jump=e.target.closest('[data-jump]');
    if(jump){
      var id=jump.getAttribute('data-jump');
      var t=document.getElementById(id);
      if(t){ t.scrollIntoView({behavior:'smooth',block:'start'}); }
    }
    var say=e.target.closest('button.say');
    if(say && 'speechSynthesis' in window){
      var u=new SpeechSynthesisUtterance(say.dataset.say);
      u.lang='en-GB'; u.rate=0.85;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
      return;
    }
    var o=e.target.closest('.mcq .opts button'); if(!o) return;
    var box=o.closest('.mcq'), fb=box.querySelector('.fb');
    [].forEach.call(box.querySelectorAll('.opts button'),function(k){k.classList.remove('ok','ko')});
    if(o.dataset.ok==='1'){o.classList.add('ok'); if(fb) fb.textContent='Yes, well done!';}
    else{o.classList.add('ko'); if(fb) fb.textContent='Not quite. Try again.';}
  });
})();
