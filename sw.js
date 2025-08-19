// M-Indicator Service Worker for PWA
const CACHE_NAME = 'mindicator-v1.0.0';
const STATIC_CACHE = 'mindicator-static-v1.0.0';
const DYNAMIC_CACHE = 'mindicator-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/data.js',
  '/js/utils.js',
  '/js/components.js',
  '/manifest.json',
  // External dependencies
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  // Fallback offline page
  '/offline.html'
];

// Dynamic caching patterns
const CACHE_STRATEGIES = {
  images: 'cache-first',
  api: 'network-first',
  static: 'cache-first'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName.startsWith('mindicator-') && 
                     cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE;
            })
            .map(cacheName => {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (request.url.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i)) {
    // Images - cache first strategy
    event.respondWith(cacheFirst(request));
  } else if (request.url.includes('/api/')) {
    // API requests - network first strategy
    event.respondWith(networkFirst(request));
  } else if (STATIC_ASSETS.includes(request.url) || STATIC_ASSETS.includes(url.pathname)) {
    // Static assets - cache first strategy
    event.respondWith(cacheFirst(request));
  } else {
    // Everything else - network first with offline fallback
    event.respondWith(networkFirst(request));
  }
});

// Cache first strategy - good for static assets
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    console.warn('Cache first failed:', error);
    return getOfflineFallback(request);
  }
}

// Network first strategy - good for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('Network first failed, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return getOfflineFallback(request);
  }
}

// Get offline fallback response
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
  }
  
  // Return a simple offline response for API requests
  if (request.url.includes('/api/')) {
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'You are currently offline. Some features may not be available.' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Return a basic offline response for other requests
  return new Response(
    'Offline - This content is not available while offline.',
    {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    }
  );
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync any offline actions stored in IndexedDB
    console.log('Service Worker: Performing background sync...');
    
    // In a real app, this would sync offline favorites, searches, etc.
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'BACKGROUND_SYNC_COMPLETE',
        message: 'Background sync completed successfully'
      });
    });
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push message received:', event);
  
  const options = {
    body: 'You have new train updates!',
    icon: '/assets/icon-192x192.png',
    badge: '/assets/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Updates',
        icon: '/assets/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/xmark.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.message || options.body;
    options.data = { ...options.data, ...data };
  }
  
  event.waitUntil(
    self.registration.showNotification('M-Indicator', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open the app to relevant section
    event.waitUntil(
      clients.openWindow('/?tab=live')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_NAME
    });
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered:', event.tag);
  
  if (event.tag === 'update-schedules') {
    event.waitUntil(updateTrainSchedules());
  }
});

async function updateTrainSchedules() {
  try {
    console.log('Service Worker: Updating train schedules...');
    
    // In a real app, this would fetch updated schedules from the server
    // and cache them for offline use
    
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SCHEDULES_UPDATED',
        message: 'Train schedules have been updated'
      });
    });
  } catch (error) {
    console.error('Service Worker: Failed to update schedules:', error);
  }
}

// Cache management utilities
async function cleanupOldCaches() {
  const caches = await caches.keys();
  const oldCaches = caches.filter(cache => 
    cache.startsWith('mindicator-') && 
    cache !== STATIC_CACHE && 
    cache !== DYNAMIC_CACHE
  );
  
  return Promise.all(oldCaches.map(cache => caches.delete(cache)));
}

// Preload critical resources
async function preloadCriticalResources() {
  const cache = await caches.open(STATIC_CACHE);
  
  // Preload most frequently accessed routes/stations
  const criticalData = [
    '/api/stations/popular',
    '/api/schedules/western/peak-hours',
    '/api/live/western'
  ];
  
  return Promise.all(
    criticalData.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.warn('Failed to preload:', url, error);
      }
    })
  );
}

// Initialize service worker
console.log('Service Worker: Script loaded successfully');

// Offline page as a fallback
const OFFLINE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>M-Indicator - Offline</title>
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #87CEEB, #4682B4);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
        }
        .offline-content {
            max-width: 400px;
            padding: 2rem;
        }
        .offline-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        h1 { margin-bottom: 1rem; }
        p { margin-bottom: 2rem; line-height: 1.6; }
        .retry-btn {
            background: rgba(255,255,255,0.2);
            border: 2px solid white;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .retry-btn:hover {
            background: white;
            color: #4682B4;
        }
    </style>
</head>
<body>
    <div class="offline-content">
        <div class="offline-icon">🚊</div>
        <h1>M-Indicator</h1>
        <p>You're currently offline. Some features may not be available, but you can still access cached train schedules.</p>
        <button class="retry-btn" onclick="window.location.reload()">
            Try Again
        </button>
    </div>
</body>
</html>
`;
