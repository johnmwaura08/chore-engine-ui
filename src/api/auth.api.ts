import { AxiosResponse } from "axios";
import { createService } from "./createService";
import { LoginResponseDto } from "../models/LoginResponseDto";
import { createPublicService } from "./createPublicService";

const authService = createPublicService("Auth");

interface IAuthApi {
	login: ({email, password}: {email: string, password: string}) => Promise<AxiosResponse<LoginResponseDto>>;
    changePassword: ({password}: {password: string}) => Promise<AxiosResponse<LoginResponseDto>>;
  refreshToken: ({refreshToken}: {
  refreshToken: string;

  }) => Promise<AxiosResponse<string>>;

  forgotPassword: ({email}: {email: string}) => Promise<AxiosResponse<boolean>>;
}
export const authApi: IAuthApi = {
	login: (req) => authService.post('login', req),
  changePassword: (req) => authService.post('change-password', req),
    refreshToken: (req) => authService.post('refresh', req),
    forgotPassword: (req) => authService.post('forgot-password', req),
};
