// Automated weekly cache versioning
const now = new Date();
const year = now.getFullYear();
const week = Math.ceil(((now - new Date(year, 0, 1)) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7);
const CACHE_NAME = `jowin-pwa-cache-${year}-W${week}`;
// IMPORTANT: This service worker ONLY caches content from the SAME ORIGIN/SITE
// External resources (analytics, CDNs, etc.) are NEVER cached for security and functionality
const urlsToCache = [
  '/',
  '/offline',
  '/connect',
  '/blog',
  '/favicon.ico',
  '/favicon.png',
  '/profile.jpg',
  '/site.webmanifest'
];

// Install event - cache resources with error handling
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.warn('Some resources failed to cache during install:', error);
        // Continue with service worker installation even if caching fails
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - Network First for all content with intelligent caching
// Uses async/await for better error handling and performance
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // ONLY cache content from the SAME ORIGIN/SITE
  // External requests (analytics, CDNs, APIs) are NEVER cached for security and functionality
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // Network First for navigation, cache-first for static assets (industry standard)
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        // For navigation requests (HTML pages)
        if (event.request.mode === 'navigate') {
          try {
            const networkResponse = await fetch(event.request);
            if (networkResponse && networkResponse.status === 200) {
              // Cache the page for offline use
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          } catch (err) {
            // If offline, try to serve from cache
            const cachedPage = await cache.match(event.request);
            if (cachedPage) return cachedPage;
            // Fallback to offline page
            const offlineResponse = await cache.match('/offline');
            return offlineResponse || createOfflineResponse();
          }
        }

        // For static assets: cache-first
        if (isStaticAsset(event.request)) {
          const cachedAsset = await cache.match(event.request);
          if (cachedAsset) return cachedAsset;
          try {
            const networkResponse = await fetch(event.request);
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          } catch (err) {
            return createOfflineResponse();
          }
        }

        // For other GET requests, try network then cache
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) return cachedResponse;
          return createOfflineResponse();
        }
      } catch (err) {
        return createOfflineResponse();
      }
    })()
  );
});

// Helper function to identify static assets
function isStaticAsset(request) {
  // Check by destination (modern browsers) - most reliable
  if (request.destination) {
    return ['image', 'font', 'style', 'script'].includes(request.destination);
  }

  // Fallback: check by file extension (optimized - only common web assets)
  const pathname = request.url.pathname.toLowerCase();
  return /\.(png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|css|js)$/i.test(pathname);
}

// Helper function to determine if cache should be updated
function shouldUpdateCache(cachedResponse, networkResponse) {
  // Compare ETag headers (most reliable)
  const cachedETag = cachedResponse.headers.get('ETag');
  const networkETag = networkResponse.headers.get('ETag');

  if (cachedETag && networkETag && cachedETag !== networkETag) {
    return true; // Content has changed
  }

  // Compare Last-Modified headers (fallback)
  const cachedLastModified = cachedResponse.headers.get('Last-Modified');
  const networkLastModified = networkResponse.headers.get('Last-Modified');

  if (cachedLastModified && networkLastModified && cachedLastModified !== networkLastModified) {
    return true; // Content has changed
  }

  // If no validation headers, assume content might have changed
  if (!cachedETag && !cachedLastModified) {
    return true;
  }

  return false; // Content appears unchanged
}

// Helper function to create offline response
function createOfflineResponse() {
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'Content not available offline. Please check your internet connection.'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}