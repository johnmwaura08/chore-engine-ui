/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import UsersGrid from "./UsersGrid";
import { UserResponseDto } from "models/UserResponseDto";
import useIsMounted from "components/customHooks/useIsMounted";
import { userApi } from "api/user.api";
import { LoadPanel } from "devextreme-react";
import { IUserFormState, UserFormStateAction } from "./user.types";
import { ChoreEngineCRUDMode } from "components/utils/types.utils";
import {
  GridHelperFunctions,
  ToastTypeEnum,
} from "components/chores/grid.helpers";
import { DeleteUserDto } from "models/users.dto";
import { AddEditUser } from "./AddEditUser";

export const UsersMain = () => {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState<UserResponseDto[]>([]);
  const isMounted = useIsMounted();

  const [formState, setFormState] = React.useReducer(
    (state: IUserFormState, newState: UserFormStateAction) => ({
      ...state,
      ...newState,
    }),
    {
      name: "",
      phoneNumber: "",
      userId: -1,
      mode: ChoreEngineCRUDMode.None,
    } as IUserFormState
  );

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const { data: users } = await userApi.getUsers();

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
    if (e?.row.data as UserResponseDto) {
      setFormState({
        phoneNumber: e.row.data.phoneNumber,
        name: e.row.data.name,
        mode: ChoreEngineCRUDMode.Update,
        userId: e.row.data.id,
        email: e.row.data.email,
      });
    }
  }, []);

  const onInitNewRow = React.useCallback(() => {
    setFormState({
      mode: ChoreEngineCRUDMode.Insert,
      userId: -1,
      phoneNumber: "",
      name: "",
      changePassword: false,
      password: "",
      email: "",
    });
  }, []);
  const handleReset = React.useCallback(() => {
    setFormState({
      mode: ChoreEngineCRUDMode.None,
      userId: -1,
      phoneNumber: "",
      name: "",
      changePassword: false,
      password: "",
      email: "",
    });
  }, []);
  const handleDeleteButtonClicked = React.useCallback(
    async (e: any) => {
      try {
        setLoading(true);
        const request: DeleteUserDto = {
          id: e?.row?.data?.id,
        };
        const res = await userApi.deleteUser(request);
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

  const isDeleteButtonVisible = React.useCallback((e: any) => {
    if (e?.row?.data as UserResponseDto) {
      return !e.row.data.isAdmin;
    }
    return false;
  }, []);
  return (
    <div id="data-grid-demo">
      <LoadPanel visible={loading} position="center" showIndicator showPane />
      <UsersGrid
        users={users}
        onInitNewRow={onInitNewRow}
        onEditingStart={onEditingStart}
        handleDeleteButtonClicked={handleDeleteButtonClicked}
        isDeleteButtonVisible={isDeleteButtonVisible}
        isLoading={loading}
      />
      {formState.mode !== ChoreEngineCRUDMode.None ? (
        <AddEditUser
          visible
          formState={formState}
          setFormState={setFormState}
          onHide={handleReset}
          mode={formState.mode}
          fetchData={fetchData}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
