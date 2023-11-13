/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  DateBox,
  LoadPanel,
  Popup,
  SelectBox,
  TextBox,
  Validator,
} from "devextreme-react";
import Form, { Label, RequiredRule, Item } from "devextreme-react/form";
import { frequencyStore, _dayOfTheWeekStore, Frequency } from "../stores";
import React from "react";
import { IFormState } from "../chores/Home";
import { UserResponseDto } from "../../models/UserResponseDto";
import { GridHelperFunctions, ToastTypeEnum } from "../chores/grid.helpers";
import { IUpdateChoreDto } from "../../models/CreateChoreRequest";
import { choreApi } from "../../api/chore.api";
import { ChoreEngineCRUDMode } from "components/utils/types.utils";

interface IAddEditChoreProps {
  visible: boolean;
  onHide: () => void;
  formState: IFormState;
  mode: ChoreEngineCRUDMode;
  setFormState: React.Dispatch<Partial<IFormState>>;
  users: UserResponseDto[];
  fetchData: () => Promise<void>;
}

//TODO Add custom rule validation for frequency

export const AddEditChore: React.FC<IAddEditChoreProps> = ({
  visible,
  formState,
  onHide,
  setFormState,
  users,
  fetchData,
}) => {
  const formRef = React.useRef<any>();

  const onNameChanged = React.useCallback(
    (e: any) => {
      setFormState({ name: e.value });
    },
    [setFormState]
  );

  const onDescriptionChanged = React.useCallback(
    (e: any) => {
      setFormState({ description: e.value });
    },
    [setFormState]
  );

  const onFrequencyChanged = React.useCallback(
    (e: any) => {
      setFormState({
        frequency: e.value,
        specificDateVisible: e.value === Frequency.SPECIFIC_DATE,
        monthlyVisible: e.value === Frequency.MONTHLY,
        weeklyVisible: e.value === Frequency.WEEKLY,
        biWeeklyVisible: e.value === Frequency.BIWEEKLY,
      });
    },
    [setFormState]
  );

  const onUserIdChanged = React.useCallback(
    (e: any) => {
      setFormState({ userId: e.value });
    },
    [setFormState]
  );

  const onSpecificDateChanged = React.useCallback(
    (e: any) => {
      setFormState({ specificDate: e.value });
    },
    [setFormState]
  );

  const onDayOfMonthChanged = React.useCallback(
    (e: any) => {
      setFormState({ dayOfMonth: e.value });
    },
    [setFormState]
  );

  const onDayOfWeekChanged = React.useCallback(
    (e: any) => {
      setFormState({ dayOfWeek: e.value });
    },
    [setFormState]
  );

  const onBiWeeklyDayOfWeekChanged = React.useCallback(
    (e: any) => {
      setFormState({ biWeeklyDayOfWeek: e.value });
    },
    [setFormState]
  );

  const getDayOfWeek = (frequency: Frequency, formState: IFormState) => {
    if (frequency === Frequency.WEEKLY) {
      return GridHelperFunctions.getValueOrDefault(formState.dayOfWeek);
    } else if (frequency === Frequency.BIWEEKLY) {
      return GridHelperFunctions.getValueOrDefault(formState.biWeeklyDayOfWeek);
    }
    return undefined;
  };

  const handleCreateUpdate = async () => {
    try {
      setFormState({
        isLoading: true,
      });
      const request: IUpdateChoreDto = {
        id: formState.choreId,
        name: formState.name,
        description: formState.description,
        frequency: formState.frequency as Frequency,
        dayOfMonth: formState.dayOfMonth
          ? GridHelperFunctions.getDayOfMonthLuxon(formState.dayOfMonth)
          : undefined,
        dayOfWeek: getDayOfWeek(formState.frequency as Frequency, formState),
        specificDate: GridHelperFunctions.formatDateForDB(
          formState.specificDate
        ),
        assignee: users.filter((u) => u.id === formState.userId)[0]?.email,
      };

      let res: any;

      if (formState.mode === ChoreEngineCRUDMode.Insert) {
        res = await choreApi.createChore(request);
      } else if (formState.mode === ChoreEngineCRUDMode.Update) {
        res = await choreApi.updateChore(request);
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
      title="Chore Management"
      showTitle={true}
      minWidth="35%"
      minHeight="45%"
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
        id="caseEventForm"
        labelLocation="top"
        validationGroup="caseEventValidationGroup"
        showValidationSummary={true}
      >
        <Item itemType="group" colCount={2} colSpan={2}>
          <Item isRequired dataField="name">
            <TextBox
              defaultValue={formState.name}
              onValueChanged={onNameChanged}
            >
              <Validator validationGroup="caseEventValidationGroup">
                <RequiredRule message="Title is required."></RequiredRule>
              </Validator>
            </TextBox>
            <Label text="Title" />
          </Item>
          <Item>
            <TextBox
              defaultValue={formState.description}
              onValueChanged={onDescriptionChanged}
            />

            <Label text="Additional instructions" />
          </Item>
          <Item isRequired>
            <SelectBox
              dataSource={users}
              displayExpr="name"
              valueExpr="id"
              defaultValue={formState?.userId}
              onValueChanged={onUserIdChanged}
            >
              <Validator validationGroup="caseEventValidationGroup">
                <RequiredRule message="Assignee is required."></RequiredRule>
              </Validator>
            </SelectBox>
            <Label text="Assigned To" />
          </Item>
          <Item editorType="dxSelectBox" isRequired>
            <SelectBox
              dataSource={frequencyStore}
              displayExpr="name"
              valueExpr="id"
              defaultValue={formState?.frequency}
              onValueChanged={onFrequencyChanged}
            >
              <Validator validationGroup="caseEventValidationGroup">
                <RequiredRule message="Frequency is required."></RequiredRule>
              </Validator>
            </SelectBox>
            <Label text="Frequency" />
          </Item>
          <Item visible={formState.weeklyVisible}>
            <SelectBox
              dataSource={_dayOfTheWeekStore}
              displayExpr="name"
              valueExpr="id"
              defaultValue={formState.dayOfWeek}
              onValueChanged={onDayOfWeekChanged}
            />
            <Label text="Day of Week" />
          </Item>
          <Item visible={formState.monthlyVisible}>
            <DateBox
              type="date"
              defaultValue={formState.dayOfMonth}
              onValueChanged={onDayOfMonthChanged}
            ></DateBox>
            <Label text="Day of Month" />
          </Item>
          <Item visible={formState.biWeeklyVisible}>
            <SelectBox
              dataSource={_dayOfTheWeekStore}
              displayExpr="name"
              valueExpr="id"
              defaultValue={formState.biWeeklyDayOfWeek}
              onValueChanged={onBiWeeklyDayOfWeekChanged}
              //   disabled={!formState.biWeeklyVisible}
            />
            <Label text="Bi Weekly Day of Week" />
          </Item>

          <Item visible={formState.specificDateVisible}>
            <DateBox
              type="datetime"
              defaultValue={formState?.specificDate}
              onValueChanged={onSpecificDateChanged}
            ></DateBox>
            <Label text=" Specific Date" />
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
