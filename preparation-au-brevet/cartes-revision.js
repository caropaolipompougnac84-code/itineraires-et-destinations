(function () {
  var root = document.getElementById("cartes-revision");
  if (!root) return;

  root.addEventListener("click", function (e) {
    var flip = e.target.closest(".carte-flip-btn");
    if (flip) {
      var card = flip.closest(".carte-rev");
      var on = card.classList.toggle("is-flipped");
      card.querySelectorAll(".carte-flip-btn").forEach(function (b) {
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      var verso = card.querySelector(".carte-verso");
      var recto = card.querySelector(".carte-recto");
      if (verso) verso.hidden = !on;
      if (recto) recto.hidden = on;
      var focusBtn = card.querySelector(on ? ".carte-verso .carte-flip-btn" : ".carte-recto .carte-flip-btn");
      if (focusBtn) focusBtn.focus();
      return;
    }
    var ans = e.target.closest(".qcm-reponse-btn");
    if (ans) {
      var box = ans.parentElement.querySelector(".qcm-reponse");
      var open = ans.getAttribute("aria-expanded") === "true";
      ans.setAttribute("aria-expanded", open ? "false" : "true");
      if (box) box.hidden = open;
      ans.textContent = open ? "Voir la réponse" : "Cacher la réponse";
    }
  });
})();
