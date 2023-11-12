/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "devextreme/data/odata/store";
import React from "react";
import useIsMounted from "./useIsMounted";
import { LoadPanel } from "devextreme-react";
import { GridHelperFunctions, ToastTypeEnum } from "./grid.helpers";
import { ChoreResponseDto } from "./models/ChoreResponseDto";
import { UserResponseDto } from "./models/UserResponseDto";
import { choreApi } from "../api/chore.api";
import { userApi } from "../api/user.api";
import { Frequency, _dayOfTheWeekStore } from "./stores";
import ChoreGrid from "./ChoreGrid";
import { AddEditChore } from "./addEditChore/AddEditChore";
import { IDeleteChoreDto } from "./models/CreateChoreRequest";

export enum Mode {
  Insert,
  Update,
  None,
}

export interface IFormState {
  description: string;
  name: string;
  mode: Mode;
  frequency: string;
  dayOfMonth: any | null;
  dayOfWeek: number | null;
  biWeeklyDayOfWeek: number | null;
  specificDate: Date | null;
  userId: number;
  weeklyVisible: boolean;
  biWeeklyVisible: boolean;
  monthlyVisible: boolean;
  specificDateVisible: boolean;
  isLoading: boolean;
  choreId: number;
}

export type FormStateAction = Partial<IFormState>;

export const Home = () => {
  const isMounted = useIsMounted();
  const [loading, setLoading] = React.useState(false);

  const [users, setUsers] = React.useState<UserResponseDto[]>([]);
  const [chores, setChores] = React.useState<ChoreResponseDto[]>([]);

  const [formState, setFormState] = React.useReducer(
    (state: IFormState, newState: FormStateAction) => ({
      ...state,
      ...newState,
    }),
    {
      choreId: -1,
      userId: -1,
      specificDate: null,
      isLoading: false,
      specificDateVisible: false,
      monthlyVisible: false,
      weeklyVisible: false,
      biWeeklyVisible: false,
      frequency: "",
      dayOfMonth: null,
      dayOfWeek: null,
      biWeeklyDayOfWeek: null,
      name: "",
      description: "",
      mode: Mode.None,
    } as IFormState
  );

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const { data: chores } = await choreApi.getChores();
      const { data: users } = await userApi.getUsers();

      setChores(chores);
      setUsers(users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isMounted()) {
      fetchData();
    }
  }, [fetchData, isMounted]);

  const onEditingStart = React.useCallback((e: any) => {
    if (e?.row.data as ChoreResponseDto) {
      setFormState({
        choreId: e.row.data.id,
        userId: e.row.data.userId,
        specificDate: e.row.data.specificDate,
        specificDateVisible: e.row.data.frequency === Frequency.SPECIFIC_DATE,
        monthlyVisible: e.row.data.frequency === Frequency.MONTHLY,
        weeklyVisible: e.row.data.frequency === Frequency.WEEKLY,
        biWeeklyVisible: e.row.data.frequency === Frequency.BIWEEKLY,
        frequency: e.row.data.frequency,
        dayOfMonth: e.row.data.dayOfMonth
          ? GridHelperFunctions.getISODateOfMonth(e.row.data.dayOfMonth)
          : null,
        dayOfWeek:
          e.row.data.frequency === Frequency.WEEKLY
            ? e.row.data.dayOfWeek
            : null,
        biWeeklyDayOfWeek:
          e.row.data.frequency === Frequency.BIWEEKLY
            ? e.row.data.dayOfWeek
            : null,
        name: e.row.data.name,
        description: e.row.data.description,
        mode: Mode.Update,
      });
    }
  }, []);

  const onInitNewRow = React.useCallback(() => {
    setFormState({
      mode: Mode.Insert,
      userId: -1,
      specificDate: null,
      specificDateVisible: false,
      monthlyVisible: false,
      weeklyVisible: false,
      biWeeklyVisible: false,
      frequency: "",
      dayOfMonth: null,
      dayOfWeek: null,
      biWeeklyDayOfWeek: null,
      name: "",
      description: "",
      choreId: -1,
    });
  }, []);

  const handleReset = React.useCallback(() => {
    setFormState({
      mode: Mode.None,
      userId: -1,
      specificDate: null,
      specificDateVisible: false,
      monthlyVisible: false,
      weeklyVisible: false,
      biWeeklyVisible: false,
      frequency: "",
      dayOfMonth: null,
      dayOfWeek: null,
      biWeeklyDayOfWeek: null,
      name: "",
      description: "",
      choreId: -1,
    });
  }, []);

  const handleDeleteButtonClicked = React.useCallback(
    async (e: any) => {
      try {
        setLoading(true);
        const request: IDeleteChoreDto = {
          choreId: e?.row?.data?.id,
        };
        const res = await choreApi.deleteChore(request);
        if (res.status === 200 || res.status === 201) {
          await fetchData();
          GridHelperFunctions.toaster(ToastTypeEnum.Success);
        } else {
          GridHelperFunctions.toaster(ToastTypeEnum.Error, res.data as any);
        }
      } catch (error) {
        console.error(error);
        GridHelperFunctions.toaster(ToastTypeEnum.Error);
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  return (
    <div id="data-grid-demo">
      <LoadPanel visible={loading} position="center" showIndicator showPane />
      <ChoreGrid
        users={users}
        chores={chores}
        onEditingStart={onEditingStart}
        onInitNewRow={onInitNewRow}
        handleDeleteButtonClicked={handleDeleteButtonClicked}
      />
      {formState.mode !== Mode.None ? (
        <AddEditChore
          visible
          formState={formState}
          setFormState={setFormState}
          onHide={handleReset}
          mode={formState.mode}
          users={users}
          fetchData={fetchData}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
