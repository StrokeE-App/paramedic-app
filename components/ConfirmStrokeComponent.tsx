'use client';

import React, {useState, useEffect} from 'react';

// Components
import Button from './Button';
import ConfirmModal from './ConfirmModal';
import SearchableSelect from './SearchableSelect';
import toast from 'react-hot-toast';

// API
import apiClient from '@/api/apiClient';
import {useRouter} from 'next/navigation';

// Context
import {useClinics} from '@/context/ClinicContext';

export type ConfirmStrokeComponentProps = {
	emergencyId: string;
};

export default function ConfirmStrokeComponent({emergencyId}: ConfirmStrokeComponentProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [actionType, setActionType] = useState('');
	const [selectedClinic, setSelectedClinic] = useState<string>('');
	const {clinics, isLoading} = useClinics();

	const router = useRouter();

	// Set initial clinic when clinics are loaded
	useEffect(() => {
		if (clinics.length > 0 && !selectedClinic) {
			setSelectedClinic(clinics[0].id);
		}
	}, [clinics, selectedClinic]);

	// Confirm emergency
	const confirmEmergency = async () => {
		if (!selectedClinic) {
			toast.error('Por favor selecciona una clínica');
			return;
		}

		const loadingToast = toast.loading('Confirmando emergencia...');
		try {
			const pickupDate = new Date().toISOString().slice(0, 19);
			await apiClient.post('/paramedic/confirm-stroke', {
				emergencyId,
				pickupDate,
				clinicId: selectedClinic,
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
		setModalTitle(title);
		setActionType(action);
		setIsModalOpen(true);
	};

	return (
		<div className="w-10/12 max-w-md mx-auto flex flex-col space-y-4 mb-5">
			<Button title="Confirmar Stroke" onClick={() => openModal('¿Estás seguro que quieres confirmar el stroke?', 'confirm')} color="red" />
			<Button title="Descartar Stroke" onClick={() => openModal('¿Estás seguro que quieres descartar el stroke?', 'discard')} color="green" />

			<ConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirm} title={modalTitle}>
				{actionType === 'confirm' && (
					<div className="mt-4">
						<SearchableSelect
							options={clinics}
							value={selectedClinic}
							onChange={setSelectedClinic}
							label="Selecciona una clínica"
							placeholder="Buscar clínica..."
							disabled={isLoading}
						/>
					</div>
				)}
			</ConfirmModal>
		</div>
	);
}
