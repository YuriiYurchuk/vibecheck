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
	const isFirstRender = useRef(true);

	const [isInitialized, setIsInitialized] = useState(false);
	const [filters, setFilters] = useState<T>(() => {
		if (typeof window === 'undefined') return defaults;

		const currentDefaults = defaults;
		const currentDeserializers = deserializers;
		const urlFilters: Partial<T> = {};
		const keys = Object.keys(currentDefaults) as Array<keyof T>;

		const params = new URLSearchParams(window.location.search);
		keys.forEach((key) => {
			const urlValue = params.get(String(key));
			if (urlValue !== null) {
				const parser = currentDeserializers[key];
				urlFilters[key] = parser ? parser(urlValue) : (urlValue as T[keyof T]);
			}
		});

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

		return finalFilters;
	});

	const filtersRef = useRef(filters);
	useEffect(() => {
		filtersRef.current = filters;
	}, [filters]);

	useEffect(() => {
		if (!isFirstRender.current) return;
		isFirstRender.current = false;

		const keys = Object.keys(defaultsRef.current) as Array<keyof T>;
		const params = new URLSearchParams(searchParams.toString());
		let needsUpdate = false;

		keys.forEach((key) => {
			if (!params.has(String(key))) {
				params.set(String(key), String(filtersRef.current[key]));
				needsUpdate = true;
			}
		});

		if (needsUpdate) {
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		}

		setIsInitialized(true);
	}, [pathname, router, searchParams]);

	useEffect(() => {
		if (!isInitialized) return;

		const keys = Object.keys(defaultsRef.current) as Array<keyof T>;
		const urlFilters: Partial<T> = {};
		let hasChanges = false;
		const currentFilters = filtersRef.current;

		keys.forEach((key) => {
			const urlValue = searchParams.get(String(key));
			if (urlValue !== null) {
				const parser = deserializersRef.current[key];
				const parsed = parser ? parser(urlValue) : (urlValue as T[keyof T]);

				if (String(parsed) !== String(currentFilters[key])) {
					urlFilters[key] = parsed;
					hasChanges = true;
				}
			}
		});

		if (hasChanges) {
			setFilters((prev) => ({ ...prev, ...urlFilters }));
		}
	}, [searchParams, isInitialized]);

	useEffect(() => {
		if (!isInitialized) return;
		try {
			localStorage.setItem(storageKey, JSON.stringify(filters));
		} catch {}
	}, [filters, storageKey, isInitialized]);

	const updateFilter = useCallback(
		<K extends keyof T>(key: K, value: T[K]) => {
			setFilters((prev) => ({ ...prev, [key]: value }));

			const params = new URLSearchParams(searchParams.toString());
			params.set(String(key), String(value));
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[searchParams, pathname, router]
	);

	return {
		filters,
		updateFilter,
		isReady: isInitialized,
	};
}
