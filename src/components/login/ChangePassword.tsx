/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Form, {
  Label,
  RequiredRule,
  SimpleItem,
  CompareRule,
  CustomRule,
} from "devextreme-react/form";
import { Button, ScrollView } from "devextreme-react";
import logo from "../../assets/logo.png";
import React from "react";
import "./login.css";
import { GridHelperFunctions, ToastTypeEnum } from "../chores/grid.helpers";
import { useNavigate, useLocation } from "react-router";
import { IChoreEngineAuthStorage, useAuthContext } from "context/useAuth";
import { ChoreEngineTokens } from "models/chore-engine.tokens";
import { userApi } from "api/user.api";

interface IFormState {
  password: string;
  confirmPassword: string;
}

export const ChangePasswordForm: React.FC = () => {
  const formRef = React.useRef<any>();
  const [dataSource, setDataSource] = React.useState<IFormState>({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { initAuth } = useAuthContext();
  const { from } = location.state || { from: { pathname: "/" } };

  const onEnterKeyPressed = () => {
    formRef && formRef?.current?.instance?.validate();
    const result = formRef && formRef.current.instance.validate();
    if (result.isValid) {
      onSubmit();
    }
  };

  const handleChangePassword = async () => {
    try {
      const res = await userApi.changePassword({
        password: dataSource.password,
      });
      if (res.status === 200 || res.status === 201) {
        const tokens: ChoreEngineTokens = {
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        };

        const toStore: IChoreEngineAuthStorage = {
          tokens: tokens,
          loginResponse: res.data,
        };
        initAuth(toStore);
        navigate(from);
      } else {
        GridHelperFunctions.toaster(ToastTypeEnum.Error);
      }
    } catch (error) {
      GridHelperFunctions.handleAxiosError(error);
    }
  };

  const onSubmit = async () => {
    const result = formRef && formRef.current.instance.validate();
    if (result.isValid) {
      await handleChangePassword();
    }
  };

  return (
    <ScrollView
      height="auto"
      className="chore-engine-login-form"
      showScrollbar="never"
    >
      <div className="chore-engine-login-header">
        <img src={logo} alt="Logo" style={{ width: 240, marginRight: 10 }} />
        <div className="login-subtitle">Your Password Has Expired</div>
      </div>

      <form onSubmit={onSubmit}>
        <Form
          ref={formRef}
          colCount={1}
          id="login"
          formData={dataSource}
          labelLocation="left"
          readOnly={false}
          validationGroup="changePasswordForm"
          showValidationSummary
        >
          <SimpleItem
            editorType="dxTextBox"
            editorOptions={{
              onEnterKey: onEnterKeyPressed,
              showClearButton: true,
              mode: "password",
            }}
            dataField="password"
          >
            <Label text="New Password" />
            <RequiredRule message="New Password is required" />
            <CustomRule
              message="New Password must be between eight to twenty characters in length, comprised of at least one lower case, one upper case, one digit, and one special character"
              validationCallback={GridHelperFunctions.passwordComplexity}
            />
          </SimpleItem>
          <SimpleItem
            dataField="confirmPassword"
            editorOptions={{
              onEnterKey: onEnterKeyPressed,
              showClearButton: true,
              mode: "password",
            }}
          >
            <CompareRule
              message="Both passwords must be the same"
              comparisonTarget={() => dataSource.password}
            />
          </SimpleItem>
          <SimpleItem>
            <div
              className="dx-field"
              style={{
                textAlign: "center",
                width: "100%",
                display: "inline-block",
              }}
            >
              <Button
                type="default"
                text="Submit"
                width={270}
                onClick={onSubmit}
                style={{
                  marginLeft: "4rem",
                }}
              />
            </div>
          </SimpleItem>
        </Form>
      </form>
    </ScrollView>
  );
};
