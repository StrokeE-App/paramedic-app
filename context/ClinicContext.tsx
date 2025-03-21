'use client';

import React, {createContext, useContext, ReactNode, useState, useEffect} from 'react';
// import apiClient from '@/api/apiClient';
import toast from 'react-hot-toast';

type Clinic = {
	id: string;
	name: string;
};

interface ClinicContextType {
	clinics: Clinic[];
	isLoading: boolean;
	error: Error | null;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

// Mock clinics for development
const mockClinics: Clinic[] = [
	{id: '1', name: 'Clínica Imbanaco'},
	{id: '2', name: 'Hospital Universitario del Valle'},
	{id: '3', name: 'Centro Médico Imbanaco'},
	{id: '4', name: 'Clínica de Occidente'},
];

export function ClinicProvider({children}: {children: ReactNode}) {
	const [clinics, setClinics] = useState<Clinic[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchClinics = async () => {
			try {
				// TODO: Uncomment when endpoint is available
				// const response = await apiClient.get('/clinics');
				// setClinics(response.data);

				// Using mock data for now
				setClinics(mockClinics);
			} catch (error) {
				console.error('Error fetching clinics:', error);
				toast.error('Error al cargar las clínicas');
				setError(error as Error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchClinics();
	}, []);

	return <ClinicContext.Provider value={{clinics, isLoading, error}}>{children}</ClinicContext.Provider>;
}

export function useClinics() {
	const context = useContext(ClinicContext);
	if (context === undefined) {
		throw new Error('useClinics must be used within a ClinicProvider');
	}
	return context;
}
