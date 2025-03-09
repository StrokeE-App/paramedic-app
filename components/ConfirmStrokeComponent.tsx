'use client';

import React, {useState} from 'react';

// Components
import Button from './Button';
import ConfirmModal from './ConfirmModal';
import toast from 'react-hot-toast';

// API
import apiClient from '@/api/apiClient';
import {useRouter} from 'next/navigation';

export type ConfirmStrokeComponentProps = {
	emergencyId: string;
};

export default function ConfirmStrokeComponent({emergencyId}: ConfirmStrokeComponentProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState(''); // Estado para el título dinámico
	const [actionType, setActionType] = useState(''); // Estado para el tipo de acción

	const router = useRouter();

	// Confirm emergency
	const confirmEmergency = async () => {
		const loadingToast = toast.loading('Confirmando emergencia...');
		try {
			const pickupDate = new Date().toISOString().slice(0, 19);
			await apiClient.post('/paramedic/confirm-stroke', {
				emergencyId,
				pickupDate,
			});
			toast.success('Emergencia confirmada', {id: loadingToast});
			router.push('/dashboard');
		} catch (error) {
			toast.error('Error al confirmar la emergencia', {id: loadingToast});
			console.error(error);
		}
	};

	// Discard emergency
	const discardEmergency = async () => {
		const loadingToast = toast.loading('Descartando emergencia...');
		try {
			const pickupDate = new Date().toISOString().slice(0, 19);
			await apiClient.post('/paramedic/discard-stroke', {
				emergencyId,
				pickupDate,
			});
			toast.success('Emergencia descartada', {id: loadingToast});
			router.push('/dashboard');
		} catch (error) {
			toast.error('Error al descartar la emergencia', {id: loadingToast});
			console.error(error);
		}
	};

	// Handle confirm or discard action
	const handleConfirm = () => {
		if (actionType === 'confirm') {
			confirmEmergency();
		} else if (actionType === 'discard') {
			discardEmergency();
		}
		setIsModalOpen(false);
	};

	const openModal = (title: string, action: string) => {
		setModalTitle(title); // Establece el título dinámico
		setActionType(action); // Establece el tipo de acción
		setIsModalOpen(true); // Abre el modal
	};
	return (
		<div className="w-10/12 max-w-md mx-auto flex flex-col space-y-4 mb-5">
			<Button title="Confirmar Stroke" onClick={() => openModal('¿Estás seguro que quieres confirmar el stroke?', 'confirm')} color="red" />
			<Button title="Descartar Stroke" onClick={() => openModal('¿Estás seguro que quieres descartar el stroke?', 'discard')} color="green" />
			<ConfirmModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={handleConfirm}
				title={modalTitle} // Pasamos el título dinámico
			/>
		</div>
	);
}
