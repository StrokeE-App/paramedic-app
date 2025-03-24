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
	status?: string;
};

export default function ConfirmStrokeComponent({emergencyId, status = 'TO_AMBULANCE'}: ConfirmStrokeComponentProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [actionType, setActionType] = useState('');
	const [selectedClinic, setSelectedClinic] = useState<string>('');
	const [deliveryDate, setDeliveryDate] = useState<string>(new Date().toISOString().slice(0, 19));
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
				healthcenterId: selectedClinic,
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

	// Mark patient as delivered
	const markAsDelivered = async () => {
		const loadingToast = toast.loading('Registrando entrega del paciente...');
		try {
			// Convert the local datetime to UTC ISO string
			const utcDate = new Date(deliveryDate).toISOString();
			// console.log(utcDate);
			await apiClient.post('/paramedic/deliver-patient', {
				emergencyId,
				deliveredDate: utcDate,
			});
			toast.success('Paciente entregado correctamente', {id: loadingToast});
			router.push('/dashboard');
		} catch (error) {
			toast.error('Error al registrar la entrega del paciente', {id: loadingToast});
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

	const handleDeliveryModalOpen = () => {
		// Get current date in local timezone
		const now = new Date();
		// Format it as YYYY-MM-DDThh:mm for the datetime-local input
		const localDate = now.toLocaleString('sv', {timeZone: 'America/Bogota'}).replace(' ', 'T');
		setDeliveryDate(localDate);
		setIsDeliveryModalOpen(true);
	};

	const handleDeliveryConfirm = () => {
		markAsDelivered();
		setIsDeliveryModalOpen(false);
	};

	const openModal = (title: string, action: string) => {
		setModalTitle(title);
		setActionType(action);
		setIsModalOpen(true);
	};

	return (
		<div className="w-10/12 max-w-md mx-auto flex flex-col space-y-4 mb-5">
			{status === 'TO_AMBULANCE' && (
				<>
					<Button title="Confirmar Stroke" onClick={() => openModal('¿Estás seguro que quieres confirmar el stroke?', 'confirm')} color="red" />
					<Button title="Descartar Stroke" onClick={() => openModal('¿Estás seguro que quieres descartar el stroke?', 'discard')} color="green" />
				</>
			)}

			{status === 'CONFIRMED' && <Button title="Paciente Entregado" onClick={handleDeliveryModalOpen} color="blue" />}

			<ConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirm} title={modalTitle} disabled={!selectedClinic}>
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

			<ConfirmModal
				isOpen={isDeliveryModalOpen}
				onClose={() => setIsDeliveryModalOpen(false)}
				onConfirm={handleDeliveryConfirm}
				title="¿Estás seguro que quieres registrar la entrega del paciente?"
			>
				<div className="mt-4">
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha y hora de entrega (Hora Colombia)</label>
					<input
						type="datetime-local"
						value={deliveryDate}
						onChange={(e) => setDeliveryDate(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
			</ConfirmModal>
		</div>
	);
}
