/* Voyager en poésie · 5e SEGPA · © 2026 Madame Carole Paoli Pompougnac · CC BY-NC-ND 4.0 */
(function(){
var norm=function(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,"'").replace(/\s+/g,' ').trim()};
document.querySelectorAll('[data-quiz]').forEach(function(q){
  var sels=q.querySelectorAll('select'),sc=q.querySelector('.score'),b=q.querySelector('[data-qcheck]');
  if(!b)return;
  b.addEventListener('click',function(){var ok=0;sels.forEach(function(s){var g=norm(s.value)===norm(s.dataset.a);s.classList.toggle('ok',g);s.classList.toggle('ko',!g&&s.value!=='');if(g)ok++});
    sc.textContent=ok===sels.length?'Bravo, tout est juste !':ok+' sur '+sels.length+' : continue, tu y es presque.'});
});
var fr=null;
function pick(){if(!('speechSynthesis' in window))return null;var v=speechSynthesis.getVoices().filter(function(x){return /^fr/i.test(x.lang)});return v.find(function(x){return /fr-FR/i.test(x.lang)})||v[0]||null}
if('speechSynthesis' in window){speechSynthesis.onvoiceschanged=function(){fr=pick()};fr=pick()}
document.querySelectorAll('[data-say]').forEach(function(b){
  if(!('speechSynthesis' in window)){b.hidden=true;return}
  b.addEventListener('click',function(){speechSynthesis.cancel();var t=document.getElementById(b.dataset.say);if(!t)return;
    var u=new SpeechSynthesisUtterance(t.innerText.replace(/·/g,''));u.lang='fr-FR';if(fr)u.voice=fr;u.rate=b.dataset.rate?parseFloat(b.dataset.rate):0.9;speechSynthesis.speak(u)});
});
var v=document.querySelector('[data-valise]');
if(v){var lists={};['lieu','transport','sensation'].forEach(function(k){lists[k]=[].map.call(document.querySelectorAll('[data-l="'+k+'"] li'),function(l){return l.textContent})});
  v.addEventListener('click',function(){['lieu','transport','sensation'].forEach(function(k){var a=lists[k];var o=document.querySelector('[data-out="'+k+'"]');if(o&&a.length)o.textContent=a[Math.floor(Math.random()*a.length)]})})}
})();
