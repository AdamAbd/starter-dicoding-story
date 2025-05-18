import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import CONFIG from './config';

// Do precaching
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);

// Runtime caching
registerRoute(
  ({ url }) => {
    return (
      url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com'
    );
  },
  new CacheFirst({
    cacheName: 'google-fonts',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome');
  },
  new CacheFirst({
    cacheName: 'fontawesome',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin === 'https://ui-avatars.com';
  },
  new CacheFirst({
    cacheName: 'avatars-api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

// Cache API responses
registerRoute(
  ({ request, url }) => {
    try {
      const baseUrl = new URL(CONFIG.BASE_URL);
      return baseUrl.origin === url.origin && request.destination !== 'image';
    } catch (error) {
      console.error('Invalid URL in API route matching:', error);
      return false;
    }
  },
  new NetworkFirst({
    cacheName: 'dicoding-story-api',
  }),
);

registerRoute(
  ({ request, url }) => {
    try {
      const baseUrl = new URL(CONFIG.BASE_URL);
      return baseUrl.origin === url.origin && request.destination === 'image';
    } catch (error) {
      console.error('Invalid URL in image route matching:', error);
      return false;
    }
  },
  new StaleWhileRevalidate({
    cacheName: 'dicoding-story-api-images',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin.includes('maptiler');
  },
  new CacheFirst({
    cacheName: 'maptiler-api',
  }),
);

// Cache application shell
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'dicoding-story-app-shell',
  }),
);

// Handle push notification
self.addEventListener('push', (event) => {
  console.log('[Service worker] Push received');

  async function showNotification() {
    let data;
    try {
      data = await event.data.json();
    } catch (error) {
      console.error('Error parsing push data:', error);
      data = {
        title: 'Story berhasil dibuat',
        options: {
          body: 'Anda telah membuat story baru',
        },
      };
    }

    return self.registration.showNotification(data.title, {
      body: data.options.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: {
        url: self.location.origin + '/#/home',
      },
    });
  }

  event.waitUntil(showNotification());
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received');

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/#/home';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle subscription change
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[Service Worker] Push subscription changed');
  // You can add code here to handle subscription changes if needed
});