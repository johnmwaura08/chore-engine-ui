/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button, LoadPanel, Popup, TextBox, Validator } from "devextreme-react";
import Form, {
  Label,
  RequiredRule,
  Item,
  EmailRule,
} from "devextreme-react/form";
import { userApi } from "api/user.api";
import {
  GridHelperFunctions,
  ToastTypeEnum,
} from "components/chores/grid.helpers";

interface IUserFormState {
  name: string;
  isLoading: boolean;
  email: string;
}

type UserFormStateAction = Partial<IUserFormState>;

export const OnboardUser = ({
  visible,
  onHide,
}: {
  visible: boolean;
  onHide: () => void;
}) => {
  const formRef = React.useRef<any>();

  const [formState, setFormState] = React.useReducer(
    (state: IUserFormState, newState: UserFormStateAction) => ({
      ...state,
      ...newState,
    }),
    {
      name: "",
      isLoading: false,
      email: "",
    } as IUserFormState
  );
  const onNameChanged = React.useCallback(
    (e: any) => {
      setFormState({ name: e.value });
    },
    [setFormState]
  );

  const onEmailChanged = React.useCallback(
    (e: any) => {
      setFormState({ email: e.value });
    },
    [setFormState]
  );

  const handleCreateUpdate = async () => {
    try {
      setFormState({
        isLoading: true,
      });
      const request = {
        name: formState.name,
        email: formState.email,
      };

      const res = await userApi.createFamily(request);

      if (res && (res.status === 200 || res.status === 201)) {
        GridHelperFunctions.toaster(ToastTypeEnum.Success);
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
      title="Onboard Family"
      showTitle={true}
      width="55rem"
      height="25rem"
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
        <Item itemType="group">
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
            >
              <Validator validationGroup="addEditUserValidationGroup">
                <RequiredRule message="Email is required."></RequiredRule>
                <EmailRule message="Email is invalid."></EmailRule>
              </Validator>
            </TextBox>

            <Label text="Email" />
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
