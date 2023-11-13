/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { IChoreEngineAuthStorage } from "context/useAuth";
import { getStorageItemAsync, setStorageItemAsync } from "context/useStorageState";
import { authApi } from "./auth.api";
import { ChoreEngineTokens } from "models/chore-engine.tokens";

const baseURL = import.meta.env.VITE_API_URL
export const createService = (controller: string): AxiosInstance => {

	const apiService = axios.create({
		baseURL: `${baseURL}/${controller}`,
		headers: {
			"Content-Type": "application/json",
		},
		crossDomain: true,
	});

	// Request interceptor to set the Authorization header
	apiService.interceptors.request.use(
		async (config: AxiosRequestConfig) => {
			try {
				const value = await getStorageItemAsync("tokens");
				if (!value) return config;
				const authStore: IChoreEngineAuthStorage = JSON.parse(value);
				const keys : ChoreEngineTokens = authStore?.tokens;
				config.headers!.Authorization = `Bearer ${keys?.accessToken}`;
				return config;
			} catch (error) {
				return Promise.reject(error) as any;
			}
		},
		(error) => Promise.reject(error),
	);

	// Response interceptor to handle 401 errors
	apiService.interceptors.response.use(
		(response: AxiosResponse) => {
			return response;
		},
		async (error: any) => {
			const originalRequest = error.config as any;
			if (error.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;
				try {
					const val = await getStorageItemAsync("tokens");
					const authStore: IChoreEngineAuthStorage = JSON.parse(val as string);
					const { data: accessToken } = await authApi.refreshToken({
						refreshToken: authStore.tokens.refreshToken,
					});
					const newTokens: ChoreEngineTokens = {
						accessToken,
						refreshToken: authStore.tokens.refreshToken,
					};

					const newInit: IChoreEngineAuthStorage = {
						loginResponse: authStore.loginResponse,
						tokens: newTokens,
					}
					await setStorageItemAsync("tokens", JSON.stringify(newInit));
					originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					return apiService(originalRequest);
				} catch (err) {
					return Promise.reject(err);
				}
			}
			return Promise.reject(error);
		},
	);

	return apiService;
};
