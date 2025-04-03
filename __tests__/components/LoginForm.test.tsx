import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {LoginForm} from '@/components/LoginForm';
import {SignIn} from '@/firebase/config';
import toast from 'react-hot-toast';

// Mock firebase SignIn
jest.mock('@/firebase/config', () => ({
	SignIn: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
	__esModule: true,
	default: {
		loading: jest.fn(() => 'loading-toast-id'),
		success: jest.fn(),
		error: jest.fn(),
	},
}));

describe('LoginForm Component', () => {
	const mockSignIn = SignIn as jest.MockedFunction<typeof SignIn>;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders form elements correctly', () => {
		render(<LoginForm />);

		expect(screen.getByPlaceholderText('Correo Electrónico')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
		expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
	});

	it('updates input values on change', () => {
		render(<LoginForm />);

		const emailInput = screen.getByPlaceholderText('Correo Electrónico');
		const passwordInput = screen.getByPlaceholderText('Contraseña');

		fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
		fireEvent.change(passwordInput, {target: {value: 'password123'}});

		expect(emailInput).toHaveValue('test@example.com');
		expect(passwordInput).toHaveValue('password123');
	});

	it('shows loading state during form submission', async () => {
		mockSignIn.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
		render(<LoginForm />);

		const emailInput = screen.getByPlaceholderText('Correo Electrónico');
		const passwordInput = screen.getByPlaceholderText('Contraseña');
		const submitButton = screen.getByText('Iniciar Sesión');

		fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
		fireEvent.change(passwordInput, {target: {value: 'password123'}});
		fireEvent.click(submitButton);

		expect(await screen.findByText('Cargando...')).toBeInTheDocument();
		expect(toast.loading).toHaveBeenCalledWith('Iniciando sesión...');
	});

	it('handles successful login', async () => {
		mockSignIn.mockResolvedValueOnce(undefined);
		render(<LoginForm />);

		const emailInput = screen.getByPlaceholderText('Correo Electrónico');
		const passwordInput = screen.getByPlaceholderText('Contraseña');
		const submitButton = screen.getByText('Iniciar Sesión');

		fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
		fireEvent.change(passwordInput, {target: {value: 'password123'}});
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
			expect(toast.success).toHaveBeenCalledWith('¡Bienvenido!', {id: 'loading-toast-id'});
		});
	});

	it('handles login error', async () => {
		const errorMessage = 'Invalid credentials';
		mockSignIn.mockRejectedValueOnce(new Error(errorMessage));
		render(<LoginForm />);

		const emailInput = screen.getByPlaceholderText('Correo Electrónico');
		const passwordInput = screen.getByPlaceholderText('Contraseña');
		const submitButton = screen.getByText('Iniciar Sesión');

		fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
		fireEvent.change(passwordInput, {target: {value: 'wrong-password'}});
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(errorMessage, {id: 'loading-toast-id'});
		});
	});

	it('handles unexpected error', async () => {
		mockSignIn.mockRejectedValueOnce('Unexpected error');
		render(<LoginForm />);

		const emailInput = screen.getByPlaceholderText('Correo Electrónico');
		const passwordInput = screen.getByPlaceholderText('Contraseña');
		const submitButton = screen.getByText('Iniciar Sesión');

		fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
		fireEvent.change(passwordInput, {target: {value: 'password123'}});
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith('Un error inesperado ha ocurrido.', {
				id: 'loading-toast-id',
			});
		});
	});

	it('validates required fields', () => {
		render(<LoginForm />);

		const emailInput = screen.getByPlaceholderText('Correo Electrónico');
		const passwordInput = screen.getByPlaceholderText('Contraseña');

		expect(emailInput).toBeRequired();
		expect(passwordInput).toBeRequired();
	});
});
