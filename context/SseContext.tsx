'use client';

import React, {createContext, useContext, ReactNode, useState, useEffect} from 'react';

// Hooks
import {useSseEvents} from '@/hooks/useSseEvents';

// Types
import {EmergencyInfo, ParamedicResponse} from '@/types';

// Context
import {useAuth} from './AuthContext';

// API
import apiClient from '@/api/apiClient';

interface SseContextType {
	emergencies: EmergencyInfo[] | null;
	isConnected: boolean;
	error: Error | null;
	isLoading: boolean;
}

const SseContext = createContext<SseContextType | undefined>(undefined);

export function SseProvider({children}: {children: ReactNode}) {
	const {user} = useAuth();
	const [ambulanceId, setAmbulanceId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [fetchError, setFetchError] = useState<Error | null>(null);

	// Fetch the paramedic's ambulanceId when the user is available
	useEffect(() => {

		console.log('fetching paramedic data');
		console.log("USER", user);
		async function fetchParamedicData() {
			if (!user?.uid) return;
			
			try {
				setIsLoading(true);
				const response = await apiClient.get<ParamedicResponse>(`/paramedic/${user.uid}`);

				
				setAmbulanceId(response.data.data.ambulanceId);
				setFetchError(null);
			} catch (error) {
				console.error('Error fetching paramedic data:', error);
				setFetchError(error instanceof Error ? error : new Error('Failed to fetch paramedic data'));
			} finally {
				setIsLoading(false);
			}
		}

		fetchParamedicData();
	}, [user?.uid]);

	// Only initialize SSE connection when ambulanceId is available
	const {data, isConnected, error: sseError} = useSseEvents<EmergencyInfo[]>({
		url: ambulanceId 
			? `${process.env.NEXT_PUBLIC_NOTIFICATION_BACKEND_URL}/paramedic-notification/emergencies/${ambulanceId}`
			: '',
		initialConnect: !!ambulanceId
	});

	// Combine any errors
	const error = fetchError || sseError;

	return (
		<SseContext.Provider value={{
			emergencies: data, 
			isConnected, 
			error,
			isLoading: isLoading || (!ambulanceId && !fetchError)
		}}>
			{children}
		</SseContext.Provider>
	);
}

export function useSseContext() {
	const context = useContext(SseContext);
	if (context === undefined) {
		throw new Error('useSseContext must be used within a SseProvider');
	}
	return context;
}
