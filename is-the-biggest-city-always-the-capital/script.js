(function () {
  const caps = [
    ["Canada", "Ottawa", "Toronto"],
    ["Australia", "Canberra", "Sydney"],
    ["New Zealand", "Wellington", "Auckland"],
    ["Nigeria", "Abuja", "Lagos"],
    ["India", "New Delhi", "Mumbai"],
    ["Pakistan", "Islamabad", "Karachi"],
    ["South Africa (executive)", "Pretoria", "Johannesburg"],
    ["California", "Sacramento", "Los Angeles"],
    ["Texas", "Austin", "Houston"],
    ["New York State", "Albany", "New York City"],
    ["Alaska", "Juneau", "Anchorage"]
  ];
  const clues = {
    "Ottawa": ["It is on a river with the same name as the city.", "It was chosen by a queen in 1857.", "It stands between English-speaking and French-speaking regions.", "It is the capital of Canada, not Toronto."],
    "Canberra": ["It did not exist in 1901.", "It is about 100 miles from a famous harbour city.", "Two American architects from Chicago designed it.", "It is the capital of Australia, not Sydney."],
    "Wellington": ["It is on the shores of a strait.", "Three commissioners from another country chose it.", "Its government works in the Beehive.", "It is the capital of New Zealand, not Auckland."],
    "Abuja": ["Its construction started at the end of the 1970s, on an almost empty site.", "It is in the centre of its country.", "The government moved there in December 1991.", "It is the capital of Nigeria, not Lagos."],
    "Pretoria": ["It is one of three capitals.", "Herbert Baker designed its most famous government building.", "Nelson Mandela was sworn in there in 1994.", "It is the seat of the South African government."],
    "New Delhi": ["It was inaugurated in 1931.", "Two British architects planned it.", "A king announced its creation at a great ceremony in 1911.", "It is the capital of India."],
    "Washington, D.C.": ["It is not part of any state.", "It is on the Potomac River.", "Congress met there for the first time in 1800.", "It is the capital of the USA."],
    "Juneau": ["You cannot drive there from the rest of North America.", "It is named after a French-Canadian gold miner.", "It is at the foot of a mountain, by the sea.", "It is the capital of Alaska, not Anchorage."]
  };

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const game = document.getElementById("game");
  if (game) {
    let order = [], qi = 0, score = 0, answered = false;
    function start() { order = shuffle(caps); qi = 0; score = 0; render(); }
    function render() {
      answered = false;
      if (qi >= order.length) {
        game.innerHTML = '<p class="tag">End of the game</p><p>Score: ' + score + ' / ' + (order.length * 2) + '</p><p>What was the most surprising capital? Why?</p><div class="btnrow"><button type="button" data-r="1">Play again</button></div>';
        return;
      }
      const [s, c, t] = order[qi];
      const other = shuffle(caps.filter(x => x[0] !== s))[0][1];
      const opts = shuffle([c, t, other]);
      game.innerHTML = '<div><strong>The Capital Trap</strong> · ' + (qi + 1) + ' / ' + order.length + ' · ' + score + ' points</div><p>What is the capital of ' + s + '?</p><div class="opts">' + opts.map(o => '<button type="button" data-o="' + o + '">' + o + '</button>').join('') + '</div><div class="fb"></div>';
    }
    game.addEventListener("click", function (e) {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.dataset.r) { start(); return; }
      if (btn.dataset.n) { qi++; render(); return; }
      const o = btn.dataset.o;
      if (!o || answered) return;
      answered = true;
      const [s, c, t] = order[qi];
      game.querySelectorAll("[data-o]").forEach(b => {
        if (b.dataset.o === c) b.classList.add("ok");
        else if (b === btn) b.classList.add("ko");
      });
      const fb = game.querySelector(".fb");
      if (o === c) { score += 2; fb.textContent = "Correct! The capital of " + s + " is " + c + ". +2 points."; }
      else if (o === t) { fb.textContent = "Trap! " + t + " is the biggest city, but the capital is " + c + ". Say two facts about " + t + " and explain why it is not the capital."; }
      else { fb.textContent = "No, the capital of " + s + " is " + c + "."; }
      fb.insertAdjacentHTML("afterend", '<div class="btnrow"><button type="button" data-n="1">Next</button></div>');
    });
    start();
  }

  const g = document.getElementById("guess");
  if (g) {
    const names = Object.keys(clues);
    let gi = 0, gc = 0;
    function renderGuess() {
      const n = names[gi], c = clues[n];
      g.innerHTML = '<p><strong>Card ' + (gi + 1) + ' / ' + names.length + '</strong> · ' + (gc === 0 ? "no clue yet" : gc + " clue" + (gc > 1 ? "s" : "")) + "</p>" +
        c.slice(0, gc).map((x, i) => '<div class="clue"><strong>' + (i + 1) + ".</strong> " + x + "</div>").join("") +
        (gc > 4 ? '<p><strong>' + n + "</strong></p>" : "") +
        '<div class="btnrow">' +
        (gc < 4 ? '<button type="button" data-a="clue">Next clue</button>' : "") +
        (gc <= 4 ? '<button type="button" data-a="reveal">Reveal the capital</button>' : "") +
        '<button type="button" data-a="next">Next capital</button></div>';
    }
    g.addEventListener("click", function (e) {
      const a = e.target.dataset.a;
      if (!a) return;
      if (a === "clue") gc++;
      if (a === "reveal") gc = 5;
      if (a === "next") { gi = (gi + 1) % names.length; gc = 0; }
      renderGuess();
    });
    renderGuess();
  }
})();
