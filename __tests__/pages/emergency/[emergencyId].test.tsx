import {render, screen, waitFor, act} from '@testing-library/react';
import EmergencyClientPage from '@/app/emergency/[emergencyId]/page';
import {useSseContext} from '@/context/SseContext';
import {useSearchParams, useRouter} from 'next/navigation';
import {ClinicProvider} from '@/context/ClinicContext';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
	useSearchParams: jest.fn(),
	useRouter: jest.fn(),
}));

// Mock the SseContext
jest.mock('@/context/SseContext', () => ({
	useSseContext: jest.fn(),
}));

// Mock the Map component
jest.mock('@/components/Map', () => {
	return function MockMap() {
		return <div data-testid="mock-map">Map Component</div>;
	};
});

describe('Emergency Detail Page', () => {
	const mockEmergency = {
		emergencyId: '123',
		patient: {
			firstName: 'John',
			lastName: 'Doe',
			phoneNumber: '1234567890',
			age: 45,
			weight: 70,
			height: 175,
		},
		location: '123 Main St',
		status: 'pending',
		latitude: 40.7128,
		longitude: -74.006,
		startDate: new Date().toISOString(),
	};

	const mockClinics = [
		{
			id: '1',
			name: 'Test Clinic',
			address: '123 Test St',
			latitude: 40.7128,
			longitude: -74.006,
		},
	];

	const mockRouter = {
		push: jest.fn(),
		back: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue(mockRouter);
	});

	const renderWithProviders = (ui: React.ReactElement) => {
		return render(<ClinicProvider>{ui}</ClinicProvider>);
	};

	it('should fetch emergency data from URL params when available', async () => {
		const mockSearchParams = new URLSearchParams();
		mockSearchParams.set('data', encodeURIComponent(JSON.stringify(mockEmergency)));
		(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: [],
		});

		await act(async () => {
			renderWithProviders(<EmergencyClientPage params={Promise.resolve({emergencyId: '123'})} />);
		});

		await waitFor(() => {
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});
	});

	it('should fetch emergency data from context when URL params are not available', async () => {
		(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: [mockEmergency],
		});

		await act(async () => {
			renderWithProviders(<EmergencyClientPage params={Promise.resolve({emergencyId: '123'})} />);
		});

		await waitFor(() => {
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});
	});

	it('should handle invalid URL params data gracefully', async () => {
		const mockSearchParams = new URLSearchParams();
		mockSearchParams.set('data', 'invalid-json');
		(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: [mockEmergency],
		});

		await act(async () => {
			renderWithProviders(<EmergencyClientPage params={Promise.resolve({emergencyId: '123'})} />);
		});

		await waitFor(() => {
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});
	});

	it('should show error state when emergency is not found', async () => {
		(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: [],
		});

		await act(async () => {
			renderWithProviders(<EmergencyClientPage params={Promise.resolve({emergencyId: '123'})} />);
		});

		await waitFor(() => {
			expect(screen.getByText('Emergencia no encontrada.')).toBeInTheDocument();
		});
	});

	// it('should render map component when location data is available', async () => {
	// 	(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
	// 	(useSseContext as jest.Mock).mockReturnValue({
	// 		emergencies: [mockEmergency],
	// 	});

	// 	await act(async () => {
	// 		renderWithProviders(<EmergencyClientPage params={Promise.resolve({emergencyId: '123'})} />);
	// 	});

	// 	await waitFor(() => {
	// 		expect(screen.getByTestId('mock-map')).toBeInTheDocument();
	// 	});
	// });
});
