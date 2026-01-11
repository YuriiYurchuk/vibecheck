import { useEffect, useState } from 'react';

const BREAKPOINTS = [
	{
		maxWidth: 640,
		size: { blockSize: 12, blockMargin: 2, blockRadius: 3, fontSize: 11 },
	},
	{
		maxWidth: 1024,
		size: { blockSize: 13, blockMargin: 3, blockRadius: 4, fontSize: 12 },
	},
	{
		maxWidth: Infinity,
		size: { blockSize: 15, blockMargin: 4, blockRadius: 5, fontSize: 14 },
	},
];

export const useCalendarSize = () => {
	const [size, setSize] = useState(BREAKPOINTS[BREAKPOINTS.length - 1].size);

	useEffect(() => {
		const updateSize = () => {
			const width = window.innerWidth;

			const match = BREAKPOINTS.find((bp) => width < bp.maxWidth);

			if (match) {
				setSize(match.size);
			} else {
				setSize(BREAKPOINTS[BREAKPOINTS.length - 1].size);
			}
		};

		updateSize();
		window.addEventListener('resize', updateSize);

		return () => window.removeEventListener('resize', updateSize);
	}, []);

	return size;
};
