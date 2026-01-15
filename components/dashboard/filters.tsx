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
import type { Limit, Mode, Period } from '@/types/dashboard';

type PeriodTogglesProps = {
	value: string;
	onChange: (value: Period) => void;
	disabled?: boolean;
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

type ModeToggleProps = {
	mode: Mode;
	onChange: (mode: Mode) => void;
};

export const PeriodToggles = ({
	value,
	onChange,
	disabled,
}: PeriodTogglesProps) => {
	const tFilters = useTranslations('dashboard.shared.filters');
	return (
		<ButtonGroup className="p-1 border border-border/50 rounded-lg">
			<Button
				variant={value === 'day' ? 'default' : 'ghost'}
				onClick={() => onChange('day')}
				size="sm"
				className="cursor-pointer"
				disabled={disabled}
			>
				{tFilters('day')}
			</Button>
			<Button
				variant={value === 'week' ? 'default' : 'ghost'}
				onClick={() => onChange('week')}
				size="sm"
				className="cursor-pointer"
				disabled={disabled}
			>
				{tFilters('week')}
			</Button>
			<Button
				variant={value === 'month' ? 'default' : 'ghost'}
				onClick={() => onChange('month')}
				size="sm"
				className="cursor-pointer"
				disabled={disabled}
			>
				{tFilters('month')}
			</Button>
		</ButtonGroup>
	);
};

export const YearSelect = ({ value, onChange, fromYear }: YearSelectProps) => {
	const tFilters = useTranslations('dashboard.shared.filters');
	const isYearSelected = /^\d{4}$/.test(value) || value === 'last_year';
	const currentYear = new Date().getFullYear();
	const safeStartYear = Math.min(fromYear, currentYear);
	const years = Array.from(
		{ length: currentYear - safeStartYear + 1 },
		(_, i) => (currentYear - i).toString()
	);

	return (
		<Select value={isYearSelected ? value : ''} onValueChange={onChange}>
			<SelectTrigger className="w-[180px] cursor-pointer">
				<SelectValue placeholder={tFilters('lastYear')} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="last_year" className="cursor-pointer">
					{tFilters('lastYear')}
				</SelectItem>
				<div className="h-px bg-border my-1 mx-2 opacity-50" />
				{years.map((year) => (
					<SelectItem key={year} value={year} className="cursor-pointer">
						{year}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export const LimitSelect = ({ value, onChange }: LimitSelectProps) => {
	const tFilters = useTranslations('dashboard.shared.filters');
	const limits: Limit[] = [10, 25];

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

export const ModeToggle = ({ mode, onChange }: ModeToggleProps) => {
	const tModes = useTranslations('dashboard.shared.filters.modes');

	return (
		<ButtonGroup className="p-1 border border-border/50 rounded-lg">
			<Button
				variant={mode === 'calendar' ? 'default' : 'ghost'}
				onClick={() => onChange('calendar')}
				size="sm"
				className="cursor-pointer"
			>
				{tModes('calendar')}
			</Button>
			<Button
				variant={mode === 'rolling' ? 'default' : 'ghost'}
				onClick={() => onChange('rolling')}
				size="sm"
				className="cursor-pointer"
			>
				{tModes('rolling')}
			</Button>
		</ButtonGroup>
	);
};
