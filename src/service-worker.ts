import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";
import { setCacheNameDetails } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";

// Set custom cache names.
setCacheNameDetails({
  prefix: "lottie-ms",
  suffix: "v1",
  precache: "precache",
  runtime: "runtime",
});

// Extend the ServiceWorkerGlobalScope to include __WB_MANIFEST
declare var self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{
    url: string;
    revision: string;
  }>;
};

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.destination === "document",
  new NetworkFirst({
    cacheName: "documents-cache",
  })
);

// Cache API responses with a Network First strategy.
registerRoute(
  ({ url }) => url.origin === "http://localhost:4000",
  new NetworkFirst({
    cacheName: "api-cache",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60, // 1 day
        maxEntries: 50,
      }),
    ],
  })
);

// Cache static resources with a Cache First strategy.
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images-cache",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        maxEntries: 50,
      }),
    ],
  })
);

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open("workbox-precache-v2-undefined").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/bundle.js",
        "/service-worker.js",
      ]);
    })
  );
});

self.addEventListener("fetch", (event: FetchEvent) => {
  if (event.request.url.includes("service-worker.js")) {
    // Serve the service worker from the cache if offline
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
    return; // Break and prevent other fetches
  }
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
