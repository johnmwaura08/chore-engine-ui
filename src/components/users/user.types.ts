import { ChoreEngineCRUDMode } from "components/utils/types.utils";

export interface IUserFormState {
    phoneNumber: string;
    name: string;
    mode: ChoreEngineCRUDMode;
    userId: number;
    changePassword: boolean;
    password: string;
    isLoading: boolean;
    email: string;
}

export type UserFormStateAction = Partial<IUserFormState>;