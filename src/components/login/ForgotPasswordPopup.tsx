/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Form, {
  Label,
  RequiredRule,
  SimpleItem,
  CompareRule,
  CustomRule,
  EmailRule,
} from "devextreme-react/form";
import { Button, ScrollView, Popup } from "devextreme-react";
import { authApi } from "api/auth.api";
import {
  GridHelperFunctions,
  ToastTypeEnum,
} from "components/chores/grid.helpers";

export const ForgotPasswordPopup = ({
  visible,
  onHide,
}: {
  visible: boolean;
  onHide: () => void;
}) => {
  const formRef = React.useRef<any>();

  const [dataSource, setDataSource] = React.useState({
    email: "",
  });
  const handleSubmit = async () => {
    const result = formRef && formRef.current.instance.validate();
    if (result.isValid) {
      onHide();
      await handleForgotPassword();
    }
  };

  const handleForgotPassword = async () => {
    try {
      const message =
        "A temporary password has been sent to your email if the account exists.";

      GridHelperFunctions.toaster(ToastTypeEnum.Success, message);

      await authApi.forgotPassword({
        email: dataSource.email,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onEnterKeyPressed = () => {
    formRef && formRef?.current?.instance?.validate();
    const result = formRef && formRef.current.instance.validate();
    if (result.isValid) {
      handleSubmit();
    }
  };

  return (
    <Popup
      title="Password Reset"
      showTitle
      width="auto"
      height="auto"
      minHeight="15rem"
      minWidth="25rem"
      resizeEnabled
      visible={visible}
      onHiding={onHide}
      hideOnOutsideClick
      showCloseButton
    >
      <ScrollView>
        <form onSubmit={handleSubmit}>
          <Form
            ref={formRef}
            colCount={1}
            id="login"
            formData={dataSource}
            labelLocation="left"
            readOnly={false}
            validationGroup="forgotPasswordForm"
            showValidationSummary
          >
            <SimpleItem
              editorType="dxTextBox"
              editorOptions={{
                onEnterKey: onEnterKeyPressed,
                showClearButton: true,
              }}
              dataField="email"
              isRequired
            >
              <Label text="Email" />
              <EmailRule message="Email is invalid" />
              <RequiredRule message="Email is required" />
            </SimpleItem>
            <SimpleItem>
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
            </SimpleItem>
          </Form>
        </form>
      </ScrollView>
    </Popup>
  );
};
