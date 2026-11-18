(function(){
  const STORE="fle-cm2-stars-v1";
  const IMGS={
    hero:"img/potter-peter-rabbit.jpg",
    rev:"img/potter-benjamin-bunny.jpg",
    lec:"img/crane-renard-et-grue.jpg",
    ecr:"img/potter-jemima-cover.jpg",
    voc:"img/caldecott-hey-diddle.jpg",
    gra:"img/rabier-canard-et-lapin.jpg",
    ort:"img/potter-jemima-promenade.jpg",
    con:"img/potter-benjamin-bunny.jpg",
    ora:"img/caldecott-hey-diddle.jpg"
  };
  const IMG_ALT={
    hero:"Pierre Lapin, en veste bleue, mange des radis dans un jardin, un rouge-gorge posé sur une bêche.",
    rev:"Benjamin Bunny et un autre lapin portent des oignons dans un jardin.",
    lec:"Le renard et la grue, dînant à une table, illustration de Walter Crane.",
    ecr:"Jemima Puddle-Duck en châle et bonnet, couverture du conte de Beatrix Potter.",
    voc:"L'assiette et la cuillère qui s'enfuient, illustration de Randolph Caldecott.",
    gra:"Un canard discute avec un lapin devant un terrier, illustration de Benjamin Rabier.",
    ort:"Jemima Puddle-Duck en bonnet, se promenant dans un pré.",
    con:"Benjamin Bunny et un autre lapin portent des oignons dans un jardin.",
    ora:"L'assiette et la cuillère qui s'enfuient, illustration de Randolph Caldecott."
  };
  let DATA=null, lang="fr", mode="eleve", current=null;
    document.body.classList.remove("lesson-open");
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

  function loadStars(){
    try{return JSON.parse(localStorage.getItem(STORE)||"{}");}catch(e){return {};}
  }
  function saveStars(s){localStorage.setItem(STORE, JSON.stringify(s));}
  function lessonStars(id){
    const s=loadStars();
    return s[id]||{items:{}};
  }
  function setStar(id, i, okFirst){
    const all=loadStars();
    if(!all[id]) all[id]={items:{}};
    if(all[id].items[i]===undefined) all[id].items[i]=okFirst;
    saveStars(all);
  }

  function t(obj){
    if(!obj) return "";
    if(typeof obj==="string") return obj;
    return obj[lang]||obj.fr||"";
  }
  function consigne(ex){
    const c=DATA.cons[ex.c]||DATA.cons[ex.t]||{};
    return t(c)||"";
  }
  function norm(s){
    return String(s||"").trim().replace(/\s+/g," ").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  }
  function speak(text){
    if(!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang="fr-FR";
    u.rate=0.9;
    window.speechSynthesis.speak(u);
  }
  function starSvg(on){
    return `<span class="fle-star${on?" is-on":""}" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#star-shape"/></svg></span>`;
  }
  function starsRow(id, total){
    const got=lessonStars(id).items;
    let html="";
    for(let i=0;i<total;i++) html+=starSvg(!!got[i]);
    const n=Object.values(got).filter(Boolean).length;
    return `<div class="fle-stars" aria-label="${n} sur ${total}">${html}</div>`;
  }

  function setMode(m){
    mode=m;
    document.body.classList.toggle("mode-eleve", m==="eleve");
    document.body.classList.toggle("mode-prof", m==="prof");
    $$("[data-mode]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.mode===m?"true":"false"));
    if(current) renderLesson(current, false);
  }
  function setLang(l){
    lang=l;
    $$("[data-lang]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.lang===l?"true":"false"));
    renderSommaire();
    if(current) renderLesson(current, false);
  }

  function renderSommaire(){
    const root=$("#sommaire-cards");
    root.innerHTML=DATA.lessons.map((l,idx)=>{
      const img=IMGS[l.d]||IMGS.hero;
      const alt=IMG_ALT[l.d]||IMG_ALT.hero;
      const title=t({fr:l.fr,ka:l.ka});
      const n=l.ex.length;
      return `<button type="button" class="fle-card" data-open="${l.id}">
        <img src="${img}" alt="${alt}">
        <div class="fle-card-body">
          <p class="fle-card-lvl">Leçon ${idx+1} · ${l.lvl}</p>
          <p class="fle-card-title">${esc(title)}</p>
          ${starsRow(l.id,n)}
        </div>
      </button>`;
    }).join("");
    $$(".fle-card[data-open]").forEach(b=>b.addEventListener("click",()=>openLesson(b.dataset.open)));

    const meth=$("#meth-list");
    if(meth){
      meth.innerHTML=DATA.meth.map(m=>{
        const title=t({fr:m.fr,ka:m.ka});
        const steps=(lang==="ka"?m.ska:m.sfr)||[];
        return `<article><h3>${esc(title)}</h3><ul>${steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></article>`;
      }).join("");
    }
    const ev=$("#evals-list");
    if(ev){
      ev.innerHTML=DATA.evals.map(e=>{
        const qs=(e.items||[]).map((item,i)=>renderEvalItem(item,i,e.d)).join("");
        const domain=t(DATA.doms[e.d])||e.d;
        return `<article class="fle-ex"><h3>${esc(domain)}</h3>${qs}</article>`;
      }).join("");
    }
    const fiche=$("#fiche-list");
    if(fiche){
      fiche.innerHTML=DATA.fiche.map(f=>`<article><h3>${esc(f.h)}</h3>${f.p.map(p=>`<p>${esc(p)}</p>`).join("")}</article>`).join("");
    }
  }

  function renderEvalItem(item,i,eid){
    return `<div class="fle-ex"><p><strong>${i+1}.</strong> ${esc(item.q)}</p><p class="fle-fb">Réponse attendue : ${esc(item.a||"")}</p></div>`;
  }

  function openLesson(id){
    current=DATA.lessons.find(l=>l.id===id);
    document.body.classList.add("lesson-open");
    $("#view-sommaire").classList.add("is-hidden");
    $("#view-lesson").classList.add("is-open");
    renderLesson(current, true);
    window.scrollTo(0,0);
  }
  function closeLesson(){
    current=null;
    document.body.classList.remove("lesson-open");
    $("#view-sommaire").classList.remove("is-hidden");
    $("#view-lesson").classList.remove("is-open");
    renderSommaire();
    window.scrollTo(0,0);
  }

  function renderLesson(l, reset){
    const title=t({fr:l.fr,ka:l.ka});
    const reten=lang==="ka"?l.rka:l.rfr;
    const img=IMGS[l.d]||IMGS.hero;
    const alt=IMG_ALT[l.d]||IMG_ALT.hero;
    const idx=DATA.lessons.findIndex(x=>x.id===l.id)+1;
    let html=`<p class="fle-kicker">Leçon ${idx} · ${esc(l.lvl)} · ${esc(t(DATA.doms[l.d]))}</p>
      <h1 class="fle-title">${esc(title)}</h1>
      <img class="fle-illus" src="${img}" alt="${alt}">
      <section class="fle-retenir"><h2>À retenir</h2><ul>${(reten||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>`;
    l.ex.forEach((ex,i)=>{ html+=renderEx(l, ex, i); });
    if(l.dic){
      const tip=lang==="ka"?l.dka:l.dfr;
      html+=`<section class="fle-dic" data-dic="${esc(l.id)}">
        <h2>Dictée</h2>
        <p class="fle-cons">${esc(tip||"Écoute puis écris.")}</p>
        <button type="button" class="fle-btn" data-speak-dic>Écouter la dictée</button>
        <label class="sr" for="dic-${l.id}">Ta dictée</label>
        <textarea class="fle-fill" id="dic-${l.id}" rows="4" placeholder="Écris ici ce que tu entends."></textarea>
        <div class="fle-dic-text prof-only"><p>Texte de la dictée (Version prof) :</p><p>${esc(l.dic)}</p></div>
      </section>`;
    }
    if(l.tr){
      html+=`<section class="fle-trace"><h2>Trace écrite</h2><p>Copie cette trace dans ton cahier.</p><p>${esc(l.tr)}</p></section>`;
    }
    html+=`<p><button type="button" class="fle-btn fle-btn-back" data-back>Retour au sommaire</button></p>`;
    $("#view-lesson").innerHTML=html;
    bindLesson(l);
  }

  function renderEx(l, ex, i){
    const cons=consigne(ex);
    let body="";
    if(ex.x) body+=`<div class="fle-x">${esc(ex.x)}</div>`;
    if(ex.t==="qcm"||ex.t==="ecoute"){
      const opts=(ex.o||[]).map((o,k)=>`<button type="button" class="fle-opt" data-k="${k}">${esc(o)}</button>`).join("");
      body+=`${ex.t==="ecoute"&&ex.say?`<p><button type="button" class="fle-btn" data-speak="${esc(ex.say)}">Écouter</button></p>`:""}
        ${ex.q?`<p class="fle-q">${esc(ex.q)}</p>`:""}
        <div class="fle-opts">${opts}</div><div class="fle-fb" hidden></div>`;
    }else if(ex.t==="fill"){
      body+=`<p class="fle-q">${esc(ex.q)}</p>
        <input class="fle-fill" type="text" autocomplete="off" aria-label="Ta réponse">
        <p><button type="button" class="fle-btn" data-check>Vérifier</button></p>
        <div class="fle-fb" hidden></div>`;
    }else if(ex.t==="order"){
      const words=(ex.w||[]).map((w,k)=>`<button type="button" class="fle-word" data-w="${k}">${esc(w)}</button>`).join("");
      body+=`<p class="fle-q">${esc(ex.q||"Remets les mots dans l'ordre.")}</p>
        <div class="fle-order-built" data-built></div>
        <div class="fle-words">${words}</div>
        <p><button type="button" class="fle-btn" data-reset-order>Recommencer</button>
        <button type="button" class="fle-btn" data-check>Vérifier</button></p>
        <div class="fle-fb" hidden></div>`;
    }else if(ex.t==="match"){
      const left=(ex.p||[]).map((pair,k)=>`<button type="button" class="fle-opt" data-side="l" data-i="${k}">${esc(pair[0])}</button>`).join("");
      const right=shuffle((ex.p||[]).map((pair,k)=>[pair[1],k])).map(([lab,k])=>`<button type="button" class="fle-opt" data-side="r" data-i="${k}">${esc(lab)}</button>`).join("");
      body+=`<p class="fle-q">${esc(ex.q||"Relie les paires.")}</p>
        <div class="fle-match"><div>${left}</div><div>${right}</div></div>
        <div class="fle-fb" hidden></div>`;
    }else if(ex.t==="write"){
      body+=`<p class="fle-q">${esc(ex.q||ex.w||"")}</p>
        <textarea class="fle-fill" rows="5" placeholder="Écris ici."></textarea>
        ${mode==="prof"&&(ex.m||ex.r)?`<div class="fle-fb">${ex.m?esc(ex.m):""}${ex.r?("<br>"+esc(ex.r)):""}</div>`:`<p class="fle-cons">Montre ensuite ta copie au professeur.</p>`}`;
    }else{
      body+=`<p>${esc(ex.q||"")}</p>`;
    }
    return `<section class="fle-ex" data-ex="${i}" data-type="${ex.t}">
      <h3>Exercice ${i+1}</h3>
      <p class="fle-cons">${esc(cons)}</p>
      ${body}
    </section>`;
  }

  function bindLesson(l){
    $$("[data-back]").forEach(b=>b.addEventListener("click", closeLesson));
    $$("[data-speak-dic]").forEach(b=>b.addEventListener("click",()=>speak(l.dic)));
    $$("[data-speak-ex]").forEach(b=>b.addEventListener("click",()=>speak(l.ex[+b.dataset.speakEx].say)));
    $$(".fle-ex").forEach(box=>{
      const i=+box.dataset.ex;
      const ex=l.ex[i];
      if(!ex) return;
      if(ex.t==="qcm"||ex.t==="ecoute"){
        let tried=false;
        $$(".fle-opt", box).forEach(btn=>btn.addEventListener("click",()=>{
          if(box.dataset.done) return;
          const ok=(+btn.dataset.k)===ex.k;
          if(!tried){ setStar(l.id,i,ok); tried=true; }
          btn.classList.add(ok?"is-ok":"is-bad");
          const fb=$(".fle-fb", box);
          if(!ok){
            fb.hidden=false; fb.className="fle-fb is-bad";
            fb.textContent=lang==="ka"?"კიდევ სცადე.":"Essaie encore.";
            return;
          }
          box.dataset.done="1";
          $$(".fle-opt", box).forEach(o=>{
            if((+o.dataset.k)===ex.k) o.classList.add("is-ok");
          });
          fb.hidden=false; fb.className="fle-fb";
          fb.textContent=ex.r|| (lang==="ka"?"ყოჩაღ!":"Bravo !");
        }));
      }
      if(ex.t==="fill"){
        let tried=false;
        $("[data-check]", box).addEventListener("click",()=>{
          const val=$(".fle-fill", box).value;
          const ok=(ex.s||[]).some(s=>norm(s)===norm(val));
          if(!tried){ setStar(l.id,i,ok); tried=true; }
          const fb=$(".fle-fb", box);
          fb.hidden=false;
          if(ok){
            box.dataset.done="1";
            fb.className="fle-fb";
            fb.textContent=(ex.r?ex.r+" ":"")+(lang==="ka"?"ყოჩაღ!":"Bravo !");
          }else{
            fb.className="fle-fb is-bad";
            fb.textContent=lang==="ka"?"კიდევ სცადე.":"Essaie encore.";
          }
        });
      }
      if(ex.t==="order"){
        let built=[];
        let tried=false;
        const builtEl=$("[data-built]", box);
        function refresh(){ builtEl.textContent=built.map(k=>ex.w[k]).join(" "); }
        $$(".fle-word", box).forEach(btn=>btn.addEventListener("click",()=>{
          const k=+btn.dataset.w;
          if(built.includes(k)) return;
          built.push(k); btn.disabled=true; refresh();
        }));
        $("[data-reset-order]", box).addEventListener("click",()=>{
          built=[]; refresh();
          $$(".fle-word", box).forEach(b=>b.disabled=false);
          $(".fle-fb", box).hidden=true;
        });
        $("[data-check]", box).addEventListener("click",()=>{
          const got=built.map(k=>ex.w[k]).join(" ");
          const ok=norm(got)===norm((ex.z||[]).join(" "));
          if(!tried){ setStar(l.id,i,ok); tried=true; }
          const fb=$(".fle-fb", box);
          fb.hidden=false;
          if(ok){
            box.dataset.done="1";
            fb.className="fle-fb";
            fb.textContent=ex.r|| (lang==="ka"?"ყოჩაღ!":"Bravo !");
          }else{
            fb.className="fle-fb is-bad";
            fb.textContent=lang==="ka"?"კიდევ სცადე.":"Essaie encore.";
          }
        });
      }
      if(ex.t==="match"){
        let pick=null; let done=0; let tried=false; let firstOk=true;
        $$(".fle-opt", box).forEach(btn=>btn.addEventListener("click",()=>{
          if(btn.classList.contains("is-done")) return;
          if(!pick){
            pick=btn; btn.classList.add("is-pick"); return;
          }
          if(pick===btn || pick.dataset.side===btn.dataset.side){
            pick.classList.remove("is-pick"); pick=btn; btn.classList.add("is-pick"); return;
          }
          const ok=pick.dataset.i===btn.dataset.i;
          if(!ok){
            firstOk=false;
            pick.classList.remove("is-pick");
            pick=null;
            const fb=$(".fle-fb", box);
            fb.hidden=false; fb.className="fle-fb is-bad";
            fb.textContent=lang==="ka"?"კიდევ სცადე.":"Essaie encore.";
            return;
          }
          [pick,btn].forEach(b=>{b.classList.remove("is-pick"); b.classList.add("is-done"); b.disabled=true;});
          pick=null; done++;
          if(done===(ex.p||[]).length){
            if(!tried){ setStar(l.id,i,firstOk); tried=true; }
            const fb=$(".fle-fb", box);
            fb.hidden=false; fb.className="fle-fb";
            fb.textContent=ex.r|| (lang==="ka"?"ყოჩაღ!":"Bravo !");
          }
        }));
      }
    });
  }

  function shuffle(arr){
    const a=arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function esc(s){
    return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  }

  function initToolbar(){
    $$("[data-lang]").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));
    $$("[data-mode]").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.mode)));
    $$("[data-back]").forEach(b=>b.addEventListener("click", closeLesson));
  }

  fetch("data.json").then(r=>r.json()).then(d=>{
    DATA=d;
    initToolbar();
    setMode("eleve");
    setLang("fr");
    renderSommaire();
  }).catch(err=>{
    $("#sommaire-cards").innerHTML="<p>Impossible de charger les leçons pour le moment.</p>";
    console.error(err);
  });
})();
