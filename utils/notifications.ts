import {getMessaging, getToken, onMessage} from 'firebase/messaging';
import apiClient from '@/api/apiClient';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export const requestNotificationPermission = async () => {
	try {
		// Check if notifications are supported
		if (!('Notification' in window)) {
			throw new Error('This browser does not support notifications');
		}

		// Check if permission is already granted
		if (Notification.permission === 'granted') {
			return true;
		}

		// Check if permission is denied
		if (Notification.permission === 'denied') {
			throw new Error('Notifications have been blocked. Please enable them in your browser settings.');
		}

		// Request permission
		const permission = await Notification.requestPermission();

		if (permission === 'granted') {
			return true;
		} else if (permission === 'denied') {
			throw new Error('Notifications have been blocked. Please enable them in your browser settings.');
		} else {
			throw new Error('Notification permission was not granted');
		}
	} catch (error) {
		console.error('Error requesting notification permission:', error);
		throw error;
	}
};

const registerServiceWorker = async (): Promise<ServiceWorkerRegistration> => {
	try {
		const registration = await navigator.serviceWorker.register('/service-worker.js', {
			scope: '/',
		});

		// Wait for the service worker to be active
		if (registration.active) {
			return registration;
		}

		// If not active, wait for it to become active
		return new Promise<ServiceWorkerRegistration>((resolve) => {
			registration.addEventListener('updatefound', () => {
				const newWorker = registration.installing;
				if (newWorker) {
					newWorker.addEventListener('statechange', () => {
						if (newWorker.state === 'activated') {
							resolve(registration);
						}
					});
				}
			});
		});
	} catch (error) {
		console.error('Error registering service worker:', error);
		throw error;
	}
};

export const initializeFirebaseMessaging = async () => {
	try {
		// First, register the service worker
		const registration = await registerServiceWorker();

		const messaging = getMessaging();

		// Get the token with the registered service worker
		const currentToken = await getToken(messaging, {
			vapidKey: VAPID_KEY,
			serviceWorkerRegistration: registration,
		});

		// Handle foreground messages
		onMessage(messaging, (payload) => {
			console.log('Received foreground message:', payload);

			if (Notification.permission === 'granted') {
				new Notification(payload.notification?.title || '', {
					body: payload.notification?.body,
					icon: '/strokee-192x192.png',
					badge: '/strokee-192x192.png',
					data: payload.data,
				});
			}
		});

		return currentToken;
	} catch (error) {
		console.error('Error initializing Firebase messaging:', error);
		throw error;
	}
};

export const subscribeToNotifications = async (role: string, userId: string, token: string, device: string) => {
	try {
		const response = await apiClient.post('/push-notifications/subscribe-notification', {
			role: 'paramedic',
			userId,
			token,
			device,
		});
		return response.data;
	} catch (error) {
		console.error('Error subscribing to notifications:', error);
		throw error;
	}
};

export const unsubscribeFromNotifications = async (role: string, userId: string, token: string) => {
	try {
		const response = await apiClient.post('/push-notifications/unsubscribe-notification', {
			role: 'paramedic',
			userId,
			token,
		});
		return response.data;
	} catch (error) {
		console.error('Error unsubscribing from notifications:', error);
		throw error;
	}
};
