# Badalain — project notes

A plain HTML/CSS/JS site, no build step, no framework, no dependencies.
Open `index.html` directly in a browser to test it locally right now.

**This is a working skeleton, not something to publish yet.** Every entry
in `data.js` is currently a "lead" — found in a secondary source, not yet
confirmed against a primary document. See "Verification workflow" below
before adding real content or sharing a link with anyone.

## Files

- `index.html` — page structure
- `styles.css` — all styling (system fonts only, no downloads)
- `data.js` — the entire content database (English). Edit this to add/change entries.
- `ur.js` — the Urdu translation of the interface and of every entry
- `app.js` — search, filtering, view switching, the suggestion form
- `sw.js` — offline caching (service worker)
- `manifest.json` — lets the site be "added to home screen" like an app
- `icon-*.png` — the app icon (a swap symbol, our own design); replace with a
  real icon when you have one, same file names and sizes
- `robots.txt`, `sitemap.xml` — helps Google/Bing find and index the site,
  since there's no app store listing driving discovery

## What's in the app

- Search, category filters, and a "verified only" toggle
- Tap any parent organization (Fauji Foundation, Army Welfare Trust) in an
  entry's ownership section to see everything else linked to it
- A share button on each entry (uses the phone's native share sheet where
  available, otherwise copies text to the clipboard)
- Open Graph tags so links posted to WhatsApp/social media show a proper
  preview instead of a bare URL
- The full dataset is linked from the About page — nothing is hidden
- Brand cards show a colored initial letter, not a real logo or product
  photo. Deliberate: using a company's actual logo without permission is
  copyright/trademark infringement, which gives a hostile party a fast,
  clean way to get the GitHub repo taken down via a DMCA notice — a much
  easier route than any defamation or PECA claim. Don't add real images.
- The app icon (a swap/exchange symbol, our own original design) and a
  one-line install banner were added in a polish pass, since the site is
  now stable enough to show to outside people. The banner detects iOS vs.
  Android/Chrome vs. everything else and shows the right install method
  for each — a real "Install" button where the browser supports it,
  manual Share-sheet steps on iOS, and a generic fallback otherwise.

## How installing works (and why the Install button can disappear)

- The browser, not this site, decides when to offer "Install". Chrome on
  Android sends the site a signal when it is ready to install; the site keeps
  it so a real **Install** button can appear in the top banner and on the
  `#/install` page. After someone installs and then uninstalls, Chrome may
  not offer it again straight away — nothing on our side can force it.
- Firefox, Safari and most other browsers never send that signal. They need
  the written steps, which live on the `#/install` page (linked from the
  top banner, the About page and the footer, so it is always findable).
- The `#/install` page lists steps for Chrome, Samsung Internet, Firefox,
  Opera/UC Browser and iPhone Safari. Browser menus change; the Opera and
  UC Browser wording was NOT verified word for word, so that section points
  people to Chrome as a fallback. Re-check these steps every few months.
- "Dismissed" is remembered only on the person's own phone and expires
  after 30 days. Nothing about installing is sent anywhere.
- Pakistan mobile browser mix, StatCounter, August 2026: Chrome 76.9%,
  UC Browser 9.6%, Safari 7.1%, Opera 4.9%, Samsung Internet 0.8%,
  Firefox 0.3%. Opera Mini cannot keep the app for offline use.

## Languages: English and Urdu

- English is the reference version. Everything a person can read can also be
  shown in Urdu with the button at the top of every page (it flips the whole
  layout right-to-left). The choice is remembered only on that phone. If a
  phone is set to Urdu, the site opens in Urdu by default.
- All Urdu wording lives in ONE file, `ur.js`, loaded only when someone
  chooses Urdu (and saved for offline use). Brand and company names, source
  titles and the menu words people will see on their screen ("Install app",
  "Add to Home screen") deliberately stay in English. Numbers, percentages,
  dates and source links come from `data.js`, never re-typed in `ur.js`.
- Every entry page in Urdu carries a note that it is a translation and that
  the English text and the linked sources are the reference. Quotes are
  marked as translated from English — never presented as anyone's exact words.
- **The Urdu was written by an AI assistant and has NOT been checked by a
  professional translator.** Someone who reads Urdu natively must read
  `ur.js` (or click through the Urdu pages) before the site is shown widely.
  Highest-care items: the PIA entry, the DHA Lahore Supreme Court sentence,
  and every place a number or a legal term appears.
- Adding a language later (Sindhi, Pashto): copy the shape of `ur.js`, add a
  loader for it in `app.js`. Only do this with a native reviewer available.
- Search understands Urdu: it ignores vowel marks and treats the different
  keyboard spellings of the same letter (ي/ی, ك/ک, ه/ہ) as equal.

## Why the app can't get stuck on an old copy

GitHub Pages lets phones keep any file for up to 10 minutes and this cannot
be changed. A phone could therefore hold a NEW page with an OLD script — a
button that "does nothing" after an update. Three safeguards:

1. Every script/style address carries the version (`app.js?v=2026-09-27.15`),
   so a new page always asks for matching new files.
2. `sw.js` fetches every file with `reload` / `no-cache`, so the offline copy is
   never built from a stale file, and a failed download abandons the update.
3. `index.html` checks that the page, `data.js` and `app.js` all say the same
   version. If not, it clears the saved copies once and reloads (the
   `?fresh=` marker stops it from ever looping). The About page has a
   "Clear saved copy and reload" button that does the same by hand.

The version must be identical in `data.js`, `app.js`, `ur.js`, `sw.js` and
`index.html` (4 places). Claude's release tool sets them together and refuses
to finish if any disagree. If you ever edit by hand, change all of them.

## Running it locally

Any static file server works. From this folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in a browser. (Opening `index.html`
directly with `file://` also works for basic testing, but the service
worker/offline behavior only works when served over http:// or https://.)

## Deploying (do this under the separate, anonymous identity only)

Two free options that need no payment method:

**GitHub Pages**
1. Create a new GitHub account using the separate email — never your own.
2. Access GitHub only through Tor Browser or a paid VPN, never your home
   or work network.
3. Create a new repository, upload all files in this folder to it.
4. In the repo's Settings → Pages, enable Pages from the main branch.
5. The site will be live at `https://<account-name>.github.io/<repo-name>/`.

**Cloudflare Pages**
1. Same identity/network precautions as above.
2. Create a Cloudflare account, go to Workers & Pages → Create → Pages →
   "Upload assets", and upload this folder directly (no Git needed).
3. The site will be live at `https://<project-name>.pages.dev/`.

Deploying to both, under the same anonymous identity, gives you a second
link that keeps working if one is ever blocked.

## Verification workflow — required before any entry is public

1. **Lead found** — from a company website, news article, or aggregator.
   Add it to `data.js` with `status: "lead"` and the source that gave you
   the lead.
2. **Check the primary document** — the company's own latest annual
   report (look for the "pattern of shareholding" table), a Pakistan
   Stock Exchange filing, an SECP record, or the foundation's own official
   website listing its subsidiaries.
3. **If confirmed**: set `status: "verified"`, fill in `primaryDate` with
   the date/year of the document, and update the `sources` entry to point
   at that exact document (include a page number if it's a PDF).
4. **If it can't be confirmed**, or the primary document says something
   different: update or remove the entry. Never leave a lead presented
   as fact.
5. **Re-check yearly** — stakes get sold, companies merge (Fauji Cement
   absorbing Askari Cement is a real example of this happening).

Keep every description factual and unemotional: "[Brand] is produced by
[Company], which is [X]% owned by [Foundation] (source: [Annual Report
year], p. [page])." No adjectives, no commentary.

## The suggestion inbox (Cloudflare Worker "suggest")

The Suggest / correct form sends submissions to a small Cloudflare Worker
named `suggest`, at `https://suggest.badalain.workers.dev/` (already set in
`app.js`). Its code is kept separately in `suggest-worker.js` — it is NOT
part of the website files and should not be uploaded to GitHub.

- It stores ONLY what the person typed plus the time it arrived — no IP
  address, no device details, nothing that identifies the sender.
- It only accepts submissions from badalain.github.io and the Cloudflare
  mirror, has a hidden spam-trap field, and enforces size limits.
- Submissions are stored in a KV namespace bound to the Worker as
  `SUGGESTIONS`. Read them in the Cloudflare dashboard: Storage & databases
  → KV → badalain-suggestions → KV pairs. Delete each one after handling it.
- Treat every submission as untrusted: never open attachments or unknown
  links from it on your normal browser — check links only in the VPN-
  connected private window, and verify everything against a primary source.

## Operational security reminders

- Use a separate email (e.g. Proton Mail) created only for this, accessed
  only through Tor Browser or a paid VPN — never from home or work
  networks, never from an account you also use personally.
- No analytics, no crash reporting, no ad scripts. None are in this code,
  and none should be added — they'd also expose visitors.
- Don't reuse code, wording, or visual style from any of your other
  public projects.
- Don't discuss this project from personal social media accounts, and
  don't tell anyone who doesn't need to know.
- Before a public launch, consider reaching out to Access Now's Digital
  Security Helpline (https://www.accessnow.org/help/) — free, 24/7,
  built for exactly this kind of situation.
