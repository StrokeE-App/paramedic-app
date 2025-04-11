import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
	async redirects() {
		return [
			// Basic redirect
			{
				source: '/',
				destination: '/login',
				permanent: true,
			},
		];
	},
	// Add headers for service worker
	async headers() {
		return [
			{
				source: '/service-worker.js',
				headers: [
					{
						key: 'Service-Worker-Allowed',
						value: '/',
					},
				],
			},
		];
	},
};

export default nextConfig;
