export interface UpdateUserDto extends DeleteUserDto {
name: string;
phoneNumber: string;
}

export interface DeleteUserDto {
    id: number;
}

export interface CreateUserDto extends UpdateUserDto {
email: string;
}

export interface ChangePasswordDto {
    password: string;
}