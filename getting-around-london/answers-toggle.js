/* Réponses cachées par défaut, bouton par bloc et mode professeur.
   © 2026 Madame Carole Paoli Pompougnac · CC BY-NC-ND 4.0 */
(function () {
  if (window.__answersToggle) return;
  window.__answersToggle = true;
  var script = document.currentScript;

  function run() {
    var lang = (script && script.getAttribute('data-lang')) || document.documentElement.getAttribute('lang') || 'fr';
    var EN = /^en/i.test(lang);
    var T = EN
      ? { show: 'Show answers', hide: 'Hide answers', allOn: 'Teacher mode: show all answers', allOff: 'Teacher mode: hide all answers' }
      : { show: 'Afficher les réponses', hide: 'Masquer les réponses', allOn: 'Mode professeur : afficher toutes les réponses', allOff: 'Mode professeur : masquer toutes les réponses' };

    var css = '.at-hidden{display:none!important}' +
      '.at-btn{display:inline-block;margin:.4em 0 .6em;padding:.55em 1em;min-height:44px;font:inherit;font-size:.95em;line-height:1.3;color:#1f3a5f;background:#fff;border:2px solid #1f3a5f;border-radius:8px;cursor:pointer;max-width:100%;white-space:normal;text-align:left}' +
      '.at-btn:hover{background:#eef3f9}.at-btn:focus-visible{outline:3px solid #f0a500;outline-offset:2px}' +
      '.at-bar{box-sizing:border-box;margin:0;padding:.5em 1em;background:#f6f8fb;border-bottom:1px solid #d5dde8;text-align:center}' +
      '.at-bar .at-btn{margin:.2em 0}' +
      '.at-btn[aria-pressed=true],.at-btn[aria-expanded=true]{background:#1f3a5f;color:#fff}' +
      '@media print{.at-btn,.at-bar{display:none!important}.at-hidden{display:none!important}}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    function txt(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); }
    function lead(s) { return s.replace(/^[^A-Za-zÀ-ÿ]+/, ''); }

    var SUMMARY_RE = /(corrig|answer|\bkeys?\b|réponse|reponse|solution|correction|model answers?|pistes? de r|ce qui est attendu|expected)/i;
    var SUMMARY_NOT = /(pas la réponse|not the answer)/i;
    var HEAD_RE = /^(les )?(corrigés?|answer keys?|answers|model answers?|homework answer key)\b/i;
    var HEAD_END_RE = /·\s*(barème et )?(corrigés?|answer keys?|answers)\s*$/i;
    var TH_RE = /^(corrigés?|corrigé et critères|corrigés? et barème|ce qui est attendu|réponses?( attendues?)?|answers?|answer key|expected answers?|model answers?|keys?)\s*$/i;
    var LABEL_RE = /^[\s✔✅✓☑🔑]*(keys?\s*:|(answers?|answer key|corrigés?( rédigé| possible| indicatif| type)?|corrigé-type|correction|model answers?|possible answers?|suggested answers?|sample answers?|réponses?( modèle| attendues?| possibles?)?|réponse modèle|solutions?|pistes? de (réponse|correction))\s*[:·.(–-])/i;
    var CLASS_SEL = '.corrige,.eval-modele,.rt-model,.key.block,.reponse';
    var STOP = /^(BODY|MAIN|ARTICLE|HEADER|FOOTER|NAV|FORM|HTML|DETAILS|SUMMARY|TABLE|TBODY|THEAD|TR|UL|OL)$/;

    var groups = []; // {els:[...], btn}
    var dets = [];
    var uid = 0;

    function cssHidden(el) {
      for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
        if (n.tagName === 'DETAILS' || n.tagName === 'SUMMARY') continue;
        var cs = getComputedStyle(n);
        if (cs.display === 'none' || cs.visibility === 'hidden') return true;
      }
      return false;
    }
    function inAnswerDetails(el) {
      for (var d = el.closest('details'); d; d = d.parentElement && d.parentElement.closest('details')) {
        if (d.classList.contains('at-det')) return true;
      }
      return false;
    }
    function taken(el) { return el.closest('.at-ans') || el.querySelector('.at-ans'); }
    function interactive(el) { return el.matches('input,select,textarea') || el.querySelector('input,select,textarea'); }

    function addGroup(els, before, joinable) {
      els = els.filter(function (e) { return e && e.nodeType === 1; });
      if (!els.length) return;
      var last = groups[groups.length - 1];
      if (joinable && last && last.joinable && els.length === 1 && els[0].previousElementSibling === last.els[last.els.length - 1]) {
        var e0 = els[0];
        if (!e0.id) e0.id = 'at-a' + (++uid);
        e0.classList.add('at-ans');
        e0.classList.toggle('at-hidden', last.btn.getAttribute('aria-expanded') !== 'true');
        last.els.push(e0);
        last.btn.setAttribute('aria-controls', last.btn.getAttribute('aria-controls') + ' ' + e0.id);
        return;
      }
      var ids = [];
      els.forEach(function (e) {
        if (!e.id) e.id = 'at-a' + (++uid);
        ids.push(e.id);
        e.classList.add('at-ans', 'at-hidden');
      });
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'at-btn';
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-controls', ids.join(' '));
      b.textContent = T.show;
      var g = { els: els, btn: b, joinable: !!joinable };
      b.addEventListener('click', function () { setGroup(g, b.getAttribute('aria-expanded') !== 'true'); });
      before.parentNode.insertBefore(b, before);
      groups.push(g);
    }
    function setGroup(g, open) {
      g.els.forEach(function (e) { e.classList.toggle('at-hidden', !open); });
      g.btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      g.btn.textContent = open ? T.hide : T.show;
    }

    // 1. Answer drawers already written as <details>: closed on load.
    Array.prototype.forEach.call(document.querySelectorAll('details'), function (d) {
      var s = d.querySelector(':scope > summary');
      if (!s) return;
      var t = txt(s);
      if (SUMMARY_RE.test(t) && !SUMMARY_NOT.test(t)) {
        d.classList.add('at-det');
        d.open = false;
        dets.push(d);
      }
    });

    // 2. Table columns headed « Corrigé », « Answers »...
    var tableDone = [];
    Array.prototype.forEach.call(document.querySelectorAll('table'), function (tb) {
      if (inAnswerDetails(tb) || cssHidden(tb)) return;
      var head = tb.rows[0];
      if (!head) return;
      var cols = [];
      Array.prototype.forEach.call(head.cells, function (c, i) {
        if (c.tagName === 'TH' && TH_RE.test(lead(txt(c)))) cols.push(i);
      });
      if (!cols.length || cols.length === head.cells.length) return;
      var els = [];
      Array.prototype.forEach.call(tb.rows, function (r) {
        if (r.cells.length !== head.cells.length) return;
        cols.forEach(function (i) { if (r.cells[i]) els.push(r.cells[i]); });
      });
      addGroup(els, tb);
      tableDone.push(tb);
    });

    // 3. Headings « Corrigé », « Answer key », « … · corrigé »: the part that follows.
    Array.prototype.forEach.call(document.querySelectorAll('h2,h3,h4,h5,h6'), function (h) {
      if (h.closest('summary') || inAnswerDetails(h) || cssHidden(h)) return;
      var t = lead(txt(h));
      if (!(HEAD_RE.test(t) || HEAD_END_RE.test(t))) return;
      var rank = +h.tagName[1], els = [];
      for (var n = h.nextElementSibling; n; n = n.nextElementSibling) {
        if (/^H[1-6]$/.test(n.tagName) && +n.tagName[1] <= rank) break;
        if (n.querySelector('h1,h2,h3,h4,h5,h6') && Array.prototype.some.call(n.querySelectorAll('h1,h2,h3,h4,h5,h6'), function (x) { return +x.tagName[1] <= rank; })) break;
        if (n.tagName === 'SCRIPT' || n.tagName === 'STYLE') continue;
        els.push(n);
      }
      if (!els.length) return;
      if (els.some(function (e) { return interactive(e) || taken(e) || tableDone.some(function (tb) { return e === tb || e.contains(tb); }); })) return;
      var rest = els.filter(function (e) { return !(e.classList.contains('at-det') || (e.tagName !== 'DETAILS' && e.querySelector('details.at-det') && !txt(e).replace(txt(e.querySelector('details.at-det')), '').trim())); });
      if (!rest.length) return;
      var all = els.map(txt).join(' ');
      if (all.length < 300 && /(sont|se trouvent|are|is) (dans|sous|in|under|on)|bouton|onglet|\btab\b|repliés?|folded/i.test(all)) return; // a note about where the answers are
      addGroup(els, els[0]);
    });

    // 4. Blocks that open with a label: « Answers: », « Corrigé : », « Model answer »...
    function climb(el) {
      var start = txt(el).slice(0, 40);
      while (el.parentElement && !STOP.test(el.parentElement.tagName) && el.parentElement.tagName !== 'SECTION' && el.parentElement.tagName !== 'LI' && txt(el.parentElement).indexOf(start) === 0 && !el.parentElement.querySelector('h1,h2,h3,h4,h5,h6,button')) {
        el = el.parentElement;
      }
      return el;
    }
    var cands = document.querySelectorAll('p,div,aside,blockquote,dd,li,section,figure');
    Array.prototype.forEach.call(cands, function (el) {
      var t = txt(el);
      if (!LABEL_RE.test(t)) return;
      var m = t.replace(LABEL_RE, '');
      if (m.replace(/[_.…\s]/g, '').length < 3) return;
      var first = el.firstElementChild;
      var ownStart = el.firstChild && el.firstChild.nodeType === 3 && el.firstChild.textContent.trim();
      if (!ownStart && first && first.matches('p,div,aside,blockquote,li,section')) return; // let the inner block handle it
      var top = climb(el);
      if (STOP.test(top.tagName) || top.tagName === 'SECTION' && top.querySelector('h1,h2,h3')) return;
      if (inAnswerDetails(top) || taken(top) || interactive(top) || cssHidden(top)) return;
      if (top.querySelector('h1,h2,h3')) return;
      var linkTxt = 0;
      Array.prototype.forEach.call(top.querySelectorAll('a'), function (a) { linkTxt += txt(a).length; });
      if (linkTxt >= txt(top).length * 0.4) return; // navigation line, not an answer
      addGroup([top], top, true);
    });

    // 5. Known answer classes on the sites.
    Array.prototype.forEach.call(document.querySelectorAll(CLASS_SEL), function (el) {
      if (el.tagName === 'DETAILS' || el.tagName === 'SUMMARY') return;
      if (inAnswerDetails(el) || taken(el) || interactive(el) || cssHidden(el)) return;
      addGroup([el], el, true);
    });

    if (!groups.length && !dets.length) return;

    // Teacher mode toggle at the top of the page.
    var bar = document.createElement('div');
    bar.className = 'at-bar';
    var tb = document.createElement('button');
    tb.type = 'button';
    tb.className = 'at-btn at-teacher';
    tb.setAttribute('aria-pressed', 'false');
    tb.textContent = T.allOn;
    bar.appendChild(tb);
    function setAll(on) {
      groups.forEach(function (g) { setGroup(g, on); });
      dets.forEach(function (d) { d.open = on; });
      tb.setAttribute('aria-pressed', on ? 'true' : 'false');
      tb.textContent = on ? T.allOff : T.allOn;
      try { sessionStorage.setItem('answersTeacherMode', on ? '1' : '0'); } catch (e) {}
    }
    tb.addEventListener('click', function () { setAll(tb.getAttribute('aria-pressed') !== 'true'); });
    document.body.insertBefore(bar, document.body.firstChild);
    try { if (sessionStorage.getItem('answersTeacherMode') === '1') setAll(true); } catch (e) {}

    window.__answersToggleStats = { groups: groups.length, details: dets.length, wrapped: groups.map(function (g) { return txt(g.els[0]).slice(0, 120); }) };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
