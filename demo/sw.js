// Instalación y pre carga
var CACHE_NAME = "offline";
var urlsToCache = ["/"];

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
    caches.match(event.request).then(function (response) {
      // Si está almacenado, se devuelve desde la cache.
      if (response) {
        return response;
      }
      var fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(function (response) {
        // verifica que le petición devuelva una respuesta válida.
        // Use: response.type !== 'basic' para almacenar solo recursos locales.
        if (!response || response.status !== 200) {
          return response;
        }
        var responseToCache = response.clone();
        // Almacena el recurso en la cache
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
