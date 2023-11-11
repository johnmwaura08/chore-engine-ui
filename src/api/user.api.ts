import { AxiosResponse } from "axios";
import { createService } from "./createService";
import { UserResponseDto } from "../components/models/UserResponseDto";

const userService = createService("User");

interface IUserApi {
	getUsers: () => Promise<AxiosResponse<UserResponseDto[]>>;
}
export const userApi: IUserApi = {
	getUsers: () => userService.post('byFamily'),
    
};
