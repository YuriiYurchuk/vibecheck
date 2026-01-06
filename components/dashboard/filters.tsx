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
	const tFilters = useTranslations('dashboard.shared.filters');
	return (
		<ButtonGroup className="p-1 border border-border/50 rounded-lg">
			<Button
				variant={value === 'day' ? 'default' : 'ghost'}
				onClick={() => onChange('day')}
				size="sm"
				className="cursor-pointer"
			>
				{tFilters('day')}
			</Button>
			<Button
				variant={value === 'week' ? 'default' : 'ghost'}
				onClick={() => onChange('week')}
				size="sm"
				className="cursor-pointer"
			>
				{tFilters('week')}
			</Button>
			<Button
				variant={value === 'month' ? 'default' : 'ghost'}
				onClick={() => onChange('month')}
				size="sm"
				className="cursor-pointer"
			>
				{tFilters('month')}
			</Button>
		</ButtonGroup>
	);
};

export const YearSelect = ({ value, onChange, fromYear }: YearSelectProps) => {
	const tFilters = useTranslations('dashboard.shared.filters');
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
				<SelectValue placeholder={tFilters('year')} />
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
	const tFilters = useTranslations('dashboard.shared.filters');
	const limits: Limit[] = [10, 25, 50];

	return (
		<Select
			value={value.toString()}
			onValueChange={(v) => onChange(Number(v) as Limit)}
		>
			<SelectTrigger className="w-32 cursor-pointer">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{limits.map((limit) => (
					<SelectItem
						key={limit}
						value={limit.toString()}
						className="cursor-pointer"
					>
						{tFilters('top', { count: String(limit) })}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
