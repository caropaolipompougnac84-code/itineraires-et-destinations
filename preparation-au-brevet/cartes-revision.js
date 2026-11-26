(function () {
  var root = document.getElementById("cartes-revision");
  if (!root) return;

  var tablist = root.querySelector(".cartes-tablist");
  var tabs = tablist ? [].slice.call(tablist.querySelectorAll('[role="tab"]')) : [];
  var panels = [].slice.call(root.querySelectorAll(".cartes-tabpanel"));
  var btnTbi = document.getElementById("btn-tbi");

  function closestPanel(el) {
    return el ? el.closest(".cartes-tabpanel") : null;
  }

  function selectTab(tab, opts) {
    if (!tab) return;
    opts = opts || {};
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) {
        if (on) panel.removeAttribute("hidden");
        else panel.setAttribute("hidden", "");
      }
    });
    if (opts.focus) tab.focus();
    if (opts.hash) {
      var panel = document.getElementById(tab.getAttribute("aria-controls"));
      var heading = panel && panel.querySelector(".cartes-famille");
      if (heading && heading.id) {
        if (location.hash.slice(1) !== heading.id) {
          history.replaceState(null, "", "#" + heading.id);
        }
      }
    }
  }

  function tabFromHash() {
    var id = (location.hash || "").slice(1);
    if (!id) return tabs[0] || null;
    var el = document.getElementById(id);
    if (!el) return tabs[0] || null;
    if (el.getAttribute("role") === "tab") return el;
    var panel = el.classList.contains("cartes-tabpanel") ? el : closestPanel(el);
    if (panel) {
      var tab = document.getElementById(panel.getAttribute("aria-labelledby"));
      if (tab) return tab;
    }
    return tabs[0] || null;
  }

  function openTabFromHash(opts) {
    var tab = tabFromHash();
    if (tab) selectTab(tab, opts || {});
  }

  if (tablist) {
    tablist.addEventListener("click", function (e) {
      var tab = e.target.closest('[role="tab"]');
      if (!tab || !tablist.contains(tab)) return;
      selectTab(tab, { hash: true });
    });
    tablist.addEventListener("keydown", function (e) {
      var tab = e.target.closest('[role="tab"]');
      if (!tab || !tablist.contains(tab)) return;
      var i = tabs.indexOf(tab);
      if (i < 0) return;
      var next = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      else return;
      e.preventDefault();
      selectTab(tabs[next], { focus: true, hash: true });
    });
  }

  openTabFromHash();
  window.addEventListener("hashchange", function () {
    if (document.body.classList.contains("tbi-actif")) return;
    openTabFromHash();
  });

  function setFlipped(card, on) {
    if (!card) return;
    card.classList.toggle("is-flipped", on);
    [].forEach.call(card.querySelectorAll(".carte-flip-btn"), function (b) {
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var verso = card.querySelector(".carte-verso");
    var recto = card.querySelector(".carte-recto");
    if (verso) verso.hidden = !on;
    if (recto) recto.hidden = on;
  }

  function toggleFlip(card) {
    if (!card) return;
    setFlipped(card, !card.classList.contains("is-flipped"));
  }

  function letterOf(opt) {
    var b = opt.querySelector("b");
    var t = ((b ? b.textContent : opt.textContent) || "").trim();
    var m = t.match(/^\s*([ABC])\s*[.]/i);
    return m ? m[1].toUpperCase() : "";
  }

  function parseAnswers(text) {
    var map = {};
    var re = /(\d+)\s*[.]\s*([ABC])/gi;
    var m;
    while ((m = re.exec(text || ""))) {
      map[parseInt(m[1], 10)] = m[2].toUpperCase();
    }
    return map;
  }

  function enhanceQcm(scope) {
    [].forEach.call((scope || root).querySelectorAll(".qcm-liste"), function (ol) {
      if (ol.getAttribute("data-qcm-ready")) return;
      ol.setAttribute("data-qcm-ready", "1");
      var card = ol.closest(".carte-rev");
      var ans = card ? card.querySelector(".qcm-reponse") : null;
      var map = parseAnswers(ans ? ans.textContent : "");
      [].forEach.call(ol.children, function (qLi, qi) {
        var correct = map[qi + 1] || "";
        var opts = qLi.querySelectorAll("ul > li");
        [].forEach.call(opts, function (opt) {
          var letter = letterOf(opt);
          opt.classList.add("qcm-choix");
          opt.setAttribute("role", "button");
          opt.setAttribute("tabindex", "0");
          opt.setAttribute("aria-pressed", "false");
          opt.setAttribute("data-lettre", letter);
          if (correct) opt.setAttribute("data-correct", letter === correct ? "true" : "false");
        });
      });
    });
  }

  function pickChoix(opt) {
    var ul = opt.parentElement;
    if (!ul) return;
    [].forEach.call(ul.querySelectorAll(".qcm-choix"), function (o) {
      o.classList.remove("qcm-bon", "qcm-faux", "qcm-choisi");
      o.setAttribute("aria-pressed", "false");
    });
    opt.classList.add("qcm-choisi");
    opt.setAttribute("aria-pressed", "true");
    if (opt.getAttribute("data-correct") === "true") opt.classList.add("qcm-bon");
    else if (opt.getAttribute("data-correct") === "false") opt.classList.add("qcm-faux");
  }

  function revealCorrect(card, open) {
    if (!card || !open) return;
    [].forEach.call(card.querySelectorAll('.qcm-choix[data-correct="true"]'), function (o) {
      o.classList.add("qcm-bon");
    });
  }

  function toggleReponse(btn) {
    var box = btn.parentElement.querySelector(".qcm-reponse");
    var open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", open ? "false" : "true");
    if (box) box.hidden = open;
    btn.textContent = open ? "Voir la réponse" : "Cacher la réponse";
    if (!open) revealCorrect(btn.closest(".carte-rev"), true);
  }

  enhanceQcm(root);

  document.addEventListener("click", function (e) {
    var flip = e.target.closest(".carte-flip-btn");
    if (flip) {
      var card = flip.closest(".carte-rev");
      toggleFlip(card);
      var on = card.classList.contains("is-flipped");
      var focusBtn = card.querySelector(on ? ".carte-verso .carte-flip-btn" : ".carte-recto .carte-flip-btn");
      if (focusBtn) focusBtn.focus();
      return;
    }
    var ans = e.target.closest(".qcm-reponse-btn");
    if (ans) {
      toggleReponse(ans);
      return;
    }
    var choix = e.target.closest(".qcm-choix");
    if (choix) {
      pickChoix(choix);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (document.body.classList.contains("tbi-actif")) return;
    var choix = e.target.closest(".qcm-choix");
    if (!choix) return;
    e.preventDefault();
    pickChoix(choix);
  });

  /* ----- Mode tableau blanc ----- */
  var overlay = null;
  var scene = null;
  var compteur = null;
  var btnPrev, btnNext, btnFlip, btnShuffle, btnQuit;
  var deck = [];
  var index = 0;
  var placeholder = null;
  var lastFocus = null;
  var tbiOpen = false;

  function buildOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.id = "tbi-overlay";
    overlay.className = "tbi-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="tbi-cadre" role="dialog" aria-modal="true" aria-labelledby="tbi-titre">' +
        '<header class="tbi-barre">' +
          '<p id="tbi-titre" class="tbi-compteur" aria-live="polite">Carte 1 sur 1</p>' +
          '<div class="tbi-barre-actions">' +
            '<button type="button" class="tbi-btn tbi-melanger">Mélanger</button>' +
            '<button type="button" class="tbi-btn tbi-quitter">Quitter</button>' +
          "</div>" +
        "</header>" +
        '<div class="tbi-scene" id="tbi-scene"></div>' +
        '<div class="tbi-commandes">' +
          '<button type="button" class="tbi-btn tbi-prev">Carte précédente</button>' +
          '<button type="button" class="tbi-btn tbi-flip">Retourner</button>' +
          '<button type="button" class="tbi-btn tbi-next">Carte suivante</button>' +
        "</div>" +
      "</div>";
    document.body.appendChild(overlay);
    scene = overlay.querySelector(".tbi-scene");
    compteur = overlay.querySelector(".tbi-compteur");
    btnPrev = overlay.querySelector(".tbi-prev");
    btnNext = overlay.querySelector(".tbi-next");
    btnFlip = overlay.querySelector(".tbi-flip");
    btnShuffle = overlay.querySelector(".tbi-melanger");
    btnQuit = overlay.querySelector(".tbi-quitter");
    btnPrev.addEventListener("click", function () { go(-1); });
    btnNext.addEventListener("click", function () { go(1); });
    btnFlip.addEventListener("click", retournner);
    btnShuffle.addEventListener("click", melanger);
    btnQuit.addEventListener("click", quitter);
  }

  function activePanel() {
    var i, p;
    for (i = 0; i < panels.length; i++) {
      p = panels[i];
      if (!p.hasAttribute("hidden")) return p;
    }
    return panels[0] || root;
  }

  function familyName(panel) {
    var h = panel ? panel.querySelector(".cartes-famille") : null;
    return h ? (h.textContent || "").trim() : "";
  }

  function cardsOf(panel) {
    return [].slice.call((panel || activePanel()).querySelectorAll(".cartes-grille > .carte-rev"));
  }

  function restoreCard() {
    if (!placeholder || !placeholder.parentNode) {
      placeholder = null;
      return;
    }
    var card = scene && scene.querySelector(".carte-rev");
    if (card) placeholder.parentNode.insertBefore(card, placeholder);
    placeholder.parentNode.removeChild(placeholder);
    placeholder = null;
  }

  function takeCard(card) {
    restoreCard();
    if (!card) return;
    placeholder = document.createElement("div");
    placeholder.className = "tbi-placeholder";
    card.parentNode.insertBefore(placeholder, card);
    scene.appendChild(card);
    setFlipped(card, false);
    enhanceQcm(card);
  }

  function updateChrome() {
    var panel = activePanel();
    var name = familyName(panel);
    var n = deck.length;
    var label = (name ? name + " · " : "") + "Carte " + (n ? index + 1 : 0) + " sur " + n;
    if (compteur) compteur.textContent = label;
    var card = deck[index];
    var flipped = card && card.classList.contains("is-flipped");
    if (btnFlip) btnFlip.textContent = flipped ? "Retour au recto" : "Retourner";
  }

  function go(delta) {
    if (!deck.length) return;
    index = (index + delta + deck.length) % deck.length;
    takeCard(deck[index]);
    updateChrome();
  }

  function retournner() {
    var card = deck[index];
    if (!card) return;
    toggleFlip(card);
    updateChrome();
  }

  function shuffle(arr) {
    var a = arr.slice();
    var i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function melanger() {
    if (deck.length < 2) return;
    deck = shuffle(deck);
    index = 0;
    takeCard(deck[0]);
    updateChrome();
  }

  function reqFS(el) {
    var fn = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (!fn) return;
    try {
      var r = fn.call(el);
      if (r && r.catch) r.catch(function () {});
    } catch (err) {}
  }

  function exitFS() {
    var el = document.fullscreenElement || document.webkitFullscreenElement;
    if (!el) return;
    var fn = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (!fn) return;
    try {
      var r = fn.call(document);
      if (r && r.catch) r.catch(function () {});
    } catch (err) {}
  }

  function ouvrir() {
    buildOverlay();
    var panel = activePanel();
    deck = cardsOf(panel);
    if (!deck.length) return;
    lastFocus = document.activeElement;
    index = 0;
    var hashId = (location.hash || "").slice(1);
    if (hashId) {
      var i;
      for (i = 0; i < deck.length; i++) {
        if (deck[i].id === hashId) { index = i; break; }
      }
    }
    overlay.hidden = false;
    document.body.classList.add("tbi-actif");
    tbiOpen = true;
    takeCard(deck[index]);
    updateChrome();
    reqFS(overlay);
    if (btnFlip) btnFlip.focus();
  }

  function quitter() {
    if (!tbiOpen) return;
    tbiOpen = false;
    restoreCard();
    document.body.classList.remove("tbi-actif");
    if (overlay) overlay.hidden = true;
    exitFS();
    deck = [];
    if (lastFocus && lastFocus.focus) {
      try { lastFocus.focus(); } catch (err) {}
    } else if (btnTbi) btnTbi.focus();
  }

  if (btnTbi) {
    btnTbi.addEventListener("click", ouvrir);
  }

  document.addEventListener("fullscreenchange", function () {
    if (tbiOpen && !document.fullscreenElement && !document.webkitFullscreenElement) {
      quitter();
    }
  });
  document.addEventListener("webkitfullscreenchange", function () {
    if (tbiOpen && !document.fullscreenElement && !document.webkitFullscreenElement) {
      quitter();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!tbiOpen) return;
    var tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    if (e.key === "Escape") {
      e.preventDefault();
      quitter();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
      return;
    }
    if (e.key === " " || e.key === "Spacebar") {
      if (e.target.closest(".qcm-choix")) {
        e.preventDefault();
        pickChoix(e.target.closest(".qcm-choix"));
        return;
      }
      if (e.target.closest("button, a")) return;
      e.preventDefault();
      retournner();
    }
    if (e.key === "Enter" && e.target.closest(".qcm-choix")) {
      e.preventDefault();
      pickChoix(e.target.closest(".qcm-choix"));
    }
  });
})();
