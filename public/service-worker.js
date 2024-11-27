self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
});

self.addEventListener('push', (event) => {
  console.log('Push-Ereignis empfangen:', event);

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Benachrichtigung';
  const options = {
    body: data.body || 'Du hast eine neue Nachricht!',
    icon: '/icon-192x192.png',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});