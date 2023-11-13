import axios, { AxiosInstance } from "axios";

declare module "axios" {
	export interface AxiosRequestConfig {
		crossDomain?: boolean;
	}
}
const baseURL = import.meta.env.VITE_API_URL

export const createPublicService = (controller: string): AxiosInstance => {
	
	const publicService = axios.create({
		baseURL: `${baseURL}/${controller}`,
		headers: {
			"Content-Type": "application/json",
		},
		crossDomain: true,
	});

	return publicService;
};
