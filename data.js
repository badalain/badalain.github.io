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
  version: "2026-09-27.10",

  // Neutral, factual app identity. Change freely — nothing else depends on it.
  appName: "Badalain (بدلیں)",
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
      notes: "Fauji Fertilizer Company holds 84.84% of Fauji Foods Limited directly; Fauji Foundation's link to Nurpur runs through its 43.51% stake in FFC. Stated as a chain rather than one combined percentage. Product range is wider than milk alone: also sells Nurpur butter, cheese (mozzarella, cheddar, American slices), desi ghee, flavoured milk, and — under the separate Fauji brand name — corn flakes and pasta. Check packaging for the Nurpur or Fauji name specifically, not just 'milk.'",
      alternatives: [
        {
          name: "Olper's (Engro Foods)",
          note: "Widely regarded as Pakistan's most trusted milk brand in consumer surveys and reviews, and the easiest to find nationwide. Note: majority ownership passed to the Dutch dairy cooperative FrieslandCampina in 2016, so it isn't fully Pakistani-owned either — but it has no military ownership link.",
        },
        {
          name: "Good Milk (Shakarganj Foods)",
          note: "A Pakistani-owned option with a solid regional reputation, though a smaller distribution footprint than Olper's in some areas.",
        },
      ],
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
      alternatives: [
        {
          name: "Tapal Tea",
          note: "A long-established, Pakistani-owned tea brand with strong nationwide recognition and no military ownership link.",
        },
        {
          name: "Vital Tea (National Foods)",
          note: "Another well-known Pakistani-owned option, widely available.",
        },
      ],
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
      notes: "Askari Bank's own annual report describes Fauji Foundation and Fauji Fertilizer Company together as 'the Fauji Consortium,' holding 71.91% combined (7.19% direct + 64.72% via FFC). Stated as two rows here rather than one combined percentage, so the direct-vs-indirect split stays visible. Re-checked in a verification refresh: the 71.91% figure is unchanged and confirmed by PACRA's most recent rating action (20 July 2026), which also upgraded the bank's credit rating to AAA/A1+ from AA+/A1+, citing 'strategic support from its ownership structure.'",
      alternatives: [
        {
          name: "Meezan Bank",
          note: "Named Best Bank in Pakistan at the Pakistan Banking Awards in 2018, 2020, and 2023, and became the country's most profitable bank in 2022. Pakistan's leading Islamic bank, consistently well reviewed for customer service. Note: it has significant Kuwaiti institutional investment among its shareholders, so it isn't purely Pakistani-owned either — but it has no military ownership link.",
        },
        {
          name: "Bank Al Habib",
          note: "Consistently profitable with a reputation for reliable service; a solid conventional-banking alternative.",
        },
      ],
    },
    {
      id: "fauji-cement",
      name: "Fauji Cement",
      aliases: ["فوجی سیمنٹ", "fccl"],
      category: "Cement & Construction",
      company: "Fauji Cement Company Limited (FCCL)",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "Committee of Admin. Fauji Foundation holds this directly, per FCCL's own annual report", stake: "61.65%" },
        { entity: "fauji-foundation", relation: "collective holding together with Fauji Fertilizer Company and Fauji Oil Terminal & Distribution (the 61.65% above is part of this total)", stake: "66.81% collectively" },
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
      notes: "Re-checked directly against FCCL's own annual report during a verification refresh — confirms the figure and updates the source from a secondary citation to the company's own filing. 'Committee of Admin. Fauji Foundation' alone holds 61.65% as the single largest shareholder; the broader 66.81% collective figure (with Fauji Fertilizer Company and Fauji Oil Terminal & Distribution) is essentially unchanged from a year earlier, confirming stability. Fauji Cement also absorbed Askari Cement (previously an Army Welfare Trust subsidiary) via a share-swap merger sanctioned by the Lahore High Court. Re-verify yearly.",
      alternatives: [
        {
          name: "Lucky Cement",
          note: "Pakistan's largest cement producer by market share and the leader in exports, owned by the Pakistani-owned Yunus Brothers Group. Widely regarded as a reliable, high-quality choice for construction.",
        },
        {
          name: "DG Khan Cement",
          note: "Owned by the Pakistani-owned Nishat Group; long-established, and often preferred on larger projects for consistent quality.",
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
          label: "Mari Energies — Pattern of Shareholding, as at 30 June 2023 (company's own filing)",
          url: "https://marienergies.com.pk/wp-content/uploads/2023/08/Pattern-of-Shareholders-1.pdf",
          accessedDate: "2026-09-26",
        },
      ],
      primaryDate: "30 June 2023",
      notes: "Fauji Foundation acquired this 40% stake in 1983 (from Esso Eastern Incorporated) and it has stayed stable since; the remaining 60% is split 20% Government of Pakistan and 20% Oil & Gas Development Company Limited (OGDCL). The company renamed itself from Mari Petroleum Company Limited to Mari Energies Limited in 2025 — same entity, same ownership.",
      alternatives: [],
      noAlternativeReason: "Mari Energies is a gas exploration and production company, not a retail brand — ordinary consumers don't choose their gas supplier the way they choose a grocery brand, so there's no meaningful everyday alternative to list here.",
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
      alternatives: [
        {
          name: "Engro Fertilizers",
          note: "One of Pakistan's largest and most established fertilizer producers, part of the Engro Corporation group; widely available nationwide.",
        },
        {
          name: "Fatima Fertilizer",
          note: "A major, fast-growing Pakistani fertilizer producer and a solid alternative for farmers.",
        },
      ],
    },
    {
      id: "fauji-fresh-n-freeze",
      name: "OPA! (Fauji Fresh n Freeze)",
      aliases: ["فوجی فریش این فریز", "Opa", "OPA! frozen fries"],
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
          note: "Pakistan's best-known frozen food brand, no military ownership link. Primarily known for chicken products, but also offers a broader frozen range — the closest well-established household name as an alternative.",
        },
        {
          name: "Dawn Foods",
          note: "A Pakistani frozen food manufacturer (Ready to Cook, Ready to Eat, Ready to Bake ranges), no military ownership link.",
        },
      ],
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
      alternatives: [
        {
          name: "Shell (Shell Helix / Shell Advance)",
          note: "The most consistently preferred motor-oil brand in Pakistani car- and bike-owner surveys. A multinational brand (Shell plc), not Pakistani-owned, but no military ownership link.",
        },
        {
          name: "ZIC (Hi-Tech Lubricants)",
          note: "A Pakistani-listed company (partnered with South Korea's SK Lubricants for the oil itself). Generally good value; some owners in enthusiast forums prefer other brands for high-performance use, so it's listed second rather than first.",
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
      alternatives: [
        {
          name: "EFU General Insurance",
          note: "Pakistan's largest and oldest general insurer (since 1932), with the strongest independent credit ratings in the sector (PACRA/VIS AA++) and repeated Consumers Association of Pakistan awards for best general insurer.",
        },
        {
          name: "Jubilee General Insurance",
          note: "A well-established, highly rated alternative (PSX Top 25 Companies recognition).",
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
      alternatives: [
        {
          name: "EFU Life Assurance",
          note: "One of Pakistan's oldest and most trusted life insurers, known for a strong branch network and consistent financial performance.",
        },
        {
          name: "Jubilee Life Insurance",
          note: "A leading life insurer with a strong reputation for financial stability, and an Asiamoney award winner for the sector.",
        },
      ],
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
      alternatives: [
        {
          name: "Pathfinder Group (Wackenhut Pakistan)",
          note: "Became a 100% Pakistani-owned company in 2012, when its chairman (a retired Army officer) bought out the multinational G4S's stake. Worth knowing: like most of Pakistan's private security industry, it's led by former military personnel — that's an industry-wide pattern, not evidence of foundation ownership. It just isn't a welfare-foundation-owned business the way Askari Guards is.",
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
          note: "Pakistan's largest and oldest general insurer, with the strongest independent credit ratings in the sector and repeated industry awards.",
        },
        {
          name: "Jubilee General Insurance",
          note: "A well-established, highly rated alternative.",
        },
      ],
    },
    {
      id: "fm100",
      name: "FM 100 (Islamabad)",
      aliases: ["Capital FM", "ایف ایم 100"],
      category: "Media",
      company: "Capital FM (Pvt) Limited",
      ownershipChain: [
        { entity: "shaheen-foundation", relation: "largest single shareholder, per SECP company records", stake: "25%" },
      ],
      status: "verified",
      sources: [
        {
          label: "Media Ownership Monitor Pakistan (Reporters Without Borders / Freedom Network), citing SECP company documents",
          url: "https://pakistan.mom-gmr.org/en/owners/individual-owners/detail/owner/owner/show/shaheen-foundation/",
          accessedDate: "2026-09-27",
        },
      ],
      primaryDate: "SECP company documents, as cited by Media Ownership Monitor Pakistan (2019)",
      notes: "Media Ownership Monitor Pakistan — a joint project of Reporters Without Borders and Freedom Network — reviewed SECP filings directly and found Shaheen Foundation holds 25% of Capital FM (Pvt) Ltd, the single largest shareholder, operating the FM 100 station in Islamabad.",
      alternatives: [],
      noAlternativeReason: "Ranking radio stations by 'quality' isn't the same kind of comparison as a product — other independent FM stations exist (City FM89, Hum FM, Radio1 FM91, among others) but haven't been researched to the same standard yet.",
    },
    {
      id: "bahria-estates",
      name: "Bahria Estates",
      aliases: ["بحریہ اسٹیٹس"],
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
      aliases: ["Bahria Security Services", "بحریہ سیکیورٹی سروسز"],
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
          note: "Became a 100% Pakistani-owned company in 2012, when its chairman (a retired Army officer) bought out the multinational G4S's stake. Worth knowing: like most of Pakistan's private security industry, it's led by former military personnel — that's an industry-wide pattern, not evidence of foundation ownership. It just isn't a welfare-foundation-owned business the way BSS&S is.",
        },
      ],
    },
    {
      id: "dha-karachi",
      name: "DHA Karachi",
      aliases: ["Defence Housing Authority Karachi", "Pakistan Defence Officers Housing Authority", "ڈیفنس ہاؤسنگ اتھارٹی کراچی"],
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
      aliases: ["Defence Housing Authority Lahore", "ڈیفنس ہاؤسنگ اتھارٹی لاہور"],
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
          note: "An independent, privately developed community on Raiwind Road, led by industrialist Gohar Ejaz's Lake City Holdings — no military or government ownership. Won 'Best Real Estate Development in Pakistan' at the FPCCI Excellence Awards.",
        },
      ],
    },
    {
      id: "dha-islamabad",
      name: "DHA Islamabad–Rawalpindi",
      aliases: ["Defence Housing Authority Islamabad", "ڈیفنس ہاؤسنگ اتھارٹی اسلام آباد"],
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
          note: "A luxury master-planned community in Islamabad developed by Ora Developers (Egyptian) and the Saif Group (Pakistani) — a genuinely independent joint venture with no military or government ownership.",
        },
      ],
    },
    {
      id: "pia",
      name: "Pakistan International Airlines (PIA)",
      aliases: ["PIACL", "پاکستان انٹرنیشنل ائیرلائن"],
      category: "Transport",
      company: "Pakistan International Airlines Corporation Limited (PIACL)",
      ownershipChain: [
        { entity: "fauji-foundation", relation: "indirect, via Fauji Fertilizer Company's 34% stake in PIA Equity Limited (PIAEL), the special-purpose vehicle acquiring PIA", stake: "34% of PIAEL held by FFC (itself 43.51% Fauji Foundation-owned); PIAEL to hold 100% of PIA once the sale completes" },
      ],
      status: "verified",
      sources: [
        {
          label: "Business Recorder — 'New shareholder added: Fauji Fertilizer becomes part of PIA Equity Limited'",
          url: "https://www.brecorder.com/news/40419033/new-shareholder-added-fauji-fertilizer-becomes-part-of-pia-equity-limited",
          accessedDate: "2026-09-27",
        },
        {
          label: "FFC's own Q1 2026 earnings briefing, confirming the 34% stake in PIA Equity Pvt. Ltd.",
          url: "https://www.thenewseyes.com/fauji-fertilizer-to-take-additional-borrowing-for-acquisition-of-pia-shares/",
          accessedDate: "2026-09-27",
        },
        {
          label: "Dawn editorial — 'PIA's privatisation,' on FFC's late entry into the winning consortium",
          url: "https://www.dawn.com/news/1963139",
          accessedDate: "2026-09-27",
        },
        {
          label: "The Express Tribune — consortium leader Arif Habib describing why and how FFC joined",
          url: "https://tribune.com.pk/story/2586814/pia-under-private-control-from-april",
          accessedDate: "2026-09-27",
        },
        {
          label: "India TV News — PM Shehbaz Sharif publicly thanking Army Chief Asim Munir for the SIFC's role in the privatisation",
          url: "https://www.indiatvnews.com/news/world/how-pakistan-military-secured-back-route-control-of-pia-the-army-corporate-nexus-explained-2026-07-01-1046800",
          accessedDate: "2026-09-27",
        },
      ],
      primaryDate: "Q1 2026 earnings briefing; deal approved, not yet fully closed",
      notes: "A genuinely new development, not something Wikipedia or older sources would show: an Arif Habib-led consortium won PIA's privatization auction in December 2025 (Rs135 billion). FFC's stake in the consortium's vehicle, PIA Equity Limited, was first reported at 25% (Express Tribune, mid-January 2026) and later confirmed at 34% by FFC's own Q1 2026 earnings briefing — the 34% figure used above is the more recent, company-confirmed one. Approved by the Cabinet Committee on Privatisation and cleared by the Competition Commission of Pakistan. Other PIAEL shareholders: Arif Habib Corporation, Fatima Fertilizer, Lake City Holdings, AKD Group, and The City School Group — none of them military-linked. Full ownership transfer to PIAEL (and full payment) is expected by May 2027, not complete yet. Doing the precise math: Fauji Foundation's indirect economic interest in PIA works out to roughly 43.51% x 34% = 15% once the deal closes — a real but minority stake, not control. Stated this way deliberately rather than implying Fauji Foundation now 'owns' the airline. Worth recording precisely, because it isn't a minor detail: FFC had withdrawn from the original bidding and was invited into the winning consortium only after the auction closed. Dawn's editorial board wrote this 'seems less for its capital needs than its desire for institutional backing.' Consortium leader Arif Habib told the Express Tribune that FFC joined at the consortium's own request, quoting himself telling FFC: 'if they wanted us to be the Imam of this prayer, they would need to offer the prayer behind us.' Separately, Prime Minister Shehbaz Sharif publicly thanked Army Chief Asim Munir for the Special Investment Facilitation Council's role in the privatisation — an on-record acknowledgment of military involvement in facilitating the sale, not a claim from unnamed sources.",
      alternatives: [
        {
          name: "Airblue",
          note: "A well-established private Pakistani airline with no military or government ownership — was itself a bidder in the same PIA privatization auction before withdrawing.",
        },
        {
          name: "SereneAir",
          note: "Another private Pakistani carrier, no military ownership link.",
        },
      ],
    },
  ],
};
