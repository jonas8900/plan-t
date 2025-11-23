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
  console.log('Empfangene Daten:', data);

  const title = data.title || 'Testbenachrichtigung';
  const options = {
    body: data.body || 'Hier ist deine Testnachricht!',
    icon: data.icon || '/icon-192x192.png',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => {
        console.log('Benachrichtigung wurde angezeigt');
      })
      .catch((err) => {
        console.error('Fehler beim Anzeigen der Benachrichtigung:', err);
      })
  );
});
