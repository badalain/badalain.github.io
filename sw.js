/*
  sw.js — makes the site work fully offline after the first visit.

  CACHE_NAME includes the data version from data.js. Whenever you edit
  data.js, bump APP_DATA.version there AND the string below, so returning
  visitors get the update instead of a stale cached copy.
*/

const CACHE_NAME = "badalain-cache-2026-09-27.3";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-apple-touch.png",
  "./robots.txt",
  "./sitemap.xml",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Cache-first for everything: fast on slow connections, and works with no
// connection at all. Falls back to network for anything not pre-cached
// (e.g. a future suggestion-endpoint POST, which isn't cached anyway).
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return response;
          })
          .catch(() => cached)
      );
    })
  );
});
