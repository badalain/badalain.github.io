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
- `data.js` — the entire content database. Edit this to add/change entries.
- `app.js` — search, filtering, view switching, the suggestion form
- `sw.js` — offline caching (service worker)
- `manifest.json` — lets the site be "added to home screen" like an app
- `icon-*.png` — placeholder icons (plain teal circle) — replace with a
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

## Connecting the suggestion form to a real backend

Right now, submitting the form on the Suggest tab either POSTs to
`SUGGESTION_ENDPOINT_URL` (in `app.js`, currently blank) or — if that's
blank or fails — shows the person their own submission to copy and send
another way.

To make submissions land somewhere reviewable without exposing your
identity or collecting anyone's IP address by default:

1. Create a Cloudflare Worker (under the anonymous identity) with a KV
   or D1 store attached.
2. Have it accept a POST of `{name, category, reason, source,
   submittedAt}` and write it to storage. Add basic rate-limiting and a
   CAPTCHA (e.g. Cloudflare Turnstile) so it can't be spammed.
3. Put the Worker's URL into `SUGGESTION_ENDPOINT_URL` in `app.js`.
4. Review submissions periodically from the Worker's storage, and update
   `data.js` following the verification workflow above.

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
