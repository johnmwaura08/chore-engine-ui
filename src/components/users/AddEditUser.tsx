/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  LoadPanel,
  Popup,
  Switch,
  TextBox,
  Validator,
} from "devextreme-react";
import Form, {
  Label,
  RequiredRule,
  Item,
  EmailRule,
  PatternRule,
} from "devextreme-react/form";
import React from "react";
import { userApi } from "../../api/user.api";
import { ChoreEngineCRUDMode } from "components/utils/types.utils";
import { IUserFormState } from "./user.types";
import { IChoreEngineAuthStorage, useAuthContext } from "context/useAuth";
import { CreateUserDto } from "models/users.dto";
import { ChoreEngineTokens } from "models/chore-engine.tokens";
import {
  GridHelperFunctions,
  ToastTypeEnum,
} from "components/chores/grid.helpers";

interface IAddEditUserProps {
  visible: boolean;
  onHide: () => void;
  formState: IUserFormState;
  mode: ChoreEngineCRUDMode;
  setFormState: React.Dispatch<Partial<IUserFormState>>;
  fetchData: () => Promise<void>;
}

//TODO Add custom rule validation for frequency

export const AddEditUser: React.FC<IAddEditUserProps> = ({
  visible,
  formState,
  onHide,
  setFormState,
  fetchData,
}) => {
  const formRef = React.useRef<any>();

  const { loginResponse, initAuth } = useAuthContext();

  const onNameChanged = React.useCallback(
    (e: any) => {
      setFormState({ name: e.value });
    },
    [setFormState]
  );

  const onPhoneNumberChanged = React.useCallback(
    (e: any) => {
      setFormState({ phoneNumber: e.value });
    },
    [setFormState]
  );

  const onEmailChanged = React.useCallback(
    (e: any) => {
      setFormState({ email: e.value });
    },
    [setFormState]
  );

  const onPasswordChanged = React.useCallback(
    (e: any) => {
      setFormState({ password: e.value });
    },
    [setFormState]
  );

  const onChangePasswordClicked = React.useCallback(
    (e: any) => {
      setFormState({ changePassword: e.value });
    },
    [setFormState]
  );

  const handleCreateUpdate = async () => {
    try {
      setFormState({
        isLoading: true,
      });
      const request: CreateUserDto = {
        id: formState.userId,
        name: formState.name,
        phoneNumber: formState.phoneNumber,
        email: formState.email,
      };

      let res: any;

      if (formState.mode === ChoreEngineCRUDMode.Insert) {
        res = await userApi.addUser(request);
      } else if (formState.mode === ChoreEngineCRUDMode.Update) {
        res = await userApi.updateUser(request);
        if (formState.changePassword && formState.password) {
          const newRes = await userApi.changePassword({
            password: formState.password,
          });
          if (newRes.status == 200 || newRes.status == 201) {
            const tokens: ChoreEngineTokens = {
              accessToken: newRes.data.accessToken,
              refreshToken: newRes.data.refreshToken,
            };

            const toStore: IChoreEngineAuthStorage = {
              tokens: tokens,
              loginResponse: newRes.data,
            };
            initAuth(toStore);
          } else {
            GridHelperFunctions.toaster(
              ToastTypeEnum.Error,
              newRes.data as any
            );
          }
        }
      } else {
        return;
      }

      if (res && (res.status === 200 || res.status === 201)) {
        GridHelperFunctions.toaster(ToastTypeEnum.Success);
        fetchData();
        onHide();
      } else {
        GridHelperFunctions.toaster(ToastTypeEnum.Error, res.data as any);
      }
    } catch (error) {
      GridHelperFunctions.handleAxiosError(error);
    } finally {
      setFormState({
        isLoading: false,
      });
    }
  };

  const handleSubmit = async () => {
    const result = formRef && formRef.current.instance.validate();
    if (result.isValid) {
      await handleCreateUpdate();
    }
  };

  return (
    <Popup
      title="User Management"
      showTitle={true}
      width="55rem"
      height="35rem"
      resizeEnabled
      visible={visible}
      onHiding={onHide}
      hideOnOutsideClick
      showCloseButton
    >
      <LoadPanel
        visible={formState.isLoading}
        position="center"
        showIndicator
        showPane
      />

      <Form
        ref={formRef}
        id="addEditUserForm"
        labelLocation="top"
        validationGroup="addEditUserValidationGroup"
        showValidationSummary={true}
      >
        <Item itemType="group" colCount={2} colSpan={2}>
          <Item isRequired dataField="name">
            <TextBox
              defaultValue={formState.name}
              onValueChanged={onNameChanged}
            >
              <Validator validationGroup="addEditUserValidationGroup">
                <RequiredRule message="Name is required."></RequiredRule>
              </Validator>
            </TextBox>
            <Label text="Name" />
          </Item>
          <Item>
            <TextBox
              defaultValue={formState.email}
              onValueChanged={onEmailChanged}
              disabled={formState.mode === ChoreEngineCRUDMode.Update}
            >
              <Validator validationGroup="addEditUserValidationGroup">
                <RequiredRule message="Email is required."></RequiredRule>
                <EmailRule message="Email is invalid."></EmailRule>
              </Validator>
            </TextBox>

            <Label text="Email" />
          </Item>
          <Item helpText="Enter the phone number in USA phone format">
            <TextBox
              defaultValue={formState.phoneNumber}
              onValueChanged={onPhoneNumberChanged}
              mask="+1 (X00) 000-0000"
              maskRules={{
                X: /[02-9]/,
              }}
              maskInvalidMessage="The phone must have a correct USA phone format"
            >
              <Validator validationGroup="addEditUserValidationGroup">
                <PatternRule
                  message="The phone must have a correct USA phone format"
                  pattern={/^[02-9]\d{9}$/}
                />
                <RequiredRule message="Phone Number is required."></RequiredRule>
              </Validator>
            </TextBox>

            <Label text="Phone Number" />
          </Item>
          <Item
            visible={
              formState.mode === ChoreEngineCRUDMode.Update &&
              !GridHelperFunctions.stringIsNullOrEmpty(formState.email) &&
              !GridHelperFunctions.stringIsNullOrEmpty(loginResponse?.email) &&
              formState.email === loginResponse?.email
            }
          >
            <Switch
              defaultValue={formState?.changePassword}
              onValueChanged={onChangePasswordClicked}
            ></Switch>
            <Label text="Change Password" />
          </Item>
          <Item
            visible={
              formState.changePassword &&
              formState.mode === ChoreEngineCRUDMode.Update &&
              !GridHelperFunctions.stringIsNullOrEmpty(formState.email) &&
              !GridHelperFunctions.stringIsNullOrEmpty(loginResponse?.email) &&
              formState.email === loginResponse?.email
            }
          >
            <TextBox
              defaultValue={formState.password}
              onValueChanged={onPasswordChanged}
              visible={
                formState.changePassword &&
                formState.mode === ChoreEngineCRUDMode.Update &&
                !GridHelperFunctions.stringIsNullOrEmpty(formState.email) &&
                !GridHelperFunctions.stringIsNullOrEmpty(
                  loginResponse?.email
                ) &&
                formState.email === loginResponse?.email
              }
            />

            <Label
              text="New Password"
              visible={
                formState.changePassword &&
                formState.mode === ChoreEngineCRUDMode.Update &&
                !GridHelperFunctions.stringIsNullOrEmpty(formState.email) &&
                !GridHelperFunctions.stringIsNullOrEmpty(
                  loginResponse?.email
                ) &&
                formState.email === loginResponse?.email
              }
            />
          </Item>
        </Item>

        <Item>
          <Button
            text="Cancel"
            stylingMode="outlined"
            type="normal"
            onClick={onHide}
            style={{
              float: "right",
              marginRight: "1rem",
            }}
          />
          <Button
            text="Submit"
            type="default"
            onClick={handleSubmit}
            style={{
              float: "right",
              marginRight: "1rem",
            }}
          />
        </Item>
      </Form>
    </Popup>
  );
};
