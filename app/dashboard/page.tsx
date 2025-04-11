'use client';

// Components
import EmergencyCard from '@/components/EmergencyCard';
import SettingsMenu from '@/components/SettingsMenu';

// Context
import {useSseContext} from '@/context/SseContext';
import {useEffect} from 'react';

export default function Dashboard() {
	const {emergencies: data, isConnected, error, connect, disconnect} = useSseContext();

	// Reconnect to SSE when the dashboard mounts
	useEffect(() => {
		// Disconnect any existing connection
		disconnect();
		// Connect to get fresh data
		connect();

		// Cleanup on unmount
		return () => {
			disconnect();
		};
	}, []);

	console.log({data, isConnected, error});

	if (data === null) {
		return (
			<main className="min-h-screen bg-white p-4">
				{/* Header */}
				<SettingsMenu />

				{/* Main Content */}
				<div className="mt-12 px-4 flex flex-col items-center w-full">
					<h1 className="text-3xl font-bold text-gray-900 mb-8">Cargando...</h1>
				</div>
			</main>
		);
	}

	if (data === undefined) {
		return (
			<main className="min-h-screen bg-white p-4">
				{/* Header */}
				<SettingsMenu />

				{/* Main Content */}
				<div className="mt-12 px-4 flex flex-col items-center w-full">
					<h1 className="text-center text-3xl font-bold text-gray-900 mb-8">No hay emergencias disponibles</h1>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-white p-4">
			{/* Header */}
			<SettingsMenu />

			{/* Main Content */}
			<div className="mt-12 px-4 flex flex-col items-center w-full">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">En proceso</h1>

				{/* Patient Information */}
				{data.map((emergency) => (
					<EmergencyCard
						key={emergency.emergencyId}
						userName={`${emergency.patient.firstName} ${emergency.patient.lastName}`}
						userPhone={emergency.patient.phoneNumber}
						emergencyId={emergency.emergencyId}
						emergency={emergency}
					/>
				))}
			</div>
		</main>
	);
}
