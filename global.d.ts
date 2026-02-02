import type messages from './messages/en.ts';
import type { AppMessages } from './messages/en.ts';

declare module 'next-intl' {
	interface AppConfig {
		Messages: typeof messages;
		Locale: 'uk' | 'en';
	}
}

declare global {
	interface IntlMessages extends AppMessages {}
}
