



import { AxiosResponse } from "axios";
import { createService } from "./createService";
import { ChoreResponseDto } from "../components/models/ChoreResponseDto";
import { ICreateChoreDto, IDeleteChoreDto, IUpdateChoreDto } from "../components/models/CreateChoreRequest";

const choreService = createService("Chore");

interface IChoreApi {
	getChores: () => Promise<AxiosResponse<ChoreResponseDto[]>>;
	updateChore: (chore: IUpdateChoreDto) => Promise<AxiosResponse<ChoreResponseDto>>;
	createChore: (chore: ICreateChoreDto) => Promise<AxiosResponse<ChoreResponseDto>>;
	deleteChore: (chore:IDeleteChoreDto) => Promise<AxiosResponse<boolean>>;
}
export const choreApi: IChoreApi = {
	getChores: () => choreService.post('byFamily'),
	updateChore: (chore) => choreService.post('update', chore),
	createChore: (chore) => choreService.post('create', chore),
	deleteChore: (chore) => choreService.post('delete', chore),
    
};
