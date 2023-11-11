import axios, { AxiosInstance } from "axios";

declare module "axios" {
	export interface AxiosRequestConfig {
		crossDomain?: boolean;
	}
}

const baseURL = import.meta.env.VITE_API_URL
console.log('baseURL', baseURL)
export const createService = (controller: string): AxiosInstance => {
	// const baseURL = process.env.EXPO_PUBLIC_API_URL;

	const publicService = axios.create({
		baseURL: `${baseURL}/${controller}`,
		headers: {
			"Content-Type": "application/json",
		},
		crossDomain: true,
	});

	return publicService;
};
