
(function(){
  var d=document;
  d.documentElement.classList.add('js');
  var PFX=d.body.getAttribute('data-pfx')||'seq', MKEY=PFX+'-mode';
  function setMode(mode){
    if(['eleve','prof','dys','absent'].indexOf(mode)<0) mode='eleve';
    d.body.classList.toggle('mode-eleve', mode==='eleve');
    d.body.classList.toggle('mode-prof', mode==='prof');
    d.body.classList.toggle('mode-dys', mode==='dys');
    d.body.classList.toggle('mode-absent', mode==='absent');
    d.body.classList.toggle('teacher', mode==='prof');
    d.body.classList.toggle('answers', mode==='prof' || mode==='absent');
    [].forEach.call(d.querySelectorAll('.mode-btn[data-mode]'), function(b){
      b.setAttribute('aria-pressed', b.getAttribute('data-mode')===mode?'true':'false');
    });
    [].forEach.call(d.querySelectorAll('[data-mode]'), function(b){
      if(b.classList.contains('mode-btn')) return;
      var want = (mode==='prof') ? 'teacher' : 'student';
      if(b.getAttribute('data-mode')===want || b.getAttribute('data-mode')===mode){ b.classList.add('on'); }
      else if(b.getAttribute('data-mode')==='student' || b.getAttribute('data-mode')==='teacher'){ b.classList.remove('on'); }
    });
    [].forEach.call(d.querySelectorAll('[data-ans]'), function(b){
      var show = (mode==='prof' || mode==='absent');
      b.classList.toggle('on', (b.getAttribute('data-ans')==='show')===show);
    });
    try{ localStorage.setItem(MKEY, mode); }catch(e){}
  }
  var saved='eleve';
  try{ saved=localStorage.getItem(MKEY)||'eleve'; }catch(e){}
  setMode(saved);
  d.addEventListener('click', function(e){
    var b=e.target.closest('.mode-btn[data-mode]');
    if(b){ e.preventDefault(); setMode(b.getAttribute('data-mode')); }
  });
})();
