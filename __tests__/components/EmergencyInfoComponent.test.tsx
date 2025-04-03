import {render, screen} from '@testing-library/react';
import EmergencyInfoComponent from '@/components/EmergencyInfoComponent';
import {formatDate} from '@/utils/functions';

// Mock the formatDate function
jest.mock('@/utils/functions', () => ({
	formatDate: jest.fn(() => 'Hace 5 minutos'),
}));

describe('EmergencyInfoComponent', () => {
	const mockEmergency = {
		id: '123',
		startDate: '2024-04-02T12:00:00Z',
		status: 'active',
		location: {lat: 0, lng: 0},
		patient: {
			firstName: 'John',
			lastName: 'Doe',
			phoneNumber: '1234567890',
			age: 45,
			weight: 70,
			height: 1.75,
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders loading state when emergency is null', () => {
		render(<EmergencyInfoComponent emergency={null} />);

		expect(screen.getByText('Cargando...')).toBeInTheDocument();
	});

	it('renders emergency information when emergency is provided', () => {
		render(<EmergencyInfoComponent emergency={mockEmergency} />);

		// Check patient name
		expect(screen.getByText('John Doe')).toBeInTheDocument();

		// Check patient details
		expect(screen.getByText('1234567890')).toBeInTheDocument();
		expect(screen.getByText('45 años')).toBeInTheDocument();
		expect(screen.getByText('70 kg')).toBeInTheDocument();
		expect(screen.getByText('1.75 m')).toBeInTheDocument();

		// Check labels
		expect(screen.getByText('Teléfono')).toBeInTheDocument();
		expect(screen.getByText('Edad')).toBeInTheDocument();
		expect(screen.getByText('Peso')).toBeInTheDocument();
		expect(screen.getByText('Estatura')).toBeInTheDocument();
		expect(screen.getByText('Tiempo desde que inició la emergencia')).toBeInTheDocument();

		// Check formatted date
		expect(formatDate).toHaveBeenCalledWith(mockEmergency.startDate);
		expect(screen.getByText('Hace 5 minutos')).toBeInTheDocument();
	});

	it('has correct styling classes', () => {
		render(<EmergencyInfoComponent emergency={mockEmergency} />);

		// Check container classes
		const container = screen.getByText('John Doe').parentElement?.parentElement?.parentElement;
		expect(container).toHaveClass('w-11/12');
		expect(container).toHaveClass('mx-auto');
		expect(container).toHaveClass('p-6');

		// Check name heading classes
		const nameHeading = screen.getByText('John Doe');
		expect(nameHeading).toHaveClass('text-2xl');
		expect(nameHeading).toHaveClass('font-bold');
		expect(nameHeading).toHaveClass('inline-block');
		expect(nameHeading).toHaveClass('px-4');
		expect(nameHeading).toHaveClass('pb-1');

		// Check grid layout
		const grid = screen.getByText('Teléfono').closest('div.grid');
		expect(grid).toHaveClass('grid-cols-2');
		expect(grid).toHaveClass('gap-x-6');
		expect(grid).toHaveClass('gap-y-6');
	});
});
