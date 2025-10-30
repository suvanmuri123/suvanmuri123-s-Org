// A unique name for our cache
const CACHE_NAME = 'karyasuchi-v1';

// The list of files to cache. This is often called the "app shell".
// NOTE: In a real-world build process, this list would be dynamically generated.
// For this environment, we are caching the source files.
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/services/geminiService.ts',
  '/components/TodoList.tsx',
  '/components/Analytics.tsx',
  '/components/FocusTimer.tsx',
  '/components/Notes.tsx',
  '/components/Loader.tsx',
  '/components/Login.tsx',
  '/components/SakuraBackground.tsx',
  '/components/Icons.tsx',
  '/components/MoodTracker.tsx',
  '/components/MoodMascot.tsx',
  '/components/MochiAnimation.tsx',
  '/components/ReflectionIcon.tsx',
  '/components/SakuraExplosion.tsx',
  '/manifest.json'
];

// Install event: This is called when the service worker is first installed.
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker.
        return self.skipWaiting();
      })
  );
});

// Activate event: This is called when the service worker is activated.
// It's a good place to clean up old caches.
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        // Tell the active service worker to take control of the page immediately.
        return self.clients.claim();
    })
  );
});

// Fetch event: This is called every time the app makes a network request.
// We use a "cache-first" strategy here.
self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For requests to third-party CDNs, we go network-first to ensure we get updates,
  // but fall back to cache if offline.
  if (event.request.url.includes('aistudiocdn.com') || event.request.url.includes('tailwindcss.com')) {
      event.respondWith(
          caches.open(CACHE_NAME).then(cache => {
              return fetch(event.request).then(response => {
                  cache.put(event.request, response.clone());
                  return response;
              }).catch(() => {
                  return caches.match(event.request);
              });
          })
      );
      return;
  }

  // For our own app assets, we use a cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If the resource is in the cache, return it.
        if (response) {
          return response;
        }
        // If it's not in the cache, fetch it from the network.
        return fetch(event.request).then(
          (networkResponse) => {
             // We don't cache requests made to the Gemini API
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' || event.request.url.includes('generativelanguage')) {
                return networkResponse;
            }
            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
      .catch((error) => {
        // If fetching fails (e.g., user is offline), you can return a fallback page or resource.
        console.error('Service Worker: Fetch failed:', error);
      })
  );
});
