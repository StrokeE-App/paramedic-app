import React from 'react';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import ConfirmStrokeComponent from '@/components/ConfirmStrokeComponent';
import apiClient from '@/api/apiClient';
import toast from 'react-hot-toast';
import {useClinics} from '@/context/ClinicContext';
import {useRouter} from 'next/navigation';

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

jest.mock('@/api/apiClient', () => ({
	post: jest.fn(),
}));

jest.mock('@/context/ClinicContext', () => ({
	useClinics: jest.fn().mockReturnValue({
		clinics: [
			{id: '1', name: 'Clinic 1'},
			{id: '2', name: 'Clinic 2'},
		],
		isLoading: false,
	}),
}));

jest.mock('react-hot-toast', () => ({
	loading: jest.fn(() => 'loading-toast-id'),
	success: jest.fn(),
	error: jest.fn(),
}));

describe('ConfirmStrokeComponent', () => {
	const mockRouter = {
		push: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue(mockRouter);
	});

	it('handles delivery confirmation', async () => {
		const mockDate = '2024-04-02T12:00:00';
		jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);
		(apiClient.post as jest.Mock).mockResolvedValueOnce({});

		render(<ConfirmStrokeComponent emergencyId="123" status="CONFIRMED" />);

		// Open delivery modal
		fireEvent.click(screen.getByText('Paciente Entregado'));

		// Set delivery date
		const dateInput = screen.getByTestId('delivery-date');
		fireEvent.change(dateInput, {target: {value: '2024-04-02T12:00'}});

		// Confirm delivery
		fireEvent.click(screen.getByText('Confirmar'));

		await waitFor(() => {
			expect(apiClient.post).toHaveBeenCalledWith('/paramedic/deliver-patient', {
				emergencyId: '123',
				deliveredDate: expect.any(String),
			});
			expect(toast.success).toHaveBeenCalledWith('Paciente entregado correctamente', {id: 'loading-toast-id'});
			expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
		});
	});

	it('handles API errors in confirm stroke', async () => {
		(apiClient.post as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
		(useClinics as jest.Mock).mockReturnValue({
			clinics: [{id: '1', name: 'Clinic 1'}],
			isLoading: false,
		});

		render(<ConfirmStrokeComponent emergencyId="123" />);

		// Open confirm modal
		fireEvent.click(screen.getByText('Confirmar Stroke'));

		// Confirm action
		fireEvent.click(screen.getByText('Confirmar'));

		await waitFor(() => {
			expect(toast.loading).toHaveBeenCalledWith('Confirmando emergencia...');
			expect(toast.error).toHaveBeenCalledWith('Error al confirmar la emergencia', {id: 'loading-toast-id'});
		});
	});

	it('validates clinic selection before confirming stroke', async () => {
		// Mock empty clinics
		(useClinics as jest.Mock).mockReturnValue({
			clinics: [],
			isLoading: false,
		});

		render(<ConfirmStrokeComponent emergencyId="123" />);

		// Open confirm modal
		fireEvent.click(screen.getByText('Confirmar Stroke'));

		// Try to confirm without selecting clinic
		const confirmButton = screen.getByText('Confirmar');
		expect(confirmButton).toBeDisabled();

		// Verify that the error message is shown
		expect(toast.error).not.toHaveBeenCalled();
		expect(apiClient.post).not.toHaveBeenCalled();
	});
});
