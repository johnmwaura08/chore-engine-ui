/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Form, { Label, RequiredRule, SimpleItem } from "devextreme-react/form";
import { Button, ScrollView } from "devextreme-react";
import { FC } from "react";
// import "../login.css";
import logo from "../../assets/logo.png";
import React from "react";
import "./login.css";
import { EmailRule } from "devextreme-react/data-grid";
import { GridHelperFunctions, ToastTypeEnum } from "../chores/grid.helpers";
import { authApi } from "../../api/auth.api";
import { useNavigate, useLocation } from "react-router";
import { IChoreEngineAuthStorage, useAuthContext } from "context/useAuth";
import { ChoreEngineTokens } from "models/chore-engine.tokens";
import Footer from "Footer";
import { ForgotPasswordPopup } from "./ForgotPasswordPopup";

interface IFormState {
  email: string;
  password: string;
}

export const LoginForm: FC = (): JSX.Element => {
  const formRef = React.useRef<any>();
  const [dataSource, setDataSource] = React.useState<IFormState>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] =
    React.useState(false);
  const { initAuth, handleLoginResponse } = useAuthContext();
  const { from } = location.state || { from: { pathname: "/" } };

  const onEnterKeyPressed = () => {
    formRef && formRef?.current?.instance?.validate();
    const result = formRef && formRef.current.instance.validate();
    if (result.isValid) {
      onSubmit();
    }
  };

  const handleLogin = async () => {
    try {
      const res = await authApi.login({
        email: dataSource.email,
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
        GridHelperFunctions.toaster(ToastTypeEnum.Error, "Invalid Credentials");
      }
    } catch (error) {
      GridHelperFunctions.handleAxiosError(error);
    }
  };

  const onSubmit = async () => {
    const result = formRef && formRef.current.instance.validate();
    if (result.isValid) {
      await handleLogin();
    }
  };

  const handleForgotPassword = React.useCallback(() => {
    setForgotPasswordModalOpen(true);
  }, []);

  const handleCloseForgotPassword = React.useCallback(() => {
    setForgotPasswordModalOpen(false);
  }, []);

  return (
    <>
      <ScrollView
        height="auto"
        className="chore-engine-login-form"
        showScrollbar="never"
      >
        <div className="chore-engine-login-header">
          <img src={logo} alt="Logo" style={{ width: 240, marginRight: 10 }} />
          <div className="login-subtitle">Authentication Required</div>
        </div>

        <form onSubmit={onSubmit}>
          <Form
            ref={formRef}
            colCount={1}
            id="login"
            formData={dataSource}
            labelLocation="left"
            readOnly={false}
            validationGroup="formAddNotification"
            showValidationSummary
          >
            <SimpleItem
              dataField="email"
              editorOptions={{ onEnterKey: onEnterKeyPressed }}
              isRequired
            >
              <Label text="Email" />
              <RequiredRule message="Email is required" />
              <EmailRule message="Email is invalid" />
            </SimpleItem>
            <SimpleItem
              dataField="password"
              editorType="dxTextBox"
              editorOptions={{
                mode: "password",
                onEnterKey: onEnterKeyPressed,
              }}
              isRequired
            />
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
                  text="Sign In"
                  width={270}
                  onClick={onSubmit}
                  style={{
                    marginLeft: "4rem",
                    marginBottom: "1rem",
                  }}
                />
                <Button
                  type="default"
                  text="Forgot Password"
                  width={270}
                  onClick={handleForgotPassword}
                  style={{
                    marginLeft: "4rem",
                    backgroundColor: "transparent",
                    color: "black",
                  }}
                />
              </div>
              <div></div>
            </SimpleItem>
          </Form>
        </form>
      </ScrollView>
      <Footer />

      {forgotPasswordModalOpen ? (
        <ForgotPasswordPopup
          visible={forgotPasswordModalOpen}
          onHide={handleCloseForgotPassword}
        />
      ) : (
        <></>
      )}
    </>
  );
};
