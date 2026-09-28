/*
  app.js — all interactive behaviour. No framework, no build step.
  Depends on APP_DATA from data.js being loaded first. Urdu wording lives in
  ur.js and is loaded only when someone chooses Urdu.

  Navigation uses the part of the address after "#", for example:
    #/                     search (home)
    #/brand/nurpur         one entry
    #/org/fauji-foundation everything linked to one organization
    #/about                about & sources
    #/install              how to install it on a phone, by browser
    #/suggest              suggestion form
    #/suggest/nurpur       suggestion form, pre-filled to correct one entry
  This gives every entry its own shareable link and makes the phone's
  Back button work the way people expect.
*/

(() => {
  "use strict";

  // Must match APP_DATA.version in data.js. index.html checks this, so an old
  // saved copy of one file can never be mixed with new copies of the others.
  const APP_VERSION = "2026-09-27.16";
  window.BADALAIN_APP_VERSION = APP_VERSION;

  // ---------------------------------------------------------------------
  // CONFIG
  // ---------------------------------------------------------------------

  // Where suggestion-form submissions are sent: the Cloudflare Worker
  // named "suggest" on the anonymous Cloudflare account. If it is
  // unreachable, the form says so honestly and keeps the person's text.
  const SUGGESTION_ENDPOINT_URL = "https://suggest.badalain.workers.dev/";

  const LANG_KEY = "badalainLang";
  const INSTALL_DISMISS_KEY = "badalainInstallDismissed";
  const INSTALL_DISMISS_DAYS = 30;

  // ---------------------------------------------------------------------
  // English wording used by the code. (Text that is written directly in
  // index.html carries a data-i18n key and has its Urdu in ur.js.)
  // ---------------------------------------------------------------------
  const EN = {
    badge_verified: "Verified",
    badge_lead: "Unverified lead",
    count_all: "{n} entries",
    count_filtered: "{m} of {n} entries",
    h_ownership: "Ownership",
    h_sources: "Sources",
    h_notes: "Notes",
    h_alternatives: "Alternatives to consider",
    alt_caveat: "Ranked best first, based on market reputation and consumer surveys — not verified with the same primary-source rigor as the ownership facts above.",
    alt_none_default: "No alternatives researched yet for this entry.",
    btn_share: "Share this entry",
    btn_report: "Report a problem",
    checked: "Checked {date}",
    primary_confirmed: "Confirmed against a primary document dated: {d}.",
    lead_warning: "This entry has not yet been confirmed against a primary document. Treat it as a lead, not a settled fact.",
    h_official_site: "Official website",
    entity_count: "{n} entries linked to this organization",
    entity_count_one: "1 entry linked to this organization",
    about_stats: "{total} entries linked to {orgs} organizations — {verified} verified against primary documents, {leads} still marked as unverified {leadword}.",
    about_stats_updated: " Last updated {date}.",
    footer_updated: "Data last updated {date}.",
    share_text: "{name} — {company}. Ownership and sources:",
    toast_copied: "Link copied — paste it anywhere to share.",
    toast_copy_fail: "Couldn't copy automatically. Link: {url}",
    toast_updated: "Updated information is available.",
    toast_refresh: "Refresh",
    toast_installed: "Installed — you'll find Badalain on your home screen.",
    toast_urdu_offline: "Urdu couldn't load. Connect to the internet and try again. / اردو ابھی لوڈ نہیں ہو سکی۔ انٹرنیٹ سے جڑ کر دوبارہ کوشش کریں۔",
    banner_install: "Install Badalain for quick, offline access.",
    banner_ios: "Install this app: tap the Share button, then \u201cAdd to Home Screen.\u201d",
    banner_ios_other: "To install on iPhone, open this page in Safari, then tap Share \u2192 \u201cAdd to Home Screen.\u201d",
    banner_tip: "Tip: you can add this to your home screen and use it like an app.",
    translation_note: "",
    t_about: "About & sources",
    t_install: "Install the app",
    t_suggest: "Suggest or correct",
    title_home: "Badalain (بدلیں) — Who owns what you buy",
    title_suffix: " — Badalain",
    s_val_missing: "Please fill in the brand or company name, and what we should know.",
    s_val_source: "The source link should start with http:// or https:// — or leave it empty.",
    s_sending: "Sending…",
    s_submit: "Submit",
    s_prefill: "Correction to the existing entry for {name}: ",
    lang_toggle_aria: "Read in Urdu (اردو)",
  };

  const state = {
    query: "",
    category: "All",
    verifiedOnly: false,
    currentView: "search",
    searchScrollY: 0,
    hasInternalHistory: false,
    initialRouteDone: false,
    lang: "en",
    bannerKey: null,
    bannerOpts: null,
  };

  const els = {};
  let searchIndex = [];
  let UR = null; // Urdu wording, once loaded

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cleanFreshMarker();

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
    els.footerUpdated = document.getElementById("footer-updated");
    els.langToggle = document.getElementById("lang-toggle");

    state.lang = readSavedLang();
    bindEvents();

    const start = () => {
      applyLanguage(); // builds the search list, chips, current page — in the chosen language
      state.initialRouteDone = true;
      registerServiceWorker();
      initInstall();
    };

    if (state.lang === "ur") {
      loadUrdu().then(start, () => {
        state.lang = "en";
        start();
      });
    } else {
      start();
    }
  }

  // If the page had to repair itself, tidy the marker out of the address bar.
  function cleanFreshMarker() {
    try {
      if (/[?&]fresh=/.test(location.search)) {
        history.replaceState(null, "", location.pathname + location.hash);
      }
    } catch (e) { /* not important */ }
  }

  // ---------------------- Language ----------------------

  function readSavedLang() {
    try {
      const v = localStorage.getItem(LANG_KEY);
      if (v === "ur" || v === "en") return v;
    } catch (e) { /* storage blocked */ }
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    return langs.some((l) => /^ur(\b|-)/i.test(l)) ? "ur" : "en";
  }

  function saveLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* best effort */ }
  }

  function loadUrdu() {
    if (UR) return Promise.resolve(UR);
    if (window.BADALAIN_UR) {
      UR = window.BADALAIN_UR;
      return Promise.resolve(UR);
    }
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "ur.js?v=" + APP_VERSION;
      s.onload = () => {
        if (window.BADALAIN_UR) {
          UR = window.BADALAIN_UR;
          resolve(UR);
        } else {
          reject(new Error("ur.js was empty"));
        }
      };
      s.onerror = () => reject(new Error("ur.js could not be loaded"));
      document.head.appendChild(s);
    });
  }

  function isUrdu() {
    return state.lang === "ur" && !!UR;
  }

  // Look up a piece of wording: Urdu if chosen and available, else English.
  function t(key, vars) {
    let s = (isUrdu() && UR.ui && UR.ui[key]) || EN[key] || key;
    if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
    return s;
  }

  // Urdu version of an entry / organization, or null.
  function trBrand(brand) {
    return (isUrdu() && UR.brands && UR.brands[brand.id]) || null;
  }
  function trEntity(entity) {
    return (isUrdu() && UR.entities && UR.entities[entity.id]) || null;
  }
  function catLabel(cat) {
    return (isUrdu() && UR.categories && UR.categories[cat]) || cat;
  }
  function displayName(brand) {
    const tr = trBrand(brand);
    return (tr && tr.nameUr) || brand.name;
  }
  // English name shown as a small second line when the Urdu name is the main one.
  function subName(brand) {
    const tr = trBrand(brand);
    return tr && tr.nameUr ? brand.name : "";
  }

  // English words (brand names, company names, source titles) inside an
  // Urdu page are wrapped so they keep their own left-to-right order
  // (a span with dir="ltr" is understood by every browser, old ones included).
  function en(text) {
    return isUrdu() ? '<span class="en" lang="en" dir="ltr">' + escapeHtml(text) + "</span>" : escapeHtml(text);
  }
  // Use the Urdu wording when present; otherwise fall back to the English.
  function pick(urText, enText) {
    return urText ? escapeHtml(urText) : en(enText);
  }

  // Swap every piece of static text on the page to the chosen language.
  function applyLanguage() {
    const urdu = isUrdu();
    if (!urdu) state.lang = "en";
    document.documentElement.lang = urdu ? "ur" : "en";
    document.documentElement.dir = urdu ? "rtl" : "ltr";
    // Flipping direction moves where "the start of the line" is; make sure the
    // view is never left scrolled sideways.
    if (window.scrollX) window.scrollTo(0, window.scrollY);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      const v = urdu && UR.ui[el.dataset.i18n];
      el.innerHTML = v ? v : el.dataset.en;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      if (el.dataset.enAria === undefined) el.dataset.enAria = el.getAttribute("aria-label") || "";
      const v = urdu && UR.ui[el.dataset.i18nAria];
      el.setAttribute("aria-label", v ? v : el.dataset.enAria);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      if (el.dataset.enPh === undefined) el.dataset.enPh = el.getAttribute("placeholder") || "";
      const v = urdu && UR.ui[el.dataset.i18nPlaceholder];
      el.setAttribute("placeholder", v ? v : el.dataset.enPh);
    });

    // The language button always offers the *other* language.
    els.langToggle.innerHTML = urdu ? '<span lang="en">English</span>' : '<span lang="ur">اردو</span>';
    els.langToggle.setAttribute("aria-label", t("lang_toggle_aria"));

    buildSearchIndex();
    buildCategoryChips();
    buildSuggestCategoryOptions();
    renderAboutStats();
    renderList();
    refreshBannerText();
    route({ keepScroll: true });
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
    const locales = isUrdu() ? ["ur-PK-u-nu-latn", "en-GB"] : ["en-GB"];
    for (const loc of locales) {
      try {
        const s = d.toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
        if (!s) continue;
        if (/^ur/.test(loc) && !/[\u0600-\u06FF]/.test(s)) continue; // device lacks Urdu month names
        return s;
      } catch (e) { /* try the next one */ }
    }
    return iso;
  }

  function badgeHtml(brand) {
    const verified = brand.status === "verified";
    return (
      '<span class="badge ' + (verified ? "badge-verified" : "badge-lead") + '">' +
      escapeHtml(verified ? t("badge_verified") : t("badge_lead")) +
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

  function initialOf(name) {
    return escapeHtml((Array.from(name.trim())[0] || "?").toUpperCase());
  }

  function brandCardHtml(brand) {
    const sub = subName(brand);
    return (
      '<li><a class="brand-card brand-card-with-icon" href="#/brand/' + encodeURIComponent(brand.id) + '">' +
      '<span class="brand-icon" aria-hidden="true" style="background:' + badgeColorFor(brand.id) + '">' +
      initialOf(displayName(brand)) +
      "</span>" +
      '<span class="brand-card-text">' +
      '<span class="brand-card-top"><span class="brand-card-name">' + escapeHtml(displayName(brand)) + "</span>" +
      badgeHtml(brand) +
      "</span>" +
      '<span class="brand-card-company">' + en((sub ? sub + " · " : "") + brand.company) + "</span>" +
      "</span></a></li>"
    );
  }

  // ---------------------- Search ----------------------

  // Makes searching forgiving: ignores capital letters, punctuation, Urdu
  // vowel marks, and the different ways keyboards type the same Urdu letter.
  function normalize(str) {
    return String(str || "")
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u200C\u200D]/g, "") // vowel marks, joiners
      .replace(/[\u064A\u0649]/g, "\u06CC") // Arabic yeh -> Urdu yeh
      .replace(/\u0643/g, "\u06A9") // Arabic kaf -> Urdu kaf
      .replace(/[\u0647\u06C2\u06C3]/g, "\u06C1") // heh variants -> Urdu heh
      .replace(/[!'’‘"“”.,()&\/\\:;–—\-|·\u06D4\u060C\u061F]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Each entry is searchable by its name, company, category, alternative
  // spellings (Urdu, Roman Urdu, product words) and the names of the
  // organizations in its ownership chain — so "army welfare trust" finds
  // every AWT brand. When Urdu is loaded, Urdu names are searchable too.
  function buildSearchIndex() {
    searchIndex = APP_DATA.brands.map((brand) => {
      const parts = [brand.name, brand.company, brand.category, ...(brand.aliases || [])];
      (brand.ownershipChain || []).forEach((link) => {
        const e = findEntity(link.entity);
        if (e) parts.push(e.name);
        const ue = UR && UR.entities && UR.entities[link.entity];
        if (ue) parts.push(ue.name);
      });
      const tr = UR && UR.brands && UR.brands[brand.id];
      if (tr && tr.nameUr) parts.push(tr.nameUr);
      if (UR && UR.categories && UR.categories[brand.category]) parts.push(UR.categories[brand.category]);
      return { brand, text: normalize(parts.join(" ")) };
    });
  }

  function getFilteredBrands() {
    const tokens = normalize(state.query).split(" ").filter(Boolean);
    return searchIndex
      .filter(({ brand, text }) => {
        if (state.category !== "All" && brand.category !== state.category) return false;
        if (state.verifiedOnly && brand.status !== "verified") return false;
        return tokens.every((tk) => text.includes(tk));
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
      els.resultCount.textContent = t("count_filtered", { m: results.length, n: total });
    } else {
      els.resultCount.textContent = t("count_all", { n: total });
    }
  }

  function resetFilters() {
    state.query = "";
    state.category = "All";
    state.verifiedOnly = false;
    els.searchInput.value = "";
    els.verifiedToggle.checked = false;
    [...els.categoryChips.children].forEach((c) => {
      const active = c.dataset.cat === "All";
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-pressed", active ? "true" : "false");
    });
    renderList();
  }

  // ---------------------- Category chips ----------------------

  function buildCategoryChips() {
    const used = new Set(APP_DATA.brands.map((b) => b.category));
    const cats = ["All", ...APP_DATA.categories.filter((c) => used.has(c))];
    if (!cats.includes(state.category)) state.category = "All";
    els.categoryChips.innerHTML = "";
    cats.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "chip" + (cat === state.category ? " is-active" : "");
      btn.textContent = cat === "All" ? (isUrdu() ? "سب" : "All") : catLabel(cat);
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
    const keep = els.suggestCategory.value;
    els.suggestCategory.innerHTML = "";
    APP_DATA.categories.concat(["Other / not sure"]).forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = catLabel(cat);
      els.suggestCategory.appendChild(opt);
    });
    if (keep) els.suggestCategory.value = keep;
  }

  // ---------------------- About stats ----------------------

  function renderAboutStats() {
    const total = APP_DATA.brands.length;
    const verified = APP_DATA.brands.filter((b) => b.status === "verified").length;
    const leads = total - verified;
    const orgs = APP_DATA.entities.length;
    const updated = formatDate(APP_DATA.lastUpdated);
    els.aboutStats.textContent =
      t("about_stats", { total: total, orgs: orgs, verified: verified, leads: leads, leadword: leads === 1 ? "lead" : "leads" }) +
      (updated ? t("about_stats_updated", { date: updated }) : "");
    const link = document.getElementById("about-data-link"); // re-found each time: the text around it gets swapped
    if (link) link.href = "data.js?v=" + encodeURIComponent(APP_DATA.version);
    if (updated) els.footerUpdated.textContent = t("footer_updated", { date: updated });
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
    if (parts[0] === "install") return { view: "install" };
    if (parts[0] === "suggest") return { view: "suggest", id: parts[1] || null };
    return { view: "search" };
  }

  function route(opts) {
    const keepScroll = !!(opts && opts.keepScroll);
    const r = parseHash();
    const leavingSearch = state.currentView === "search" && r.view !== "search";
    if (leavingSearch) state.searchScrollY = window.scrollY;
    const toTop = () => { if (!keepScroll) scrollToTop(); };

    if (r.view === "detail") {
      const brand = findBrand(r.id);
      if (!brand) return notFound();
      renderDetail(brand);
      showView("detail", displayName(brand));
      toTop();
    } else if (r.view === "entity") {
      const entity = findEntity(r.id);
      if (!entity) return notFound();
      renderEntityDetail(entity);
      const te = trEntity(entity);
      showView("entity", (te && te.name) || entity.name);
      toTop();
    } else if (r.view === "about") {
      showView("about", t("t_about"));
      toTop();
    } else if (r.view === "install") {
      showView("install", t("t_install"));
      updateInstallNow();
      toTop();
    } else if (r.view === "suggest") {
      prefillSuggest(r.id);
      showView("suggest", t("t_suggest"));
      toTop();
    } else {
      showView("search", null);
      if (!keepScroll) window.scrollTo(0, state.searchScrollY || 0);
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

    // Entry and organization pages belong under the Search tab; the install
    // guide belongs under About.
    const tabView =
      viewName === "detail" || viewName === "entity" ? "search" : viewName === "install" ? "about" : viewName;
    document.querySelectorAll(".tab-btn").forEach((tab) => {
      const isMatch = tab.dataset.view === tabView;
      tab.classList.toggle("is-active", isMatch);
      if (isMatch) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    });

    // The install banner is pointless on the page that already explains installing.
    const installBanner = document.getElementById("install-banner");
    if (installBanner) installBanner.classList.toggle("is-suppressed", viewName === "install");

    document.title = titlePart ? titlePart + t("title_suffix") : t("title_home");

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

  function translationNoteHtml() {
    return isUrdu() ? '<p class="translation-note">' + escapeHtml(t("translation_note")) + "</p>" : "";
  }

  function renderDetail(brand) {
    const tr = trBrand(brand);
    const sub = subName(brand);
    let html = "";
    html += '<div class="detail-header-row">';
    html +=
      '<span class="brand-icon brand-icon-lg" aria-hidden="true" style="background:' +
      badgeColorFor(brand.id) + '">' +
      initialOf(displayName(brand)) +
      "</span>";
    html += '<div class="detail-header-text"><h2 class="detail-title" tabindex="-1">' + escapeHtml(displayName(brand)) + "</h2>";
    html += badgeHtml(brand) + "</div></div>";
    if (sub) html += '<p class="detail-name-en">' + en(sub) + "</p>";
    html += '<p class="detail-company">' + en(brand.company) + " · " + escapeHtml(catLabel(brand.category)) + "</p>";

    html += '<div class="detail-actions">';
    html += '<button class="action-btn share-btn" type="button" data-share-id="' + escapeAttr(brand.id) + '">' + escapeHtml(t("btn_share")) + "</button>";
    html += '<a class="action-btn" href="#/suggest/' + encodeURIComponent(brand.id) + '">' + escapeHtml(t("btn_report")) + "</a>";
    html += "</div>";
    html += translationNoteHtml();

    // Ownership chain — tap the parent organization to see everything else
    // linked to it.
    html += '<div class="detail-section"><h3>' + escapeHtml(t("h_ownership")) + "</h3>";
    (brand.ownershipChain || []).forEach((link, i) => {
      const entity = findEntity(link.entity);
      const te = entity ? trEntity(entity) : null;
      const chain = (tr && tr.chain && tr.chain[i]) || {};
      const entityName = entity ? pick(te && te.name, entity.name) : en(link.entity);
      html += '<div class="ownership-chain-row">';
      html += '<a class="entity-chip" href="#/org/' + encodeURIComponent(link.entity) + '">' + entityName + "</a>";
      html += '<span class="ownership-arrow" aria-hidden="true">&rarr;</span>';
      html += '<span class="ownership-stake">' + pick(chain.stake, link.stake || "") + "</span>";
      html += '<span class="ownership-arrow" aria-hidden="true">&rarr;</span>';
      html += '<span class="ownership-target-chip">' + en(brand.company) + "</span>";
      html += "</div>";
      if (link.relation) {
        html += '<p class="ownership-relation-note">' + pick(chain.relation, link.relation) + "</p>";
      }
    });
    html += "</div>";

    // Sources (the documents themselves are English, so their titles stay English)
    html += '<div class="detail-section"><h3>' + escapeHtml(t("h_sources")) + "</h3>";
    (brand.sources || []).forEach((src) => {
      html +=
        '<a class="source-link" target="_blank" rel="noopener noreferrer" href="' + escapeAttr(src.url) + '">' +
        en(src.label) + "</a>" +
        (src.accessedDate ? '<span class="source-date">' + escapeHtml(t("checked", { date: formatDate(src.accessedDate) })) + "</span>" : "");
    });
    if (brand.status === "verified" && brand.primaryDate) {
      html += '<p class="primary-date">' + t("primary_confirmed", { d: pick(tr && tr.primaryDate, brand.primaryDate) }) + "</p>";
    }
    if (brand.status !== "verified") {
      html += '<p class="lead-warning">' + escapeHtml(t("lead_warning")) + "</p>";
    }
    html += "</div>";

    // Notes
    if (brand.notes) {
      html += '<div class="detail-section"><h3>' + escapeHtml(t("h_notes")) + "</h3><p>" + pick(tr && tr.notes, brand.notes) + "</p></div>";
    }

    // Alternatives — lighter research than the ownership facts; ranked best first.
    html += '<div class="detail-section"><h3>' + escapeHtml(t("h_alternatives")) + "</h3>";
    if (brand.alternatives && brand.alternatives.length > 0) {
      html += '<p class="alt-caveat">' + escapeHtml(t("alt_caveat")) + "</p>";
      html += '<ol class="alt-list">';
      brand.alternatives.forEach((alt, i) => {
        const note = pick(tr && tr.alternatives && tr.alternatives[i] && tr.alternatives[i].note, alt.note || "");
        html += "<li><strong>" + en(alt.name) + "</strong>" + (note ? " — " + note : "") + "</li>";
      });
      html += "</ol>";
    } else {
      const reason = brand.noAlternativeReason
        ? pick(tr && tr.noAlternativeReason, brand.noAlternativeReason)
        : escapeHtml(t("alt_none_default"));
      html += '<p class="alt-empty">' + reason + "</p>";
    }
    html += "</div>";

    els.detailContent.innerHTML = html;
  }

  // ---------------------- Organization view ----------------------

  function renderEntityDetail(entity) {
    const te = trEntity(entity);
    const linkedBrands = APP_DATA.brands
      .filter((b) => (b.ownershipChain || []).some((link) => link.entity === entity.id))
      .sort(byVerifiedThenName);

    let html = "";
    html += '<h2 class="detail-title" tabindex="-1">' + pick(te && te.name, entity.name) + "</h2>";
    if (entity.type) html += '<p class="detail-company">' + pick(te && te.type, entity.type) + "</p>";
    html += translationNoteHtml();
    if (entity.note) html += '<div class="detail-section"><p>' + pick(te && te.note, entity.note) + "</p></div>";
    if (entity.officialUrl) {
      html +=
        '<div class="detail-section"><h3>' + escapeHtml(t("h_official_site")) + '</h3><a class="source-link" target="_blank" rel="noopener noreferrer" href="' +
        escapeAttr(entity.officialUrl) + '">' + en(entity.officialUrl) + "</a></div>";
    }
    const countText = linkedBrands.length === 1 && !isUrdu() ? t("entity_count_one") : t("entity_count", { n: linkedBrands.length });
    html += '<div class="detail-section"><h3>' + escapeHtml(countText) + "</h3>";
    html += '<ul class="brand-list">' + linkedBrands.map(brandCardHtml).join("") + "</ul></div>";

    els.entityContent.innerHTML = html;
  }

  // ---------------------- Sharing ----------------------

  async function shareBrand(brandId) {
    const brand = findBrand(brandId);
    if (!brand) return;
    const base = location.origin + location.pathname;
    const url = base + "#/brand/" + encodeURIComponent(brand.id);
    const text = t("share_text", { name: displayName(brand), company: brand.company });

    if (navigator.share) {
      try {
        await navigator.share({ title: displayName(brand) + t("title_suffix"), text: text, url: url });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return; // person closed the share sheet
      }
    }
    try {
      await navigator.clipboard.writeText(text + " " + url);
      showToast(t("toast_copied"));
    } catch (err) {
      showToast(t("toast_copy_fail", { url: url }), 8000);
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
    if (!field("reason").value.trim()) field("reason").value = t("s_prefill", { name: brand.name });
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
      validation.textContent = t("s_val_missing");
      validation.hidden = false;
      (payload.name ? field("reason") : field("name")).focus();
      return;
    }
    if (payload.source && !/^https?:\/\//i.test(payload.source)) {
      validation.textContent = t("s_val_source");
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
    submitBtn.textContent = t("s_sending");
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
    submitBtn.textContent = t("s_submit");

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

    els.langToggle.addEventListener("click", async () => {
      const next = state.lang === "ur" ? "en" : "ur";
      if (next === "ur") {
        try {
          await loadUrdu();
        } catch (err) {
          showToast(EN.toast_urdu_offline, 7000);
          return;
        }
      }
      state.lang = next;
      saveLang(next);
      applyLanguage();
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

    // Clears the phone's saved copy of the app and reloads a fresh one.
    document.getElementById("reset-app").addEventListener("click", () => {
      if (typeof window.badalainRepair === "function") window.badalainRepair();
      else location.reload();
    });
  }

  // ---------------------- Install (banner + help page) ----------------------
  // The browser — not this site — decides when installing is offered.
  // Chrome on Android fires an event when it is ready to install the app;
  // we keep that event so a real "Install" button can be shown (in the top
  // banner and on the #/install page). Firefox and Safari never fire it, so
  // they get written steps instead. Nothing here is sent anywhere; the
  // "dismissed" choice is stored only on the person's own phone, and expires
  // after 30 days.

  let deferredPrompt = null;

  function isStandalone() {
    return (
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true
    );
  }

  function installDismissedRecently() {
    try {
      const saved = parseInt(localStorage.getItem(INSTALL_DISMISS_KEY), 10);
      return Number.isFinite(saved) && Date.now() - saved < INSTALL_DISMISS_DAYS * 86400000;
    } catch (e) {
      return false; // storage blocked — just show the banner
    }
  }

  // Shows the big "Install now" button on the help page, but only while the
  // browser is actually offering to install.
  function updateInstallNow() {
    const box = document.getElementById("install-now");
    if (box) box.hidden = !(deferredPrompt && !isStandalone());
  }

  async function runInstallPrompt() {
    if (!deferredPrompt) return;
    const promptEvent = deferredPrompt;
    deferredPrompt = null; // a browser prompt can only be used once
    promptEvent.prompt();
    try { await promptEvent.userChoice; } catch (e) { /* ignore */ }
    const banner = document.getElementById("install-banner");
    if (banner) banner.hidden = true;
    state.bannerKey = null;
    updateInstallNow();
  }

  // The banner remembers *which* message it shows, so it can be re-worded
  // when the language changes.
  function showInstallMessage(key, opts) {
    state.bannerKey = key;
    state.bannerOpts = opts;
    refreshBannerText();
  }

  function refreshBannerText() {
    const banner = document.getElementById("install-banner");
    if (!banner || !state.bannerKey) return;
    document.getElementById("install-banner-text").textContent = t(state.bannerKey);
    document.getElementById("install-banner-btn").hidden = !state.bannerOpts.button;
    document.getElementById("install-banner-link").hidden = !state.bannerOpts.steps;
    banner.hidden = false;
  }

  function initInstall() {
    const banner = document.getElementById("install-banner");
    const btnEl = document.getElementById("install-banner-btn");
    const dismissEl = document.getElementById("install-banner-dismiss");
    const footerInstall = document.getElementById("footer-install");
    const headerInstall = document.getElementById("header-install");
    if (!banner) return;

    if (isStandalone()) {
      // Already running as an installed app: nothing to offer.
      if (footerInstall) footerInstall.hidden = true;
      if (headerInstall) headerInstall.hidden = true;
      return;
    }

    const showBanner = !installDismissedRecently();

    // Registered even if the banner was dismissed, so the help page can
    // still offer the real Install button.
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      updateInstallNow();
      if (showBanner) showInstallMessage("banner_install", { button: true, steps: false });
    });

    window.addEventListener("appinstalled", () => {
      deferredPrompt = null;
      banner.hidden = true;
      state.bannerKey = null;
      updateInstallNow();
      showToast(t("toast_installed"), 5000);
    });

    const ua = navigator.userAgent || "";
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1); // iPadOS reports itself as a Mac
    const iosOtherBrowser = isIOS && /CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua);
    const isMobile = isIOS || /Android|Mobile/i.test(ua);

    if (showBanner) {
      if (isIOS) {
        showInstallMessage(iosOtherBrowser ? "banner_ios_other" : "banner_ios", { button: false, steps: true });
      } else if (isMobile) {
        // Browsers that never send the install event (Firefox, Samsung
        // Internet, Opera, UC…) get a pointer to the written steps.
        setTimeout(() => {
          if (!deferredPrompt && banner.hidden) showInstallMessage("banner_tip", { button: false, steps: true });
        }, 3000);
      }
    }

    btnEl.addEventListener("click", runInstallPrompt);
    document.getElementById("install-now-btn").addEventListener("click", runInstallPrompt);

    dismissEl.addEventListener("click", () => {
      banner.hidden = true;
      state.bannerKey = null;
      try { localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now())); } catch (e) { /* best effort */ }
    });
  }

  // ---------------------- Service worker ----------------------
  // When a newer version of the site has been downloaded in the background,
  // offer a one-tap refresh instead of silently showing old data.

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker
      .register("sw.js", { updateViaCache: "none" })
      // Ask for a new version every time the app opens (browsers otherwise
      // only look about once a day). It's a tiny request when nothing changed.
      .then((reg) => { try { reg.update(); } catch (e) { /* not important */ } })
      .catch(() => { /* offline mode unavailable — not fatal */ });
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController || refreshing) return;
      showToast(t("toast_updated"), 0, t("toast_refresh"), () => {
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
