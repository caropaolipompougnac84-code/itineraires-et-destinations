/**
 * Catalogue éditeur — listes déployées depuis data/resources.json
 */
(function () {
  function dataUrlFromPage() {
    const path = location.pathname;
    if (/\/(lycee-pro|lycee-general|cfa|lycee-agricole|segpa|methodologie)\//.test(path)) {
      return "../data/resources.json";
    }
    return "data/resources.json";
  }
  function assetPrefix() {
    return /\/(lycee-pro|lycee-general|cfa|lycee-agricole|segpa|methodologie)\//.test(location.pathname)
      ? "../assets/"
      : "assets/";
  }

  function dedupe(resources) {
    const seen = new Map();
    const out = [];
    for (const r of resources) {
      const key = [r.title, r.section, r.subject, r.level]
        .map((x) => String(x || "").trim().toLowerCase())
        .join("|");
      if (seen.has(key)) continue;
      seen.set(key, true);
      out.push(r);
    }
    return out;
  }

  function matches(r, opts) {
    if (opts.section && r.section !== opts.section) return false;
    if (opts.subject && r.subject !== opts.subject) return false;
    if (opts.level && r.level !== opts.level) return false;
    if (opts.collection && r.collection !== opts.collection) return false;
    if (opts.group && r.group !== opts.group) return false;
    if (opts.theme && !(r.themes || []).includes(opts.theme)) return false;
    if (opts.q) {
      const hay = [r.title, r.summary, r.levelLabel || r.level, ...(r.themes || [])]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(opts.q.toLowerCase())) return false;
    }
    return true;
  }

  function themeLabel(themesCatalog, id) {
    const t = (themesCatalog || []).find((x) => x.id === id);
    return t ? t.label : id;
  }
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }
  function enrich(resources, collections) {
    const byId = Object.fromEntries((collections || []).map((c) => [c.id, c]));
    return resources.map((r) => ({
      ...r,
      collectionName: r.collectionName || (byId[r.collection] && byId[r.collection].name) || "",
    }));
  }

  function workHTML(r, themesCatalog) {
    const prefix = assetPrefix();
    const themes = (r.themes || [])
      .map((id) => `<li class="theme">${escapeHtml(themeLabel(themesCatalog, id))}</li>`)
      .join("");
    const level = r.levelLabel || r.level || "";
    const hasUrl = r.url && r.url !== "#";
    const img = r.image
      ? `<img class="work-thumb" src="${escapeAttr(prefix + r.image)}" alt="" />`
      : "";
    const credit = r.credit
      ? `<p class="muted" style="font-size:0.75rem;margin:0.25rem 0 0">${escapeHtml(r.credit)}</p>`
      : "";
    function versionLinksHTML(r) {
      if (Array.isArray(r.versionLinks) && r.versionLinks.length) {
        return `<span class="work-links">` + r.versionLinks.map((v) => {
          if (v && v.url) {
            const external = /^https?:/i.test(v.url) && !/itineraires-destinations\.fr/i.test(v.url);
            return `<a class="work-link" href="${escapeAttr(v.url)}"${external ? ' target="_blank" rel="noopener"' : ""}>${escapeHtml(v.label)}</a>`;
          }
          const note = v && v.note ? ` (${escapeHtml(v.note)})` : "";
          return `<span class="work-link-soon">${escapeHtml((v && v.label) || "")}${note}</span>`;
        }).join("") + `</span>`;
      }
      if (hasUrl) {
        const external = /^https?:/i.test(r.url) && !/itineraires-destinations\.fr/i.test(r.url);
        return `<span class="work-links"><a class="work-link" href="${escapeAttr(r.url)}"${external ? ' target="_blank" rel="noopener"' : ""}>Voir le support</a>${
            r.facebookUrl
              ? `<a class="work-link work-link-secondary" href="${escapeAttr(r.facebookUrl)}" target="_blank" rel="noopener">Annonce Facebook</a>`
              : ""
          }</span>`;
      }
      return `<span class="muted">Lien à venir</span>`;
    }
    return `
<article class="work reveal" data-id="${escapeAttr(r.id || "")}">
  ${img}
  <div class="work-body">
    <h3>${escapeHtml(r.title)}</h3>
    <ul class="work-meta">
      ${level ? `<li>${escapeHtml(level)}</li>` : ""}
      ${themes}
    </ul>
    ${r.summary ? `<p class="work-summary">${escapeHtml(r.summary)}</p>` : ""}
    ${versionLinksHTML(r)}
    ${credit}
  </div>
</article>`;
  }

  function placeholderHTML(message) {
    return `
<div class="placeholder" role="status">
  <h3>Bientôt disponible</h3>
  <p>${escapeHtml(
    message ||
      "Les supports de cette collection seront proposés ici dès qu'ils auront été recensés depuis la page Facebook professionnelle."
  )}</p>
</div>`;
  }

  function renderCatalogue(data, root) {
    const baseOpts = {
      section: root.dataset.section || "",
      subject: root.dataset.subject || "",
      level: root.dataset.level || "",
      collection: root.dataset.collection || "",
      group: root.dataset.group || "",
    };
    const tabs = document.querySelector("[data-level-tabs]");
    let pool = enrich(dedupe(data.resources || []), data.collections).filter((r) =>
      matches(r, {
        section: baseOpts.section,
        subject: baseOpts.subject,
        collection: baseOpts.collection,
        group: baseOpts.group,
        level: tabs && !root.dataset.level ? "" : baseOpts.level,
      })
    );

    const listEl = root.querySelector("[data-cards]") || root;
    const filtersEl = root.querySelector("[data-filters]") || document.querySelector("[data-filters]");
    const countEl = root.querySelector("[data-count]") || document.querySelector("[data-count]");

    let activeTheme = "";
    let activeLevel = (!tabs && baseOpts.level) || "";
    let query = "";

    function currentList() {
      return pool.filter((r) =>
        matches(r, {
          section: baseOpts.section,
          subject: baseOpts.subject,
          collection: baseOpts.collection,
          group: baseOpts.group,
          level: activeLevel,
          theme: activeTheme,
          q: query,
        })
      );
    }

    function paint() {
      const filtered = currentList();
      if (countEl) countEl.textContent = String(filtered.length);
      if (!filtered.length) {
        listEl.innerHTML = placeholderHTML(root.dataset.emptyMessage || "");
        observeReveals();
        return;
      }
      listEl.innerHTML =
        `<div class="works">` +
        filtered.map((r) => workHTML(r, data.themes)).join("") +
        `</div>`;
      observeReveals();
    }

    if (tabs) {
      tabs.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-level]");
        if (!btn) return;
        activeLevel = btn.dataset.level || "";
        tabs.querySelectorAll("[data-level]").forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-current", b === btn ? "true" : "false");
        });
        paint();
      });
      const hash = location.hash.replace("#niveau-", "");
      if (hash) {
        const btn = tabs.querySelector(`[data-level="${hash}"]`);
        if (btn) {
          activeLevel = hash;
          tabs.querySelectorAll("[data-level]").forEach((b) => {
            b.classList.toggle("active", b === btn);
            b.setAttribute("aria-current", b === btn ? "true" : "false");
          });
        }
      }
    }

    if (filtersEl && !filtersEl.dataset.bound) {
      filtersEl.dataset.bound = "1";
      const chipsSource = data.themes || [];
      filtersEl.innerHTML = `
<span class="filters-label">Thèmes</span>
<button type="button" class="filter-chip" data-theme="" aria-pressed="true">Tous</button>
${chipsSource
  .map(
    (t) =>
      `<button type="button" class="filter-chip" data-theme="${escapeAttr(t.id)}" aria-pressed="false">${escapeHtml(t.label)}</button>`
  )
  .join("")}
<label class="sr-only" for="q-search">Rechercher</label>
<input class="search-box" id="q-search" type="search" placeholder="Rechercher un support" autocomplete="off" />
`;
      filtersEl.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-theme]");
        if (!btn) return;
        activeTheme = btn.dataset.theme || "";
        filtersEl.querySelectorAll("[data-theme]").forEach((b) => {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        paint();
      });
      const input = filtersEl.querySelector("#q-search");
      if (input) {
        input.addEventListener("input", () => {
          query = input.value.trim();
          paint();
        });
      }
    }

    paint();
  }

  function fillNouveautes(data) {
    const el = document.querySelector("[data-nouveautes]");
    if (!el) return;
    const list = enrich(dedupe(data.resources || []), data.collections)
      .slice()
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
      .slice(0, 14);
    if (!list.length) {
      el.innerHTML = placeholderHTML(
        "Les nouveautés publiées sur la page Facebook apparaîtront ici."
      );
      return;
    }
    el.innerHTML = `<div class="works">` + list.map((r) => workHTML(r, data.themes)).join("") + `</div>`;
    observeReveals();
  }

  function fillThemesPage(data) {
    const el = document.querySelector("[data-themes-catalog]");
    if (!el) return;
    const list = enrich(dedupe(data.resources || []), data.collections);
    el.innerHTML = (data.themes || [])
      .map((t) => {
        const items = list.filter((r) => (r.themes || []).includes(t.id));
        const body = items.length
          ? `<div class="works">${items.map((r) => workHTML(r, data.themes)).join("")}</div>`
          : placeholderHTML(`Aucun support indexé pour le thème « ${t.label} » pour le moment.`);
        return `
<section class="page-hero" id="theme-${escapeAttr(t.id)}" style="padding-bottom:0">
  <p class="kicker">Thème</p>
  <h2 style="font-family:var(--serif);font-size:1.7rem;margin:0 0 0.8rem">${escapeHtml(t.label)} <span class="muted" style="font-size:0.9rem">(${items.length})</span></h2>
</section>
${body}`;
      })
      .join("");
    observeReveals();
  }

  function observeReveals() {
    const nodes = document.querySelectorAll(".reveal:not(.is-visible)");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
  }

  document.querySelectorAll(".band, .pourquoi, .hero-bleed-inner, .page-hero, .sommaire, .fb-note").forEach((el) => {
    el.classList.add("reveal");
  });

  fetch(dataUrlFromPage())
    .then((res) => {
      if (!res.ok) throw new Error("catalogue");
      return res.json();
    })
    .then((data) => {
      document.querySelectorAll("[data-catalogue]").forEach((root) => renderCatalogue(data, root));
      fillNouveautes(data);
      fillThemesPage(data);
      window.__catalogueData = data;
      observeReveals();
    })
    .catch((err) => {
      console.error(err);
      document
        .querySelectorAll("[data-catalogue] [data-cards], [data-nouveautes], [data-themes-catalog]")
        .forEach((el) => {
          el.innerHTML = placeholderHTML("Le catalogue n'a pas pu être chargé.");
        });
      observeReveals();
    });

  observeReveals();
})();
