const CACHE = "poker-tracker-v3";
const ASSETS = ["/", "/index.html", "/manifest.webmanifest"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // Let Firebase/network requests go through
  if (e.request.url.includes("firebase") || e.request.url.includes("googleapis") ||
      e.request.url.includes("fonts.g") || e.request.url.includes("gstatic")) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
