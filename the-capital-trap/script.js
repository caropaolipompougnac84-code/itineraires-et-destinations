(function () {
  const caps = [
    ["California", "Sacramento", "Los Angeles"],
    ["New York", "Albany", "New York City"],
    ["Texas", "Austin", "Houston"],
    ["Florida", "Tallahassee", "Miami"],
    ["Illinois", "Springfield", "Chicago"],
    ["Pennsylvania", "Harrisburg", "Philadelphia"],
    ["Washington", "Olympia", "Seattle"],
    ["Nevada", "Carson City", "Las Vegas"],
    ["Louisiana", "Baton Rouge", "New Orleans"],
    ["Michigan", "Lansing", "Detroit"],
    ["Kentucky", "Frankfort", "Louisville"],
    ["Oregon", "Salem", "Portland"],
    ["Alaska", "Juneau", "Anchorage"],
    ["Missouri", "Jefferson City", "Kansas City"]
  ];
  const cities = {
    "Chicago": ["It’s in the Midwest.", "It’s next to a big lake.", "It’s the biggest city in Illinois, but not the capital.", "Its name starts with “Ch”."],
    "San Francisco": ["It’s on the West Coast.", "It’s famous for a red bridge.", "It’s in California.", "The bridge is the Golden Gate."],
    "New Orleans": ["It’s in the South, near the Gulf of Mexico.", "The Mississippi flows through it.", "It’s famous for jazz.", "It’s in Louisiana."],
    "Las Vegas": ["It’s in the desert.", "It’s famous for casinos and shows.", "It’s in Nevada, but it isn’t the capital.", "Its name means “the meadows” in Spanish."],
    "Boston": ["It’s on the East Coast.", "It’s a very old city with famous universities.", "It’s the capital of Massachusetts.", "A famous “Tea Party” took place there in 1773."],
    "Honolulu": ["It’s on an island in the Pacific Ocean.", "It’s very far from the other big cities.", "It’s the capital of Hawaii.", "Pearl Harbor is very close."],
    "Miami": ["It’s in the south-east.", "It’s famous for beaches and sunshine.", "It’s in Florida, but it isn’t the capital.", "Many people speak Spanish there."],
    "Seattle": ["It’s in the north-west.", "It rains a lot there.", "It’s in Washington State, but it isn’t the capital.", "It’s famous for the Space Needle."]
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
      game.innerHTML = '<div><strong>The Capital Trap</strong> · state ' + (qi + 1) + ' / ' + order.length + ' · ' + score + ' points</div><p>What is the capital of ' + s + '?</p><div class="opts">' + opts.map(o => '<button type="button" data-o="' + o + '">' + o + '</button>').join('') + '</div><div class="fb"></div>';
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
      else if (o === t) { fb.textContent = "Trap! " + t + " is the biggest city, but the capital is " + c + ". Say three things about " + t + "."; }
      else { fb.textContent = "No, the capital of " + s + " is " + c + "."; }
      fb.insertAdjacentHTML("afterend", '<div class="btnrow"><button type="button" data-n="1">Next state</button></div>');
    });
    start();
  }

  const g = document.getElementById("guess");
  if (g) {
    const names = Object.keys(cities);
    let gi = 0, gc = 0;
    function renderGuess() {
      const n = names[gi], c = cities[n];
      g.innerHTML = '<p><strong>Card ' + (gi + 1) + ' / ' + names.length + '</strong> · ' + (gc === 0 ? "no clue yet" : gc + " clue" + (gc > 1 ? "s" : "")) + "</p>" +
        c.slice(0, gc).map((x, i) => '<div class="clue"><strong>' + (i + 1) + ".</strong> " + x + "</div>").join("") +
        (gc > 4 ? '<p><strong>' + n + "</strong></p>" : "") +
        '<div class="btnrow">' +
        (gc < 4 ? '<button type="button" data-a="clue">Next clue</button>' : "") +
        (gc <= 4 ? '<button type="button" data-a="reveal">Reveal the city</button>' : "") +
        '<button type="button" data-a="next">Next city</button></div>';
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
