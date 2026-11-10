/* Interactive questions and dialogue audio for « Indian Railways ».
   © 2026 Madame Carole Paoli Pompougnac · CC BY-NC-SA 4.0 */
(function () {
  function norm(s) {
    return (s || '').toLowerCase().replace(/[’']/g, "'").replace(/[.,!?;:"]/g, '').replace(/\s+/g, ' ').trim();
  }
  function $(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ---------- scores ----------
  var boards = {};
  function board(id) {
    if (!boards[id]) {
      var el = document.querySelector('.score[data-for="' + id + '"]');
      boards[id] = { el: el, got: 0, total: el ? +el.getAttribute('data-total') : 0 };
    }
    return boards[id];
  }
  function bump(id, ok) {
    if (!id) return;
    var b = board(id);
    if (ok) b.got++;
    if (b.el) b.el.querySelector('b').textContent = b.got;
    var all = 0, tot = 0;
    Object.keys(boards).forEach(function (k) { all += boards[k].got; tot += boards[k].total; });
    $('.grand b').forEach(function (g) { g.textContent = all; });
  }
  function setScore(id, n) {
    var b = board(id); b.got = n; if (b.el) b.el.querySelector('b').textContent = n; bump(null);
    var all = 0; Object.keys(boards).forEach(function (k) { all += boards[k].got; });
    $('.grand b').forEach(function (g) { g.textContent = all; });
  }

  // ---------- multiple choice and true / false ----------
  function wireChoice(q) {
    var a = q.getAttribute('data-a');
    var id = q.getAttribute('data-score') || (q.closest('[data-score]') && q.closest('[data-score]').getAttribute('data-score'));
    var fb = q.querySelector('.fb');
    $('.opt', q).forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (q.classList.contains('done')) return;
        q.classList.add('done');
        var ok = btn.getAttribute('data-v') === a;
        btn.classList.add(ok ? 'right' : 'wrong');
        btn.setAttribute('aria-pressed', 'true');
        if (!ok) $('.opt', q).forEach(function (b) { if (b.getAttribute('data-v') === a) b.classList.add('right'); });
        $('.opt', q).forEach(function (b) { b.disabled = true; });
        if (fb) {
          fb.innerHTML = (ok ? '<strong>Correct.</strong> ' : '<strong>Not quite.</strong> ') + (q.getAttribute('data-fb') || '');
          fb.className = 'fb ' + (ok ? 'ok' : 'ko');
        }
        bump(id, ok);
        var ev = new CustomEvent('answered', { bubbles: true, detail: { ok: ok } });
        q.dispatchEvent(ev);
      });
    });
  }
  $('.q').forEach(wireChoice);

  // ---------- gap-fill ----------
  $('.gapfill').forEach(function (g) {
    var id = g.getAttribute('data-score');
    var btn = g.querySelector('.check');
    var res = g.querySelector('.fb');
    btn.addEventListener('click', function () {
      var n = 0, inputs = $('input[data-a]', g);
      inputs.forEach(function (inp) {
        var ok = inp.getAttribute('data-a').split('|').some(function (x) { return norm(x) === norm(inp.value); });
        inp.classList.remove('right', 'wrong');
        inp.classList.add(ok ? 'right' : 'wrong');
        inp.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (ok) n++;
      });
      setScore(id, n);
      res.className = 'fb ' + (n === inputs.length ? 'ok' : 'ko');
      res.innerHTML = '<strong>' + n + ' / ' + inputs.length + '.</strong> ' + (n === inputs.length ? 'Well done.' : 'Correct the red boxes and check again.');
    });
    var bank = g.querySelector('.bank');
    if (bank) $('.chip', bank).forEach(function (c) {
      c.addEventListener('click', function () {
        var target = g.querySelector('input[data-a]:focus') || g.__last || $('input[data-a]', g).filter(function (i) { return !i.value; })[0];
        if (target) { target.value = c.textContent; target.focus(); }
      });
    });
    $('input[data-a]', g).forEach(function (i) { i.addEventListener('focus', function () { g.__last = i; }); });
  });

  // ---------- tap to match ----------
  $('.match').forEach(function (m) {
    var id = m.getAttribute('data-score');
    var pick = null, done = 0, tries = 0;
    var total = $('.mw', m).length;
    var info = m.querySelector('.fb');
    function upd() { info.innerHTML = '<strong>' + done + ' / ' + total + '</strong> pairs found. Attempts: ' + tries + '.'; info.className = 'fb' + (done === total ? ' ok' : ''); }
    $('.mw', m).forEach(function (w) {
      w.addEventListener('click', function () {
        if (w.classList.contains('right')) return;
        $('.mw', m).forEach(function (x) { x.classList.remove('sel'); });
        pick = w; w.classList.add('sel'); w.setAttribute('aria-pressed', 'true');
      });
    });
    $('.md', m).forEach(function (d) {
      d.addEventListener('click', function () {
        if (!pick || d.classList.contains('right')) return;
        tries++;
        if (pick.getAttribute('data-k') === d.getAttribute('data-k')) {
          pick.classList.remove('sel'); pick.classList.add('right'); d.classList.add('right');
          pick.disabled = true; d.disabled = true; done++;
          if (tries === done) { /* perfect so far */ }
          setScore(id, done);
        } else {
          d.classList.add('wrong'); var p = pick;
          setTimeout(function () { d.classList.remove('wrong'); }, 700);
          p.classList.add('wrong'); setTimeout(function () { p.classList.remove('wrong'); }, 700);
        }
        pick = null; upd();
      });
    });
    upd();
  });

  // ---------- video with questions at set times ----------
  $('.vq').forEach(function (wrap) {
    var v = wrap.querySelector('video');
    var layer = wrap.querySelector('.pop');
    var cues = $('.cue', wrap).map(function (c) { return { t: +c.getAttribute('data-t'), el: c, done: false }; });
    var toggle = document.getElementById(wrap.getAttribute('data-toggle'));
    var last = 0;
    function on() { return !toggle || toggle.checked; }
    v.addEventListener('timeupdate', function () {
      var now = v.currentTime;
      if (on() && !v.seeking && now > last && now - last < 1.5) {
        cues.forEach(function (c) {
          if (!c.done && c.t > last && c.t <= now) show(c);
        });
      }
      last = now;
    });
    v.addEventListener('seeked', function () { last = v.currentTime; });
    function show(c) {
      c.done = true;
      v.pause();
      if (document.fullscreenElement) { try { document.exitFullscreen(); } catch (e) {} }
      if (v.webkitDisplayingFullscreen && v.webkitExitFullscreen) { try { v.webkitExitFullscreen(); } catch (e) {} }
      $('.cue', layer).forEach(function (x) { x.hidden = true; });
      c.el.hidden = false;
      layer.hidden = false;
      wrap.classList.add('asking');
      var first = c.el.querySelector('.opt');
      if (first) first.focus({ preventScroll: true });
      if (window.innerWidth < 700) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    $('.cue', wrap).forEach(function (c) {
      layer.appendChild(c);
      c.hidden = true;
      var go = c.querySelector('.resume');
      c.addEventListener('answered', function () { go.hidden = false; go.focus({ preventScroll: true }); });
      go.addEventListener('click', function () {
        layer.hidden = true; wrap.classList.remove('asking'); v.play();
      });
    });
    var restart = wrap.parentNode.querySelector('.replay-q');
    if (restart) restart.addEventListener('click', function () {
      cues.forEach(function (c) { c.done = false; });
      v.currentTime = 0; last = 0; v.play();
    });
    $('.speed', wrap.parentNode).forEach(function (b) {
      b.addEventListener('click', function () {
        v.playbackRate = +b.getAttribute('data-rate');
        $('.speed', wrap.parentNode).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      });
    });
  });

  // ---------- adapted version: one step at a time ----------
  var stepBtn = document.getElementById('onestep');
  if (stepBtn) {
    var steps = $('.step'); var i = 0;
    function showStep() { steps.forEach(function (s, k) { s.classList.toggle('on', k === i); }); document.getElementById('stepn').textContent = (i + 1) + ' / ' + steps.length; }
    stepBtn.addEventListener('click', function () {
      var onOff = document.body.classList.toggle('onestep');
      stepBtn.setAttribute('aria-pressed', onOff ? 'true' : 'false');
      stepBtn.textContent = onOff ? 'Show the whole page' : 'One step at a time';
      showStep();
    });
    document.getElementById('prevstep').addEventListener('click', function () { if (i > 0) { i--; showStep(); window.scrollTo(0, stepBtn.offsetTop); } });
    document.getElementById('nextstep').addEventListener('click', function () { if (i < steps.length - 1) { i++; showStep(); window.scrollTo(0, stepBtn.offsetTop); } });
  }

  // ---------- dialogue audio ----------
  var player = new Audio(); var queue = []; var slow = false; var current = null;
  function mark(btn, on) { if (btn) btn.classList.toggle('playing', on); }
  function playSrc(btn) {
    var base = btn.getAttribute('data-a');
    mark(current, false); current = btn; mark(btn, true);
    player.src = 'audio/' + base + (slow ? '-s' : '-n') + '.mp3';
    player.play().catch(function () {});
  }
  player.addEventListener('ended', function () {
    mark(current, false);
    if (queue.length) playSrc(queue.shift()); else current = null;
  });
  $('.say').forEach(function (b) {
    b.addEventListener('click', function () { queue = []; playSrc(b); });
  });
  $('.playall').forEach(function (b) {
    b.addEventListener('click', function () {
      var scene = document.getElementById(b.getAttribute('data-scene'));
      queue = $('.say', scene); if (queue.length) playSrc(queue.shift());
    });
  });
  $('.stopall').forEach(function (b) { b.addEventListener('click', function () { queue = []; player.pause(); mark(current, false); }); });
  $('.slowbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      slow = b.getAttribute('data-slow') === '1';
      $('.slowbtn').forEach(function (x) { x.setAttribute('aria-pressed', (x.getAttribute('data-slow') === '1') === slow ? 'true' : 'false'); });
    });
  });
  $('.hidetext').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = document.body.classList.toggle('listen-only');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.textContent = on ? 'Show the words' : 'Listen without the words';
    });
  });
  // ---------- writing checklist ----------
  $('.wcount').forEach(function (box) {
    var ta = box.querySelector('textarea'), out = box.querySelector('.wc');
    ta.addEventListener('input', function () { var n = (ta.value.match(/[A-Za-z'’]+/g) || []).length; out.textContent = n + ' words'; });
  });
})();
