



import { AxiosResponse } from "axios";
import { createService } from "./createService";
import { ChoreResponseDto } from "../components/models/ChoreResponseDto";

const choreService = createService("Chore");

interface IChoreApi {
	getChores: () => Promise<AxiosResponse<ChoreResponseDto[]>>;
}
export const choreApi: IChoreApi = {
	getChores: () => choreService.post('byFamily'),
    
};
