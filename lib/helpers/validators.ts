export const validatePeriod = (period: string | null): string => {
	const allowed = ['day', 'week', 'month'];
	return period && allowed.includes(period) ? period : 'day';
};

export const validateLimit = (limit: string | null): number => {
	const parsed = Number.parseInt(limit || '10', 10);
	const allowed = [10, 25, 50];
	return allowed.includes(parsed) ? parsed : 10;
};

export const validateOffset = (offset: string | null): number => {
	const parsed = Number.parseInt(offset || '0', 10);
	return parsed >= 0 ? parsed : 0;
};
