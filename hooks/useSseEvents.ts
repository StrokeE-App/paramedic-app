import {useState, useEffect, useRef} from 'react';
import {createEventSource} from '@/api/sseClient';
import {EventSourcePolyfill} from 'event-source-polyfill';

interface UseSseEventsOptions {
	url: string;
	initialConnect?: boolean;
}

export function useSseEvents<T = any>({url, initialConnect = true}: UseSseEventsOptions) {
	const [data, setData] = useState<T | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	const connect = () => {
		if (eventSourceRef.current) return;

		try {
			const eventSource = createEventSource(url);

			// Override the default onmessage handler
			eventSource.onmessage = (event) => {
				try {
					const parsedData = JSON.parse(event.data);
					setData(parsedData.data);
					// Reset error state on successful message
					setError(null);
				} catch (err) {
					console.error('Error parsing SSE data:', err);
				}
			};

			eventSource.onopen = () => {
				setIsConnected(true);
				setError(null);
				// Clear any pending reconnection timeout
				if (reconnectTimeoutRef.current) {
					clearTimeout(reconnectTimeoutRef.current);
				}
			};

			eventSource.onerror = (err) => {
				console.error('SSE connection error:', err);
				setError(err instanceof Error ? err : new Error('SSE connection error'));
				setIsConnected(false);
				eventSource.close();
				eventSourceRef.current = null;

				// Try to reconnect after a delay
				reconnectTimeoutRef.current = setTimeout(() => {
					console.log('Attempting to reconnect SSE...');
					connect();
				}, 5000); // Retry every 5 seconds
			};

			eventSourceRef.current = eventSource;
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to create SSE connection'));
			// Try to reconnect after a delay
			reconnectTimeoutRef.current = setTimeout(() => {
				console.log('Attempting to reconnect SSE...');
				connect();
			}, 5000);
		}
	};

	const disconnect = () => {
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
		}
		if (eventSourceRef.current) {
			eventSourceRef.current.close();
			eventSourceRef.current = null;
			setIsConnected(false);
		}
	};

	// Handle visibility change
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				// Reconnect when page becomes visible if we're not already connected
				if (!isConnected) {
					connect();
				}
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [isConnected]);

	useEffect(() => {
		if (initialConnect) {
			connect();
		}

		// Cleanup on unmount
		return () => {
			disconnect();
		};
	}, [url]);

	return {
		data,
		isConnected,
		error,
		connect,
		disconnect,
	};
}
