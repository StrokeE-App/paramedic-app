'use client';

import {Settings, X, Bell, BellOff} from 'lucide-react';
import {useState, useEffect} from 'react';
import {SignOut} from '@/firebase/config';
import {useAuth} from '@/context/AuthContext';
import {useNotifications} from '@/hooks/useNotifications';

export default function SettingsMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const {user} = useAuth();
	const {isSubscribed, error, subscribe, unsubscribe} = useNotifications('paramedic', user?.uid || '');

	// Close panel when pressing Escape key
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, []);

	const handleLogOut = async () => {
		try {
			if (isSubscribed) {
				await unsubscribe();
			}
			await SignOut();
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	const handleNotificationToggle = async () => {
		try {
			if (isSubscribed) {
				await unsubscribe();
			} else {
				await subscribe();
			}
		} catch (error) {
			console.error('Error toggling notifications:', error);
		}
	};

	return (
		<>
			{/* Settings Button */}
			<div onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-customRed cursor-pointer z-20">
				<Settings className="w-8 h-8" />
				<span className="text-lg font-medium">Configuración</span>
			</div>

			{/* Overlay */}
			{isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-30" onClick={() => setIsOpen(false)} />}

			{/* Side Panel */}
			<div
				className={`fixed top-0 left-0 h-full w-3/4 max-w-sm bg-white transform transition-transform duration-300 ease-in-out z-40 ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				{/* Panel Header */}
				<div className="relative bg-customRed text-white p-6">
					<h2 className="text-2xl font-medium">Hola,</h2>
					<p className="text-2xl font-black">Paramédico!</p>
					<X onClick={() => setIsOpen(false)} className="absolute top-6 right-6 w-6 h-6 cursor-pointer" />
				</div>

				{/* Panel Content */}
				<div className="p-6">
					{error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

					<button onClick={handleNotificationToggle} className="flex items-center gap-2 text-gray-700 hover:text-customRed transition-colors mb-4">
						{isSubscribed ? (
							<>
								<Bell className="w-5 h-5" />
								<span>Desactivar notificaciones</span>
							</>
						) : (
							<>
								<BellOff className="w-5 h-5" />
								<span>Activar notificaciones</span>
							</>
						)}
					</button>
				</div>

				{/* Panel Footer with Logout Button */}
				<div className="absolute bottom-0 left-0 right-0 p-6">
					<button onClick={handleLogOut} className="text-customRed text-lg font-medium hover:text-red-700">
						Cerrar sesión
					</button>
				</div>
			</div>
		</>
	);
}
