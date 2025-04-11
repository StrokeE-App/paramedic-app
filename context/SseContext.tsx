'use client';

import React, {createContext, useContext, ReactNode, useState, useEffect} from 'react';
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
	connect: () => void;
	disconnect: () => void;
}

const SseContext = createContext<SseContextType | undefined>(undefined);

export function SseProvider({children}: {children: ReactNode}) {
	const [paramedicData, setParamedicData] = useState<ParamedicData | null>(null);
	const {isAuthenticated, user} = useAuth();

	// Always call the hook, but with a dummy URL when we don't have paramedic data
	const {data, isConnected, error, connect, disconnect} = useSseEvents<EmergencyInfo[]>({
		url: paramedicData
			? `${process.env.NEXT_PUBLIC_NOTIFICATION_BACKEND_URL}/paramedic-notification/emergencies/${paramedicData.ambulanceId}`
			: `${process.env.NEXT_PUBLIC_NOTIFICATION_BACKEND_URL}/paramedic-notification/emergencies/dummy`,
		initialConnect: !!paramedicData, // Only connect when we have paramedic data
	});

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

	return <SseContext.Provider value={{emergencies: data, isConnected, error, connect, disconnect}}>{children}</SseContext.Provider>;
}

export function useSseContext() {
	const context = useContext(SseContext);
	if (context === undefined) {
		throw new Error('useSseContext must be used within a SseProvider');
	}
	return context;
}
