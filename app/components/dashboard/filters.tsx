import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Limit, Period } from '@/types/dashboard';

type PeriodTogglesProps = {
	value: string;
	onChange: (value: Period) => void;
};

type YearSelectProps = {
	value: string;
	onChange: (value: string) => void;
	fromYear: number;
};

type LimitSelectProps = {
	value: Limit;
	onChange: (value: Limit) => void;
};

export const PeriodToggles = ({ value, onChange }: PeriodTogglesProps) => {
	const t = useTranslations('dashboard.filters');
	return (
		<ButtonGroup>
			<Button
				variant={value === 'day' ? 'default' : 'outline'}
				onClick={() => onChange('day')}
				size="sm"
				className="px-4"
			>
				{t('day')}
			</Button>
			<Button
				variant={value === 'week' ? 'default' : 'outline'}
				onClick={() => onChange('week')}
				size="sm"
				className="px-4"
			>
				{t('week')}
			</Button>
			<Button
				variant={value === 'month' ? 'default' : 'outline'}
				onClick={() => onChange('month')}
				size="sm"
				className="px-4"
			>
				{t('month')}
			</Button>
		</ButtonGroup>
	);
};

export const YearSelect = ({ value, onChange, fromYear }: YearSelectProps) => {
	const t = useTranslations('dashboard.filters');
	const isYearSelected = /^\d{4}$/.test(value);
	const currentYear = new Date().getFullYear();
	const startYear = fromYear;
	const safeStartYear = Math.min(startYear, currentYear);
	const years = Array.from(
		{ length: currentYear - safeStartYear + 1 },
		(_, i) => (currentYear - i).toString()
	);

	return (
		<Select value={isYearSelected ? value : ''} onValueChange={onChange}>
			<SelectTrigger
				className={cn(
					'w-24',
					isYearSelected ? 'border-primary ring-1 ring-primary' : ''
				)}
			>
				<SelectValue placeholder={t('Year')} />
			</SelectTrigger>
			<SelectContent>
				{years.map((year) => (
					<SelectItem key={year} value={year}>
						{year}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export const LimitSelect = ({ value, onChange }: LimitSelectProps) => {
	const t = useTranslations('dashboard.filters');
	const limits: Limit[] = [10, 25, 50];

	return (
		<Select
			value={value.toString()}
			onValueChange={(v) => onChange(Number(v) as Limit)}
		>
			<SelectTrigger className="w-32">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{limits.map((limit) => (
					<SelectItem key={limit} value={limit.toString()}>
						{t('top', { count: limit })}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
