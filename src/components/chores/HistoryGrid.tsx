/* eslint-disable @typescript-eslint/no-explicit-any */
import "devextreme/data/odata/store";
import React from "react";
import useIsMounted from "../customHooks/useIsMounted";
import { LoadPanel } from "devextreme-react";
import { GridHelperFunctions, ToastTypeEnum } from "./grid.helpers";
import { ChoreResponseDto } from "../../models/ChoreResponseDto";
import { UserResponseDto } from "../../models/UserResponseDto";
import { choreApi } from "../../api/chore.api";
import { userApi } from "../../api/user.api";
import { _dayOfTheWeekStore } from "../stores";
import ChoreGrid from "./ChoreGrid";
import { IDeleteChoreDto } from "../../models/CreateChoreRequest";
import { GridType } from "./chores.types";

export const HistoryGrid = () => {
  const [users, setUsers] = React.useState<UserResponseDto[]>([]);
  const [chores, setChores] = React.useState<ChoreResponseDto[]>([]);
  const isMounted = useIsMounted();

  const [loading, setLoading] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const { data: chores } = await choreApi.getHistoricalChores();
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
        onEditingStart={() => undefined}
        onInitNewRow={() => undefined}
        handleDeleteButtonClicked={handleDeleteButtonClicked}
        isLoading={loading}
        gridType={GridType.History}
      />
    </div>
  );
};
