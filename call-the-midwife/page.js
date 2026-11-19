
(function(){
  function setMode(m){
    var body=document.body;
    body.classList.remove('mode-eleve','mode-prof','mode-dys','mode-absent','eleve','dys-opendys');
    if(m==='prof'){ body.classList.add('mode-prof'); }
    else if(m==='dys'){ body.classList.add('mode-eleve','eleve','mode-dys','dys-opendys'); }
    else if(m==='absent'){ body.classList.add('mode-eleve','eleve','mode-absent'); }
    else { m='eleve'; body.classList.add('mode-eleve','eleve'); }
    document.querySelectorAll('.mode-btn[data-mode]').forEach(function(b){
      b.setAttribute('aria-pressed', b.getAttribute('data-mode')===m ? 'true':'false');
    });
    if(m!=='prof'){
      document.querySelectorAll('.quiz').forEach(function(q){ q.classList.remove('is-revealed'); });
    }
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
  document.querySelectorAll('.lang-btn').forEach(function(b){
    b.addEventListener('click', function(){
      var lang=b.getAttribute('data-lang');
      document.body.classList.toggle('lang-fr', lang==='fr');
      document.querySelectorAll('.lang-btn').forEach(function(x){
        x.setAttribute('aria-pressed', x===b?'true':'false');
      });
    });
  });
  document.querySelectorAll('.tab-btn').forEach(function(tab){
    tab.addEventListener('click', function(){
      var k=tab.getAttribute('data-k');
      var root=tab.closest('.tabs-root')||document;
      root.querySelectorAll('.tab-btn').forEach(function(x){ x.setAttribute('aria-selected', x===tab?'true':'false'); });
      root.querySelectorAll('.panel').forEach(function(p){ p.hidden=p.getAttribute('data-k')!==k; });
    });
  });
  document.querySelectorAll('.quiz').forEach(function(q){
    var ans=q.getAttribute('data-answer');
    if(!ans) return;
    q.querySelectorAll('input').forEach(function(inp){
      if(inp.value===ans) inp.closest('label').setAttribute('data-correct','1');
    });
    q.addEventListener('change', function(){
      if(document.body.classList.contains('mode-prof')) q.classList.add('is-revealed');
    });
  });
  document.querySelectorAll('.btn-show-answers').forEach(function(b){
    b.addEventListener('click', function(){
      if(!document.body.classList.contains('mode-prof')) return;
      document.querySelectorAll('.quiz').forEach(function(q){ q.classList.add('is-revealed'); });
    });
  });
  setMode('eleve');
})();

/* Open a tab from a link (#words-of-care, #post-war-words, #sequence...) or from the address */
(function(){
  function openTab(k){
    var b=document.querySelector('.tab-btn[data-k="'+k+'"]');
    if(!b) return false;
    b.click();
    var p=document.querySelector('.panel[data-k="'+k+'"]');
    if(p) window.scrollTo({top:p.getBoundingClientRect().top+window.pageYOffset-20,behavior:'auto'});
    return true;
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#"]'); if(!a) return;
    var k=a.getAttribute('href').slice(1);
    if(k && document.querySelector('.tab-btn[data-k="'+k+'"]')){ e.preventDefault(); openTab(k); history.replaceState(null,'','#'+k); }
  });
  if(location.hash){ openTab(location.hash.slice(1)); }
})();
