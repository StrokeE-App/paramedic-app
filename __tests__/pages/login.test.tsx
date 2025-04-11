import {render, screen} from '@testing-library/react';
import Login from '@/app/login/page';
import {useAuth} from '@/context/AuthContext';
import {useRouter} from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

// Mock the AuthContext
jest.mock('@/context/AuthContext', () => ({
	useAuth: jest.fn(),
}));

describe('Login Page', () => {
	const mockRouter = {
		push: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue(mockRouter);
	});

	it('should show loading spinner when authentication is loading', () => {
		(useAuth as jest.Mock).mockReturnValue({
			isAuthenticated: false,
			isLoading: true,
		});

		render(<Login />);
		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	it('should show login form when not authenticated', () => {
		(useAuth as jest.Mock).mockReturnValue({
			isAuthenticated: false,
			isLoading: false,
		});

		render(<Login />);
		expect(screen.queryByRole('status')).not.toBeInTheDocument();
		expect(screen.getByRole('form')).toBeInTheDocument();
	});

	it('should redirect to dashboard when authenticated', () => {
		(useAuth as jest.Mock).mockReturnValue({
			isAuthenticated: true,
			isLoading: false,
		});

		render(<Login />);
		expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
	});

	it('should not redirect while loading', () => {
		(useAuth as jest.Mock).mockReturnValue({
			isAuthenticated: true,
			isLoading: true,
		});

		render(<Login />);
		expect(mockRouter.push).not.toHaveBeenCalled();
	});
});
