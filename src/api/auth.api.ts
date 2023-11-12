import { AxiosResponse } from "axios";
import { createService } from "./createService";
import { LoginResponseDto } from "../components/models/LoginResponseDto";

const authService = createService("Auth");

interface IAuthApi {
	login: ({email, password}: {email: string, password: string}) => Promise<AxiosResponse<LoginResponseDto>>;
    changePassword: ({password}: {password: string}) => Promise<AxiosResponse<LoginResponseDto>>;
  refresh: ({refreshToken}: {
  refreshToken: string;

  }) => Promise<AxiosResponse<string>>;
}
export const authApi: IAuthApi = {
	login: (req) => authService.post('login', req),
    changePassword: (req) => authService.post('change-password', req),
    refresh: (req) => authService.post('refresh', req),
};
