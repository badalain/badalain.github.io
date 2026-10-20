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

  Do not deploy this dataset publicly until every entry you intend to
  show is "verified" or is clearly and only shown as a labeled lead with
  a visible caveat. See README.md for the full verification workflow.
*/

const APP_DATA = {
  // Bump this string whenever you change this file. The service worker
  // uses it to know a new version of the data exists and refresh the cache.
  version: "2026-10-20.20",

  // App name used in page titles.
  appName: "Badalain",
  appNameUrdu: "بدلیں",
  lastUpdated: "2026-10-20",
  appTagline: "See who owns what you buy, and find alternatives.",

  categories: [
    "Food & Dairy",
    "Banking & Finance",
    "Cement & Construction",
    "Energy & Fuel",
    "Fertilizer",
    "Insurance",
    "Media",
    "Real Estate",
    "Transport",
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
    {
      id: "shaheen-foundation",
      name: "Shaheen Foundation",
      type: "Welfare foundation",
      note: "A Pakistan Air Force welfare foundation, established 1977, funding welfare for PAF personnel and their families through businesses in aviation, insurance, media, and real estate.",
      officialUrl: "https://shaheenfoundation.com/",
    },
    {
      id: "ministry-of-defence-pakistan",
      name: "Ministry of Defence, Pakistan / Pakistan Army",
      type: "Government ministry & armed forces (statutory administration, not a shareholding structure)",
      note: "Defence Housing Authorities are government statutory bodies, legally distinct from the welfare foundations above. Each city's DHA is a separate legal entity created by its own law, governed by a Governing Body chaired by the federal Secretary of Defence and an Executive Board headed by the local Army Corps Commander. There is no 'ownership percentage' to state here, since this is direct government/military administration rather than a company with shares.",
      officialUrl: null,
    },
    {
      id: "bahria-foundation",
      name: "Bahria Foundation",
      type: "Welfare foundation",
      note: "A Pakistan Navy welfare foundation, established 1982, funding welfare for Navy personnel and their families through real estate, security services, maritime/dredging works, and other commercial businesses. Not the same organization as Bahria Town, a private real-estate company with no connection to the Navy — the two share a name only, following a 2001 Supreme Court ruling that let Bahria Town keep using the word.",
      officialUrl: "https://bahriafoundation.com/",
    },
  ],

  // Every row here is a consumer-facing brand or company. "alternatives" is
  // left empty until that research pass happens — never guess an
  // alternative just to fill the field.
  brands: [
    {
      id: "nurpur",
      name: "Nurpur",
      aliases: ["نور پور", "nur pur", "nurpur milk", "nurpur dairy", "milk", "doodh", "butter", "makhan", "cheese", "desi ghee", "ghee", "flavoured milk"],
      category: "Food & Dairy",
      company: "Fauji Foods Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "indirect, via Fauji Fertilizer Company, the direct parent of Fauji Foods Limited (FFC is itself 44.32% Fauji Foundation-owned, as at 30 June 2026)", stake: "47.84% of Fauji Foods held directly by FFC" },
        { entity: "fauji-foundation", relation: "direct shareholder in Fauji Foods Limited", stake: "2.67% (67,371,916 shares)" },
      ],
      status: "verified",
      sources: [
        {
          label: "Fauji Foods Limited — Annual Report 2025, note 5.2.1, shares held by associated undertakings at 31 December 2025 (company's own report, page 78)",
          url: "https://www.faujifoods.com/pdf/financialResults/fauji-foods-annual-report-2025.pdf",
          accessedDate: "2026-10-20",
        },
        {
          label: "Fauji Fertilizer Company — half-year report, six months ended 30 June 2026, note 4.1 (company's own PSX filing)",
          url: "https://dps.psx.com.pk/download/document/281738.pdf",
          accessedDate: "2026-10-20",
        },
        {
          label: "Business Recorder (BR Research) — Fauji Foods Limited, citing its shareholding pattern as of 31 Dec 2024 (earlier, secondary)",
          url: "https://www.brecorder.com/news/40381578",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "31 December 2025 (Fauji Foods Annual Report 2025); FFC's own holding as at 30 June 2026",
      notes: "Fauji Foods Limited's Annual Report 2025 (note 5.2.1, shares held by associated undertakings at 31 December 2025) lists these holders: Fauji Fertilizer Company 47.84% (1,205,576,237 shares), FFC Energy Limited 18.45% (465,000,000), FFBL Power Company Limited 15.87% (400,000,000) and Fauji Foundation 2.67% (67,371,916), together 84.84%. The report calls Fauji Fertilizer Company the intermediate parent and Fauji Foundation the ultimate controlling parent of Fauji Foods. It lists FFC Energy and FFBL Power as associated companies but does not say who owns them, so only FFC's direct 47.84% and the Foundation's direct 2.67% are shown as rows here. An earlier version of this entry described the whole 84.84% as held by FFC; that was less precise than the filing. Product range is wider than milk alone: also sells Nurpur butter, cheese (mozzarella, cheddar, American slices), desi ghee, flavoured milk, and, under separate brand names, Fauji corn flakes and Opa pasta. Check packaging for the Nurpur or Fauji name specifically, not just 'milk.'",
      alternatives: [
        {
          name: "Olper's (Engro Foods)",
          note: "Made by Engro Foods. Majority ownership passed to the Dutch dairy cooperative FrieslandCampina in 2016, so it is not fully Pakistani-owned. No military ownership link was identified in the documents checked.",
        },
        {
          name: "Good Milk (Shakarganj Foods)",
          note: "A Pakistani-owned dairy brand from Shakarganj Foods. No military ownership link was identified in the documents checked.",
        },
      ],
    },
    {
      id: "dostea",
      name: "Dostea",
      aliases: ["دوستی چائے", "dost tea", "tea", "chai", "chaye", "patti"],
      category: "Food & Dairy",
      company: "Fauji Foods Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "indirect, via Fauji Fertilizer Company, the direct parent of Fauji Foods Limited (FFC is itself 44.32% Fauji Foundation-owned, as at 30 June 2026)", stake: "47.84% of Fauji Foods held directly by FFC" },
        { entity: "fauji-foundation", relation: "direct shareholder in Fauji Foods Limited", stake: "2.67% (67,371,916 shares)" },
      ],
      status: "verified",
      sources: [
        {
          label: "Fauji Foods Limited — Annual Report 2025, note 5.2.1, shares held by associated undertakings at 31 December 2025 (company's own report, page 78)",
          url: "https://www.faujifoods.com/pdf/financialResults/fauji-foods-annual-report-2025.pdf",
          accessedDate: "2026-10-20",
        },
        {
          label: "Fauji Fertilizer Company — half-year report, six months ended 30 June 2026, note 4.1 (company's own PSX filing)",
          url: "https://dps.psx.com.pk/download/document/281738.pdf",
          accessedDate: "2026-10-20",
        },
        {
          label: "Business Recorder (BR Research) — Fauji Foods Limited, citing its shareholding pattern as of 31 Dec 2024 (earlier, secondary)",
          url: "https://www.brecorder.com/news/40381578",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "31 December 2025 (Fauji Foods Annual Report 2025); FFC's own holding as at 30 June 2026",
      notes: "Same chain as Nurpur — both are Fauji Foods brands. See the Nurpur entry for the full list of Fauji Foods shareholders (Fauji Foods Annual Report 2025, 31 December 2025).",
      alternatives: [
        {
          name: "Tapal Tea",
          note: "A Pakistani-owned tea brand (Tapal). No military ownership link was identified in the documents checked.",
        },
        {
          name: "Vital Tea (Vital Group)",
          note: "Made by Vital Group, a Pakistani-owned company based in Karachi since 1991. No military ownership link was identified in the documents checked.",
        },
      ],
    },
    {
      id: "fauji-cereals",
      name: "Fauji Corn Flakes (Fauji Cereals)",
      aliases: ["فوجی کارن فلیکس", "fauji cereals", "corn flakes", "cornflakes", "cereal", "breakfast cereal", "fauji pasta"],
      category: "Food & Dairy",
      company: "Fauji Foods Limited (Fauji Cereals)",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "indirect, via Fauji Fertilizer Company, the direct parent of Fauji Foods Limited (FFC is itself 44.32% Fauji Foundation-owned, as at 30 June 2026)", stake: "47.84% of Fauji Foods held directly by FFC" },
        { entity: "fauji-foundation", relation: "direct shareholder in Fauji Foods Limited", stake: "2.67% (67,371,916 shares)" },
      ],
      status: "verified",
      sources: [
        {
          label: "Fauji Foods Limited — Annual Report 2025, note 5.2.1, shares held by associated undertakings at 31 December 2025 (company's own report, page 78)",
          url: "https://www.faujifoods.com/pdf/financialResults/fauji-foods-annual-report-2025.pdf",
          accessedDate: "2026-10-20",
        },
        {
          label: "Fauji Fertilizer Company — half-year report, six months ended 30 June 2026, note 4.1 (company's own PSX filing)",
          url: "https://dps.psx.com.pk/download/document/281738.pdf",
          accessedDate: "2026-10-20",
        },
        {
          label: "Fauji Foods' own exhibitor profile (Saudi Food Show), listing Fauji Corn Flakes among its products",
          url: "https://thesaudifoodshow.com/exhibitors/fauji-foods-limited",
          accessedDate: "2026-09-27",
        },
        {
          label: "Gama Consumer — Fauji Foods acquires Fauji Infraveast Foods and the cereals business from Fauji Foundation (29 February 2024)",
          url: "https://www.gamaconsumer.com/pakistan-fauji-foods-acquires-fauji-infraveast-foods-consolidate-cereal-dairy-brands/",
          accessedDate: "2026-10-20",
        },
        {
          label: "Business Recorder (BR Research) — Fauji Foods Limited, citing its shareholding pattern as of 31 Dec 2024 (earlier, secondary)",
          url: "https://www.brecorder.com/news/40381578",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "31 December 2025 (shareholding); product listing current as of access date",
      notes: "Fauji Cereals dates back to 1954. Its corn flakes are sold under the Fauji name itself, so the brand is easy to spot on the box. Same ownership chain as Nurpur, since both now sit under Fauji Foods (see the Nurpur entry for the full shareholder list). Fauji Foods took over Fauji Cereals from Fauji Foundation in February 2024, according to its stock-exchange announcement as reported by Profit and Gama Consumer.",
      alternatives: [],
      noAlternativeReason: "Breakfast-cereal alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "askari-bank",
      name: "Askari Bank",
      aliases: ["عسکری بینک", "askari commercial bank", "bank", "account", "atm"],
      category: "Banking & Finance",
      company: "Askari Bank Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "direct holding", stake: "7.19%" },
        { entity: "fauji-foundation", relation: "indirect, via Fauji Fertilizer Company (itself 44.32% Fauji Foundation-owned, as at 30 June 2026)", stake: "64.72% held by FFC" },
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
      notes: "Askari Bank's own annual report describes Fauji Foundation and Fauji Fertilizer Company together as 'the Fauji Consortium,' holding 71.91% combined (7.19% direct + 64.72% via FFC). Stated as two rows here rather than one combined percentage, so the direct-vs-indirect split stays visible. Re-checked in a verification refresh: the 71.91% figure is unchanged and confirmed by PACRA's most recent rating action (20 July 2026), which also upgraded the bank's credit rating to AAA/A1+ from AA+/A1+, citing 'strategic support from its ownership structure.'",
      alternatives: [
        {
          name: "Meezan Bank",
          note: "An Islamic bank. Note: it has significant Kuwaiti institutional investment among its shareholders, so it is not purely Pakistani-owned. No military ownership link was identified in the documents checked.",
        },
        {
          name: "Bank Al Habib",
          note: "A Pakistani conventional bank. No military ownership link was identified in the documents checked.",
        },
      ],
    },
    {
      id: "fauji-cement",
      name: "Fauji Cement",
      aliases: ["فوجی سیمنٹ", "fccl", "cement", "askari cement"],
      category: "Cement & Construction",
      company: "Fauji Cement Company Limited (FCCL)",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "Committee of Admin. Fauji Foundation holds this directly, per FCCL's own annual report", stake: "61.6492%" },
        { entity: "fauji-foundation", relation: "collective holding together with Fauji Fertilizer Company and Fauji Oil Terminal & Distribution (the 61.6492% above is part of this total)", stake: "66.8091% collectively" },
      ],
      status: "verified",
      sources: [
        {
          label: "Fauji Cement Company Limited — Annual Report 2026, 'Categories of Shareholders as on 30th June 2026' (company's own filing)",
          url: "https://fccl.com.pk/eng/wp-content/uploads/2025/05/Categories-of-Shareholders-as-on-30th-June-2026.pdf",
          accessedDate: "2026-09-27",
        },
      ],
      primaryDate: "30 June 2026",
      notes: "Re-checked directly against FCCL's own annual report during a verification refresh — confirms the figure and updates the source from a secondary citation to the company's own filing. 'Committee of Admin. Fauji Foundation' alone holds 61.6492% as the single largest shareholder; the broader 66.8091% collective figure (with Fauji Fertilizer Company and Fauji Oil Terminal & Distribution) is essentially unchanged from a year earlier, confirming stability. Fauji Cement also absorbed Askari Cement (previously an Army Welfare Trust subsidiary) via a share-swap merger sanctioned by the Lahore High Court. Percentages are shown to the four decimal places published in the filing and are not rounded. Re-verify yearly.",
      alternatives: [
        {
          name: "Lucky Cement",
          note: "A cement producer associated with the Pakistani-owned Yunus Brothers Group. No military ownership link was identified in the documents checked.",
        },
        {
          name: "DG Khan Cement",
          note: "A cement producer owned by the Pakistani-owned Nishat Group. No military ownership link was identified in the documents checked.",
        },
      ],
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
          label: "Mari Energies — Pattern of Shareholding, as at 30 June 2025 (company's own filing, page 140)",
          url: "https://www.marienergies.com.pk/wp-content/uploads/2025/10/Pattern-of-Shareholding-as-of-June-30-2025.pdf",
          accessedDate: "2026-10-20",
        },
        {
          label: "Mari Energies — Pattern of Shareholding, as at 30 June 2023 (company's own filing)",
          url: "https://marienergies.com.pk/wp-content/uploads/2023/08/Pattern-of-Shareholders-1.pdf",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "30 June 2025",
      notes: "Fauji Foundation acquired this 40% stake in 1983 (from Esso Eastern Incorporated) and it has stayed stable since; as at 30 June 2025 the other holders of 5% or more were Oil & Gas Development Company Limited (OGDCL) with 20.00% and the Government of Pakistan with 19.99%; no other holder reached 5%. The company renamed itself from Mari Petroleum Company Limited to Mari Energies Limited in 2025 — same entity, same ownership.",
      alternatives: [],
      noAlternativeReason: "Mari Energies is a gas exploration and production company, not a retail brand — ordinary consumers don't choose their gas supplier the way they choose a grocery brand, so there's no meaningful everyday alternative to list here.",
    },
    {
      id: "fauji-fertilizer",
      name: "Fauji Fertilizer Company (FFC)",
      aliases: ["فوجی فرٹیلائزر", "ffc urea", "sona urea", "urea", "khad", "fertilizer", "fertiliser", "dap", "ffbl"],
      category: "Fertilizer",
      company: "Fauji Fertilizer Company Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "largest shareholder", stake: "44.32%" },
      ],
      status: "verified",
      sources: [
        {
          label: "Fauji Fertilizer Company — half-year report, six months ended 30 June 2026, note 4.1 (company's own PSX filing)",
          url: "https://dps.psx.com.pk/download/document/281738.pdf",
          accessedDate: "2026-10-20",
        },
        {
          label: "Fauji Fertilizer Company — quarterly report, three months ended 31 March 2026, note 4.1 (company's own PSX filing)",
          url: "https://dps.psx.com.pk/download/document/276333.pdf",
          accessedDate: "2026-10-20",
        },
        {
          label: "FFC quarterly report, period ended 31 Mar 2025 (via MarketScreener) — earlier figure, superseded",
          url: "https://www.marketscreener.com/quote/stock/FAUJI-FERTILIZER-COMPANY--6492700/news/Fauji-Fertilizer-Transmission-of-Quarterly-Report-for-the-Period-Ended-31-Mar-2025-49766796/",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "30 June 2026 (half-year report); 43.70% at 31 December 2025",
      notes: "44.32% is a large stake but not full ownership — FFC is a listed company with other shareholders holding the remainder. FFC's own filings give Fauji Foundation's holding as 44.32% at 30 June 2026, 44.32% at 31 March 2026 and 43.70% at 31 December 2025 (earlier versions of this page showed 43.51%, from March 2025). FFC merged with the former Fauji Fertilizer Bin Qasim Limited (FFBL) effective 1 July 2024; figures here are for the merged entity.",
      alternatives: [
        {
          name: "Engro Fertilizers",
          note: "A fertilizer producer, part of the Engro Corporation group. No military ownership link was identified in the documents checked.",
        },
        {
          name: "Fatima Fertilizer",
          note: "A Pakistani fertilizer producer (Fatima Fertilizer Company). Note: Fatima Fertilizer and Fauji Fertilizer Company are both members of the consortium that took over PIA (see the PIA entry). No military ownership link was identified in the documents checked.",
        },
      ],
    },
    {
      id: "fauji-fresh-n-freeze",
      name: "OPA! (Fauji Fresh n Freeze)",
      aliases: ["فوجی فریش این فریز", "opa", "opa frozen fries", "frozen fries", "french fries", "frozen vegetables", "frozen food"],
      category: "Food & Dairy",
      company: "Fauji Fresh n Freeze Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "wholly owned, via Fauji Fertilizer Company", stake: "100% held by FFC (itself 44.32% Fauji Foundation-owned, as at 30 June 2026)" },
      ],
      status: "verified",
      sources: [
        {
          label: "FFC corporate profile (sponsor page, ICAP/SAFA) — describes the 2013 acquisition",
          url: "https://icap.org.pk/safa/sponsor-ffc.php",
          accessedDate: "2026-09-26",
        },
        {
          label: "Fauji Foods' own exhibitor profile (Saudi Food Show), naming the Opa brand directly",
          url: "https://thesaudifoodshow.com/exhibitors/fauji-foods-limited",
          accessedDate: "2026-09-27",
        },
      ],
      primaryDate: "profile current as of access date; acquisition dated October 2013",
      notes: "FFC acquired 100% of Al-Hamd Foods Limited in October 2013 and renamed it Fauji Fresh n Freeze Limited. Retail brand identified in a follow-up check: frozen French fries, IQF fruits and vegetables are sold under the 'OPA!' brand — this is the name to look for on packaging, not the company name. IQF plant in Sahiwal.",
      alternatives: [
        {
          name: "K&N's",
          note: "A frozen-food brand, best known for chicken products, that also sells a broader frozen range. No military ownership link was identified in the documents checked.",
        },
        {
          name: "Dawn Foods",
          note: "A Pakistani frozen food manufacturer (Ready to Cook, Ready to Eat, Ready to Bake ranges). No military ownership link was identified in the documents checked.",
        },
      ],
    },
    {
      id: "mal-pakistan",
      name: "MAL Pakistan (Mobil lubricants)",
      aliases: ["mobil askari lubricants", "mobil pakistan", "موبل آسکری", "mobil", "engine oil", "motor oil", "lubricant"],
      category: "Energy & Fuel",
      company: "MAL Pakistan Limited",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "described as a wholly owned subsidiary of AWT in a credit-rating report", stake: "reported as 100% ('wholly owned'); the same report also gives about 99.98% for AWT and about 1.2% in three directors' names, which add up to more than 100% — exact stake not confirmed" },
      ],
      status: "lead",
      sources: [
        {
          label: "PACRA credit rating report on MAL Pakistan Limited, dated 5 August 2026 (a rating agency's report, not a share register)",
          url: "https://pacra.com/api/rating-report/MTYwNjY=",
          accessedDate: "2026-09-26",
        },
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: "5 August 2026 (PACRA report; not a share register)",
      notes: "Unverified lead: AWT's ownership is described as 'wholly owned' in PACRA's rating report (5 August 2026), and the company appears among AWT's projects in the Defence Minister's 2016 Senate reply (as reported by Daily Pakistan), but neither is a share register. PACRA's ownership section gives about 99.98% for AWT and about 1.2% split among three directors, which add up to more than 100%, so the exact stake is not confirmed. Originally a 1996 joint venture (30% AWT / 70% Mobil International Petroleum Corporation) named Mobil Askari Lubricants; AWT acquired the remaining shares in 2007 and renamed it MAL Pakistan Limited. Still sells under the Mobil brand via a licensing agreement with ExxonMobil — engine oils, greases, transmission oils, brake fluids.",
      alternatives: [
        {
          name: "Shell (Shell Helix / Shell Advance)",
          note: "A motor-oil brand sold in Pakistan under licence by Wafi Energy Pakistan: Shell plc sold its Pakistan business in 2024 and the local company is about 88% owned by Saudi Arabia's Wafi Energy. Not Pakistani-owned. No military ownership link was identified in the documents checked.",
        },
        {
          name: "ZIC (Hi-Tech Lubricants)",
          note: "Sold by Hi-Tech Lubricants, a Pakistan-listed company (the oil itself is made with South Korea's SK Lubricants). No military ownership link was identified in the documents checked.",
        },
      ],
    },
    {
      id: "askari-general-insurance",
      name: "Askari General Insurance (AGICO)",
      aliases: ["AGICO", "AGICL", "عسکری جنرل انشورنس"],
      category: "Insurance",
      company: "Askari General Insurance Company Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "direct controlling shareholder (since 28 Aug 2026), as reported", stake: "51%" },
        { entity: "army-welfare-trust", relation: "remaining minority holder (previously 60.23% before the transfer, as reported)", stake: "~9.23% (calculated: 60.23% minus 51%)" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — Askari General Insurance transfers majority stake to Fauji Foundation (1 September 2026; reports the company's PSX disclosure)",
          url: "https://en.dailypakistan.com.pk/01-Sep-2026/askari-general-insurance-transfers-majority-stake-to-fauji-foundation-in-major-restructuring",
          accessedDate: "2026-10-20",
        },
        {
          label: "Pakistan Today (Profit) — SECP approves Fauji Foundation's takeover of 51% in Askari General Insurance and Askari Life (24 July 2026)",
          url: "https://profit.pakistantoday.com.pk/2026/07/24/secp-approves-fauji-foundations-takeover-of-51percent-stake-in-askari-general-insurance-askari-life-assurance",
          accessedDate: "2026-10-20",
        },
        {
          label: "Business Recorder — Fauji Foundation acquires majority stake in Askari General Insurance",
          url: "https://www.brecorder.com/news/40437396/fauji-foundation-acquires-majority-stake-in-askari-general-insurance",
          accessedDate: "2026-09-26",
        },
        {
          label: "Askari General Insurance — 'Parent & Sister Concerns' page on its own website (still describes AWT as parent; does not mention the transfer)",
          url: "https://www.agico.com.pk/parent-sister-concerns.php",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: "28 August 2026 (as reported; the PSX filing itself has not been read)",
      notes: "Until 28 August 2026 this was an Army Welfare Trust company. News reports of the company's PSX disclosure (Daily Pakistan, 1 September 2026; Business Recorder) say AWT transferred 51,337,953 ordinary shares (51% of paid-up capital) to Fauji Foundation at carrying cost; they put AWT's holding at 60.23% before the transfer, which leaves about 9.23%. SECP approved the transfer on 23 July 2026 (Profit, 24 July 2026). Both organizations describe it as an internal restructuring between two military welfare trusts, not a commercial acquisition. Caution: AGICO's own 'Parent & Sister Concerns' web page still described AWT as the parent holding 59.18% when checked on 20 October 2026 and does not mention the transfer; its half-year report to 30 June 2026 calls the company a subsidiary of AWT. The PSX filing itself has not been read, so this stays an unverified lead until it is linked.",
      alternatives: [
        {
          name: "EFU General Insurance",
          note: "A general insurance company (established 1932). No military ownership link was identified in the documents checked.",
        },
        {
          name: "Jubilee General Insurance",
          note: "A general insurance company. No military ownership link was identified in the documents checked.",
        },
      ],
    },
    {
      id: "askari-life-assurance",
      name: "Askari Life Assurance",
      aliases: ["Askari Life", "عسکری لائف"],
      category: "Insurance",
      company: "Askari Life Assurance Company Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "direct controlling shareholder (since 28 Aug 2026), as reported", stake: "51%" },
        { entity: "army-welfare-trust", relation: "remaining minority holder (66.65% before the transfer, as reported)", stake: "~15.65% (calculated: 66.65% minus 51%)" },
      ],
      status: "lead",
      sources: [
        {
          label: "Digital Pakistan — Fauji Foundation becomes Askari General's 51% shareholder (reports the same restructuring completed at Askari Life, 76,587,727 shares, on 28 August)",
          url: "https://digitalpakistan.pk/fauji-foundation-becomes-askari-generals-51-shareholder/",
          accessedDate: "2026-10-20",
        },
        {
          label: "Pakistan Today (Profit) — SECP approves Fauji Foundation's takeover of 51% in Askari General Insurance and Askari Life (24 July 2026)",
          url: "https://profit.pakistantoday.com.pk/2026/07/24/secp-approves-fauji-foundations-takeover-of-51percent-stake-in-askari-general-insurance-askari-life-assurance",
          accessedDate: "2026-10-20",
        },
        {
          label: "ProPakistani — Fauji Foundation to take control of these 2 PSX-listed insurance companies (8 July 2026; AWT held 66.65%)",
          url: "https://propakistani.pk/2026/07/08/fauji-foundation-to-take-control-of-these-2-psx-listed-insurance-companies/",
          accessedDate: "2026-10-20",
        },
        {
          label: "Pakistan Today (Profit) — Fauji Foundation to acquire controlling stakes in Askari General, Askari Life from Army Welfare Trust (8 July 2026)",
          url: "https://profit.pakistantoday.com.pk/2026/07/08/fauji-foundation-to-acquire-controlling-stakes-in-askari-general-askari-life-from-army-welfare-trust",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "28 August 2026 (as reported); SECP approval 23 July 2026; the PSX filing itself has not been read",
      notes: "Formerly known as East West Life Assurance Company Limited. Until 28 August 2026 this was an Army Welfare Trust company: ProPakistani reported on 8 July 2026 that AWT held 66.65%. SECP approved the transfer of 51% to Fauji Foundation on 23 July 2026 (Profit, 24 July 2026), and Digital Pakistan reports that the transfer of 76,587,727 shares (51% of paid-up capital) took place on 28 August 2026, which would leave AWT with about 15.65% (calculated here as 66.65% minus 51%). Same restructuring as Askari General Insurance. These are news reports; the company's PSX filing has not been read, so this stays an unverified lead until it is linked.",
      alternatives: [
        {
          name: "EFU Life Assurance",
          note: "A life insurance company. No military ownership link was identified in the documents checked.",
        },
        {
          name: "Jubilee Life Insurance",
          note: "A life insurance company. No military ownership link was identified in the documents checked.",
        },
      ],
    },
    {
      id: "askari-guards",
      name: "Askari Guards",
      aliases: ["AGL", "Askari Guards Pvt Limited", "عسکری گارڈز", "security", "security guard", "guard company", "سیکیورٹی"],
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
      alternatives: [
        {
          name: "Pathfinder Group (Wackenhut Pakistan)",
          note: "Became a 100% Pakistani-owned company in 2012, when its chairman (a retired Army officer) bought out the multinational G4S's stake. Worth knowing: like most of Pakistan's private security industry, it's led by former military personnel — that's an industry-wide pattern, not evidence of foundation ownership. No welfare-foundation ownership was identified in the documents checked.",
        },
      ],
    },
    {
      id: "askari-aviation",
      name: "Askari Aviation",
      aliases: ["Askari Aviation Services", "AAS", "عسکری ایوی ایشن"],
      category: "Retail & Other",
      company: "Askari Aviation (Pvt) Limited",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "described as an AWT project/company by multiple secondary sources", stake: "not yet confirmed against a primary document" },
      ],
      status: "lead",
      sources: [
        {
          label: "Pakistan Today (Profit) — 'Askari Airline not to take off anytime soon,' describing Askari Aviation as an AWT project",
          url: "https://profit.pakistantoday.com.pk/2020/07/02/askari-airline-not-to-take-off-anytime-soon/",
          accessedDate: "2026-09-26",
        },
        {
          label: "Wikipedia — Army Welfare Trust, listing Askari Aviation among its unlisted companies",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: null,
      notes: "Founded 1995. Offers helicopter/fixed-wing charter (weddings, tourism, air ambulance), a CAA-approved flying academy, and is reportedly the only operator permitted to fly charter routes near Pakistan's northern border areas. Consistently described as AWT-owned by several independent secondary sources, but no primary document (AWT's own filing or official site page) confirming an exact stake was found — needs that before this can be marked verified.",
      alternatives: [],
      noAlternativeReason: "A very niche service (helicopter charter) most people never use — and Askari Aviation reportedly holds exclusive permission to fly some northern border routes, so a like-for-like alternative may not exist at all.",
    },
    {
      id: "shaheen-insurance",
      name: "Shaheen Insurance",
      aliases: ["SICL", "شاہین انشورنس"],
      category: "Insurance",
      company: "Shaheen Insurance Company Limited",
      ownershipChain: [
        { entity: "shaheen-foundation", relation: "major shareholder (exact percentage not disclosed in filings reviewed)", stake: "major shareholding" },
      ],
      status: "verified",
      sources: [
        {
          label: "Shaheen Insurance Company Limited — Quarterly Report, 30 September 2025 (company's own PSX filing)",
          url: "https://dps.psx.com.pk/download/document/264532.pdf",
          accessedDate: "2026-09-27",
        },
      ],
      primaryDate: "30 September 2025",
      notes: "The company's own PSX-filed reports state directly: 'Shaheen Insurance Company Ltd. (SICL) is a group company of Shaheen Foundation, PAF which owns major shareholding of the Company.' General insurance (motor, health, miscellaneous) plus Window Takaful. Exact percentage not given in the filings reviewed — recorded as 'major shareholding' rather than assumed to be a specific number.",
      alternatives: [
        {
          name: "EFU General Insurance",
          note: "A general insurance company (established 1932). No military ownership link was identified in the documents checked.",
        },
        {
          name: "Jubilee General Insurance",
          note: "A general insurance company. No military ownership link was identified in the documents checked.",
        },
      ],
    },
    {
      id: "fm100",
      name: "FM 100 (Islamabad)",
      aliases: ["Capital FM", "ایف ایم 100", "radio", "fm", "fm 100", "ریڈیو"],
      category: "Media",
      company: "Capital FM (Pvt) Limited",
      ownershipChain: [
        { entity: "shaheen-foundation", relation: "largest single shareholder, per SECP company records", stake: "25%" },
      ],
      status: "lead",
      sources: [
        {
          label: "Media Ownership Monitor Pakistan (Reporters Without Borders / Freedom Network), citing SECP company documents",
          url: "https://pakistan.mom-gmr.org/en/owners/individual-owners/detail/owner/owner/show/shaheen-foundation/",
          accessedDate: "2026-09-27",
        },
      ],
      primaryDate: "SECP company records as reported by Media Ownership Monitor Pakistan (2019); current SECP records not seen",
      notes: "Media Ownership Monitor Pakistan — a joint project of Reporters Without Borders and Freedom Network — reviewed SECP filings directly and found Shaheen Foundation holds 25% of Capital FM (Pvt) Ltd, the single largest shareholder, operating the FM 100 station in Islamabad. This is a 2019 secondary report of SECP records; the current SECP records have not been seen, so the stake may have changed.",
      alternatives: [],
      noAlternativeReason: "Ranking radio stations by 'quality' isn't the same kind of comparison as a product — other independent FM stations exist (City FM89, Hum FM, Radio1 FM91, among others) but haven't been researched to the same standard yet.",
    },
    {
      id: "bahria-estates",
      name: "Bahria Estates",
      aliases: ["بحریہ اسٹیٹس", "plot", "plots", "property", "housing", "پلاٹ"],
      category: "Real Estate",
      company: "Bahria Foundation (internal division)",
      ownershipChain: [
        { entity: "bahria-foundation", relation: "one of the Foundation's four internal business pillars — not a separately incorporated company with its own published shareholding", stake: "wholly internal" },
      ],
      status: "verified",
      sources: [
        {
          label: "Bahria Foundation's own official website — 'About Us,' listing its four pillars including Bahria Estates",
          url: "https://bahriafoundation.com/?page_id=5503",
          accessedDate: "2026-09-27",
        },
      ],
      primaryDate: "current as of access date",
      notes: "Real-estate and property development arm, run directly as one of Bahria Foundation's four pillars (alongside Commercial Businesses, Maritime Works, and Education & Training) rather than as a separate shareholding company. Not to be confused with Bahria Town, an unrelated private developer.",
      alternatives: [],
      noAlternativeReason: "Bahria Town (the obvious private, non-military alternative by name recognition) was considered and set aside — it has its own well-documented land-acquisition controversies, including Supreme Court findings against it, so recommending it as 'the good alternative' wouldn't meet this app's own bar. No other well-vetted nationwide option has been found yet.",
    },
    {
      id: "bss-and-s",
      name: "BSS&S (Bahria Security Services & Systems)",
      aliases: ["Bahria Security Services", "بحریہ سیکیورٹی سروسز", "guards", "security guard", "سیکیورٹی"],
      category: "Retail & Other",
      company: "Bahria Security Services & Systems",
      ownershipChain: [
        { entity: "bahria-foundation", relation: "commercial business unit of the Foundation (exact stake not applicable/published — an internal business, not a separate shareholding company)", stake: "internal business unit" },
      ],
      status: "verified",
      sources: [
        {
          label: "Bahria Foundation's own official website — Commercial Businesses page",
          url: "https://bahriafoundation.com/?page_id=5532",
          accessedDate: "2026-09-27",
        },
      ],
      primaryDate: "current as of access date",
      notes: "Established 1996. Security guarding and technical security services, licensed nationwide with offices in Islamabad, Karachi, Lahore, Multan, and Gwadar. ISO 9001:2015 and ISO 18788:2015 certified. A member of the All Pakistan Security Agencies Association.",
      alternatives: [
        {
          name: "Pathfinder Group (Wackenhut Pakistan)",
          note: "Became a 100% Pakistani-owned company in 2012, when its chairman (a retired Army officer) bought out the multinational G4S's stake. Worth knowing: like most of Pakistan's private security industry, it's led by former military personnel — that's an industry-wide pattern, not evidence of foundation ownership. No welfare-foundation ownership was identified in the documents checked.",
        },
      ],
    },
    {
      id: "dha-karachi",
      name: "DHA Karachi",
      aliases: ["Defence Housing Authority Karachi", "Pakistan Defence Officers Housing Authority", "ڈیفنس ہاؤسنگ اتھارٹی کراچی", "plot", "plots", "property", "housing society", "defence karachi", "پلاٹ"],
      category: "Real Estate",
      company: "Defence Housing Authority, Karachi",
      ownershipChain: [
        { entity: "ministry-of-defence-pakistan", relation: "created by Presidential Order No. 7 of 1980; Governing Body chaired by the Secretary, Ministry of Defence; Executive Board headed by the Corps Commander Karachi", stake: "government/military-administered statutory authority" },
      ],
      status: "verified",
      sources: [
        {
          label: "DHA Karachi's own official website — 'About DHA Karachi'",
          url: "https://www.dhakarachi.org/about-us/about-dha-karachi/",
          accessedDate: "2026-09-27",
        },
      ],
      primaryDate: "current as of access date",
      notes: "Originally a cooperative housing society formed by retired servicemen in the mid-1950s, taken over by the government in 1981 under President Zia-ul-Haq and placed under the Corps Commander Karachi. Spans about 8,797–8,852 acres with over 81,000 members. Not to be confused with Bahria Town, an unrelated private developer with no Navy or Army ownership.",
      alternatives: [],
      noAlternativeReason: "Bahria Town Karachi (the obvious private, non-military alternative by name recognition) was considered and set aside — it has its own well-documented land-acquisition controversies, including Supreme Court findings against it, so recommending it as 'the good alternative' wouldn't meet this app's own bar. No other well-vetted Karachi-specific option has been found yet.",
    },
    {
      id: "dha-lahore",
      name: "DHA Lahore",
      aliases: ["Defence Housing Authority Lahore", "ڈیفنس ہاؤسنگ اتھارٹی لاہور", "plot", "plots", "property", "housing society", "defence lahore", "پلاٹ"],
      category: "Real Estate",
      company: "Defence Housing Authority, Lahore",
      ownershipChain: [
        { entity: "ministry-of-defence-pakistan", relation: "created via the DHA (Lahore) Ordinance of 1999 and federalized under Chief Executive's Order No. 26 of 2002 (validated by Parliament in 2004); Governing Body chaired by the Secretary, Ministry of Defence, with Army officers on its Executive Board", stake: "government/military-administered statutory authority" },
      ],
      status: "verified",
      sources: [
        {
          label: "PILDAT (Pakistan Institute of Legislative Development and Transparency) — civil-military relations monitor, citing the DHA (Lahore) Ordinance 1999 and Chief Executive's Order No. 26 of 2002",
          url: "https://pildat.org/?p=8278",
          accessedDate: "2026-09-27",
        },
        {
          label: "DHA Lahore's own official website — 'About DHA' / history page",
          url: "https://dhalahore.org/?p=75551",
          accessedDate: "2026-09-27",
        },
      ],
      primaryDate: "current as of access date",
      notes: "Began in 1973 as the Civil and Defence Housing Society, became the Lahore Cantonment Co-Operative Housing Society in 1975, converted to DHA Lahore in 1999, and was federalized in 2002. The Supreme Court has scrutinized DHA Lahore's governance and its resistance to audits by the Auditor General of Pakistan (Suo Moto Case No. 12 of 2015) — a documented example of the accountability concerns this structure raises.",
      alternatives: [
        {
          name: "Lake City, Lahore",
          note: "A privately developed community on Raiwind Road, led by industrialist Gohar Ejaz's Lake City Holdings. Note: Lake City Holdings is also a member of the PIA Equity consortium (see the PIA entry). No military or government ownership was identified in the documents checked.",
        },
      ],
    },
    {
      id: "dha-islamabad",
      name: "DHA Islamabad–Rawalpindi",
      aliases: ["Defence Housing Authority Islamabad", "ڈیفنس ہاؤسنگ اتھارٹی اسلام آباد", "plot", "plots", "property", "housing society", "defence islamabad", "dha rawalpindi", "پلاٹ"],
      category: "Real Estate",
      company: "Defence Housing Authority, Islamabad–Rawalpindi",
      ownershipChain: [
        { entity: "ministry-of-defence-pakistan", relation: "created via Act No. XII of 2013, passed by Parliament and published in the Gazette of Pakistan on 19 March 2013; headed by a serving Pakistan Army brigadier under the Welfare and Rehabilitation Directorate", stake: "government/military-administered statutory authority" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Defence Housing Authority, Islamabad, citing the Gazette of Pakistan and Act No. XII of 2013",
          url: "https://en.wikipedia.org/wiki/Defence_Housing_Authority,_Islamabad",
          accessedDate: "2026-09-27",
        },
      ],
      primaryDate: null,
      notes: "The most recently established of the three major DHAs (1992 origin, formalized by federal Act in 2013). Recorded as a lead rather than verified because the specific Act citation hasn't yet been cross-checked against DHA Islamabad's own official site or the Gazette text directly — that check is still needed before this can be upgraded.",
      alternatives: [
        {
          name: "Eighteen, Islamabad",
          note: "A master-planned community in Islamabad developed as a joint venture by Ora Developers (Egyptian) and the Saif Group (Pakistani). No military or government ownership was identified in the documents checked.",
        },
      ],
    },
    {
      id: "pia",
      name: "Pakistan International Airlines (PIA)",
      aliases: ["piacl", "پاکستان انٹرنیشنل ائیرلائن", "airline", "flight", "pia"],
      category: "Transport",
      company: "Pakistan International Airlines Corporation Limited (PIACL)",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "indirect, via Fauji Fertilizer Company's holding in PIA Equity Limited (PIAEL), the special-purpose vehicle that took over PIA's management on 29 June 2026", stake: "FFC holds 33.99% of PIAEL (30 June 2026); FFC says this equals 22.6% of PIA, as PIAEL held 66.7% of PIA. FFC is itself 44.32% Fauji Foundation-owned" },
      ],
      status: "verified",
      sources: [
        {
          label: "Fauji Fertilizer Company — half-year report, six months ended 30 June 2026, note 4.1 (company's own PSX filing)",
          url: "https://dps.psx.com.pk/download/document/281738.pdf",
          accessedDate: "2026-10-20",
        },
        {
          label: "Dawn — 'Govt formally transfers management control of PIA to Arif Habib-led consortium' (29 June 2026)",
          url: "https://www.dawn.com/news/2011655/govt-formally-transfers-management-control-of-pia-to-arif-habib-led-consortium",
          accessedDate: "2026-10-20",
        },
        {
          label: "Business Recorder — analysis of the staged takeover, listing PIAEL's shareholders (15 May 2026)",
          url: "https://www.brecorder.com/news/amp/40421207",
          accessedDate: "2026-10-20",
        },
        {
          label: "Business Recorder — consortium stakes as stated by the AKD Group's founding chairman",
          url: "https://www.brecorder.com/news/40418683",
          accessedDate: "2026-10-20",
        },
        {
          label: "Business Recorder — 'New shareholder added: Fauji Fertilizer becomes part of PIA Equity Limited'",
          url: "https://www.brecorder.com/news/40419033/new-shareholder-added-fauji-fertilizer-becomes-part-of-pia-equity-limited",
          accessedDate: "2026-09-27",
        },
        {
          label: "Dawn editorial — 'PIA's privatisation,' on FFC's late entry into the winning consortium",
          url: "https://www.dawn.com/news/1963139",
          accessedDate: "2026-09-27",
        },
      ],
      primaryDate: "30 June 2026 (FFC half-year report); management handover 29 June 2026",
      notes: "An Arif Habib-led consortium won PIA's privatization auction in December 2025 (Rs135 billion for 75%). FFC joined the consortium after the auction. FFC's own half-year report (30 June 2026, note 10.1) records 169,950,000 PIA Equity Limited (PIAEL) shares issued to FFC, which is 33.99% of PIAEL's paid-up capital; the rest of FFC's payment (about Rs28.9 billion) is shown as an advance against shares not yet issued. Earlier reports gave 25% (Express Tribune, January 2026) and about 34% (FFC's Q1 2026 briefing; Business Recorder citing the AKD Group's founding chairman); Dawn's 30 June 2026 report printed 33.9% with a holder list that did not add up to 100%. FFC's directors' review says PIAEL held 66.7% of PIA at 30 June 2026 and that FFC's investment equals 22.6% of PIA; this differs from the 75% reported at the first closing and the sources do not explain the difference. Management control was formally transferred to the consortium on 29 June 2026 (Dawn). The government's remaining shares are due to transfer at a second closing within about 12 months (about Rs45 billion); reports differ on whether that step is already complete. Other PIAEL shareholders: Arif Habib Corporation and Fatima Fertilizer (reported 34.1% jointly), Lake City Holdings, AKD Group and The City School; none was described as military-linked in the sources reviewed. Fauji Foundation's indirect economic interest, calculated here from the figures above: 44.32% x 22.6% = about 10.0% of PIA today, or 44.32% x 33.99% = about 15.06% if PIAEL comes to hold 100% and FFC's share stays at 33.99%. This is a minority interest, not control, and it is not described here as ownership of the airline. Dawn's editorial noted that FFC joined after the auction closed.",
      alternatives: [
        {
          name: "Airblue",
          note: "A private Pakistani airline (Airblue). It was itself a bidder in the same PIA privatization auction before withdrawing. No military or government ownership was identified in the documents checked. (SereneAir was considered and left off: its owners are not publicly disclosed and its chief executive is a retired Air Vice Marshal, so a 'no military link' statement could not be checked.)",
        },
      ],
    },
    {
      id: "opa-pasta",
      name: "Opa Pasta (Fauji Foods)",
      aliases: ["opa pasta", "pasta", "macaroni", "spaghetti", "penne", "elbow", "اوپا پاستا", "پاستا"],
      category: "Food & Dairy",
      company: "Fauji Foods Limited",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "indirect, via Fauji Fertilizer Company, the direct parent of Fauji Foods Limited (FFC is itself 44.32% Fauji Foundation-owned, as at 30 June 2026)", stake: "47.84% of Fauji Foods held directly by FFC" },
        { entity: "fauji-foundation", relation: "direct shareholder in Fauji Foods Limited", stake: "2.67% (67,371,916 shares)" },
      ],
      status: "verified",
      sources: [
        {
          label: "Fauji Foods Limited — 'Opa Pasta' brand page on the company's own website (lists it among its brands)",
          url: "https://www.faujifoods.com/brands/opa-pasta",
          accessedDate: "2026-10-20",
        },
        {
          label: "Fauji Foods Limited — Annual Report 2025, note 5.2.1, shares held by associated undertakings at 31 December 2025 (company's own report, page 78)",
          url: "https://www.faujifoods.com/pdf/financialResults/fauji-foods-annual-report-2025.pdf",
          accessedDate: "2026-10-20",
        },
        {
          label: "Fauji Fertilizer Company — half-year report, six months ended 30 June 2026, note 4.1 (company's own PSX filing)",
          url: "https://dps.psx.com.pk/download/document/281738.pdf",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: "31 December 2025 (Fauji Foods Annual Report 2025); FFC's own holding as at 30 June 2026",
      notes: "Opa Pasta is listed as one of Fauji Foods Limited's own brands on the company's website (pasta shapes: penne, large and small elbow, shell, spiral). The frozen-food range sold as 'OPA!' is listed separately on this site under Fauji Fresh n Freeze Limited. The ownership chain is the same as Nurpur (see that entry for the full Fauji Foods shareholder list).",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "army-welfare-sugar-mills",
      name: "Army Welfare Sugar Mills (Badin)",
      aliases: ["sugar", "chini", "cheeni", "awt sugar", "badin", "چینی", "شوگر"],
      category: "Food & Dairy",
      company: "Army Welfare Sugar Mills (Badin)",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as a AWT business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Army Welfare Trust (AWT) in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Army Welfare Sugar Mills, Badin\"). Wikipedia (secondary) says the Badin mill was established in 1984. No retail brand name was identified. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "askari-shoes",
      name: "Askari Shoes",
      aliases: ["shoes", "footwear", "joota", "boots", "جوتے", "عسکری شوز"],
      category: "Retail & Other",
      company: "Askari Shoes",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as a AWT business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Army Welfare Trust (AWT) in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Askari Project (shoe and woollen), Lahore\"). Wikipedia (secondary) says the Lahore shoe factory was founded in 1990. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "askari-woollen-mills",
      name: "Askari Woollen Mills",
      aliases: ["woollen", "woolen", "wool", "blanket", "sweater", "عسکری وولن"],
      category: "Retail & Other",
      company: "Askari Woollen Mills",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as a AWT business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Army Welfare Trust (AWT) in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Askari Project (shoe and woollen), Lahore\"). The Senate list names one combined shoe and woollen project in Lahore; Wikipedia (secondary) lists Askari Woolen Mills separately. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "askari-apparel",
      name: "Askari Apparel",
      aliases: ["apparel", "clothing", "garments", "uniform", "کپڑے", "عسکری ایپیرل"],
      category: "Retail & Other",
      company: "Askari Apparel",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as a AWT business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Army Welfare Trust (AWT) in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Askari Apparel, Lahore\"). Wikipedia (secondary) says it was established in 2014. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "askari-seeds",
      name: "Askari Seeds",
      aliases: ["seeds", "seed", "beej", "bij", "askari farms and seeds", "بیج"],
      category: "Retail & Other",
      company: "Askari Seeds",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as a AWT business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Army Welfare Trust (AWT) in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Askari Seeds, Okara\"). Wikipedia (secondary) says it was founded in 2004 with factories in Lahore, Okara and Sukkur. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "askari-fuels",
      name: "Askari Fuels (CNG)",
      aliases: ["cng", "askari cng", "fuel", "petrol pump", "gas station", "سی این جی"],
      category: "Energy & Fuel",
      company: "Askari Fuels (CNG)",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as a AWT business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Army Welfare Trust (AWT) in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Askari Fuels (CNG) with HO in Rawalpindi\"). Wikipedia (secondary) says it began as Askari CNG in 2002 and was renamed Askari Fuels in May 2014. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "blue-lagoon",
      name: "Blue Lagoon restaurants (Army Welfare Mess)",
      aliases: ["blue lagoon", "restaurant", "askari lagoon", "mess", "ریسٹورنٹ", "بلیو لگون"],
      category: "Retail & Other",
      company: "Blue Lagoon restaurants (Army Welfare Mess)",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as a AWT business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Army Welfare Trust (AWT) in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Army Welfare Mess and Blue Lagoon Restaurant, Rawalpindi; Askari Lagoon, Faisalabad\"). Wikipedia (secondary) says the Rawalpindi restaurant launched in 1990 and a Faisalabad branch opened in 2015. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "askari-enterprises",
      name: "Askari Enterprises",
      aliases: ["enterprises", "trading", "rice", "commodity", "عسکری انٹرپرائزز"],
      category: "Retail & Other",
      company: "Askari Enterprises",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as a AWT business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Army Welfare Trust (AWT) in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Askari Enterprises, Rawalpindi\"). No consumer brand name was identified. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "fauji-security-services",
      name: "Fauji Security Services",
      aliases: ["security", "guards", "fauji security", "سیکیورٹی"],
      category: "Retail & Other",
      company: "Fauji Security Services",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as a AWT business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Army Welfare Trust (AWT) in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Fauji Security Services (acquired from Fauji Foundation), HO in Rawalpindi\"). The Senate list shows it under AWT, noting it was acquired from Fauji Foundation. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "askari-housing",
      name: "Askari Housing Schemes",
      aliases: ["housing", "askari housing", "askari 11", "plots", "sangjani", "badaber", "ہاؤسنگ"],
      category: "Real Estate",
      company: "Askari Housing Schemes",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as a AWT business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Army Welfare Trust (AWT) in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Real estate comprising three small housing schemes in Lahore, Badaber and Sangjani\"). Wikipedia (secondary) says these schemes launched in 1991. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "awt-rice-mills",
      name: "AWT Rice Mills",
      aliases: ["rice", "chawal", "rice mill", "چاول"],
      category: "Food & Dairy",
      company: "AWT Rice Mills",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as an AWT business on Wikipedia (a secondary source)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed on Wikipedia's Army Welfare Trust page (a secondary source) as an AWT business. Wikipedia lists an AWT Rice Mill (Rakh Baikunth) and an Askari Welfare Rice Mill; it does not say whether either still operates. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "askari-fish-farm",
      name: "Askari Fish Farm",
      aliases: ["fish", "machli", "fish farm", "مچھلی"],
      category: "Food & Dairy",
      company: "Askari Fish Farm",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as an AWT business on Wikipedia (a secondary source)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed on Wikipedia's Army Welfare Trust page (a secondary source) as an AWT business. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "jolidays",
      name: "Jolidays (AWT Tourism)",
      aliases: ["tourism", "tours", "holiday", "jolidays", "ٹورازم"],
      category: "Transport",
      company: "Jolidays (AWT Tourism)",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as an AWT business on Wikipedia (a secondary source)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed on Wikipedia's Army Welfare Trust page (a secondary source) as an AWT business. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "askari-airport-services",
      name: "Askari Airport Services",
      aliases: ["airport services", "ground handling", "ایئرپورٹ"],
      category: "Transport",
      company: "Askari Airport Services",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as an AWT business on Wikipedia (a secondary source)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed on Wikipedia's Army Welfare Trust page (a secondary source) as an AWT business. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "askari-flying-academy",
      name: "Askari Flying Academy",
      aliases: ["flying academy", "pilot training", "aviation academy", "فلائنگ"],
      category: "Transport",
      company: "Askari Flying Academy",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as an AWT business on Wikipedia (a secondary source)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed on Wikipedia's Army Welfare Trust page (a secondary source) as an AWT business. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "askari-travels",
      name: "Askari Travels & Tours",
      aliases: ["travel agency", "tickets", "askari travels", "ٹریول"],
      category: "Transport",
      company: "Askari Travels & Tours",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as an AWT business on Wikipedia (a secondary source)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed on Wikipedia's Army Welfare Trust page (a secondary source) as an AWT business. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "medask",
      name: "MEDASK",
      aliases: ["medask", "medical", "hospital", "healthcare", "clinic", "طبی"],
      category: "Retail & Other",
      company: "MEDASK",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as an AWT business on Wikipedia (a secondary source)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed on Wikipedia's Army Welfare Trust page (a secondary source) as an AWT business. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "awt-investments",
      name: "AWT Investments",
      aliases: ["awt investments", "investment company", "pak brunei", "سرمایہ کاری"],
      category: "Banking & Finance",
      company: "AWT Investments",
      ownershipChain: [
        { entity: "army-welfare-trust", relation: "listed as an AWT business on Wikipedia (a secondary source)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Wikipedia — Army Welfare Trust (secondary source listing AWT businesses)",
          url: "https://en.wikipedia.org/wiki/Army_Welfare_Trust",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed on Wikipedia's Army Welfare Trust page (a secondary source) as an AWT business. Wikipedia (secondary) says it was founded in 2017 as a joint venture with Pak Brunei Investment Company. Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "noon-pakistan",
      name: "Noon Pakistan",
      aliases: ["noon", "noon milk", "dairy", "milk", "doodh", "نون", "دودھ"],
      category: "Food & Dairy",
      company: "Noon Pakistan",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "listed as a Fauji Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Fauji Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Noon Pakistan Ltd Lahore\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "fauji-meat",
      name: "Fauji Meat",
      aliases: ["meat", "gosht", "beef", "mutton", "fauji meat", "گوشت"],
      category: "Food & Dairy",
      company: "Fauji Meat",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "listed as a Fauji Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Fauji Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Fauji Meat Ltd\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "foundation-gas",
      name: "Foundation Gas",
      aliases: ["lpg", "gas", "cylinder", "foundation gas", "گیس"],
      category: "Energy & Fuel",
      company: "Foundation Gas",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "listed as a Fauji Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Fauji Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Foundation Gas\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "fauji-kabirwala-power",
      name: "Fauji Kabirwala Power Company",
      aliases: ["power", "electricity", "bijli", "fkpcl", "kabirwala", "بجلی"],
      category: "Energy & Fuel",
      company: "Fauji Kabirwala Power Company",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "listed as a Fauji Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Fauji Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Fauji Kabirwala Power Company Ltd\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "foundation-power-daharki",
      name: "Foundation Power Company (Daharki)",
      aliases: ["power", "electricity", "daharki", "dharki", "bijli", "بجلی"],
      category: "Energy & Fuel",
      company: "Foundation Power Company (Daharki)",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "listed as a Fauji Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Fauji Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Foundation Power Co (Dharki) Ltd\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "foundation-wind-energy",
      name: "Foundation Wind Energy",
      aliases: ["wind", "wind power", "electricity", "ہوا", "بجلی"],
      category: "Energy & Fuel",
      company: "Foundation Wind Energy",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "listed as a Fauji Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Fauji Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Foundation Wind Energy (I and II) Ltd\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "fauji-oil-terminal",
      name: "Fauji Oil Terminal & Distribution Company (FOTCO)",
      aliases: ["fotco", "oil terminal", "fuel terminal", "karachi port", "ٹرمینل"],
      category: "Energy & Fuel",
      company: "Fauji Oil Terminal & Distribution Company (FOTCO)",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "listed as a Fauji Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Fauji Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Fauji Oil Terminal and Distillery Co Ltd\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "shaheen-knitwear",
      name: "Shaheen Knitwear",
      aliases: ["knitwear", "garments", "clothes", "shaheen knitwear", "کپڑے"],
      category: "Retail & Other",
      company: "Shaheen Knitwear",
      ownershipChain: [
        { entity: "shaheen-foundation", relation: "listed as a Shaheen Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Shaheen Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Shaheen Knitwear\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "hawk-advertising",
      name: "Hawk Advertising",
      aliases: ["advertising", "ads", "billboard", "hawk", "اشتہار"],
      category: "Media",
      company: "Hawk Advertising",
      ownershipChain: [
        { entity: "shaheen-foundation", relation: "listed as a Shaheen Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Shaheen Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Hawk Advertising\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "shaheen-airport-services",
      name: "Shaheen Airport Services",
      aliases: ["airport services", "ground handling", "saps", "ایئرپورٹ"],
      category: "Transport",
      company: "Shaheen Airport Services",
      ownershipChain: [
        { entity: "shaheen-foundation", relation: "listed as a Shaheen Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Shaheen Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Shaheen Airport Services\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "shaheen-aerotraders",
      name: "Shaheen Aerotraders",
      aliases: ["aerotraders", "aviation trading", "ایرو"],
      category: "Transport",
      company: "Shaheen Aerotraders",
      ownershipChain: [
        { entity: "shaheen-foundation", relation: "listed as a Shaheen Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Shaheen Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Shaheen Aerotraders\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "shaheen-medical-services",
      name: "Shaheen Medical Services",
      aliases: ["medical", "hospital", "clinic", "healthcare", "طبی"],
      category: "Retail & Other",
      company: "Shaheen Medical Services",
      ownershipChain: [
        { entity: "shaheen-foundation", relation: "listed as a Shaheen Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Shaheen Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Shaheen Medical Services\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "fazaia-schools",
      name: "Fazaia Welfare Education School System",
      aliases: ["school", "schools", "fazaia", "education", "فضائیہ", "سکول"],
      category: "Retail & Other",
      company: "Fazaia Welfare Education School System",
      ownershipChain: [
        { entity: "shaheen-foundation", relation: "listed as a Shaheen Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Shaheen Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Fazaia Welfare Education School System\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "saps-aviation-college",
      name: "SAPS Aviation College",
      aliases: ["college", "aviation college", "saps", "aviation", "کالج"],
      category: "Retail & Other",
      company: "SAPS Aviation College",
      ownershipChain: [
        { entity: "shaheen-foundation", relation: "listed as a Shaheen Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Shaheen Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"SAPS Aviation College\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "air-eagle-aviation-academy",
      name: "Air Eagle Aviation Academy",
      aliases: ["academy", "aviation academy", "air eagle", "اکیڈمی"],
      category: "Retail & Other",
      company: "Air Eagle Aviation Academy",
      ownershipChain: [
        { entity: "shaheen-foundation", relation: "listed as a Shaheen Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Shaheen Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Air Eagle Aviation Academy\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "shaheen-housing-peshawar",
      name: "Shaheen Welfare Housing Scheme (Peshawar)",
      aliases: ["housing", "plots", "peshawar", "shaheen housing", "ہاؤسنگ", "پشاور"],
      category: "Real Estate",
      company: "Shaheen Welfare Housing Scheme (Peshawar)",
      ownershipChain: [
        { entity: "shaheen-foundation", relation: "listed as a Shaheen Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Shaheen Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Shaheen Welfare Housing Scheme, Peshawar\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
    {
      id: "shaheen-complexes",
      name: "Shaheen Complexes (Karachi and Lahore)",
      aliases: ["complex", "shaheen complex", "office", "commercial", "کمپلیکس"],
      category: "Real Estate",
      company: "Shaheen Complexes (Karachi and Lahore)",
      ownershipChain: [
        { entity: "shaheen-foundation", relation: "listed as a Shaheen Foundation business in the Defence Minister's 2016 written reply to the Senate (as reported)", stake: "not stated — no ownership percentage found" },
      ],
      status: "lead",
      sources: [
        {
          label: "Daily Pakistan — 'List of businesses run by the army presented to the Senate' (21 July 2016; reports the Defence Minister's written reply to the Senate)",
          url: "https://en.dailypakistan.com.pk/21-Jul-2016/list-of-businesses-run-by-the-army-presented-to-the-senate",
          accessedDate: "2026-10-20",
        },
      ],
      primaryDate: null,
      notes: "Listed under Shaheen Foundation in a written reply the Defence Minister gave the Senate, as reported by Daily Pakistan on 21 July 2016 (listed as: \"Shaheen Complex, Karachi; Shaheen Complex, Lahore\"). Current ownership, legal structure, stake and whether it is still operating have not been confirmed. Treat as an unverified lead until a primary document (company report, SECP or PSX filing, or the organization's own website) is found.",
      alternatives: [],
      noAlternativeReason: "Alternatives haven't been researched to this site's standard yet — flagged for a future pass rather than guessed at.",
    },
  ],
};
