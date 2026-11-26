(function () {
  "use strict";

  var FAMILIES = [
    { id: "clothes", name: "The Clothes Family", short: "Clothes", color: "#e63946", ink: "#fff", tint: "#ffe5e7", members: ["a dress", "shoes", "socks", "a ribbon", "a suit", "an armband"] },
    { id: "colours", name: "The Colours Family", short: "Colours", color: "#ff8c1a", ink: "#fff", tint: "#fff0e0", members: ["white", "yellow", "red", "black", "blue", "green"] },
    { id: "feelings", name: "The Feelings Family", short: "Feelings", color: "#ffc61a", ink: "#1a2233", tint: "#fff8d6", members: ["brave", "scared", "alone", "happy", "sad", "angry"] },
    { id: "people", name: "The People Family", short: "People", color: "#2bb24c", ink: "#fff", tint: "#e6f8ea", members: ["Ruby", "her mother", "Mrs Henry", "a marshal", "a painter", "a reporter"] },
    { id: "school", name: "The School Things Family", short: "School Things", color: "#00a8b5", ink: "#fff", tint: "#e0f6f8", members: ["a notebook", "a ruler", "a pencil", "a book", "a blackboard", "a desk"] },
    { id: "places", name: "The Places Family", short: "Places", color: "#1e88e5", ink: "#fff", tint: "#e3f1fc", members: ["a school", "a classroom", "a playground", "a street", "an office", "a house"] },
    { id: "past", name: "The Past Family", short: "Past", color: "#8e44ad", ink: "#fff", tint: "#f3e8f8", members: ["was", "went", "walked", "drove", "held", "sat"] }
  ];

  var CARDS = [
    { id: "c00", family: "clothes", word: "a dress", sentence: "Ruby's dress is white.", img: "img/cards/clothes-dress.jpg", alt: "a dress: Ruby's dress is white." },
    { id: "c01", family: "clothes", word: "shoes", sentence: "Her shoes are white.", img: "img/cards/clothes-shoes.jpg", alt: "shoes: Her shoes are white." },
    { id: "c02", family: "clothes", word: "socks", sentence: "Her socks are white.", img: "img/cards/clothes-socks.jpg", alt: "socks: Her socks are white." },
    { id: "c03", family: "clothes", word: "a ribbon", sentence: "She has got a ribbon in her hair.", img: "img/cards/clothes-ribbon.jpg", alt: "a ribbon: She has got a ribbon in her hair." },
    { id: "c04", family: "clothes", word: "a suit", sentence: "The marshals are wearing suits.", img: "img/cards/clothes-suit.jpg", alt: "a suit: The marshals are wearing suits." },
    { id: "c05", family: "clothes", word: "an armband", sentence: "The armbands are yellow.", img: "img/cards/clothes-armband.jpg", alt: "an armband: The armbands are yellow." },
    { id: "c10", family: "colours", word: "white", sentence: "a white cat", img: "img/cards/colours-white.jpg", alt: "white: a white cat" },
    { id: "c11", family: "colours", word: "yellow", sentence: "a yellow sunflower", img: "img/cards/colours-yellow.jpg", alt: "yellow: a yellow sunflower" },
    { id: "c12", family: "colours", word: "red", sentence: "a red tomato", img: "img/cards/colours-red.jpg", alt: "red: a red tomato" },
    { id: "c13", family: "colours", word: "black", sentence: "a black umbrella", img: "img/cards/colours-black.jpg", alt: "black: a black umbrella" },
    { id: "c14", family: "colours", word: "blue", sentence: "a blue book", img: "img/cards/colours-blue.jpg", alt: "blue: a blue book" },
    { id: "c15", family: "colours", word: "green", sentence: "a green apple", img: "img/cards/colours-green.jpg", alt: "green: a green apple" },
    { id: "c20", family: "feelings", word: "brave", sentence: "She is brave.", img: "img/cards/feelings-brave.jpg", alt: "brave: She is brave." },
    { id: "c21", family: "feelings", word: "scared", sentence: "He is scared.", img: "img/cards/feelings-scared.jpg", alt: "scared: He is scared." },
    { id: "c22", family: "feelings", word: "alone", sentence: "She is alone.", img: "img/cards/feelings-alone.jpg", alt: "alone: She is alone." },
    { id: "c23", family: "feelings", word: "happy", sentence: "He is happy.", img: "img/cards/feelings-happy.jpg", alt: "happy: He is happy." },
    { id: "c24", family: "feelings", word: "sad", sentence: "She is sad.", img: "img/cards/feelings-sad.jpg", alt: "sad: She is sad." },
    { id: "c25", family: "feelings", word: "angry", sentence: "He is angry.", img: "img/cards/feelings-angry.jpg", alt: "angry: He is angry." },
    { id: "c30", family: "people", word: "Ruby", sentence: "Ruby was six.", img: "img/cards/people-ruby.jpg", alt: "Ruby: Ruby was six." },
    { id: "c31", family: "people", word: "her mother", sentence: "Ruby held her mother's hand.", img: "img/cards/people-mother.jpg", alt: "her mother: Ruby held her mother's hand." },
    { id: "c32", family: "people", word: "Mrs Henry", sentence: "Mrs Henry was Ruby's teacher.", img: "img/cards/people-mrs-henry.jpg", alt: "Mrs Henry: Mrs Henry was Ruby's teacher." },
    { id: "c33", family: "people", word: "a marshal", sentence: "Four marshals walked with Ruby.", img: "img/cards/people-marshal.jpg", alt: "a marshal: Four marshals walked with Ruby." },
    { id: "c34", family: "people", word: "a painter", sentence: "Norman Rockwell was a painter.", img: "img/cards/people-painter.jpg", alt: "a painter: Norman Rockwell was a painter." },
    { id: "c35", family: "people", word: "a reporter", sentence: "A young reporter asked Ruby questions.", img: "img/cards/people-reporter.jpg", alt: "a reporter: A young reporter asked Ruby questions." },
    { id: "c40", family: "school", word: "a notebook", sentence: "Ruby has got a notebook.", img: "img/cards/school-notebook.jpg", alt: "a notebook: Ruby has got a notebook." },
    { id: "c41", family: "school", word: "a ruler", sentence: "Ruby has got a ruler.", img: "img/cards/school-ruler.jpg", alt: "a ruler: Ruby has got a ruler." },
    { id: "c42", family: "school", word: "a pencil", sentence: "I write with a pencil.", img: "img/cards/school-pencil.jpg", alt: "a pencil: I write with a pencil." },
    { id: "c43", family: "school", word: "a book", sentence: "I read a book.", img: "img/cards/school-book.jpg", alt: "a book: I read a book." },
    { id: "c44", family: "school", word: "a blackboard", sentence: "The teacher writes on the blackboard.", img: "img/cards/school-blackboard.jpg", alt: "a blackboard: The teacher writes on the blackboard." },
    { id: "c45", family: "school", word: "a desk", sentence: "I sit at my desk.", img: "img/cards/school-desk.jpg", alt: "a desk: I sit at my desk." },
    { id: "c50", family: "places", word: "a school", sentence: "Ruby went to a new school.", img: "img/cards/places-school.jpg", alt: "a school: Ruby went to a new school." },
    { id: "c51", family: "places", word: "a classroom", sentence: "Ruby was alone in her classroom.", img: "img/cards/places-classroom.jpg", alt: "a classroom: Ruby was alone in her classroom." },
    { id: "c52", family: "places", word: "a playground", sentence: "Ruby could not go to the playground.", img: "img/cards/places-playground.jpg", alt: "a playground: Ruby could not go to the playground." },
    { id: "c53", family: "places", word: "a street", sentence: "A lot of people shouted in the street.", img: "img/cards/places-street.jpg", alt: "a street: A lot of people shouted in the street." },
    { id: "c54", family: "places", word: "an office", sentence: "On the first day, Ruby sat in the office.", img: "img/cards/places-office.jpg", alt: "an office: On the first day, Ruby sat in the office." },
    { id: "c55", family: "places", word: "a house", sentence: "I live in a house.", img: "img/cards/places-house.jpg", alt: "a house: I live in a house." },
    { id: "c60", family: "past", word: "was", sentence: "be / was: Ruby was six.", img: "img/cards/past-was.jpg", alt: "was: be / was: Ruby was six." },
    { id: "c61", family: "past", word: "went", sentence: "go / went: She went to a new school.", img: "img/cards/past-went.jpg", alt: "went: go / went: She went to a new school." },
    { id: "c62", family: "past", word: "walked", sentence: "walk / walked: She walked into the school.", img: "img/cards/past-walked.jpg", alt: "walked: walk / walked: She walked into the school." },
    { id: "c63", family: "past", word: "drove", sentence: "drive / drove: The marshals drove Ruby to school.", img: "img/cards/past-drove.jpg", alt: "drove: drive / drove: The marshals drove Ruby to school." },
    { id: "c64", family: "past", word: "held", sentence: "hold / held: She held her mother's hand.", img: "img/cards/past-held.jpg", alt: "held: hold / held: She held her mother's hand." },
    { id: "c65", family: "past", word: "sat", sentence: "sit / sat: She sat in the office all day.", img: "img/cards/past-sat.jpg", alt: "sat: sit / sat: She sat in the office all day." }
  ];

  var cardById = {};
  CARDS.forEach(function (c) { cardById[c.id] = c; });
  var familyById = {};
  FAMILIES.forEach(function (f) { familyById[f.id] = f; });

  var state = {
    pile: [],
    drawn: null,
    flipped: false,
    filed: {},
    team: "A",
    familiesWon: { A: 0, B: 0 },
    cardsWon: { A: 0, B: 0 },
    complete: {},
    message: "",
    tone: "",
    confirmNew: false,
    dys: false,
    activeFamily: "clothes"
  };

  var voice = null;
  var els = {};

  function shuffle(list) {
    var a = list.slice();
    var i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function familyWord(n) {
    return n === 1 ? "family" : "families";
  }

  function cardWord(n) {
    return n === 1 ? "card" : "cards";
  }

  function teamName(t) {
    return t === "A" ? "Team A" : "Team B";
  }

  function completeCount() {
    return Object.keys(state.complete).length;
  }

  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    var list = speechSynthesis.getVoices();
    voice = list.find(function (x) { return x.lang === "en-US"; }) ||
      list.find(function (x) { return /^en/.test(x.lang); }) ||
      null;
  }

  function speakCard(card) {
    if (!("speechSynthesis" in window) || !card) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(card.word + ". " + card.sentence);
    u.lang = "en-US";
    if (voice) u.voice = voice;
    u.rate = 0.95;
    speechSynthesis.speak(u);
  }

  function clearConfirm() {
    state.confirmNew = false;
  }

  function newGame() {
    var filed = {};
    FAMILIES.forEach(function (f) { filed[f.id] = []; });
    state.pile = shuffle(CARDS.map(function (c) { return c.id; }));
    state.drawn = null;
    state.flipped = false;
    state.filed = filed;
    state.team = "A";
    state.familiesWon = { A: 0, B: 0 };
    state.cardsWon = { A: 0, B: 0 };
    state.complete = {};
    state.confirmNew = false;
    state.tone = "";
    state.message = "Team A starts. Touch Draw a card.";
    state.activeFamily = "clothes";
    render();
  }

  function requestNewGame() {
    if (!state.confirmNew) {
      state.confirmNew = true;
      state.tone = "";
      state.message = "Touch Shuffle / New game again to start a new game.";
      render();
      return;
    }
    newGame();
  }

  function setTeam(t) {
    if (t !== "A" && t !== "B") return;
    clearConfirm();
    state.team = t;
    state.tone = "";
    state.message = teamName(t) + " plays now.";
    render();
  }

  function drawCard() {
    clearConfirm();
    if (state.drawn) {
      state.tone = "";
      state.message = state.flipped
        ? "Put this card in a family first. Touch a family."
        : "Turn this card first. Touch the card.";
      render();
      return;
    }
    if (!state.pile.length) {
      state.tone = "";
      state.message = "The pile is empty.";
      render();
      return;
    }
    state.drawn = state.pile.shift();
    state.flipped = false;
    state.tone = "";
    state.message = teamName(state.team) + ": touch the card to turn it.";
    render();
    var cardEl = document.getElementById("drawn-card");
    if (cardEl) cardEl.focus();
  }

  function flipCard() {
    if (!state.drawn || state.flipped) return;
    clearConfirm();
    state.flipped = true;
    state.tone = "";
    state.message = "Touch a family to put this card away.";
    render();
  }

  function fileToFamily(familyId) {
    clearConfirm();
    if (!familyById[familyId]) return;
    if (!state.drawn) {
      state.activeFamily = familyId;
      render();
      return;
    }
    if (!state.flipped) {
      state.activeFamily = familyId;
      state.tone = "";
      state.message = "Turn this card first. Touch the card.";
      render();
      return;
    }
    var card = cardById[state.drawn];
    state.activeFamily = familyId;
    if (card.family !== familyId) {
      state.tone = "no";
      state.message = "Not this family. Try again.";
      render();
      return;
    }
    state.filed[familyId].push({ id: card.id, team: state.team });
    state.cardsWon[state.team] += 1;
    var placedBy = state.team;
    var fam = familyById[familyId];
    state.drawn = null;
    state.flipped = false;
    var justComplete = state.filed[familyId].length === 6 && !state.complete[familyId];
    if (justComplete) {
      state.complete[familyId] = placedBy;
      state.familiesWon[placedBy] += 1;
    }
    if (completeCount() === 7) {
      announceWinner();
    } else if (justComplete) {
      state.tone = "yes";
      state.message = "Yes. The " + fam.short + " family is complete. This family goes to " + teamName(placedBy) + ".";
      state.team = placedBy === "A" ? "B" : "A";
      state.message += " " + teamName(state.team) + " plays now.";
    } else {
      state.tone = "yes";
      state.team = placedBy === "A" ? "B" : "A";
      state.message = "Yes. This card belongs to the " + fam.short + " family. " + teamName(state.team) + " plays now.";
    }
    render();
  }

  function announceWinner() {
    var a = state.familiesWon.A;
    var b = state.familiesWon.B;
    var end;
    if (a > b) {
      end = "Well done. All seven families are complete. Team A wins, with " + a + " " + familyWord(a) + ".";
    } else if (b > a) {
      end = "Well done. All seven families are complete. Team B wins, with " + b + " " + familyWord(b) + ".";
    } else {
      end = "Well done. All seven families are complete. It is a tie: " + a + " " + familyWord(a) + " each.";
    }
    state.tone = "done";
    state.message = end;
  }

  function toggleDys() {
    state.dys = !state.dys;
    document.body.classList.toggle("mode-dys", state.dys);
    els.dysBtn.setAttribute("aria-pressed", state.dys ? "true" : "false");
    els.dysBtn.textContent = state.dys ? "Standard version" : "Dys version";
  }

  function renderScores() {
    var done = completeCount();
    els.scoreFamilies.textContent = "Complete families: " + done + " / 7";
    els.scoreA.textContent = "Team A: " + state.familiesWon.A + " " + familyWord(state.familiesWon.A) + ", " + state.cardsWon.A + " " + cardWord(state.cardsWon.A);
    els.scoreB.textContent = "Team B: " + state.familiesWon.B + " " + familyWord(state.familiesWon.B) + ", " + state.cardsWon.B + " " + cardWord(state.cardsWon.B);
    els.scorePile.textContent = "Cards in the pile: " + state.pile.length;
  }

  function renderToolbar() {
    els.teamA.setAttribute("aria-pressed", state.team === "A" ? "true" : "false");
    els.teamB.setAttribute("aria-pressed", state.team === "B" ? "true" : "false");
    els.drawBtn.disabled = !state.pile.length && !state.drawn;
    els.newBtn.classList.toggle("warn", state.confirmNew);
  }

  function renderStatus() {
    els.status.textContent = state.message;
    els.status.className = "status" + (state.tone ? " is-" + state.tone : "");
  }

  function renderCard() {
    var stage = els.cardSlot;
    stage.innerHTML = "";
    if (!state.drawn) {
      var empty = document.createElement("div");
      empty.className = "card-empty";
      empty.id = "card-empty";
      empty.textContent = state.pile.length
        ? "Touch Draw a card."
        : (completeCount() === 7 ? "All the cards are in their families." : "The pile is empty.");
      stage.appendChild(empty);
      return;
    }
    var card = cardById[state.drawn];
    var fam = familyById[card.family];
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hf-card" + (state.flipped ? " is-flipped" : "");
    btn.id = "drawn-card";
    btn.setAttribute("aria-pressed", state.flipped ? "true" : "false");
    btn.setAttribute("aria-label", state.flipped
      ? (card.word + ". " + card.sentence + " Touch a family to put this card away.")
      : "A card from the pile, face down. Touch the card to turn it.");
    var inner = document.createElement("div");
    inner.className = "inner";
    inner.innerHTML =
      '<div class="face back">' +
        '<div class="game-name">HAPPY FAMILIES</div>' +
        '<div class="seq-name">RUBY GOES TO SCHOOL</div>' +
        '<div class="dots" aria-hidden="true">' +
          FAMILIES.map(function (f) {
            return '<span style="background:' + f.color + '"></span>';
          }).join("") +
        "</div>" +
      "</div>" +
      '<div class="face front">' +
        '<div class="hband" style="background:' + fam.color + ";color:" + fam.ink + '">' + fam.name + "</div>" +
        '<div class="ph pic"><img src="' + card.img + '" alt="' + escapeHtml(card.alt) + '"></div>' +
        '<div class="word">' + escapeHtml(card.word) + "</div>" +
        '<div class="sentence">' + escapeHtml(card.sentence) + "</div>" +
        '<div class="front-actions"><button type="button" class="listen-btn" data-listen>Listen</button></div>' +
      "</div>";
    btn.appendChild(inner);
    btn.addEventListener("click", function (e) {
      if (e.target.closest("[data-listen]")) {
        e.preventDefault();
        e.stopPropagation();
        speakCard(card);
        return;
      }
      if (!state.flipped) flipCard();
    });
    stage.appendChild(btn);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderTabs() {
    els.tabs.innerHTML = "";
    FAMILIES.forEach(function (f, index) {
      var n = state.filed[f.id].length;
      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "family-tab";
      tab.id = "tab-" + f.id;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", "panel-families");
      tab.setAttribute("aria-selected", state.activeFamily === f.id ? "true" : "false");
      tab.tabIndex = state.activeFamily === f.id ? 0 : -1;
      tab.dataset.family = f.id;
      if (state.activeFamily === f.id) {
        tab.style.background = f.color;
        tab.style.borderColor = f.color;
        tab.style.color = f.ink;
      }
      if (state.flipped && state.drawn) tab.classList.add("is-ready");
      if (state.complete[f.id]) tab.classList.add("is-complete");
      tab.innerHTML = escapeHtml(f.short) + '<span class="count">' + n + " / 6</span>";
      tab.addEventListener("click", function () {
        fileToFamily(f.id);
      });
      tab.addEventListener("keydown", function (e) {
        var next = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % FAMILIES.length;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index - 1 + FAMILIES.length) % FAMILIES.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = FAMILIES.length - 1;
        if (next >= 0) {
          e.preventDefault();
          state.activeFamily = FAMILIES[next].id;
          render();
          var ntab = document.getElementById("tab-" + FAMILIES[next].id);
          if (ntab) ntab.focus();
        }
      });
      els.tabs.appendChild(tab);
    });
  }

  function renderPanel() {
    var f = familyById[state.activeFamily];
    els.panel.style.background = f.tint;
    els.panelTitle.textContent = f.name;
    var done = !!state.complete[f.id];
    els.badge.hidden = !done;
    if (done) {
      els.badge.textContent = "Complete: " + teamName(state.complete[f.id]);
    }
    var canPut = !!(state.drawn && state.flipped);
    els.putBtn.disabled = !canPut;
    els.putBtn.setAttribute("aria-disabled", canPut ? "false" : "true");
    els.slots.innerHTML = "";
    var placed = {};
    state.filed[f.id].forEach(function (item) {
      placed[cardById[item.id].word] = item;
    });
    f.members.forEach(function (word) {
      var slot = document.createElement("div");
      var item = placed[word];
      if (item) {
        var card = cardById[item.id];
        slot.className = "slot is-filled";
        slot.innerHTML =
          '<img src="' + card.img + '" alt="' + escapeHtml(card.alt) + '">' +
          '<div class="slot-word">' + escapeHtml(card.word) + "</div>" +
          '<div class="slot-team is-' + item.team.toLowerCase() + '">' + teamName(item.team) + "</div>";
      } else {
        slot.className = "slot is-empty";
        slot.innerHTML = '<div class="slot-word">' + escapeHtml(word) + "</div>";
      }
      els.slots.appendChild(slot);
    });
  }

  function render() {
    renderToolbar();
    renderScores();
    renderStatus();
    renderCard();
    renderTabs();
    renderPanel();
  }

  function bind() {
    els.teamA = document.getElementById("team-a");
    els.teamB = document.getElementById("team-b");
    els.drawBtn = document.getElementById("draw-card");
    els.newBtn = document.getElementById("new-game");
    els.dysBtn = document.getElementById("dys-toggle");
    els.scoreFamilies = document.getElementById("score-families");
    els.scoreA = document.getElementById("score-a");
    els.scoreB = document.getElementById("score-b");
    els.scorePile = document.getElementById("score-pile");
    els.status = document.getElementById("game-status");
    els.cardSlot = document.getElementById("card-slot");
    els.tabs = document.getElementById("family-tabs");
    els.panel = document.getElementById("panel-families");
    els.panelTitle = document.getElementById("panel-title");
    els.badge = document.getElementById("complete-badge");
    els.putBtn = document.getElementById("put-here");
    els.slots = document.getElementById("family-slots");

    els.teamA.addEventListener("click", function () { setTeam("A"); });
    els.teamB.addEventListener("click", function () { setTeam("B"); });
    els.drawBtn.addEventListener("click", drawCard);
    els.newBtn.addEventListener("click", requestNewGame);
    els.dysBtn.addEventListener("click", toggleDys);
    els.putBtn.addEventListener("click", function () {
      fileToFamily(state.activeFamily);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bind();
    if ("speechSynthesis" in window) {
      pickVoice();
      speechSynthesis.onvoiceschanged = pickVoice;
    }
    newGame();
  });

  window.__happyFamilies = {
    families: FAMILIES,
    cards: CARDS,
    getState: function () {
      return {
        pile: state.pile.slice(),
        drawn: state.drawn,
        flipped: state.flipped,
        filed: JSON.parse(JSON.stringify(state.filed)),
        team: state.team,
        familiesWon: { A: state.familiesWon.A, B: state.familiesWon.B },
        cardsWon: { A: state.cardsWon.A, B: state.cardsWon.B },
        complete: Object.assign({}, state.complete),
        message: state.message,
        activeFamily: state.activeFamily,
        dys: state.dys
      };
    },
    setPile: function (ids) {
      state.pile = ids.slice();
      state.drawn = null;
      state.flipped = false;
      render();
    },
    draw: drawCard,
    flip: flipCard,
    file: fileToFamily,
    newGame: newGame,
    setTeam: setTeam
  };
})();
