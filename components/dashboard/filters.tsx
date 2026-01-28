import { subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDateFormatter } from '@/hooks/use-date-formatter';
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

type MonthNavigatorProps = {
	value: number;
	onChange: (value: number) => void;
	maxMonths?: number;
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
		<div className="flex items-center gap-2">
			<ButtonGroup className="p-1 border border-border/50 rounded-lg bg-background">
				<Button
					variant={mode === 'rolling' ? 'secondary' : 'ghost'}
					onClick={() => onChange('rolling')}
					size="sm"
					className="cursor-pointer gap-2 px-3"
				>
					{tModes('rolling')}
				</Button>
				<Button
					variant={mode === 'calendar' ? 'secondary' : 'ghost'}
					onClick={() => onChange('calendar')}
					size="sm"
					className="cursor-pointer gap-2 px-3"
				>
					{tModes('calendar')}
				</Button>
			</ButtonGroup>
			<TooltipProvider>
				<Tooltip delayDuration={300}>
					<TooltipTrigger asChild>
						<div className="text-muted-foreground/50 hover:text-foreground transition-colors cursor-help">
							<Info className="h-4 w-4" />
						</div>
					</TooltipTrigger>
					<TooltipContent side="right" className="max-w-[250px] text-sm">
						<div className="space-y-2">
							<p>
								<strong>{tModes('rolling')}:</strong>{' '}
								{tModes('tooltips.rolling')}
							</p>
							<div className="h-px bg-border/50" />
							<p>
								<strong>{tModes('calendar')}:</strong>{' '}
								{tModes('tooltips.calendar')}
							</p>
						</div>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export const MonthNavigator = ({
	value,
	onChange,
	maxMonths = 12,
}: MonthNavigatorProps) => {
	const tFilters = useTranslations('dashboard.shared.filters');
	const { formatDate } = useDateFormatter();
	const currentDate = new Date();
	const targetDate = subMonths(currentDate, value);

	const handlePrevious = () => {
		if (value < maxMonths) onChange(value + 1);
	};

	const handleNext = () => {
		if (value > 0) onChange(value - 1);
	};

	let title: string;
	let subtitle: string;

	if (value === 0) {
		title = tFilters('thisMonth');
		subtitle = tFilters('currentMonth');
	} else {
		const rawTitle = formatDate(targetDate, 'MMMM yyyy');
		title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
		subtitle = tFilters('monthsAgo', { count: value });
	}

	return (
		<div className="flex items-center justify-between gap-3 select-none">
			<Button
				variant="outline"
				size="icon"
				onClick={handlePrevious}
				disabled={value >= maxMonths}
				className="size-10 rounded-xl bg-card/50 border-white/10 hover:bg-white/10 transition-colors"
			>
				<ChevronLeft className="size-5 text-muted-foreground" />
			</Button>
			<div className="flex flex-col items-center justify-center min-w-[140px] md:min-w-[180px] text-center space-y-0.5">
				<span className="text-lg md:text-xl font-bold tracking-tight text-foreground leading-none">
					{title}
				</span>
				<span className="text-xs font-medium text-muted-foreground">
					{subtitle}
				</span>
			</div>
			<Button
				variant="outline"
				size="icon"
				onClick={handleNext}
				disabled={value === 0}
				className="size-10 rounded-xl bg-card/50 border-white/10 hover:bg-white/10 transition-colors"
			>
				<ChevronRight className="size-5 text-muted-foreground" />
			</Button>
		</div>
	);
};
