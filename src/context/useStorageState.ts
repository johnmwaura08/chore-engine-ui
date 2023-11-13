/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
type UseStateHook<T> = [boolean, T | null, (value?: T | null) => void];

function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
  return React.useReducer<any>(
    (state: UseStateHook<T>, action: T | null = null) => [false, action],
    initialValue
  ) as any;
}

export async function setStorageItemAsync(key: string, value: string | null) {

	try {
		if (value === null) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, value);
		}
	} catch (e) {
		console.error("Local storage is unavailable:", e);
	}
}

export  function getStorageItemAsync(key: string): any {
	try {
		if (typeof localStorage !== "undefined") {
			const item =  localStorage.getItem(key);
			return item || null;
		}
	} catch (e) {
		console.error("Local storage is unavailable:", e);
		return null;
	}
}

export function useStorageState(key: string): any {
	// Public
	const [state, setState] = useAsyncState<any>();

	// Get
	React.useEffect(() => {
		const retrieveData = async () => {
			try {
				const value = await getStorageItemAsync(key);
				setState(value);
			} catch (error) {
				console.error(error);
			}
		};
		retrieveData();
	}, [key]);

	// Set
	const setValue = React.useCallback(
		(value: any) => {
			setStorageItemAsync(key, value).then(() => {
				setState(value);
			});
		},
		[key, setState],
	);

	return [state, setValue];
}
