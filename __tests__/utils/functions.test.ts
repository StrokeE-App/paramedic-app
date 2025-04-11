import {formatDate} from '@/utils/functions';

describe('formatDate', () => {
	beforeAll(() => {
		// Mock Intl.DateTimeFormat for consistent output
		const mockFormat = jest.fn(() => '2 abr 2024, 12:00:00');
		global.Intl.DateTimeFormat = jest.fn(() => ({
			format: mockFormat,
		})) as any;
	});

	it('formats a valid Date object', () => {
		const date = new Date('2024-04-02T12:00:00Z');
		expect(formatDate(date)).toBe('2 abr 2024, 12:00:00');
	});

	it('formats a valid date string', () => {
		const dateString = '2024-04-02T12:00:00Z';
		expect(formatDate(dateString)).toBe('2 abr 2024, 12:00:00');
	});

	it('returns "Ahorita" for null date', () => {
		expect(formatDate(null)).toBe('Ahorita');
	});

	it('returns "Ahorita" for undefined date', () => {
		expect(formatDate(undefined)).toBe('Ahorita');
	});

	it('returns "Fecha desconocida" for invalid date string', () => {
		const invalidDate = 'not-a-date';
		expect(formatDate(invalidDate)).toBe('Fecha desconocida');
	});

	it('uses correct Intl.DateTimeFormat options', () => {
		const date = new Date('2024-04-02T12:00:00Z');
		formatDate(date);

		expect(Intl.DateTimeFormat).toHaveBeenCalledWith('es-CO', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	});
});
