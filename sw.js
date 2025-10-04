const CACHE_NAME = 'beauty-studio-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for offline bookings
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(syncBookings());
    }
});

async function syncBookings() {
    // In a real app, this would sync offline bookings with the server
    console.log('Syncing bookings...');
}

// Push notifications (for appointment reminders)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Tenés un turno próximo',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver Turno',
                icon: '/icons/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/icons/icon-192x192.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Estudio de Belleza', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/#appointments')
        );
    }
});
