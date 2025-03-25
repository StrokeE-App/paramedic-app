'use client';

import {useEffect} from 'react';
import toast from 'react-hot-toast';

export default function NotificationPermission() {
	useEffect(() => {
		const requestNotificationPermission = async () => {
			if ('Notification' in window) {
				const permission = await Notification.requestPermission();

				if (permission === 'granted') {
					toast.success('Notificaciones activadas correctamente');
				} else {
					toast.error('Por favor permite las notificaciones para recibir alertas de emergencias');
				}
			}
		};

		requestNotificationPermission();
	}, []);

	return null;
}
