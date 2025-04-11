import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '@/components/Button';

describe('Button Component', () => {
	const mockOnClick = jest.fn();

	beforeEach(() => {
		mockOnClick.mockClear();
	});

	it('renders with red color scheme', () => {
		render(<Button title="Test Button" onClick={mockOnClick} color="red" />);

		const button = screen.getByText('Test Button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass('bg-customRed');
		expect(button).toHaveClass('text-customWhite');
	});

	it('renders with green color scheme', () => {
		render(<Button title="Test Button" onClick={mockOnClick} color="green" />);

		const button = screen.getByText('Test Button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass('bg-customGreen');
		expect(button).toHaveClass('text-customBlack');
	});

	it('calls onClick handler when clicked', () => {
		render(<Button title="Test Button" onClick={mockOnClick} color="red" />);

		const button = screen.getByText('Test Button');
		fireEvent.click(button);
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});
});
