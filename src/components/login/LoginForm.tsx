/* eslint-disable @typescript-eslint/no-explicit-any */
import Form, { Label, RequiredRule, SimpleItem } from "devextreme-react/form";
import { Button, ScrollView } from "devextreme-react";
import { FC } from "react";
// import "../login.css";
import logo from "../../assets/logo.png";
import React from "react";
import "./login.css";
import { EmailRule } from "devextreme-react/data-grid";
import { GridHelperFunctions, ToastTypeEnum } from "../grid.helpers";
import { authApi } from "../../api/auth.api";

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
        GridHelperFunctions.toaster(ToastTypeEnum.Success, "Login Success");
      } else {
        GridHelperFunctions.toaster(ToastTypeEnum.Error, "Invalid Credentials");
      }
    } catch (error) {
      GridHelperFunctions.toaster(ToastTypeEnum.Error, "Invalid Credentials");
    }
  };

  const onSubmit = async () => {
    const result = formRef && formRef.current.instance.validate();
    if (result.isValid) {
      await handleLogin();
    }
  };

  return (
    <ScrollView height="auto" className="boit-login-form" showScrollbar="never">
      <div className="boit-login-header">
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
            editorOptions={{ mode: "password", onEnterKey: onEnterKeyPressed }}
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
                }}
              />
            </div>
          </SimpleItem>
        </Form>
      </form>
    </ScrollView>
  );
};
