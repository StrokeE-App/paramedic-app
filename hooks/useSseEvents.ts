import {useState, useEffect, useRef} from 'react';
import {createEventSource} from '@/api/sseClient';
import {EventSourcePolyfill} from 'event-source-polyfill';

interface UseSseEventsOptions {
	url: string;
	initialConnect?: boolean;
	reconnectInterval?: number;
}

export function useSseEvents<T = unknown>({url, initialConnect = true, reconnectInterval = 5000}: UseSseEventsOptions) {
	const [data, setData] = useState<T | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const connect = () => {
		console.log('Attempting to connect to SSE...');
		if (eventSourceRef.current) {
			console.log('Closing existing connection...');
			eventSourceRef.current.close();
		}

		try {
			const eventSource = createEventSource(url);
			console.log('SSE connection created');

			eventSource.onmessage = (event) => {
				console.log('Received SSE message:', event.data);
				try {
					const parsedData = JSON.parse(event.data);
					console.log('Parsed SSE data:', parsedData);
					setData(parsedData.data);
				} catch (err) {
					console.error('Error parsing SSE data:', err);
					setError(err instanceof Error ? err : new Error('Failed to parse SSE data'));
				}
			};

			eventSource.onopen = () => {
				console.log('SSE connection opened');
				setIsConnected(true);
				setError(null);
				if (reconnectTimeoutRef.current) {
					clearTimeout(reconnectTimeoutRef.current);
					reconnectTimeoutRef.current = null;
				}
			};

			eventSource.onerror = (err) => {
				console.error('SSE connection error:', err);
				setError(err instanceof Error ? err : new Error('SSE connection error'));
				setIsConnected(false);

				if (!reconnectTimeoutRef.current) {
					console.log(`Scheduling reconnection in ${reconnectInterval}ms`);
					reconnectTimeoutRef.current = setTimeout(() => {
						console.log('Attempting reconnection...');
						reconnectTimeoutRef.current = null;
						connect();
					}, reconnectInterval);
				}
			};

			eventSourceRef.current = eventSource;
		} catch (err) {
			console.error('Failed to create SSE connection:', err);
			setError(err instanceof Error ? err : new Error('Failed to create SSE connection'));
			setIsConnected(false);
		}
	};

	const disconnect = () => {
		console.log('Disconnecting SSE...');
		if (eventSourceRef.current) {
			eventSourceRef.current.close();
			eventSourceRef.current = null;
		}
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}
		setIsConnected(false);
	};

	useEffect(() => {
		console.log('useSseEvents effect triggered');
		if (initialConnect) {
			connect();
		}

		return () => {
			console.log('Cleaning up SSE connection');
			disconnect();
		};
	}, [url, initialConnect]);

	return {
		data,
		isConnected,
		error,
		connect,
		disconnect,
	};
}
