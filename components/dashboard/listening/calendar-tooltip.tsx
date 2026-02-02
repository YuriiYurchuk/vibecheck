import { useTranslations } from 'next-intl';
import { cloneElement } from 'react';
import type { Activity } from 'react-activity-calendar';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

type CalendarTooltipProps = {
	block: React.ReactElement<React.SVGProps<SVGRectElement>>;
	activity: Activity;
	formatDate: (date: string | Date, format: string) => string;
};

export const CalendarTooltip = ({
	block,
	activity,
	formatDate,
}: CalendarTooltipProps) => {
	const tCalendar = useTranslations('dashboard.pages.listening.calendar');

	const dateLabel = formatDate(activity.date, 'd MMMM');

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				{cloneElement(block, {
					style: { cursor: 'pointer', outline: 'none' },
					tabIndex: 0,
					role: 'button',
				})}
			</TooltipTrigger>
			<TooltipContent side="top" className="text-xs touch-none">
				<div className="text-center">
					<p className="font-semibold capitalize">{dateLabel}</p>
					<p className="text-muted-foreground">
						{tCalendar('tooltipTracks', { count: activity.count })}
					</p>
				</div>
			</TooltipContent>
		</Tooltip>
	);
};
