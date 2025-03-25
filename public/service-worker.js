self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open('strokee-v1').then((cache) => {
			return cache.addAll(['/', '/index.html', '/manifest.json', '/strokee-192x192.png', '/strokee-512x512.png']);
		})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return (
				response ||
				fetch(event.request)
					.then((response) => {
						// Clone the response because it can only be consumed once
						const responseToCache = response.clone();

						// Add the new response to the cache
						caches.open('strokee-v1').then((cache) => {
							cache.put(event.request, responseToCache);
						});

						return response;
					})
					.catch(() => {
						// If both fetch and cache fail, you might want to show a fallback
						return new Response('Offline content not available');
					})
			);
		})
	);
});

// Handle push notifications
self.addEventListener('push', function (event) {
	const options = {
		body: event.data.text(),
		icon: '/strokee-192x192.png',
		badge: '/strokee-192x192.png',
		vibrate: [200, 100, 200],
		tag: 'new-emergency',
		renotify: true,
		actions: [
			{action: 'open', title: 'Abrir'},
			{action: 'close', title: 'Cerrar'},
		],
	};

	event.waitUntil(self.registration.showNotification('Nueva Emergencia', options));
});

// Handle notification click
self.addEventListener('notificationclick', function (event) {
	event.notification.close();

	if (event.action === 'open') {
		// Open the app when notification is clicked
		event.waitUntil(clients.openWindow('/'));
	}
});
