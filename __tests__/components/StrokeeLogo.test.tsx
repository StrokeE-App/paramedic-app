import {render, screen} from '@testing-library/react';
import {StrokeeLogo} from '@/components/StrokeeLogo';

describe('StrokeeLogo Component', () => {
	it('renders the logo with correct text', () => {
		render(<StrokeeLogo />);

		const logoText = screen.getByText('STROKEE');
		expect(logoText).toBeInTheDocument();
		expect(logoText).toHaveClass('text-red-600');
		expect(logoText).toHaveClass('text-2xl');
		expect(logoText).toHaveClass('font-bold');
		expect(logoText).toHaveClass('tracking-wider');
	});

	it('renders the Siren icon', () => {
		render(<StrokeeLogo />);

		const sirenIcon = document.querySelector('svg');
		expect(sirenIcon).toBeInTheDocument();
		expect(sirenIcon).toHaveAttribute('width', '64');
		expect(sirenIcon).toHaveAttribute('height', '64');
		expect(sirenIcon).toHaveAttribute('stroke', '#d63a3a');
	});
});
