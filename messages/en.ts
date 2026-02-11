import common from './en/common.json';
import dashboard from './en/dashboard.json';
import landing from './en/landing.json';

const en = {
	common,
	dashboard,
	landing,
};

type DeepString<T> = T extends object
	? { [K in keyof T]: DeepString<T[K]> }
	: string;

export type AppMessages = DeepString<typeof en>;

export default en;
