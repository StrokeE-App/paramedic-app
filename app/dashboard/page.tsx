'use client';

// Components
import EmergencyCard from '@/components/EmergencyCard';
import SettingsMenu from '@/components/SettingsMenu';

// Context
import {useSseContext} from '@/context/SseContext';

export default function Dashboard() {
	const {emergencies: data, isConnected, error} = useSseContext();

	console.log({data, isConnected, error});

	if (!data) {
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
						userName={`${emergency.patient.firstName}`}
						userPhone={emergency.patient.phoneNumber}
						emergencyId={emergency.emergencyId}
						emergency={emergency}
					/>
				))}
			</div>
		</main>
	);
}
