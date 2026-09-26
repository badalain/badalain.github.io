/*
  data.js — the entire content database for this site.

  HOW TO ADD OR EDIT AN ENTRY
  ----------------------------
  Copy an existing object in BRANDS below, change the fields, and save.
  No build step is needed — the site reads this file directly.

  STATUS FIELD — READ THIS BEFORE ADDING ANYTHING
  -------------------------------------------------
  "lead"      = found in a secondary source (Wikipedia, news, aggregator).
                NOT yet confirmed against a primary document.
                Must show the "Unverified lead" badge. Never present as fact.
  "verified"  = confirmed against a primary source: a company annual report
                (pattern of shareholding), an SECP/PSX filing, or the
                foundation's own official website. The primaryDate field
                must be filled in, and sourceUrl must point at that exact
                document (with a page/section if it's a PDF).

  Nothing in this starter file has been through the second step yet.
  Do not deploy this dataset publicly until every entry you intend to
  show is "verified" or is clearly and only shown as a labeled lead with
  a visible caveat. See README.md for the full verification workflow.
*/

const APP_DATA = {
  // Bump this string whenever you change this file. The service worker
  // uses it to know a new version of the data exists and refresh the cache.
  version: "2026-09-26.1",

  // Neutral, factual app identity. Change freely — nothing else depends on it.
  appName: "Badalain",
  appTagline: "See who owns what you buy, and find alternatives.",

  categories: [
    "Food & Dairy",
    "Banking & Finance",
    "Cement & Construction",
    "Energy & Fuel",
    "Fertilizer",
    "Real Estate",
    "Retail & Other",
  ],

  // The parent organizations. Kept separate from brands so the ownership
  // chain (brand -> company -> ... -> foundation) can be shown clearly.
  entities: [
    {
      id: "fauji-foundation",
      name: "Fauji Foundation",
      type: "Welfare foundation",
      note: "A welfare trust whose managing directors are drawn from senior military ranks. Runs commercial businesses; profits fund welfare programs for military families.",
      officialUrl: "https://www.fauji.org.pk/",
    },
  ],

  // Every row here is a consumer-facing brand or company. "alternatives" is
  // left empty until that research pass happens — never guess an
  // alternative just to fill the field.
  brands: [
    {
      id: "nurpur",
      name: "Nurpur",
      aliases: ["نور پور", "nur pur", "nurpur milk", "nurpur dairy"],
      category: "Food & Dairy",
      company: "Fauji Foods Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "parent (via Fauji Fertilizer Company)", stake: "not yet confirmed" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Fauji Foods",
          url: "https://en.wikipedia.org/wiki/Fauji_Foods",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: null,
      notes: "Wikipedia describes Fauji Foods as a subsidiary of Fauji Fertilizer Company (FFC), known for the Nurpur and Dostea brands. Needs confirmation from FFC's or Fauji Foods' own annual report pattern of shareholding before this can be marked verified.",
      alternatives: [],
    },
    {
      id: "dostea",
      name: "Dostea",
      aliases: ["دوستی چائے", "dost tea"],
      category: "Food & Dairy",
      company: "Fauji Foods Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "parent (via Fauji Fertilizer Company)", stake: "not yet confirmed" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Fauji Foods",
          url: "https://en.wikipedia.org/wiki/Fauji_Foods",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: null,
      notes: "Same chain as Nurpur — both are Fauji Foods brands.",
      alternatives: [],
    },
    {
      id: "askari-bank",
      name: "Askari Bank",
      aliases: ["عسکری بینک", "askari commercial bank"],
      category: "Banking & Finance",
      company: "Askari Bank Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "parent", stake: "not yet confirmed" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Fauji Foundation",
          url: "https://en.wikipedia.org/wiki/Fauji_Foundation",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: null,
      notes: "Listed by Wikipedia as a Fauji Foundation subsidiary. Needs confirmation from Askari Bank's own annual report pattern of shareholding.",
      alternatives: [],
    },
    {
      id: "fauji-cement",
      name: "Fauji Cement",
      aliases: ["فوجی سیمنٹ", "fccl"],
      category: "Cement & Construction",
      company: "Fauji Cement Company Limited (FCCL)",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "parent", stake: "not yet confirmed" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Fauji Cement",
          url: "https://en.wikipedia.org/wiki/Fauji_Cement",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: null,
      notes: "Fauji Cement absorbed Askari Cement (previously an Army Welfare Trust subsidiary) via a share-swap merger sanctioned by the Lahore High Court. This is a documented example of ownership changing over time — re-verify stakes yearly.",
      alternatives: [],
    },
    {
      id: "mari-petroleum",
      name: "Mari Petroleum",
      aliases: ["مری پیٹرولیم", "mari gas"],
      category: "Energy & Fuel",
      company: "Mari Petroleum Company Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "shareholder", stake: "not yet confirmed (historical note: ~40% acquired in 1983)" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Fauji Foundation",
          url: "https://en.wikipedia.org/wiki/Fauji_Foundation",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: null,
      notes: "Historical stake noted from 1983; current stake not yet confirmed from a recent annual report.",
      alternatives: [],
    },
    {
      id: "fauji-fertilizer",
      name: "Fauji Fertilizer Company (FFC)",
      aliases: ["فوجی فرٹیلائزر", "ffc urea", "sona urea"],
      category: "Fertilizer",
      company: "Fauji Fertilizer Company Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "largest shareholder", stake: "~43% (per Wikipedia infobox, unverified)" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Fauji Fertilizer Company",
          url: "https://en.wikipedia.org/wiki/Fauji_Fertilizer_Company",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: null,
      notes: "43% is a large stake but not full ownership — FFC is a listed company with other shareholders. State this precisely once verified; do not round up to 'owned by'.",
      alternatives: [],
    },
    {
      id: "fauji-fresh-n-freeze",
      name: "Fauji Fresh n Freeze",
      aliases: ["فوجی فریش این فریز"],
      category: "Food & Dairy",
      company: "Fauji Fresh n Freeze Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "parent (via Fauji Fertilizer Company)", stake: "not yet confirmed" },
      ],
      status: "lead",
      sources: [
        {
          label: "MarketScreener — Fauji Fertilizer Company profile",
          url: "https://www.marketscreener.com/quote/stock/FAUJI-FERTILIZER-COMPANY--6492700/company/",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: null,
      notes: "Processes fresh/frozen fruit, vegetables, and cooked/semi-cooked food. Consumer brand names under this company not yet identified — check retail packaging or the company website.",
      alternatives: [],
    },
  ],
};
