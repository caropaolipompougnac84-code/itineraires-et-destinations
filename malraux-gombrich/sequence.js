(function(){
  var aff=document.getElementById('minuteur-affichage');
  if(aff){
    var t=null,rest=0;
    function show(){var m=Math.floor(rest/60),s=rest%60;aff.textContent=(m<10?'0':'')+m+':'+(s<10?'0':'')+s;}
    document.querySelectorAll('#minuteur button[data-min]').forEach(function(b){
      b.addEventListener('click',function(){clearInterval(t);rest=parseInt(b.getAttribute('data-min'),10)*60;show();
        t=setInterval(function(){rest--;show();if(rest<=0){clearInterval(t);aff.textContent='Temps écoulé';}},1000);});
    });
    document.getElementById('minuteur-stop').addEventListener('click',function(){clearInterval(t);});
    var sujets=["« L'art est un anti-destin. » (Malraux)","« L'Art avec un grand A n'existe pas. » (Gombrich)","Une reproduction du Rhinocéros de Dürer","Une photographie d'Atget, rue de Paris déserte","« Ça a été. » (Barthes)","Le portrait de Lewis Payne","« Un crucifix roman n'était pas d'abord une sculpture. » (Malraux)","Deux images : Cimabue et Giotto","« Voir, c'est interpréter. »","Le tympan de Moissac"];
    document.getElementById('tirage').addEventListener('click',function(){
      document.getElementById('tirage-resultat').textContent='Sujet tiré : '+sujets[Math.floor(Math.random()*sujets.length)];});
  }
  var g=document.getElementById('grille-expose');
  if(g){
    var ins=g.querySelectorAll('input'),tot=document.getElementById('total-expose');
    function sum(){var s=0;ins.forEach(function(i){var v=parseFloat(i.value);if(!isNaN(v))s+=Math.min(v,parseFloat(i.max));});tot.textContent=s;}
    ins.forEach(function(i){i.addEventListener('input',sum);});
    document.getElementById('effacer-grille').addEventListener('click',function(){ins.forEach(function(i){i.value='';});sum();});
  }
})();
