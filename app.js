/*
  app.js — all interactive behaviour. No framework, no build step.
  Depends on APP_DATA from data.js being loaded first.

  Navigation uses the part of the address after "#", for example:
    #/                     search (home)
    #/brand/nurpur         one entry
    #/org/fauji-foundation everything linked to one organization
    #/about                about & sources
    #/suggest              suggestion form
    #/suggest/nurpur       suggestion form, pre-filled to correct one entry
  This gives every entry its own shareable link and makes the phone's
  Back button work the way people expect.
*/

(() => {
  "use strict";

  // ---------------------------------------------------------------------
  // CONFIG
  // ---------------------------------------------------------------------

  // Where suggestion-form submissions are sent: the Cloudflare Worker
  // named "suggest" on the anonymous Cloudflare account. If it isn't set
  // up yet or is unreachable, the form says so honestly and keeps the
  // person's text so nothing is lost.
  const SUGGESTION_ENDPOINT_URL = "https://suggest.badalain.workers.dev/";


  // ---------------------------------------------------------------------

  const state = {
    query: "",
    category: "All",
    verifiedOnly: false,
    currentView: "search",
    searchScrollY: 0,
    hasInternalHistory: false,
    initialRouteDone: false,
  };

  const els = {};
  let searchIndex = [];

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    els.searchInput = document.getElementById("search-input");
    els.searchClear = document.getElementById("search-clear");
    els.categoryChips = document.getElementById("category-chips");
    els.brandList = document.getElementById("brand-list");
    els.resultCount = document.getElementById("result-count");
    els.emptyState = document.getElementById("empty-state");
    els.detailContent = document.getElementById("detail-content");
    els.entityContent = document.getElementById("entity-content");
    els.suggestForm = document.getElementById("suggest-form");
    els.suggestCategory = document.getElementById("s-category");
    els.verifiedToggle = document.getElementById("verified-only-toggle");
    els.aboutStats = document.getElementById("about-stats");
    els.aboutDataLink = document.getElementById("about-data-link");
    els.footerUpdated = document.getElementById("footer-updated");

    buildSearchIndex();
    buildCategoryChips();
    buildSuggestCategoryOptions();
    renderAboutStats();
    bindEvents();
    renderList();
    route();
    state.initialRouteDone = true;
    registerServiceWorker();
    initInstallBanner();
  }

  // ---------------------- Helpers ----------------------

  function findBrand(id) {
    return APP_DATA.brands.find((b) => b.id === id);
  }

  function findEntity(id) {
    return APP_DATA.entities.find((e) => e.id === id);
  }

  function formatDate(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || "";
    const d = new Date(iso + "T00:00:00Z");
    try {
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
    } catch (e) {
      return iso;
    }
  }

  function badgeHtml(brand) {
    const verified = brand.status === "verified";
    return (
      '<span class="badge ' + (verified ? "badge-verified" : "badge-lead") + '">' +
      (verified ? "Verified" : "Unverified lead") +
      "</span>"
    );
  }

  // A small fixed palette (not images — see README for why) so each brand
  // gets a consistent, visually distinct initial badge without ever using
  // a real logo or product photo.
  const BADGE_COLORS = ["#0F6B5C", "#8A5A2B", "#3B5EA6", "#7A4A8F", "#B5501E", "#3F7A3F"];
  function badgeColorFor(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    return BADGE_COLORS[hash % BADGE_COLORS.length];
  }

  function brandCardHtml(brand) {
    return (
      '<li><a class="brand-card brand-card-with-icon" href="#/brand/' + encodeURIComponent(brand.id) + '">' +
      '<span class="brand-icon" aria-hidden="true" style="background:' + badgeColorFor(brand.id) + '">' +
      escapeHtml(brand.name.trim().charAt(0).toUpperCase()) +
      "</span>" +
      '<span class="brand-card-text">' +
      '<span class="brand-card-top"><span class="brand-card-name">' + escapeHtml(brand.name) + "</span>" +
      badgeHtml(brand) +
      "</span>" +
      '<span class="brand-card-company">' + escapeHtml(brand.company) + "</span>" +
      "</span></a></li>"
    );
  }

  // ---------------------- Search ----------------------

  function normalize(str) {
    return String(str || "")
      .toLowerCase()
      .replace(/[!'’‘"“”.,()&\/\\:;–—-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Each entry is searchable by its name, company, category, alternative
  // spellings (Urdu, Roman Urdu, product words) and the names of the
  // organizations in its ownership chain — so "army welfare trust" finds
  // every AWT brand.
  function buildSearchIndex() {
    searchIndex = APP_DATA.brands.map((brand) => {
      const ownerNames = (brand.ownershipChain || []).map((link) => {
        const e = findEntity(link.entity);
        return e ? e.name : "";
      });
      const text = [brand.name, brand.company, brand.category, ...(brand.aliases || []), ...ownerNames].join(" ");
      return { brand, text: normalize(text) };
    });
  }

  function getFilteredBrands() {
    const tokens = normalize(state.query).split(" ").filter(Boolean);
    return searchIndex
      .filter(({ brand, text }) => {
        if (state.category !== "All" && brand.category !== state.category) return false;
        if (state.verifiedOnly && brand.status !== "verified") return false;
        return tokens.every((t) => text.includes(t));
      })
      .map(({ brand }) => brand)
      .sort(byVerifiedThenName);
  }

  // Verified entries first, then unverified leads; alphabetical within each.
  function byVerifiedThenName(a, b) {
    const av = a.status === "verified" ? 0 : 1;
    const bv = b.status === "verified" ? 0 : 1;
    return av - bv || a.name.localeCompare(b.name);
  }

  function renderList() {
    const results = getFilteredBrands();
    const total = APP_DATA.brands.length;
    const filtered = state.query.trim() || state.category !== "All" || state.verifiedOnly;

    els.brandList.innerHTML = results.map(brandCardHtml).join("");
    els.emptyState.hidden = results.length !== 0;
    els.searchClear.hidden = !state.query;

    if (results.length === 0) {
      els.resultCount.textContent = "";
    } else if (filtered) {
      els.resultCount.textContent = results.length + " of " + total + " entries";
    } else {
      els.resultCount.textContent = total + " entries";
    }
  }

  function resetFilters() {
    state.query = "";
    state.category = "All";
    state.verifiedOnly = false;
    els.searchInput.value = "";
    els.verifiedToggle.checked = false;
    [...els.categoryChips.children].forEach((c) => c.classList.toggle("is-active", c.dataset.cat === "All"));
    renderList();
  }

  // ---------------------- Category chips ----------------------

  function buildCategoryChips() {
    const used = new Set(APP_DATA.brands.map((b) => b.category));
    const cats = ["All", ...APP_DATA.categories.filter((c) => used.has(c))];
    els.categoryChips.innerHTML = "";
    cats.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "chip" + (cat === state.category ? " is-active" : "");
      btn.textContent = cat;
      btn.type = "button";
      btn.dataset.cat = cat;
      btn.setAttribute("aria-pressed", cat === state.category ? "true" : "false");
      btn.addEventListener("click", () => {
        state.category = cat;
        [...els.categoryChips.children].forEach((c) => {
          const active = c === btn;
          c.classList.toggle("is-active", active);
          c.setAttribute("aria-pressed", active ? "true" : "false");
        });
        renderList();
      });
      els.categoryChips.appendChild(btn);
    });
  }

  function buildSuggestCategoryOptions() {
    els.suggestCategory.innerHTML = "";
    APP_DATA.categories.concat(["Other / not sure"]).forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      els.suggestCategory.appendChild(opt);
    });
  }

  // ---------------------- About stats ----------------------

  function renderAboutStats() {
    const total = APP_DATA.brands.length;
    const verified = APP_DATA.brands.filter((b) => b.status === "verified").length;
    const leads = total - verified;
    const orgs = APP_DATA.entities.length;
    const updated = formatDate(APP_DATA.lastUpdated);
    els.aboutStats.textContent =
      total + " entries linked to " + orgs + " organizations — " +
      verified + " verified against primary documents, " +
      leads + " still marked as unverified " + (leads === 1 ? "lead" : "leads") + "." +
      (updated ? " Last updated " + updated + "." : "");
    els.aboutDataLink.href = "data.js?v=" + encodeURIComponent(APP_DATA.version);
    if (updated) els.footerUpdated.textContent = "Data last updated " + updated + ".";
  }

  // ---------------------- Routing ----------------------

  function parseHash() {
    const raw = (location.hash || "").replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean).map((p) => {
      try { return decodeURIComponent(p); } catch (e) { return p; }
    });
    if (parts[0] === "brand" && parts[1]) return { view: "detail", id: parts[1] };
    if (parts[0] === "org" && parts[1]) return { view: "entity", id: parts[1] };
    if (parts[0] === "about") return { view: "about" };
    if (parts[0] === "suggest") return { view: "suggest", id: parts[1] || null };
    return { view: "search" };
  }

  function route() {
    const r = parseHash();
    const leavingSearch = state.currentView === "search" && r.view !== "search";
    if (leavingSearch) state.searchScrollY = window.scrollY;

    if (r.view === "detail") {
      const brand = findBrand(r.id);
      if (!brand) return notFound();
      renderDetail(brand);
      showView("detail", brand.name);
      scrollToTop();
    } else if (r.view === "entity") {
      const entity = findEntity(r.id);
      if (!entity) return notFound();
      renderEntityDetail(entity);
      showView("entity", entity.name);
      scrollToTop();
    } else if (r.view === "about") {
      showView("about", "About & sources");
      scrollToTop();
    } else if (r.view === "suggest") {
      prefillSuggest(r.id);
      showView("suggest", "Suggest or correct");
      scrollToTop();
    } else {
      showView("search", null);
      window.scrollTo(0, state.searchScrollY || 0);
    }
  }

  function notFound() {
    // Unknown or removed entry: go home rather than show a blank page.
    history.replaceState(null, "", "#/");
    showView("search", null);
  }

  function showView(viewName, titlePart) {
    state.currentView = viewName;
    // The general "verified vs lead" explainer is shown on the home screen;
    // each entry page states its own status, so it's hidden there.
    document.getElementById("disclaimer-banner").hidden = viewName !== "search";
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("is-active"));
    document.getElementById("view-" + viewName).classList.add("is-active");

    // Entry and organization pages belong under the Search tab.
    const tabView = viewName === "detail" || viewName === "entity" ? "search" : viewName;
    document.querySelectorAll(".tab-btn").forEach((tab) => {
      const isMatch = tab.dataset.view === tabView;
      tab.classList.toggle("is-active", isMatch);
      if (isMatch) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    });

    document.title = titlePart
      ? titlePart + " — Badalain"
      : "Badalain (" + APP_DATA.appNameUrdu + ") — Who owns what you buy";

    // Move screen-reader focus to the new view's heading, but not on the
    // very first load (that would be jarring) and never for the search view.
    if (state.initialRouteDone && viewName !== "search") {
      const heading = document.querySelector("#view-" + viewName + " h2");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    }
  }

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  function goBack() {
    if (state.hasInternalHistory) history.back();
    else location.hash = "#/";
  }

  // ---------------------- Detail view ----------------------

  function renderDetail(brand) {
    let html = "";
    html += '<div class="detail-header-row">';
    html +=
      '<span class="brand-icon brand-icon-lg" aria-hidden="true" style="background:' +
      badgeColorFor(brand.id) + '">' +
      escapeHtml(brand.name.trim().charAt(0).toUpperCase()) +
      "</span>";
    html += '<div class="detail-header-text"><h2 class="detail-title" tabindex="-1">' + escapeHtml(brand.name) + "</h2>";
    html += badgeHtml(brand) + "</div></div>";
    html += '<p class="detail-company">' + escapeHtml(brand.company) + " · " + escapeHtml(brand.category) + "</p>";

    html += '<div class="detail-actions">';
    html += '<button class="action-btn share-btn" type="button" data-share-id="' + escapeAttr(brand.id) + '">Share this entry</button>';
    html += '<a class="action-btn" href="#/suggest/' + encodeURIComponent(brand.id) + '">Report a problem</a>';
    html += "</div>";

    // Ownership chain — tap the parent organization to see everything else
    // linked to it.
    html += '<div class="detail-section"><h3>Ownership</h3>';
    (brand.ownershipChain || []).forEach((link) => {
      const entity = findEntity(link.entity);
      const entityName = entity ? entity.name : link.entity;
      html += '<div class="ownership-chain-row">';
      html += '<a class="entity-chip" href="#/org/' + encodeURIComponent(link.entity) + '">' + escapeHtml(entityName) + "</a>";
      html += '<span class="ownership-arrow" aria-hidden="true">&rarr;</span>';
      html += '<span class="ownership-stake">' + escapeHtml(link.stake || "") + "</span>";
      html += '<span class="ownership-arrow" aria-hidden="true">&rarr;</span>';
      html += '<span class="ownership-target-chip">' + escapeHtml(brand.company) + "</span>";
      html += "</div>";
      if (link.relation) {
        html += '<p class="ownership-relation-note">' + escapeHtml(link.relation) + "</p>";
      }
    });
    html += "</div>";

    // Sources
    html += '<div class="detail-section"><h3>Sources</h3>';
    (brand.sources || []).forEach((src) => {
      html +=
        '<a class="source-link" target="_blank" rel="noopener noreferrer" href="' + escapeAttr(src.url) + '">' +
        escapeHtml(src.label) + "</a>" +
        (src.accessedDate ? '<span class="source-date">Checked ' + escapeHtml(formatDate(src.accessedDate)) + "</span>" : "");
    });
    if (brand.status === "verified" && brand.primaryDate) {
      html += '<p class="primary-date">Confirmed against a primary document dated: ' + escapeHtml(brand.primaryDate) + ".</p>";
    }
    if (brand.status !== "verified") {
      html += '<p class="lead-warning">This entry has not yet been confirmed against a primary document. Treat it as a lead, not a settled fact.</p>';
    }
    html += "</div>";

    // Notes
    if (brand.notes) {
      html += '<div class="detail-section"><h3>Notes</h3><p>' + escapeHtml(brand.notes) + "</p></div>";
    }

    // Alternatives — lighter research than the ownership facts; ranked best first.
    html += '<div class="detail-section"><h3>Alternatives to consider</h3>';
    if (brand.alternatives && brand.alternatives.length > 0) {
      html += '<p class="alt-caveat">Ranked best first, based on market reputation and consumer surveys — not verified with the same primary-source rigor as the ownership facts above.</p>';
      html += '<ol class="alt-list">';
      brand.alternatives.forEach((alt) => {
        html += "<li><strong>" + escapeHtml(alt.name) + "</strong>" + (alt.note ? " — " + escapeHtml(alt.note) : "") + "</li>";
      });
      html += "</ol>";
    } else {
      html += '<p class="alt-empty">' + escapeHtml(brand.noAlternativeReason || "No alternatives researched yet for this entry.") + "</p>";
    }
    html += "</div>";

    els.detailContent.innerHTML = html;
  }

  // ---------------------- Organization view ----------------------

  function renderEntityDetail(entity) {
    const linkedBrands = APP_DATA.brands
      .filter((b) => (b.ownershipChain || []).some((link) => link.entity === entity.id))
      .sort(byVerifiedThenName);

    let html = "";
    html += '<h2 class="detail-title" tabindex="-1">' + escapeHtml(entity.name) + "</h2>";
    if (entity.type) html += '<p class="detail-company">' + escapeHtml(entity.type) + "</p>";
    if (entity.note) html += '<div class="detail-section"><p>' + escapeHtml(entity.note) + "</p></div>";
    if (entity.officialUrl) {
      html +=
        '<div class="detail-section"><h3>Official website</h3><a class="source-link" target="_blank" rel="noopener noreferrer" href="' +
        escapeAttr(entity.officialUrl) + '">' + escapeHtml(entity.officialUrl) + "</a></div>";
    }
    html +=
      '<div class="detail-section"><h3>' + linkedBrands.length + " " +
      (linkedBrands.length === 1 ? "entry" : "entries") + " linked to this organization</h3>";
    html += '<ul class="brand-list">' + linkedBrands.map(brandCardHtml).join("") + "</ul></div>";

    els.entityContent.innerHTML = html;
  }

  // ---------------------- Sharing ----------------------

  async function shareBrand(brandId) {
    const brand = findBrand(brandId);
    if (!brand) return;
    const base = location.origin + location.pathname;
    const url = base + "#/brand/" + encodeURIComponent(brand.id);
    const text = brand.name + " — " + brand.company + ". Ownership and sources:";

    if (navigator.share) {
      try {
        await navigator.share({ title: brand.name + " — Badalain", text: text, url: url });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return; // person closed the share sheet
      }
    }
    try {
      await navigator.clipboard.writeText(text + " " + url);
      showToast("Link copied — paste it anywhere to share.");
    } catch (err) {
      showToast("Couldn't copy automatically. Link: " + url, 8000);
    }
  }

  // ---------------------- Suggestion form ----------------------

  // Form fields are looked up by their element IDs, never as form.name /
  // form.category etc. — on a <form>, "form.name" is the form's OWN name
  // attribute (an empty string), not the input box called "name", which
  // silently breaks the form in every browser.
  function field(n) {
    return document.getElementById("s-" + n);
  }

  function prefillSuggest(brandId) {
    document.getElementById("suggest-success").hidden = true;
    document.getElementById("suggest-error").hidden = true;
    els.suggestForm.hidden = false;
    if (!brandId) return;
    const brand = findBrand(brandId);
    if (!brand) return;
    if (field("name").value.trim() && field("name").value !== brand.name) return; // don't overwrite someone's typing
    field("name").value = brand.name;
    if (APP_DATA.categories.includes(brand.category)) field("category").value = brand.category;
    if (!field("reason").value.trim()) field("reason").value = "Correction to the existing entry for " + brand.name + ": ";
  }

  async function handleSuggestSubmit(e) {
    e.preventDefault();
    const form = els.suggestForm;
    const submitBtn = document.getElementById("suggest-submit");
    const validation = document.getElementById("suggest-validation");
    const successBox = document.getElementById("suggest-success");
    const errorBox = document.getElementById("suggest-error");
    successBox.hidden = true;
    errorBox.hidden = true;
    validation.hidden = true;

    const payload = {
      name: field("name").value.trim(),
      category: field("category").value,
      reason: field("reason").value.trim(),
      source: field("source").value.trim(),
      website: field("website").value, // spam trap — should always be empty
    };

    if (!payload.name || !payload.reason) {
      validation.textContent = "Please fill in the brand or company name, and what we should know.";
      validation.hidden = false;
      (payload.name ? field("reason") : field("name")).focus();
      return;
    }
    if (payload.source && !/^https?:\/\//i.test(payload.source)) {
      validation.textContent = "The source link should start with http:// or https:// — or leave it empty.";
      validation.hidden = false;
      field("source").focus();
      return;
    }
    if (payload.website) {
      // A bot filled the hidden field. Pretend it worked, send nothing.
      form.reset();
      form.hidden = true;
      successBox.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    let ok = false;
    try {
      const controller = "AbortController" in window ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), 15000) : null;
      const res = await fetch(SUGGESTION_ENDPOINT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined,
      });
      if (timer) clearTimeout(timer);
      ok = res.ok;
    } catch (err) {
      ok = false;
    }
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";

    if (ok) {
      form.reset();
      form.hidden = true;
      successBox.hidden = false;
    } else {
      errorBox.hidden = false; // the person's text stays in the form
    }
  }

  // ---------------------- Toast ----------------------

  function showToast(message, ms, actionLabel, onAction) {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.innerHTML = "";
    const span = document.createElement("span");
    span.textContent = message;
    toast.appendChild(span);
    if (actionLabel && onAction) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "toast-btn";
      btn.textContent = actionLabel;
      btn.addEventListener("click", onAction);
      toast.appendChild(btn);
    }
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    if (ms !== 0) showToast._t = setTimeout(() => toast.classList.remove("is-visible"), ms || 3500);
  }

  // ---------------------- Events ----------------------

  function bindEvents() {
    window.addEventListener("hashchange", () => {
      state.hasInternalHistory = true;
      route();
    });

    // Tapping the name/logo always returns to a clean home screen.
    document.getElementById("home-link").addEventListener("click", (e) => {
      e.preventDefault();
      resetFilters();
      state.searchScrollY = 0;
      if (parseHash().view === "search") {
        route();
        scrollToTop();
      } else {
        location.hash = "#/";
      }
    });

    els.searchInput.addEventListener("input", (e) => {
      state.query = e.target.value;
      renderList();
    });

    els.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") els.searchInput.blur(); // closes the phone keyboard
    });

    els.searchClear.addEventListener("click", () => {
      state.query = "";
      els.searchInput.value = "";
      renderList();
      els.searchInput.focus();
    });

    els.verifiedToggle.addEventListener("change", (e) => {
      state.verifiedOnly = e.target.checked;
      renderList();
    });

    document.getElementById("detail-back-btn").addEventListener("click", goBack);
    document.getElementById("entity-back-btn").addEventListener("click", goBack);

    els.detailContent.addEventListener("click", (e) => {
      const shareBtn = e.target.closest(".share-btn");
      if (shareBtn) shareBrand(shareBtn.dataset.shareId);
    });

    els.suggestForm.addEventListener("submit", handleSuggestSubmit);

    document.getElementById("suggest-another").addEventListener("click", () => {
      document.getElementById("suggest-success").hidden = true;
      els.suggestForm.hidden = false;
      field("name").focus();
    });
  }

  // ---------------------- Install banner ----------------------
  // iOS gets manual Share-sheet instructions (Apple has no automatic
  // install prompt). Chrome/Android/desktop get a real "Install" button.
  // Everything else gets a generic hint. Dismissal is remembered on the
  // device only — nothing is sent anywhere.

  function initInstallBanner() {
    const banner = document.getElementById("install-banner");
    const textEl = document.getElementById("install-banner-text");
    const btnEl = document.getElementById("install-banner-btn");
    const dismissEl = document.getElementById("install-banner-dismiss");
    if (!banner) return;

    const isStandalone =
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    try {
      if (localStorage.getItem("badalainInstallDismissed") === "true") return;
    } catch (e) { /* storage blocked — just show the banner */ }

    const ua = navigator.userAgent || "";
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1); // iPadOS reports as Mac
    let deferredPrompt = null;

    function show(message, showButton) {
      textEl.textContent = message;
      btnEl.hidden = !showButton;
      banner.hidden = false;
    }

    if (isIOS) {
      show("Install this app: tap the Share button, then \u201cAdd to Home Screen.\u201d", false);
    } else {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        show("Install Badalain for quick, offline access.", true);
      });
      setTimeout(() => {
        if (!deferredPrompt && banner.hidden) {
          show("Tip: add this to your home screen (browser menu \u2192 \u201cAdd to Home screen\u201d) to use it like an app.", false);
        }
      }, 2500);
    }

    window.addEventListener("appinstalled", () => {
      banner.hidden = true;
    });

    btnEl.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch (e) { /* ignore */ }
      deferredPrompt = null;
      banner.hidden = true;
    });

    dismissEl.addEventListener("click", () => {
      banner.hidden = true;
      try { localStorage.setItem("badalainInstallDismissed", "true"); } catch (e) { /* best effort */ }
    });
  }

  // ---------------------- Service worker ----------------------
  // When a newer version of the site has been downloaded in the background,
  // offer a one-tap refresh instead of silently showing old data.

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register("sw.js").catch(() => { /* offline mode unavailable — not fatal */ });
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController || refreshing) return;
      showToast("Updated information is available.", 0, "Refresh", () => {
        refreshing = true;
        location.reload();
      });
    });
  }

  // ---------------------- Utilities ----------------------

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }
})();
