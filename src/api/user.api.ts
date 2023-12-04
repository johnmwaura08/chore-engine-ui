/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { createService } from "./createService";
import { UserResponseDto } from "../models/UserResponseDto";
import { ChangePasswordDto, CreateUserDto, DeleteUserDto, UpdateUserDto } from "models/users.dto";
import { LoginResponseDto } from "models/LoginResponseDto";

const userService = createService("User");



interface IUserApi {
	getUsers: () => Promise<AxiosResponse<UserResponseDto[]>>;
	addUser: (user: CreateUserDto) => Promise<AxiosResponse<UserResponseDto>>;
	updateUser: (user: UpdateUserDto) => Promise<AxiosResponse<UserResponseDto>>;
	deleteUser: (user: DeleteUserDto) => Promise<AxiosResponse<boolean>>;
	changePassword: (user: ChangePasswordDto) => Promise<AxiosResponse<LoginResponseDto>>;
	createFamily: ({name, email}: {name: string, email: string}) => Promise<AxiosResponse<any>>;
}
export const userApi: IUserApi = {
	getUsers: () => userService.post('byFamily'),
	addUser: (user) => userService.post('create', user),
	updateUser: (user) => userService.post('update', user),
	deleteUser: (user) => userService.post('delete', user ),
	changePassword: (user) => userService.post('change-password', user),
	createFamily: (family) => userService.post('family', family	),
    
};
