/*
  sw.js — makes the site work offline after the first visit.

  Strategy:
  - Pages, data and code: try the network first (so corrections reach people
    quickly), but give up after a few seconds on a slow connection and use the
    saved copy instead. With no connection at all, the saved copy is used
    straight away.
  - Images: use the saved copy first (they almost never change).

  IMPORTANT — why every request below says "no-cache" / "reload":
  GitHub Pages lets a browser reuse any file for up to 10 minutes without
  asking, and that cannot be changed. Without these settings the app could
  save (or show) an OLD copy of one file next to NEW copies of the others,
  which is exactly what makes a button "do nothing" after an update.
  "no-cache" means: always check with the server that our copy is current
  (a tiny request when nothing changed).

  Bump CACHE_NAME whenever files change, together with APP_DATA.version in
  data.js (release.py does this for you). Old saved copies are deleted
  automatically.
*/

const CACHE_NAME = "badalain-cache-2026-09-27.16";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js",
  "./ur.js",
  "./app.js",
  "./manifest.json",
  "./favicon.ico",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-apple-touch.png",
  "./icon-maskable-512.png",
];

const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Every file is fetched straight from the server ("reload"), never from
      // the browser's own 10-minute copy. If any one file fails, the whole
      // install is abandoned and the previous working version stays in use.
      Promise.all(
        CORE_ASSETS.map((url) =>
          fetch(new Request(url, { cache: "reload" })).then((res) => {
            if (!res.ok) throw new Error("Could not save " + url);
            return cache.put(url, res);
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isImage(url) {
  return /\.(png|ico|jpg|jpeg|webp|svg)$/i.test(url.pathname);
}

function saveCopy(request, response) {
  if (response && response.ok && response.type === "basic") {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
  }
  return response;
}

// Rebuilt from the address so it also works for page navigations, which some
// browsers won't let you re-configure directly.
function freshRequest(request) {
  return new Request(request.url, { cache: "no-cache", credentials: "same-origin" });
}

function networkWithTimeout(request) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), NETWORK_TIMEOUT_MS);
    fetch(freshRequest(request)).then(
      (res) => { clearTimeout(timer); resolve(res); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never touch other sites

  if (isImage(url)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => saveCopy(request, res)))
    );
    return;
  }

  event.respondWith(
    networkWithTimeout(request)
      .then((res) => saveCopy(request, res))
      .catch(() =>
        caches.match(request, { ignoreSearch: true }).then((cached) => {
          if (cached) return cached;
          if (request.mode === "navigate") return caches.match("./index.html");
          return Response.error();
        })
      )
  );
});
