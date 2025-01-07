'use client';
import {EmergencyCard} from '@/components/EmergencyCard';
import {useAuth} from '@/context/AuthContext';
import {SignOut} from '@/firebase/config';

export default function Dashboard() {
	const {user} = useAuth();

	const handleLogOut = async () => {
		try {
			await SignOut();
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	return (
		<main className="min-h-screen bg-white p-4">
			{/* Header */}
			<div className="flex items-center gap-2 text-red-600">
				{/* <Settings className="w-8 h-8" /> */}
				<span className="text-lg font-medium">Configuración</span>
			</div>

			{/* Main Content */}
			<div className="mt-12 px-4 flex flex-col items-center w-full">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">En proceso</h1>

				{/* Patient Information */}
				<EmergencyCard />
				<EmergencyCard />
				<EmergencyCard />
				<EmergencyCard />
			</div>
		</main>
	);
}
