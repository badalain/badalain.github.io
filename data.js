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
  version: "2026-09-26.5",

  // Neutral, factual app identity. Change freely — nothing else depends on it.
  appName: "Badalain",
  appTagline: "See who owns what you buy, and find alternatives.",

  categories: [
    "Food & Dairy",
    "Banking & Finance",
    "Cement & Construction",
    "Energy & Fuel",
    "Fertilizer",
    "Insurance",
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
    {
      id: "army-welfare-trust",
      name: "Army Welfare Trust (AWT)",
      type: "Welfare trust",
      note: "A Pakistan Army-run welfare trust, separate from Fauji Foundation, funding welfare for army personnel and their families through commercial businesses (also known as the Askari Group).",
      officialUrl: "https://awt.com.pk/",
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
        { entity: "fauji-foundation", relation: "indirect parent, via Fauji Fertilizer Company", stake: "84.84% of Fauji Foods held by FFC (itself 43.51% Fauji Foundation-owned)" },
      ],
      status: "verified",
      sources: [
        {
          label: "Business Recorder (BR Research) — Fauji Foods Limited, citing FFL's own shareholding pattern as of 31 Dec 2024",
          url: "https://www.brecorder.com/news/40381578",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "31 December 2024",
      notes: "Fauji Fertilizer Company holds 84.84% of Fauji Foods Limited directly; Fauji Foundation's link to Nurpur runs through its 43.51% stake in FFC. Stated as a chain rather than one combined percentage.",
      alternatives: [],
    },
    {
      id: "dostea",
      name: "Dostea",
      aliases: ["دوستی چائے", "dost tea"],
      category: "Food & Dairy",
      company: "Fauji Foods Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "indirect parent, via Fauji Fertilizer Company", stake: "84.84% of Fauji Foods held by FFC (itself 43.51% Fauji Foundation-owned)" },
      ],
      status: "verified",
      sources: [
        {
          label: "Business Recorder (BR Research) — Fauji Foods Limited, citing FFL's own shareholding pattern as of 31 Dec 2024",
          url: "https://www.brecorder.com/news/40381578",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "31 December 2024",
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
        { entity: "fauji-foundation", relation: "direct holding", stake: "7.19%" },
        { entity: "fauji-foundation", relation: "indirect, via Fauji Fertilizer Company (itself 43.51% Fauji Foundation-owned)", stake: "64.72% held by FFC" },
      ],
      status: "verified",
      sources: [
        {
          label: "Askari Bank Annual Report 2025 (corporate profile page)",
          url: "https://askaribank.com/gallery/Askari-AR-2025.pdf",
          accessedDate: "2026-09-26",
        },
        {
          label: "PACRA rating report, corroborating the 71.91% combined stake",
          url: "https://pacra.com/api/rating-report/MTYyMjE=",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "2025 Annual Report",
      notes: "Askari Bank's own annual report describes Fauji Foundation and Fauji Fertilizer Company together as 'the Fauji Consortium,' holding 71.91% combined (7.19% direct + 64.72% via FFC). Stated as two rows here rather than one combined percentage, so the direct-vs-indirect split stays visible.",
      alternatives: [],
    },
    {
      id: "fauji-cement",
      name: "Fauji Cement",
      aliases: ["فوجی سیمنٹ", "fccl"],
      category: "Cement & Construction",
      company: "Fauji Cement Company Limited (FCCL)",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "collective holding, together with Committee of Admin Fauji Foundation, Fauji Fertilizer Company, and Fauji Oil Terminal & Distribution", stake: "66.81% collectively" },
      ],
      status: "verified",
      sources: [
        {
          label: "Business Recorder (BR Research) — Fauji Cement performance and outlook, citing FCCL's shareholding pattern as of 30 June 2025",
          url: "https://www.brecorder.com/news/40437287/fauji-cement-company-limited-performance-and-outlook",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "30 June 2025",
      notes: "This 66.81% is a collective figure across four related Fauji entities, not Fauji Foundation alone — stated that way deliberately rather than rounded up. Fauji Cement also absorbed Askari Cement (previously an Army Welfare Trust subsidiary) via a share-swap merger sanctioned by the Lahore High Court, a documented example of ownership changing over time. Re-verify yearly.",
      alternatives: [],
    },
    {
      id: "mari-petroleum",
      name: "Mari Petroleum",
      aliases: ["مری پیٹرولیم", "mari gas", "mari energies"],
      category: "Energy & Fuel",
      company: "Mari Energies Limited (formerly Mari Petroleum Company Limited)",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "largest shareholder", stake: "40%" },
      ],
      status: "verified",
      sources: [
        {
          label: "Mari Energies — Pattern of Shareholding, as at 30 June 2023 (company's own filing)",
          url: "https://marienergies.com.pk/wp-content/uploads/2023/08/Pattern-of-Shareholders-1.pdf",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "30 June 2023",
      notes: "Fauji Foundation acquired this 40% stake in 1983 (from Esso Eastern Incorporated) and it has stayed stable since; the remaining 60% is split 20% Government of Pakistan and 20% Oil & Gas Development Company Limited (OGDCL). The company renamed itself from Mari Petroleum Company Limited to Mari Energies Limited in 2025 — same entity, same ownership.",
      alternatives: [],
    },
    {
      id: "fauji-fertilizer",
      name: "Fauji Fertilizer Company (FFC)",
      aliases: ["فوجی فرٹیلائزر", "ffc urea", "sona urea"],
      category: "Fertilizer",
      company: "Fauji Fertilizer Company Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "largest shareholder", stake: "43.51%" },
      ],
      status: "verified",
      sources: [
        {
          label: "FFC quarterly report, period ended 31 Mar 2025 (via MarketScreener)",
          url: "https://www.marketscreener.com/quote/stock/FAUJI-FERTILIZER-COMPANY--6492700/news/Fauji-Fertilizer-Transmission-of-Quarterly-Report-for-the-Period-Ended-31-Mar-2025-49766796/",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "31 March 2025 (unchanged from 31 December 2024)",
      notes: "43.51% is a large stake but not full ownership — FFC is a listed company with other shareholders holding the remainder. FFC merged with the former Fauji Fertilizer Bin Qasim Limited (FFBL) effective 1 July 2024; figures here are for the merged entity.",
      alternatives: [],
    },
    {
      id: "fauji-fresh-n-freeze",
      name: "Fauji Fresh n Freeze",
      aliases: ["فوجی فریش این فریز"],
      category: "Food & Dairy",
      company: "Fauji Fresh n Freeze Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "wholly owned, via Fauji Fertilizer Company", stake: "100% held by FFC (itself 43.51% Fauji Foundation-owned)" },
      ],
      status: "verified",
      sources: [
        {
          label: "FFC corporate profile (sponsor page, ICAP/SAFA) — describes the 2013 acquisition",
          url: "https://icap.org.pk/safa/sponsor-ffc.php",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "profile current as of access date; acquisition dated October 2013",
      notes: "FFC acquired 100% of Al-Hamd Foods Limited in October 2013 and renamed it Fauji Fresh n Freeze Limited. It processes fresh/frozen fruit, vegetables, and cooked/semi-cooked food (IQF plant in Sahiwal). Consumer-facing brand names under this company not yet identified — check retail packaging or freshnfreeze.com.",
      alternatives: [],
    },
    {
      id: "mal-pakistan",
      name: "MAL Pakistan (Mobil lubricants)",
      aliases: ["Mobil Askari Lubricants", "Mobil Pakistan", "موبل آسکری"],
      category: "Energy & Fuel",
      company: "MAL Pakistan Limited",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "wholly owned subsidiary", stake: "100%" },
      ],
      status: "verified",
      sources: [
        {
          label: "PACRA credit rating report on MAL Pakistan Limited, dated 5 August 2026",
          url: "https://pacra.com/api/rating-report/MTYwNjY=",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "5 August 2026 (rating report)",
      notes: "Originally a 1996 joint venture (30% AWT / 70% Mobil International Petroleum Corporation) named Mobil Askari Lubricants; AWT acquired the remaining shares in 2007 and renamed it MAL Pakistan Limited. Still sells under the Mobil brand via a licensing agreement with ExxonMobil — engine oils, greases, transmission oils, brake fluids.",
      alternatives: [],
    },
    {
      id: "askari-general-insurance",
      name: "Askari General Insurance (AGICO)",
      aliases: ["AGICO", "AGICL", "عسکری جنرل انشورنس"],
      category: "Insurance",
      company: "Askari General Insurance Company Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "direct controlling shareholder (since 28 Aug 2026)", stake: "51%" },
        { entity: "army-welfare-trust", relation: "remaining minority holder (previously 60.23% before the transfer)", stake: "~9.23%" },
      ],
      status: "verified",
      sources: [
        {
          label: "Business Recorder — Fauji Foundation acquires majority stake in Askari General Insurance",
          url: "https://www.brecorder.com/news/40437396/fauji-foundation-acquires-majority-stake-in-askari-general-insurance",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "28 August 2026 (PSX filing)",
      notes: "Until 28 August 2026 this was an Army Welfare Trust company (60.23% AWT-owned). AWT transferred 51,337,953 ordinary shares (51% of paid-up capital) to Fauji Foundation, per AGICO's own PSX disclosure. Both organizations describe this as an internal restructuring between two military welfare trusts, not a commercial acquisition.",
      alternatives: [],
    },
    {
      id: "askari-life-assurance",
      name: "Askari Life Assurance",
      aliases: ["Askari Life", "عسکری لائف"],
      category: "Insurance",
      company: "Askari Life Assurance Company Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "direct controlling shareholder (since 28 Aug 2026)", stake: "51%" },
        { entity: "army-welfare-trust", relation: "remaining minority holder (previously 66.65% before the transfer)", stake: "~15.65%" },
      ],
      status: "verified",
      sources: [
        {
          label: "Pakistan Today Profit — Fauji Foundation to acquire controlling stakes in Askari General, Askari Life from Army Welfare Trust",
          url: "https://profit.pakistantoday.com.pk/2026/07/08/fauji-foundation-to-acquire-controlling-stakes-in-askari-general-askari-life-from-army-welfare-trust",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "28 August 2026 (transfer completed; SECP approval 23 July 2026)",
      notes: "Formerly known as East West Life Assurance Company Limited. Until 28 August 2026 this was an Army Welfare Trust company (66.65% AWT-owned). AWT transferred 76,587,727 shares (51% of paid-up capital) to Fauji Foundation. Same restructuring as Askari General Insurance, completed the same day.",
      alternatives: [],
    },
    {
      id: "askari-guards",
      name: "Askari Guards",
      aliases: ["AGL", "Askari Guards Pvt Limited", "عسکری گارڈز"],
      category: "Retail & Other",
      company: "Askari Guards (Pvt) Limited",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "subsidiary (exact stake not published)", stake: "subsidiary" },
      ],
      status: "verified",
      sources: [
        {
          label: "Askari Guards' own website — company footer states its AWT ownership directly",
          url: "https://www.askariguards.com/",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "current as of access date",
      notes: "Founded 1996; describes itself as the largest security company in Pakistan (20,000 guards). Services: security guards, close protection, cash-in-transit, CCTV/access control for homes and businesses. Exact ownership percentage not published — company states 'subsidiary' without a number, so this is recorded as such rather than assumed to be 100%.",
      alternatives: [],
    },
  ],
};
