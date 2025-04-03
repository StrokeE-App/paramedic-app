import {getCookie} from '@/utils/cookies';

describe('getCookie', () => {
	beforeEach(() => {
		// Clear document.cookie before each test
		document.cookie = '';
	});

	it('returns undefined when cookie does not exist', () => {
		expect(getCookie('nonexistent')).toBeUndefined();
	});

	it('returns cookie value when cookie exists', () => {
		document.cookie = 'test=value';
		expect(getCookie('test')).toBe('value');
	});

	it('returns correct cookie value when multiple cookies exist', () => {
		document.cookie = 'first=value1';
		document.cookie = 'second=value2';
		document.cookie = 'third=value3';

		expect(getCookie('second')).toBe('value2');
	});

	it('handles cookies with special characters', () => {
		document.cookie = 'test=hello%20world';
		expect(getCookie('test')).toBe('hello%20world');
	});

	it('handles cookies with equals sign in value', () => {
		document.cookie = 'test=key=value';
		expect(getCookie('test')).toBe('key=value');
	});
});
