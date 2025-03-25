import {useState, useEffect} from 'react';
import apiClient from '@/api/apiClient';

export function usePushNotifications() {
	const [subscription, setSubscription] = useState<PushSubscription | null>(null);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

	useEffect(() => {
		// Check if service workers and push messaging is supported
		if ('serviceWorker' in navigator && 'PushManager' in window) {
			navigator.serviceWorker.ready.then((reg) => {
				setRegistration(reg);

				// Check if already subscribed
				reg.pushManager.getSubscription().then((sub) => {
					if (sub) {
						setSubscription(sub);
						setIsSubscribed(true);
					}
				});
			});
		}
	}, []);

	const subscribeUser = async () => {
		try {
			if (!registration) {
				throw new Error('No hay registro de Service Worker');
			}

			// Request notification permission
			const permission = await Notification.requestPermission();
			if (permission !== 'granted') {
				throw new Error('Permiso de notificación denegado');
			}

			// Get the subscription object
			const sub = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
			});

			// Send the subscription to your backend
			await apiClient.post('/paramedic/push-subscription', {
				subscription: sub,
			});

			setSubscription(sub);
			setIsSubscribed(true);
			return true;
		} catch (error) {
			console.error('Error al suscribir a notificaciones:', error);
			return false;
		}
	};

	const unsubscribeUser = async () => {
		try {
			if (subscription) {
				await subscription.unsubscribe();
				// Notify your backend about the unsubscription
				await apiClient.delete('/paramedic/push-subscription');
				setSubscription(null);
				setIsSubscribed(false);
				return true;
			}
			return false;
		} catch (error) {
			console.error('Error al cancelar suscripción:', error);
			return false;
		}
	};

	return {
		isSubscribed,
		subscribeUser,
		unsubscribeUser,
	};
}
