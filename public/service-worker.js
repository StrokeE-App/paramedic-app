importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase with your config
firebase.initializeApp({
	apiKey: 'AIzaSyByxLuZRV04bp8WgyGvfr2iWyq3blfXBP8',
	authDomain: 'strokeeapp.firebaseapp.com',
	projectId: 'strokeeapp',
	storageBucket: 'strokeeapp.firebasestorage.app',
	messagingSenderId: '1080629496007',
	appId: '1:1080629496007:web:9cf1ffa3c217a76c6296e2',
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
	console.log('Received background message:', payload);

	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: '/strokee-192x192.png',
		badge: '/strokee-192x192.png',
		data: payload.data,
		actions: payload.data.actions || [],
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});

// Cache handling
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open('strokee-v1').then((cache) => {
			// Only cache essential files that we know exist
			return Promise.all([cache.add('/'), cache.add('/manifest.json'), cache.add('/strokee-192x192.png'), cache.add('/strokee-512x512.png')]).catch(
				(error) => {
					console.error('Error caching files:', error);
				}
			);
		})
	);
});

self.addEventListener('fetch', (event) => {
	// Skip caching for non-GET requests
	if (event.request.method !== 'GET') {
		return event.respondWith(fetch(event.request));
	}

	// Skip caching for navigation requests (they might involve redirects)
	if (event.request.mode === 'navigate') {
		return event.respondWith(fetch(event.request));
	}

	// Skip caching for API requests
	if (event.request.url.includes('/api/') || event.request.url.includes('/paramedic-notification/')) {
		return event.respondWith(fetch(event.request));
	}

	event.respondWith(
		caches.match(event.request).then((response) => {
			return (
				response ||
				fetch(event.request)
					.then((response) => {
						// Don't cache redirects or error responses
						if (!response.ok || response.type === 'opaqueredirect') {
							return response;
						}

						// Clone the response before caching
						const responseToCache = response.clone();
						caches.open('strokee-v1').then((cache) => {
							cache.put(event.request, responseToCache);
						});

						return response;
					})
					.catch(() => {
						// If both fetch and cache fail, return a fallback response
						return new Response('Offline content not available');
					})
			);
		})
	);
});
