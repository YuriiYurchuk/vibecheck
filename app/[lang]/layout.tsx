import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { QueryProvider } from '@/components/providers/query-provider';
import { TimezoneSync } from '@/components/providers/timezone-sync';
import './globals.css';

const montserrat = Montserrat({
	variable: '--font-montserrat',
	subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
	title: 'VibeCheck',
	description:
		'A mood tracking app to help you understand your emotions and improve your mental well-being.',
};

export async function generateStaticParams() {
	return [{ lang: 'en' }, { lang: 'uk' }];
}

export default async function RootLayout({
	children,
	params,
}: LayoutProps<'/[lang]'>) {
	return (
		<html
			lang={(await params).lang}
			suppressHydrationWarning
			className={`${montserrat.variable} antialiased`}
		>
			<body>
				<NextIntlClientProvider>
					<ThemeProvider attribute="class">
						<QueryProvider>
							<TimezoneSync />
							{children}
						</QueryProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
