export const getTodayInUserTz = (timezone: string = 'UTC') => {
	return new Date().toLocaleDateString('en-CA', { timeZone: timezone });
};
