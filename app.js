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
    currentDetailId: null,
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
    els.suggestCategory = document.getElementById("s-category");

    buildCategoryChips();
    buildSuggestCategoryOptions();
    bindEvents();
    render();
    registerServiceWorker();
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
      return categoryOk && matchesQuery(b, state.query);
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

      btn.appendChild(top);
      btn.appendChild(company);
      btn.addEventListener("click", () => openDetail(brand.id));

      li.appendChild(btn);
      els.brandList.appendChild(li);
    });
  }

  // ---------------------- Detail view ----------------------

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
    html += '<div class="brand-card-top" style="align-items:flex-start;">';
    html += '<h2 class="detail-title">' + escapeHtml(brand.name) + "</h2>";
    html += badge;
    html += "</div>";
    html += '<p class="detail-company">' + escapeHtml(brand.company) + "</p>";

    // Ownership chain
    html += '<div class="detail-section"><h3>Ownership</h3>';
    (brand.ownershipChain || []).forEach((link) => {
      const entity = findEntity(link.entity);
      const entityName = entity ? entity.name : link.entity;
      html += '<div class="ownership-row"><span>' + escapeHtml(entityName);
      if (link.relation) html += " — " + escapeHtml(link.relation);
      html += '</span><span>' + escapeHtml(link.stake || "") + "</span></div>";
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

    // Alternatives
    html += '<div class="detail-section"><h3>Alternatives to consider</h3>';
    if (brand.alternatives && brand.alternatives.length > 0) {
      brand.alternatives.forEach((alt) => {
        html += '<p>' + escapeHtml(alt.name) + (alt.note ? " — " + escapeHtml(alt.note) : "") + "</p>";
      });
    } else {
      html += '<p class="alt-empty">No alternatives researched yet for this entry.</p>';
    }
    html += "</div>";

    els.detailContent.innerHTML = html;
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

    document.getElementById("empty-state-suggest-link").addEventListener("click", () => {
      switchView("suggest");
    });

    document.getElementById("suggest-form").addEventListener("submit", handleSuggestSubmit);

    document.getElementById("suggest-copy-btn").addEventListener("click", () => {
      const text = document.getElementById("suggest-fallback-text").textContent;
      navigator.clipboard?.writeText(text);
    });
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
