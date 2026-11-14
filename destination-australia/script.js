(function(){
  var KEY='hoa-dys';
  function apply(on){
    document.body.classList.toggle('dys', !!on);
    var b=document.querySelectorAll('[data-dys-toggle]');
    b.forEach(function(el){ el.setAttribute('aria-pressed', on ? 'true' : 'false'); });
  }
  try{ apply(localStorage.getItem(KEY)==='1'); }catch(e){}
  document.addEventListener('click', function(ev){
    var t=ev.target.closest && ev.target.closest('[data-dys-toggle]');
    if(!t) return;
    var on=!document.body.classList.contains('dys');
    apply(on);
    try{ localStorage.setItem(KEY, on?'1':'0'); }catch(e){}
  });

  function num(id, fallback){
    var el=document.getElementById(id);
    if(!el) return fallback;
    var v=parseFloat(String(el.value).replace(',', '.'));
    return isFinite(v) ? v : fallback;
  }
  function euro(n){ return (Math.round(n).toLocaleString('fr-FR')) + ' €'; }
  function aud(n){ return (Math.round(n).toLocaleString('fr-FR')) + ' AUD'; }
  function update(){
    var box=document.getElementById('calc-results');
    if(!box) return;
    var rate=num('rate', 1.62); // AUD for 1 euro
    if(rate<=0) rate=1.62;
    var savingsEUR=num('savings', 4000);
    var flightEUR=num('flight', 1400);
    var visaAUD=num('visa', 840);
    var insEUR=num('insurance', 440);
    var passEUR=num('passport', 86);
    var rent=num('rent', 250);
    var food=num('food', 120);
    var trans=num('transport', 50);
    var phone=num('phone', 40);
    var wage=num('wage', 33);
    var hours=num('hours', 30);
    var tax=num('tax', 15);
    var weeksWait=num('weeksWait', 2);
    var savingsAUD=savingsEUR*rate;
    var setupAUD=(flightEUR+insEUR+passEUR)*rate + visaAUD;
    var weeklyCosts=rent+food+trans+phone;
    var weeklyGross=wage*hours;
    var weeklyNet=weeklyGross*(1-tax/100);
    var waitCost=weeklyCosts*weeksWait;
    var leftoverFirst=savingsAUD - setupAUD - waitCost;
    var weeklyBalance=weeklyNet-weeklyCosts;
    var html='<p><strong>Before you leave (approx.)</strong><br>';
    html+='Visa: '+euro(visaAUD/rate)+' ('+aud(visaAUD)+'). Savings: '+aud(savingsAUD)+'.</p>';
    html+='<p><strong>To leave France</strong><br>Flight, visa, insurance and passport: about '+euro((flightEUR+insEUR+passEUR)+visaAUD/rate)+' or '+aud(setupAUD)+'.</p>';
    html+='<p><strong>Every week in Australia</strong><br>Costs: '+aud(weeklyCosts)+'. Pay before tax: '+aud(weeklyGross)+'. Pay after tax (approx.): '+aud(weeklyNet)+'. Left after costs: '+aud(weeklyBalance)+'.</p>';
    html+='<p><strong>After '+weeksWait+' week(s) without a job</strong><br>Money left from savings, after leaving costs and those weeks: '+aud(leftoverFirst)+'.</p>';
    if(savingsAUD<5000){
      html+='<p>Official guidance usually asks for about AUD 5 000 in savings, plus a return ticket or the money to buy one. Your savings are under that amount: check the current rule on the Department of Home Affairs website.</p>';
    } else {
      html+='<p>Your savings are at least about AUD 5 000. You still need a return ticket or the money to buy one. Check the current rule before you apply.</p>';
    }
    if(weeklyBalance<0){
      html+='<p>With these numbers, your weekly pay does not cover your weekly costs. Change the job, the hours or the rent.</p>';
    }
    box.innerHTML=html;
  }
  window.hoaUpdateBudget=update;
  document.addEventListener('DOMContentLoaded', function(){
    var form=document.getElementById('budget-calc');
    if(!form) return;
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    update();
  });
})();
