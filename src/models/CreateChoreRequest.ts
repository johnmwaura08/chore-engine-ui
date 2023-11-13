import { Frequency } from "../components/stores";


export interface  ICreateChoreDto {
  name: string;
  description: string;
  assignee: string;
  frequency: Frequency;
  dayOfWeek?: number;
  dayOfMonth?: number;
  specificDate?: string;
}

export interface IUpdateChoreDto extends ICreateChoreDto {

  id: number;
}

export interface IDeleteChoreDto {
  choreId: number;

}