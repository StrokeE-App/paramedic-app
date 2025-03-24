'use client';

import React, {createContext, useContext, ReactNode, useState, useEffect} from 'react';
import apiClient from '@/api/apiClient';
import toast from 'react-hot-toast';
import {useAuth} from '@/context/AuthContext';

type Clinic = {
	id: string;
	name: string;
};

interface ClinicResponse {
	message: string;
	clinics: Array<{
		healthcenterId: string;
		healthcenterName: string;
	}>;
}

interface ClinicContextType {
	clinics: Clinic[];
	isLoading: boolean;
	error: Error | null;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

// Mock clinics for development
// const mockClinics: Clinic[] = [
// 	{id: '1', name: 'Clínica Imbanaco'},
// 	{id: '2', name: 'Hospital Universitario del Valle'},
// 	{id: '3', name: 'Centro Médico Imbanaco'},
// 	{id: '4', name: 'Clínica de Occidente'},
// ];

export function ClinicProvider({children}: {children: ReactNode}) {
	const [clinics, setClinics] = useState<Clinic[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const {isAuthenticated} = useAuth();

	useEffect(() => {
		const fetchClinics = async () => {
			if (!isAuthenticated) {
				setIsLoading(false);
				return;
			}

			try {
				const response = await apiClient.get<ClinicResponse>('/clinic/all');
				// Transform the response to match Clinic type
				const transformedClinics = response.data.clinics.map((clinic) => ({
					id: clinic.healthcenterId,
					name: clinic.healthcenterName,
				}));
				setClinics(transformedClinics);
			} catch (error) {
				console.error('Error fetching clinics:', error);
				toast.error('Error al cargar las clínicas');
				setError(error as Error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchClinics();
	}, [isAuthenticated]);

	return <ClinicContext.Provider value={{clinics, isLoading, error}}>{children}</ClinicContext.Provider>;
}

export function useClinics() {
	const context = useContext(ClinicContext);
	if (context === undefined) {
		throw new Error('useClinics must be used within a ClinicProvider');
	}
	return context;
}
