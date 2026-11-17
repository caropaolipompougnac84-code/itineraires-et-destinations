/* Quiz de vocabulaire professionnel : moteur commun */
(function(){
  "use strict";
  var DATA = window.QUIZ_DATA; if(!DATA) return;
  var root = document.getElementById("quiz");
  var params = new URLSearchParams(location.search);
  var dys = params.get("dys") === "1";
  var steps = [], idx = 0, score = 0, total = 0;

  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function el(tag, cls, text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}

  /* Audio : voix anglaise britannique */
  var voices = [];
  function loadVoices(){ if("speechSynthesis" in window){ voices = window.speechSynthesis.getVoices() || []; } }
  if("speechSynthesis" in window){ loadVoices(); window.speechSynthesis.onvoiceschanged = loadVoices; }
  function speak(text){
    if(!("speechSynthesis" in window)){ alert("La lecture audio n'est pas disponible sur cet appareil."); return; }
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB"; u.rate = 0.85;
    var v = voices.filter(function(x){return /^en[-_]GB/i.test(x.lang);})[0];
    if(v) u.voice = v;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
  window.quizSpeak = speak;

  function others(list, exclude, n){ return shuffle(list.filter(function(x){return x!==exclude;})).slice(0,n); }

  function build(){
    var items = DATA.items, nOpt = dys ? 1 : 2; // nombre de distracteurs
    var enAll = items.map(function(i){return i.en;}), frAll = items.map(function(i){return i.fr;});
    steps = [];
    var mcItems = dys ? shuffle(items).slice(0,8) : shuffle(items);
    mcItems.forEach(function(it){
      steps.push({type:"mc", part:"1. Du français à l'anglais", prompt:it.fr, answer:it.en, say:it.en, item:it,
        options:shuffle([it.en].concat(others(enAll,it.en,nOpt)))});
    });
    shuffle(items).slice(0, dys ? 4 : 6).forEach(function(it){
      steps.push({type:"listen", part:"2. Écouter et choisir", answer:it.fr, say:it.en,
        options:shuffle([it.fr].concat(others(frAll,it.fr,nOpt)))});
    });
    var mp = shuffle(items).slice(0, dys ? 4 : 6);
    steps.push({type:"match", part:"3. Associer", pairs:mp});
    shuffle(DATA.gaps).slice(0, dys ? 4 : 6).forEach(function(g){
      steps.push({type:"gap", part:"4. Compléter la phrase", prompt:g.s, answer:g.a, say:g.s.replace("___", g.a),
        options:shuffle([g.a].concat(shuffle(g.d).slice(0,nOpt)))});
    });
    total = steps.reduce(function(n,s){return n + (s.type==="match" ? s.pairs.length : 1);},0);
    idx = 0; score = 0;
  }

  function header(step){
    var f = document.createDocumentFragment();
    var p = el("div","progress"); var bar = el("span"); bar.style.width = Math.round(idx/steps.length*100)+"%"; p.appendChild(bar);
    p.setAttribute("role","progressbar"); p.setAttribute("aria-valuenow", idx); p.setAttribute("aria-valuemax", steps.length);
    f.appendChild(p);
    f.appendChild(el("p","part", step.part + "  (" + (idx+1) + " / " + steps.length + ")"));
    return f;
  }

  function nextButton(fb){
    var b = el("button","btn primary","Suivant"); b.type="button";
    b.addEventListener("click", function(){ idx++; render(); });
    fb.appendChild(b); b.focus();
  }

  function sayBtn(text, label){
    var b = el("button","btn say", label || "Écouter"); b.type="button";
    b.setAttribute("aria-label", (label || "Écouter") + " en anglais");
    b.addEventListener("click", function(){ speak(text); });
    return b;
  }

  function renderChoice(step){
    if(step.type === "listen"){
      root.appendChild(el("p",null,"Écoutez le mot anglais, puis choisissez sa traduction."));
      var lb = sayBtn(step.say, "Écouter"); lb.classList.add("primary"); lb.dataset.role="listen";
      var r = el("div","row"); r.appendChild(lb); root.appendChild(r);
    } else if(step.type === "gap"){
      root.appendChild(el("p",null,"Choisissez le mot qui complète la phrase."));
      root.appendChild(el("p","prompt sentence", step.prompt.replace("___","________")));
    } else {
      root.appendChild(el("p",null,"Comment dit-on en anglais :"));
      if(step.item && step.item.img){
        var fig = el("figure","qfig"), im = el("img","qimg");
        im.src = step.item.img; im.alt = step.item.fr; im.width = step.item.w; im.height = step.item.h;
        im.loading = "eager"; im.decoding = "async";
        fig.appendChild(im); root.appendChild(fig);
      }
      root.appendChild(el("p","prompt", step.prompt));
    }
    var box = el("div","options"); var fb = el("p","feedback"); fb.setAttribute("aria-live","polite");
    step.options.forEach(function(o){
      var b = el("button","btn opt", o); b.type="button";
      if(step.type!=="listen") b.lang = "en-GB";
      b.addEventListener("click", function(){
        var all = box.querySelectorAll("button"); all.forEach(function(x){x.disabled=true;});
        var good = (o === step.answer);
        if(good){ score++; b.classList.add("ok"); fb.textContent="Bravo, c'est juste !"; fb.className="feedback ok"; }
        else { b.classList.add("ko"); all.forEach(function(x){ if(x.textContent===step.answer) x.classList.add("ok"); });
          fb.textContent = "Pas tout à fait. La bonne réponse : " + step.answer; fb.className="feedback ko"; }
        var r2 = el("div","row"); r2.appendChild(sayBtn(step.say, "Réécouter"));
        fb.parentNode.insertBefore(r2, fb.nextSibling);
        nextButton(r2);
      });
      box.appendChild(b);
    });
    root.appendChild(box); root.appendChild(fb);
  }

  function renderMatch(step){
    root.appendChild(el("p",null,"Touchez un mot anglais, puis sa traduction française."));
    var m = el("div","match"), cE = el("div","col"), cF = el("div","col");
    cE.appendChild(el("p","part","Anglais")); cF.appendChild(el("p","part","Français"));
    var fb = el("p","feedback"); fb.setAttribute("aria-live","polite");
    var sel = null, done = 0, firstTry = {};
    step.pairs.forEach(function(p){ firstTry[p.en] = true; });
    shuffle(step.pairs).forEach(function(p){
      var b = el("button","btn pair", p.en); b.type="button"; b.lang="en-GB"; b.dataset.en=p.en;
      b.addEventListener("click", function(){ if(b.disabled) return; if(sel) sel.classList.remove("sel"); sel=b; b.classList.add("sel"); speak(p.en); });
      cE.appendChild(b);
    });
    shuffle(step.pairs).forEach(function(p){
      var b = el("button","btn pair", p.fr); b.type="button"; b.dataset.en=p.en;
      b.addEventListener("click", function(){
        if(b.disabled) return;
        if(!sel){ fb.textContent="Touchez d'abord un mot anglais."; fb.className="feedback ko"; return; }
        if(sel.dataset.en === p.en){
          [sel,b].forEach(function(x){x.classList.remove("sel");x.classList.add("ok");x.disabled=true;});
          if(firstTry[p.en]) score++;
          done++; sel=null; fb.textContent="Bravo !"; fb.className="feedback ok";
          if(done === step.pairs.length){ fb.textContent="Toutes les paires sont trouvées."; var rr = el("div","row"); root.appendChild(rr); nextButton(rr); }
        } else {
          firstTry[sel.dataset.en] = false;
          b.classList.add("ko"); setTimeout(function(){b.classList.remove("ko");},700);
          fb.textContent="Essayez encore."; fb.className="feedback ko";
        }
      });
      cF.appendChild(b);
    });
    m.appendChild(cE); m.appendChild(cF); root.appendChild(m); root.appendChild(fb);
  }

  function renderEnd(){
    root.appendChild(el("h2",null,"Résultat"));
    root.appendChild(el("p","score", score + " / " + total));
    var pct = score/total, msg = pct>=0.8 ? "Excellent travail !" : pct>=0.5 ? "Bon travail, continuez !" : "Reprenez la liste de vocabulaire, puis recommencez.";
    root.appendChild(el("p",null,msg));
    var r = el("div","row");
    var b = el("button","btn primary","Recommencer"); b.type="button"; b.id="restart";
    b.addEventListener("click", function(){ build(); render(); });
    r.appendChild(b);
    var a = el("a","btn","Voir la liste de vocabulaire"); a.href="#vocabulaire"; r.appendChild(a);
    root.appendChild(r); root.dataset.finished = "1"; b.focus();
  }

  function render(){
    root.innerHTML = ""; root.dataset.finished = "";
    if(idx >= steps.length){ renderEnd(); return; }
    var step = steps[idx]; root.appendChild(header(step));
    if(step.type === "match") renderMatch(step); else renderChoice(step);
    preload(idx+1);
  }
  /* Image de l'étape suivante chargée à l'avance */
  function preload(n){
    var s = steps[n]; if(s && s.item && s.item.img){ var i = new Image(); i.src = s.item.img; }
  }
  /* Images de la liste : chargées dès que la liste s'ouvre */
  document.querySelectorAll("details").forEach(function(d){
    d.addEventListener("toggle", function(){ if(d.open) d.querySelectorAll("img[loading=lazy]").forEach(function(i){ i.loading = "eager"; }); });
  });

  function setMode(d){
    dys = d; document.body.classList.toggle("dys", dys);
    document.querySelectorAll("[data-mode]").forEach(function(b){ b.setAttribute("aria-pressed", String((b.dataset.mode==="dys")===dys)); });
    var u = new URL(location.href); if(dys) u.searchParams.set("dys","1"); else u.searchParams.delete("dys");
    history.replaceState(null,"",u.toString());
    build(); render();
  }
  document.querySelectorAll("[data-mode]").forEach(function(b){ b.addEventListener("click", function(){ setMode(b.dataset.mode==="dys"); }); });
  document.querySelectorAll("[data-say]").forEach(function(b){ b.addEventListener("click", function(){ speak(b.dataset.say); }); });
  setMode(dys);
})();
