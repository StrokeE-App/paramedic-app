import {render, screen, fireEvent} from '@testing-library/react';
import EmergencyCard from '@/components/EmergencyCard';
import {useRouter} from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

describe('EmergencyCard Component', () => {
	const mockRouter = {
		push: jest.fn(),
	};

	const mockEmergency = {
		id: '123',
		location: {lat: 0, lng: 0},
		timestamp: new Date().toISOString(),
		status: 'active',
	};

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue(mockRouter);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders user information correctly', () => {
		render(<EmergencyCard userName="John Doe" userPhone="1234567890" emergencyId="123" emergency={mockEmergency} />);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('+57 1234567890')).toBeInTheDocument();
	});

	it('navigates to emergency page when clicked', () => {
		render(<EmergencyCard userName="John Doe" userPhone="1234567890" emergencyId="123" emergency={mockEmergency} />);

		const card = screen.getByText('John Doe').parentElement;
		fireEvent.click(card!);

		expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/emergency/123?data='));
	});

	it('has correct styling classes', () => {
		render(<EmergencyCard userName="John Doe" userPhone="1234567890" emergencyId="123" emergency={mockEmergency} />);

		const container = screen.getByText('John Doe').parentElement;
		expect(container).toHaveClass('border-b');
		expect(container).toHaveClass('border-red-200');
		expect(container).toHaveClass('py-4');
		expect(container).toHaveClass('w-full');
		expect(container).toHaveClass('max-w-80');
		expect(container).toHaveClass('cursor-pointer');
	});
});
