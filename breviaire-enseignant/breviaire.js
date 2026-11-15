(function () {
  var parts = Array.prototype.slice.call(document.querySelectorAll('.bv-part'));
  function openId(id) { var d = document.getElementById(id); if (d && d.tagName === 'DETAILS') d.open = true; }
  document.querySelectorAll('[data-open]').forEach(function (a) {
    a.addEventListener('click', function () { openId(a.getAttribute('data-open')); });
  });
  if (location.hash) openId(location.hash.slice(1));
  window.addEventListener('hashchange', function () { openId(location.hash.slice(1)); });
  var oa = document.getElementById('bv-open-all'), ca = document.getElementById('bv-close-all');
  if (oa) oa.addEventListener('click', function () { parts.forEach(function (d) { d.open = true; }); });
  if (ca) ca.addEventListener('click', function () { parts.forEach(function (d) { d.open = false; }); });
  var saved = [];
  window.addEventListener('beforeprint', function () { saved = parts.map(function (d) { return d.open; }); parts.forEach(function (d) { d.open = true; }); });
  window.addEventListener('afterprint', function () { parts.forEach(function (d, i) { d.open = saved[i]; }); document.body.classList.remove('bv-memo-only'); });
  var pm = document.getElementById('bv-print-memo');
  if (pm) pm.addEventListener('click', function () { document.body.classList.add('bv-memo-only'); window.print(); });
  document.querySelectorAll('.bv-copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.parentNode.querySelector('.bv-letter-text').innerText;
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { b.textContent = 'Modèle copié'; });
    });
  });
})();
