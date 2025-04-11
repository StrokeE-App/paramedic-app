import {useState, useEffect} from 'react';
import {
	requestNotificationPermission,
	initializeFirebaseMessaging,
	subscribeToNotifications,
	unsubscribeFromNotifications,
} from '../utils/notifications';

export const useNotifications = (role: string, userId: string) => {
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const subscribe = async () => {
		try {
			// Request permission
			const hasPermission = await requestNotificationPermission();
			if (!hasPermission) {
				setError('Notification permission denied');
				return;
			}

			// Initialize Firebase messaging and get token
			const token = await initializeFirebaseMessaging();
			if (!token) {
				setError('Failed to get notification token');
				return;
			}

			// Subscribe to notifications
			await subscribeToNotifications(role, userId, token, 'web');
			setIsSubscribed(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to subscribe to notifications');
		}
	};

	const unsubscribe = async () => {
		try {
			const token = await initializeFirebaseMessaging();
			if (token) {
				await unsubscribeFromNotifications(role, userId, token);
				setIsSubscribed(false);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to unsubscribe from notifications');
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (isSubscribed) {
				unsubscribe();
			}
		};
	}, [isSubscribed]);

	return {
		isSubscribed,
		error,
		subscribe,
		unsubscribe,
	};
};
