export interface LoginResponseDto {
    email: string;
    accessToken: string;
    refreshToken: string;
    phoneNumber: string;
    passwordExpired: boolean;
    id:number
  }