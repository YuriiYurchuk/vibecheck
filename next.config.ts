import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
	experimental: {
		createMessagesDeclaration: './messages/en/dashboard.json',
	},
});

const nextConfig: NextConfig = {
	output: 'standalone',
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: '*.scdn.co' },
			{ protocol: 'https', hostname: '*.spotifycdn.com' },
			{ protocol: 'https', hostname: '*.googleusercontent.com' },
			{ protocol: 'https', hostname: '*.fbsbx.com' },
		],
	},
};

export default withNextIntl(nextConfig);
