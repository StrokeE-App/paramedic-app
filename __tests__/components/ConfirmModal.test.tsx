import {render, screen, fireEvent} from '@testing-library/react';
import ConfirmModal from '@/components/ConfirmModal';

describe('ConfirmModal Component', () => {
	const mockOnClose = jest.fn();
	const mockOnConfirm = jest.fn();
	const defaultProps = {
		isOpen: true,
		onClose: mockOnClose,
		onConfirm: mockOnConfirm,
		title: 'Test Modal',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders nothing when isOpen is false', () => {
		render(<ConfirmModal {...defaultProps} isOpen={false} />);
		expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
	});

	it('renders modal content when isOpen is true', () => {
		render(<ConfirmModal {...defaultProps} />);

		expect(screen.getByText('Test Modal')).toBeInTheDocument();
		expect(screen.getByText('Cancelar')).toBeInTheDocument();
		expect(screen.getByText('Confirmar')).toBeInTheDocument();
	});

	it('renders children content', () => {
		render(
			<ConfirmModal {...defaultProps}>
				<div>Test Content</div>
			</ConfirmModal>
		);

		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('calls onClose when cancel button is clicked', () => {
		render(<ConfirmModal {...defaultProps} />);

		fireEvent.click(screen.getByText('Cancelar'));
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('calls onConfirm when confirm button is clicked', () => {
		render(<ConfirmModal {...defaultProps} />);

		fireEvent.click(screen.getByText('Confirmar'));
		expect(mockOnConfirm).toHaveBeenCalledTimes(1);
	});

	it('disables confirm button when disabled prop is true', () => {
		render(<ConfirmModal {...defaultProps} disabled={true} />);

		const confirmButton = screen.getByText('Confirmar');
		expect(confirmButton).toBeDisabled();
		expect(confirmButton).toHaveClass('disabled:opacity-50');
		expect(confirmButton).toHaveClass('disabled:cursor-not-allowed');
	});

	it('calls onClose when Escape key is pressed', () => {
		render(<ConfirmModal {...defaultProps} />);

		fireEvent.keyDown(document, {key: 'Escape'});
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose for other key presses', () => {
		render(<ConfirmModal {...defaultProps} />);

		fireEvent.keyDown(document, {key: 'Enter'});
		expect(mockOnClose).not.toHaveBeenCalled();
	});

	it('removes event listener when component unmounts', () => {
		const {unmount} = render(<ConfirmModal {...defaultProps} />);

		unmount();
		fireEvent.keyDown(document, {key: 'Escape'});
		expect(mockOnClose).not.toHaveBeenCalled();
	});

	it('has correct styling classes', () => {
		render(<ConfirmModal {...defaultProps} />);

		const overlay = screen.getByTestId('modal-overlay');
		const modal = screen.getByTestId('modal-content');

		expect(overlay).toHaveClass('fixed');
		expect(overlay).toHaveClass('inset-0');
		expect(overlay).toHaveClass('bg-black');
		expect(overlay).toHaveClass('bg-opacity-50');
		expect(overlay).toHaveClass('flex');
		expect(overlay).toHaveClass('items-center');
		expect(overlay).toHaveClass('justify-center');
		expect(overlay).toHaveClass('z-50');

		expect(modal).toHaveClass('bg-white');
		expect(modal).toHaveClass('p-6');
		expect(modal).toHaveClass('rounded-lg');
		expect(modal).toHaveClass('shadow-xl');
		expect(modal).toHaveClass('max-w-md');
		expect(modal).toHaveClass('w-full');
		expect(modal).toHaveClass('mx-4');
	});
});
