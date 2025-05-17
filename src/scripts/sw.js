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
  console.log('[Service worker] pushing...');

  async function showNotification() {
    const data = await event.data.json();

    await self.registration.showNotification(data.title, {
      body: data.options.body,
    });
  }

  event.waitUntil(showNotification());
});