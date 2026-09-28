/*
  sw.js — makes the site work offline after the first visit.

  Strategy:
  - Pages, data and code: try the network first (so corrections reach
    people quickly), but give up after a few seconds on a slow connection
    and use the saved copy instead. With no connection at all, the saved
    copy is used straight away.
  - Images: use the saved copy first (they almost never change).

  Bump CACHE_NAME whenever files change, together with APP_DATA.version
  in data.js. Old saved copies are deleted automatically.
*/

const CACHE_NAME = "badalain-cache-2026-09-27.14";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js",
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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
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

function networkWithTimeout(request) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), NETWORK_TIMEOUT_MS);
    fetch(request).then(
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
