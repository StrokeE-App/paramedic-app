import {render, screen} from '@testing-library/react';
import Dashboard from '@/app/dashboard/page';
import {useSseContext} from '@/context/SseContext';

// Mock the SseContext
jest.mock('@/context/SseContext', () => ({
	useSseContext: jest.fn(),
}));

describe('Dashboard Page', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should show loading state when data is null', () => {
		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: null,
			isConnected: false,
			error: null,
			connect: jest.fn(),
			disconnect: jest.fn(),
		});

		render(<Dashboard />);
		expect(screen.getByText('Cargando...')).toBeInTheDocument();
	});

	it('should show no emergencies message when data is undefined', () => {
		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: undefined,
			isConnected: false,
			error: null,
			connect: jest.fn(),
			disconnect: jest.fn(),
		});

		render(<Dashboard />);
		expect(screen.getByText('No hay emergencias disponibles')).toBeInTheDocument();
	});

	it('should show emergencies when data is available', () => {
		const mockEmergencies = [
			{
				emergencyId: '1',
				patient: {
					firstName: 'John',
					lastName: 'Doe',
					phoneNumber: '1234567890',
				},
				location: '123 Main St',
				status: 'pending',
			},
		];

		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: mockEmergencies,
			isConnected: true,
			error: null,
			connect: jest.fn(),
			disconnect: jest.fn(),
		});

		render(<Dashboard />);
		expect(screen.getByText('En proceso')).toBeInTheDocument();
	});

	it('should show error state when there is an error', () => {
		const mockError = new Error('Connection failed');

		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: null,
			isConnected: false,
			error: mockError,
			connect: jest.fn(),
			disconnect: jest.fn(),
		});

		render(<Dashboard />);
		expect(screen.getByText('Cargando...')).toBeInTheDocument();
	});
});
