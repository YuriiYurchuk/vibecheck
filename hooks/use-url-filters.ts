'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

type FilterConfig<T extends Record<string, string | number>> = {
	storageKey: string;
	defaults: T;
	deserializers?: Partial<{
		[K in keyof T]: (value: string) => T[K];
	}>;
};

export function useUrlFilters<T extends Record<string, string | number>>({
	storageKey,
	defaults,
	deserializers = {},
}: FilterConfig<T>) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const defaultsRef = useRef(defaults);
	const deserializersRef = useRef(deserializers);

	const [filters, setFilters] = useState<T | null>(null);

	useEffect(() => {
		const currentDefaults = defaultsRef.current;
		const currentDeserializers = deserializersRef.current;
		const urlFilters: Partial<T> = {};
		const keys = Object.keys(currentDefaults) as Array<keyof T>;
		let hasAllParamsInUrl = true;

		keys.forEach((key) => {
			const urlValue = searchParams.get(String(key));
			if (urlValue !== null) {
				const parser = currentDeserializers[key];
				urlFilters[key] = parser ? parser(urlValue) : (urlValue as T[keyof T]);
			} else {
				hasAllParamsInUrl = false;
			}
		});

		if (!filters) {
			let savedData: Partial<T> = {};
			try {
				const item = localStorage.getItem(storageKey);
				if (item) savedData = JSON.parse(item);
			} catch {}
			const finalFilters: T = { ...currentDefaults };

			keys.forEach((key) => {
				if (urlFilters[key] !== undefined) {
					finalFilters[key] = urlFilters[key] as T[keyof T];
				} else if (savedData[key] !== undefined) {
					finalFilters[key] = savedData[key] as T[keyof T];
				}
			});

			setFilters(finalFilters);

			if (!hasAllParamsInUrl) {
				const params = new URLSearchParams(searchParams.toString());
				keys.forEach((key) => {
					if (!params.has(String(key))) {
						params.set(String(key), String(finalFilters[key]));
					}
				});
				if (params.toString() !== searchParams.toString()) {
					router.replace(`${pathname}?${params.toString()}`, { scroll: false });
				}
			}
		} else {
			const newFilters = { ...filters };
			let hasExternalChanges = false;

			keys.forEach((key) => {
				const valFromUrl = urlFilters[key];

				if (
					valFromUrl !== undefined &&
					String(valFromUrl) !== String(filters[key])
				) {
					newFilters[key] = valFromUrl as T[keyof T];
					hasExternalChanges = true;
				}
			});

			if (hasExternalChanges) {
				setFilters(newFilters);
			}
		}
	}, [searchParams, pathname, router, storageKey, filters]);

	useEffect(() => {
		if (!filters) return;
		try {
			localStorage.setItem(storageKey, JSON.stringify(filters));
		} catch {}
	}, [filters, storageKey]);

	const updateFilter = useCallback(
		<K extends keyof T>(key: K, value: T[K]) => {
			if (!filters) return;

			setFilters((prev) => (prev ? { ...prev, [key]: value } : null));

			const params = new URLSearchParams(searchParams.toString());
			params.set(String(key), String(value));
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[filters, searchParams, pathname, router]
	);

	return {
		filters,
		updateFilter,
		isReady: filters !== null,
	};
}
