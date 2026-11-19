
(function(){
  function setMode(m){
    var body=document.body;
    body.classList.remove('mode-eleve','mode-prof','mode-dys','eleve','dys-opendys','teacher','answers');
    if(m==='prof'){
      body.classList.add('mode-prof','teacher','answers');
    } else if(m==='dys'){
      body.classList.add('mode-eleve','eleve','mode-dys','dys-opendys');
    } else {
      m='eleve';
      body.classList.add('mode-eleve','eleve');
    }
    document.querySelectorAll('.mode-btn[data-mode]').forEach(function(b){
      b.setAttribute('aria-pressed', b.getAttribute('data-mode')===m ? 'true':'false');
    });
  }
  document.querySelectorAll('.mode-btn[data-mode]').forEach(function(b){
    b.addEventListener('click', function(){ setMode(b.getAttribute('data-mode')); });
  });
  document.querySelectorAll('.dys-font').forEach(function(b){
    b.addEventListener('click', function(){
      var k=b.getAttribute('data-font');
      document.body.classList.toggle('dys-opendys', k==='opendyslexic' && document.body.classList.contains('mode-dys'));
      document.querySelectorAll('.dys-font').forEach(function(x){
        x.setAttribute('aria-pressed', x===b?'true':'false');
      });
    });
  });
  var root=document.querySelector('.tabs-root');
  if(root){
    root.querySelectorAll('.tab-btn').forEach(function(tab){
      tab.addEventListener('click', function(){
        var k=tab.getAttribute('data-k');
        root.querySelectorAll('.tab-btn').forEach(function(x){ x.setAttribute('aria-selected', x===tab?'true':'false'); });
        root.querySelectorAll('.panel').forEach(function(p){ p.hidden=p.getAttribute('data-k')!==k; });
        if(history.replaceState){
          var h=k==='start'?'':'#'+k;
          history.replaceState(null,'',location.pathname+location.search+h);
        }
      });
    });
    function fromHash(){
      var h=decodeURIComponent((location.hash||'').slice(1));
      if(!h) return;
      var tab=root.querySelector('.tab-btn[data-k="'+h+'"]');
      if(tab) tab.click();
    }
    fromHash();
    window.addEventListener('hashchange', fromHash);
  }
  function norm(s){return (s||'').toLowerCase().replace(/[.\u2019'£€%]/g,'').replace(/^the /,'').replace(/\s+/g,' ').trim();}
  document.querySelectorAll('[data-check]').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(!document.body.classList.contains('mode-prof')) return;
      var box=btn.closest('[data-quiz]');
      if(!box) return;
      var items=box.querySelectorAll('[data-a]'), good=0;
      items.forEach(function(el){
        var ok=el.dataset.a.split('|').some(function(a){return norm(el.value)===norm(a)});
        el.classList.toggle('ok',ok); el.classList.toggle('ko',!ok); if(ok) good++;
      });
      var sc=box.querySelector('.score');
      if(sc) sc.textContent=good+' / '+items.length;
    });
  });
  // keep existing audio buttons working
  document.querySelectorAll('button.say, button[data-src]').forEach(function(b){
    b.addEventListener('click', function(){
      var src=b.getAttribute('data-src'); if(!src) return;
      var a=document.getElementById('sjsp-audio');
      if(!a){ a=document.createElement('audio'); a.id='sjsp-audio'; document.body.appendChild(a); }
      a.src=src; a.play();
    });
  });
  setMode('eleve');
})();
