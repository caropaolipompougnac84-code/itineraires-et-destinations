(function(){
  function norm(s){return (s||'').toLowerCase().replace(/[\u2019']/g,"'").replace(/[.,!?;:]/g,'').replace(/\s+/g,' ').trim();}
  document.querySelectorAll('.ex[data-check]').forEach(function(ex){
    var btn=ex.querySelector('button.check'), fb=ex.querySelector('.fb');
    if(!btn)return;
    btn.addEventListener('click',function(){
      var total=0,good=0;
      ex.querySelectorAll('input[type=text][data-a]').forEach(function(i){
        total++;var ok=i.dataset.a.split('|').map(norm).indexOf(norm(i.value))>-1;
        i.classList.toggle('good',ok);i.classList.toggle('bad',!ok);if(ok)good++;});
      ex.querySelectorAll('select[data-a]').forEach(function(s){
        total++;var ok=s.value===s.dataset.a;s.classList.toggle('good',ok);s.classList.toggle('bad',!ok);if(ok)good++;});
      ex.querySelectorAll('[data-group]').forEach(function(g){
        total++;var c=g.querySelector('input:checked');
        g.querySelectorAll('.opt').forEach(function(o){o.classList.remove('good','bad');});
        if(c){var lab=c.closest('.opt');var ok=c.hasAttribute('data-ok');lab.classList.add(ok?'good':'bad');if(ok)good++;}});
      fb.textContent=good+' / '+total+(good===total?' · Well done!':' · Try again on the dashed answers.');
    });
  });
  var stage=document.querySelector('.blur-stage');
  if(stage){
    var b=document.getElementById('next-clue'),clues=document.querySelectorAll('.clues li'),pts=document.getElementById('points');
    b.addEventListener('click',function(){
      var s=parseInt(stage.dataset.step||'0',10);
      if(s<4){s++;stage.dataset.step=s;if(clues[s-1])clues[s-1].classList.add('on');pts.textContent=s<4?('Points if you guess now: '+(5-s)):'It is Robert Pattinson!';if(s===4)b.disabled=true;}
    });
  }
})();
