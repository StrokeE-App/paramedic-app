'use client';

import React, {createContext, useContext, ReactNode, useState, useEffect, useRef} from 'react';
import {useSseEvents} from '@/hooks/useSseEvents';
import {EmergencyInfo} from '@/types';
import apiClient from '@/api/apiClient';
import {useAuth} from '@/context/AuthContext';

interface ParamedicData {
	firstName: string;
	lastName: string;
	ambulanceId: string;
	email: string;
}

interface SseContextType {
	emergencies: EmergencyInfo[] | null;
	isConnected: boolean;
	error: Error | null;
}

const SseContext = createContext<SseContextType | undefined>(undefined);

export function SseProvider({children}: {children: ReactNode}) {
	const [paramedicData, setParamedicData] = useState<ParamedicData | null>(null);
	const {isAuthenticated, user} = useAuth();
	const previousEmergenciesRef = useRef<EmergencyInfo[] | null>(null);

	// Always call the hook, but with a dummy URL when we don't have paramedic data
	const {data, isConnected, error} = useSseEvents<EmergencyInfo[]>({
		url: paramedicData
			? `${process.env.NEXT_PUBLIC_NOTIFICATION_BACKEND_URL}/paramedic-notification/emergencies/${paramedicData.ambulanceId}`
			: `${process.env.NEXT_PUBLIC_NOTIFICATION_BACKEND_URL}/paramedic-notification/emergencies/dummy`,
		initialConnect: !!paramedicData, // Only connect when we have paramedic data
	});

	// Check for new emergencies and show notifications
	useEffect(() => {
		if (data && previousEmergenciesRef.current) {
			const newEmergencies = data.filter((emergency) => !previousEmergenciesRef.current?.find((prev) => prev.emergencyId === emergency.emergencyId));

			// Show notification for each new emergency
			newEmergencies.forEach((emergency) => {
				if ('Notification' in window && Notification.permission === 'granted') {
					// Play a sound to alert the user
					const audio = new Audio('/notification-sound.mp3'); // You'll need to add this sound file
					audio.play().catch((err) => console.log('Audio playback failed:', err));

					const notification = new Notification('Nueva Emergencia', {
						body: `Nuevo paciente: ${emergency.patient.firstName} ${emergency.patient.lastName}`,
						icon: '/strokee-192x192.png',
						badge: '/strokee-192x192.png',
						tag: 'new-emergency',
						requireInteraction: true, // Makes the notification persist until user interacts with it
					});

					notification.onclick = () => {
						window.focus();
						window.location.href = `/emergency/${emergency.emergencyId}`;
					};
				}
			});
		}

		previousEmergenciesRef.current = data;
	}, [data]);

	// Fetch paramedic data
	useEffect(() => {
		const fetchParamedicData = async () => {
			if (!isAuthenticated || !user?.uid) return;

			try {
				const response = await apiClient.get<{message: string; data: ParamedicData}>(`/paramedic/${user.uid}`);
				setParamedicData(response.data.data);
			} catch (error) {
				console.error('Error fetching paramedic data:', error);
			}
		};

		fetchParamedicData();
	}, [isAuthenticated, user?.uid]);

	return <SseContext.Provider value={{emergencies: data, isConnected, error}}>{children}</SseContext.Provider>;
}

export function useSseContext() {
	const context = useContext(SseContext);
	if (context === undefined) {
		throw new Error('useSseContext must be used within a SseProvider');
	}
	return context;
}
