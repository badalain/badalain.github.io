/*
  app.js — all interactive behavior. No framework, no build step.
  Depends on APP_DATA from data.js being loaded first.
*/

(() => {
  "use strict";

  // ---------------------------------------------------------------------
  // CONFIG — things you'll want to change before going live.
  // ---------------------------------------------------------------------

  // Where suggestion-form submissions are sent. Leave blank for now — the
  // form will fall back to showing the person their own submission to copy
  // and send themselves. Once you set up a backend (see README.md), put
  // its URL here, e.g. a Cloudflare Worker endpoint.
  const SUGGESTION_ENDPOINT_URL = "";

  // Used only in the fallback message shown when SUGGESTION_ENDPOINT_URL
  // is empty or unreachable. Replace with an address created under the
  // separate, anonymous identity — never a personal address.
  const FALLBACK_CONTACT_NOTE =
    "the address given on the About page";

  // ---------------------------------------------------------------------

  const state = {
    query: "",
    category: "All",
    verifiedOnly: false,
    currentDetailId: null,
    currentEntityId: null,
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    document.getElementById("app-name-text").textContent = APP_DATA.appName;
    document.getElementById("app-tagline-text").textContent = APP_DATA.appTagline;
    document.title = APP_DATA.appName + " — " + APP_DATA.appTagline;

    els.searchInput = document.getElementById("search-input");
    els.categoryChips = document.getElementById("category-chips");
    els.brandList = document.getElementById("brand-list");
    els.resultCount = document.getElementById("result-count");
    els.emptyState = document.getElementById("empty-state");
    els.detailContent = document.getElementById("detail-content");
    els.entityContent = document.getElementById("entity-content");
    els.suggestCategory = document.getElementById("s-category");
    els.verifiedToggle = document.getElementById("verified-only-toggle");
    els.aboutStats = document.getElementById("about-stats");
    els.aboutDataLink = document.getElementById("about-data-link");

    buildCategoryChips();
    buildSuggestCategoryOptions();
    renderAboutStats();
    bindEvents();
    render();
    registerServiceWorker();
  }

  // ---------------------- About page stats ----------------------

  function renderAboutStats() {
    const total = APP_DATA.brands.length;
    const verified = APP_DATA.brands.filter((b) => b.status === "verified").length;
    const leads = total - verified;
    els.aboutStats.textContent =
      total + " entries so far — " + verified + " verified, " + leads + " still unverified leads.";
    if (els.aboutDataLink) {
      els.aboutDataLink.href = "data.js?v=" + encodeURIComponent(APP_DATA.version);
    }
  }

  // ---------------------- Category chips ----------------------

  function buildCategoryChips() {
    const cats = ["All", ...APP_DATA.categories];
    els.categoryChips.innerHTML = "";
    cats.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "chip" + (cat === state.category ? " is-active" : "");
      btn.textContent = cat;
      btn.type = "button";
      btn.addEventListener("click", () => {
        state.category = cat;
        [...els.categoryChips.children].forEach((c) =>
          c.classList.toggle("is-active", c === btn)
        );
        render();
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

  // ---------------------- Search + list rendering ----------------------

  function matchesQuery(brand, query) {
    if (!query) return true;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const haystack = [
      brand.name,
      brand.company,
      brand.category,
      ...(brand.aliases || []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }

  function getFilteredBrands() {
    return APP_DATA.brands.filter((b) => {
      const categoryOk = state.category === "All" || b.category === state.category;
      const verifiedOk = !state.verifiedOnly || b.status === "verified";
      return categoryOk && verifiedOk && matchesQuery(b, state.query);
    });
  }

  function render() {
    const results = getFilteredBrands();
    els.brandList.innerHTML = "";

    els.resultCount.textContent =
      results.length === 0
        ? ""
        : results.length === 1
        ? "1 result"
        : results.length + " results";

    els.emptyState.hidden = results.length !== 0;

    results.forEach((brand) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.className = "brand-card";
      btn.type = "button";
      btn.setAttribute("aria-label", "View details for " + brand.name);

      const initial = document.createElement("span");
      initial.className = "brand-icon";
      initial.style.background = badgeColorFor(brand.id);
      initial.textContent = brand.name.trim().charAt(0).toUpperCase();
      initial.setAttribute("aria-hidden", "true");

      const top = document.createElement("div");
      top.className = "brand-card-top";

      const name = document.createElement("span");
      name.className = "brand-card-name";
      name.textContent = brand.name;

      const badge = document.createElement("span");
      badge.className = "badge " + (brand.status === "verified" ? "badge-verified" : "badge-lead");
      badge.textContent = brand.status === "verified" ? "Verified" : "Unverified lead";

      top.appendChild(name);
      top.appendChild(badge);

      const company = document.createElement("span");
      company.className = "brand-card-company";
      company.textContent = brand.company;

      const textWrap = document.createElement("div");
      textWrap.className = "brand-card-text";
      textWrap.appendChild(top);
      textWrap.appendChild(company);

      btn.classList.add("brand-card-with-icon");
      btn.appendChild(initial);
      btn.appendChild(textWrap);
      btn.addEventListener("click", () => openDetail(brand.id));

      li.appendChild(btn);
      els.brandList.appendChild(li);
    });
  }

  // ---------------------- Detail view ----------------------

  // A small fixed palette (not images — see README for why) so each brand
  // gets a consistent, visually distinct initial badge without ever using
  // a real logo or product photo.
  const BADGE_COLORS = ["#0F6B5C", "#8A5A2B", "#3B5EA6", "#7A4A8F", "#B5501E", "#3F7A3F"];
  function badgeColorFor(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    return BADGE_COLORS[hash % BADGE_COLORS.length];
  }

  function findEntity(id) {
    return APP_DATA.entities.find((e) => e.id === id);
  }

  function openDetail(brandId) {
    const brand = APP_DATA.brands.find((b) => b.id === brandId);
    if (!brand) return;
    state.currentDetailId = brandId;
    renderDetail(brand);
    switchView("detail");
  }

  function renderDetail(brand) {
    const badge =
      '<span class="badge ' +
      (brand.status === "verified" ? "badge-verified" : "badge-lead") +
      '">' +
      (brand.status === "verified" ? "Verified" : "Unverified lead") +
      "</span>";

    let html = "";
    html += '<div class="detail-header-row">';
    html +=
      '<span class="brand-icon brand-icon-lg" aria-hidden="true" style="background:' +
      badgeColorFor(brand.id) +
      '">' +
      escapeHtml(brand.name.trim().charAt(0).toUpperCase()) +
      "</span>";
    html += '<div><div class="brand-card-top" style="align-items:flex-start;">';
    html += '<h2 class="detail-title">' + escapeHtml(brand.name) + "</h2>";
    html += badge;
    html += "</div></div></div>";
    html += '<p class="detail-company">' + escapeHtml(brand.company) + "</p>";
    html +=
      '<button class="link-btn share-btn" type="button" data-share-id="' +
      escapeAttr(brand.id) +
      '">Share this entry</button>';

    // Ownership chain — shown as a small clickable diagram: tap the parent
    // organization to see everything else it owns.
    html += '<div class="detail-section"><h3>Ownership</h3>';
    (brand.ownershipChain || []).forEach((link) => {
      const entity = findEntity(link.entity);
      const entityName = entity ? entity.name : link.entity;
      html += '<div class="ownership-chain-row">';
      html +=
        '<button class="entity-chip" type="button" data-entity-id="' +
        escapeAttr(link.entity) +
        '">' +
        escapeHtml(entityName) +
        "</button>";
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
        '<a class="source-link" target="_blank" rel="noopener" href="' +
        escapeAttr(src.url) +
        '">' +
        escapeHtml(src.label) +
        (src.accessedDate ? " (accessed " + escapeHtml(src.accessedDate) + ")" : "") +
        "</a>";
    });
    if (brand.primaryDate) {
      html += "<p>Confirmed against a primary document as of " + escapeHtml(brand.primaryDate) + ".</p>";
    }
    html += "</div>";

    // Notes
    if (brand.notes) {
      html += '<div class="detail-section"><h3>Notes</h3><p>' + escapeHtml(brand.notes) + "</p></div>";
    }

    // Alternatives — a lighter, different kind of research than the
    // ownership facts above: based on market reputation, awards, and
    // consumer surveys, not primary-source filings. Listed best first.
    html += '<div class="detail-section"><h3>Alternatives to consider</h3>';
    if (brand.alternatives && brand.alternatives.length > 0) {
      html +=
        '<p class="alt-caveat">Ranked best first, based on market reputation and consumer surveys — not verified with the same primary-source rigor as the ownership facts above.</p>';
      html += '<ol class="alt-list">';
      brand.alternatives.forEach((alt) => {
        html += "<li><strong>" + escapeHtml(alt.name) + "</strong>" + (alt.note ? " — " + escapeHtml(alt.note) : "") + "</li>";
      });
      html += "</ol>";
    } else {
      html +=
        '<p class="alt-empty">' +
        escapeHtml(brand.noAlternativeReason || "No alternatives researched yet for this entry.") +
        "</p>";
    }
    html += "</div>";

    els.detailContent.innerHTML = html;
  }

  // ---------------------- Entity view (tap a parent to see all its brands) ----------------------

  function openEntity(entityId) {
    const entity = findEntity(entityId);
    if (!entity) return;
    state.currentEntityId = entityId;
    renderEntityDetail(entity);
    switchView("entity");
  }

  function renderEntityDetail(entity) {
    const linkedBrands = APP_DATA.brands.filter((b) =>
      (b.ownershipChain || []).some((link) => link.entity === entity.id)
    );

    let html = "";
    html += '<h2 class="detail-title">' + escapeHtml(entity.name) + "</h2>";
    if (entity.type) html += '<p class="detail-company">' + escapeHtml(entity.type) + "</p>";
    if (entity.note) html += '<div class="detail-section"><p>' + escapeHtml(entity.note) + "</p></div>";
    if (entity.officialUrl) {
      html +=
        '<div class="detail-section"><a class="source-link" target="_blank" rel="noopener" href="' +
        escapeAttr(entity.officialUrl) +
        '">' +
        escapeHtml(entity.officialUrl) +
        "</a></div>";
    }

    html +=
      '<div class="detail-section"><h3>' +
      linkedBrands.length +
      " brand" +
      (linkedBrands.length === 1 ? "" : "s") +
      " linked to this organization</h3></div>";

    html += '<ul class="brand-list">';
    linkedBrands.forEach((brand) => {
      html += '<li><button class="brand-card brand-card-with-icon entity-linked-brand" type="button" data-brand-id="' + escapeAttr(brand.id) + '">';
      html +=
        '<span class="brand-icon" aria-hidden="true" style="background:' +
        badgeColorFor(brand.id) +
        '">' +
        escapeHtml(brand.name.trim().charAt(0).toUpperCase()) +
        "</span>";
      html += '<div class="brand-card-text"><div class="brand-card-top"><span class="brand-card-name">' + escapeHtml(brand.name) + "</span>";
      html +=
        '<span class="badge ' +
        (brand.status === "verified" ? "badge-verified" : "badge-lead") +
        '">' +
        (brand.status === "verified" ? "Verified" : "Unverified lead") +
        "</span></div>";
      html += '<span class="brand-card-company">' + escapeHtml(brand.company) + "</span></div>";
      html += "</button></li>";
    });
    html += "</ul>";

    els.entityContent.innerHTML = html;
  }

  // ---------------------- View switching (tabs) ----------------------

  function switchView(viewName) {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("is-active"));
    document.getElementById("view-" + viewName).classList.add("is-active");

    document.querySelectorAll(".tab-btn").forEach((btn) => {
      const isMatch = btn.dataset.view === viewName;
      btn.classList.toggle("is-active", isMatch);
      btn.setAttribute("aria-pressed", isMatch ? "true" : "false");
    });

    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  // ---------------------- Events ----------------------

  function bindEvents() {
    els.searchInput.addEventListener("input", (e) => {
      state.query = e.target.value;
      render();
    });

    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => switchView(btn.dataset.view));
    });

    document.getElementById("detail-back-btn").addEventListener("click", () => {
      switchView("search");
    });

    document.getElementById("entity-back-btn").addEventListener("click", () => {
      switchView("search");
    });

    els.verifiedToggle.addEventListener("change", (e) => {
      state.verifiedOnly = e.target.checked;
      render();
    });

    // Event delegation: the detail view's content is rebuilt on every open,
    // so these listeners are attached once to the container instead.
    els.detailContent.addEventListener("click", (e) => {
      const entityBtn = e.target.closest(".entity-chip");
      if (entityBtn) {
        openEntity(entityBtn.dataset.entityId);
        return;
      }
      const shareBtn = e.target.closest(".share-btn");
      if (shareBtn) {
        shareBrand(shareBtn.dataset.shareId);
      }
    });

    els.entityContent.addEventListener("click", (e) => {
      const brandBtn = e.target.closest(".entity-linked-brand");
      if (brandBtn) {
        openDetail(brandBtn.dataset.brandId);
      }
    });

    document.getElementById("empty-state-suggest-link").addEventListener("click", () => {
      switchView("suggest");
    });

    document.getElementById("suggest-form").addEventListener("submit", handleSuggestSubmit);

    document.getElementById("suggest-copy-btn").addEventListener("click", () => {
      const text = document.getElementById("suggest-fallback-text").textContent;
      navigator.clipboard?.writeText(text);
    });
  }

  async function shareBrand(brandId) {
    const brand = APP_DATA.brands.find((b) => b.id === brandId);
    if (!brand) return;
    const shareText =
      brand.name + " — produced by " + brand.company + ". See the sources: " + window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: APP_DATA.appName, text: shareText, url: window.location.href });
        return;
      } catch (err) {
        // user cancelled the share sheet, or it failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      alert("Copied to clipboard — paste it anywhere to share.");
    } catch (err) {
      // clipboard blocked (older browser) — nothing more we can do silently
    }
  }

  async function handleSuggestSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      category: form.category.value,
      reason: form.reason.value.trim(),
      source: form.source.value.trim(),
      submittedAt: new Date().toISOString(),
    };

    const successBox = document.getElementById("suggest-success");
    const fallbackBox = document.getElementById("suggest-fallback");
    successBox.hidden = true;
    fallbackBox.hidden = true;

    if (SUGGESTION_ENDPOINT_URL) {
      try {
        const res = await fetch(SUGGESTION_ENDPOINT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          successBox.hidden = false;
          form.reset();
          return;
        }
      } catch (err) {
        // fall through to fallback path below
      }
    }

    // No endpoint configured, or it failed — show the person their own
    // submission so they can send it another way.
    const text =
      "Brand/company: " + payload.name + "\n" +
      "Category: " + payload.category + "\n" +
      "Details: " + payload.reason + "\n" +
      "Source: " + (payload.source || "(none given)") + "\n" +
      "\nSubmission couldn't be sent automatically. Please send this to " +
      FALLBACK_CONTACT_NOTE + ".";
    document.getElementById("suggest-fallback-text").textContent = text;
    fallbackBox.hidden = false;
  }

  // ---------------------- Service worker ----------------------

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {
        /* offline support just won't be available — not fatal */
      });
    }
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
