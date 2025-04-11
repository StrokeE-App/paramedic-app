import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchableSelect from '@/components/SearchableSelect';

describe('SearchableSelect Component', () => {
	const mockOptions = [
		{id: '1', name: 'Option 1'},
		{id: '2', name: 'Option 2'},
		{id: '3', name: 'Another Option'},
	];

	const mockOnChange = jest.fn();

	beforeEach(() => {
		mockOnChange.mockClear();
	});

	it('renders with label and placeholder', () => {
		render(<SearchableSelect options={mockOptions} value="" onChange={mockOnChange} label="Test Label" placeholder="Test Placeholder" />);

		expect(screen.getByText('Test Label')).toBeInTheDocument();
		expect(screen.getByText('Test Placeholder')).toBeInTheDocument();
	});

	it('displays selected option', () => {
		render(<SearchableSelect options={mockOptions} value="2" onChange={mockOnChange} label="Test Label" />);

		expect(screen.getByText('Option 2')).toBeInTheDocument();
	});

	it('opens dropdown on click', async () => {
		render(<SearchableSelect options={mockOptions} value="" onChange={mockOnChange} label="Test Label" />);

		const selectButton = screen.getByText('Buscar...');
		fireEvent.click(selectButton);

		await waitFor(() => {
			mockOptions.forEach((option) => {
				expect(screen.getByText(option.name)).toBeInTheDocument();
			});
		});
	});

	it('filters options based on search term', async () => {
		render(<SearchableSelect options={mockOptions} value="" onChange={mockOnChange} label="Test Label" />);

		// Open dropdown
		fireEvent.click(screen.getByText('Buscar...'));

		// Find and type in search input
		const searchInput = screen.getByPlaceholderText('Buscar...');
		fireEvent.change(searchInput, {target: {value: 'Another'}});

		// Check filtered results
		expect(screen.getByText('Another Option')).toBeInTheDocument();
		expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
		expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
	});

	it('calls onChange when option is selected', async () => {
		render(<SearchableSelect options={mockOptions} value="" onChange={mockOnChange} label="Test Label" />);

		// Open dropdown
		fireEvent.click(screen.getByText('Buscar...'));

		// Select an option
		fireEvent.click(screen.getByText('Option 1'));

		expect(mockOnChange).toHaveBeenCalledWith('1');
	});

	it('closes dropdown when clicking outside', async () => {
		render(<SearchableSelect options={mockOptions} value="" onChange={mockOnChange} label="Test Label" />);

		// Open dropdown
		fireEvent.click(screen.getByText('Buscar...'));

		// Verify dropdown is open
		expect(screen.getByText('Option 1')).toBeInTheDocument();

		// Click outside
		fireEvent.mouseDown(document.body);

		// Verify dropdown is closed
		await waitFor(() => {
			expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
		});
	});

	it('shows no results message when no options match search', async () => {
		render(<SearchableSelect options={mockOptions} value="" onChange={mockOnChange} label="Test Label" />);

		// Open dropdown
		fireEvent.click(screen.getByText('Buscar...'));

		// Search for non-existent option
		const searchInput = screen.getByPlaceholderText('Buscar...');
		fireEvent.change(searchInput, {target: {value: 'NonExistent'}});

		expect(screen.getByText('No se encontraron resultados')).toBeInTheDocument();
	});

	it('disables the select when disabled prop is true', () => {
		render(<SearchableSelect options={mockOptions} value="" onChange={mockOnChange} label="Test Label" disabled={true} />);

		const selectButton = screen.getByText('Buscar...');
		fireEvent.click(selectButton);

		// Verify dropdown doesn't open when disabled
		expect(screen.queryByPlaceholderText('Buscar...')).not.toBeInTheDocument();
	});
});
