// Instalación y pre carga
var CACHE_NAME = "offline";
var urlsToCache = [""];

self.addEventListener("install", function (event) {
  // Creando la cache
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.info("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        var fetchPromise = fetch(event.request).then(function (
          networkResponse
        ) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});
