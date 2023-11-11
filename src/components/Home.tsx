/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "devextreme/data/odata/store";
import DataGrid, {
  Column,
  Paging,
  Pager,
  FilterRow,
  OperationDescriptions,
  Toolbar,
  HeaderFilter,
  SearchPanel,
  Sorting,
  Lookup,
  Editing,
  ColumnChooser,
  Form,
  GroupPanel,
  Grouping,
  Popup,
  Scrolling,
  Item as GridItem,
} from "devextreme-react/data-grid";
import React from "react";
import { useClearFilter } from "./useClearFilter";
import useIsMounted from "./useIsMounted";
import { LoadPanel, DateBox, SelectBox } from "devextreme-react";
import { ClearFiltersButton } from "./ClearFiltersButton";
import { RecordsFoundToolbarItem } from "./RecordsFoundToolbarItem";
import { GridHelperFunctions, ToastTypeEnum } from "./grid.helpers";
import { Item, Label } from "devextreme-react/form";
import { ChoreResponseDto } from "./models/ChoreResponseDto";
import { UserResponseDto } from "./models/UserResponseDto";
import { choreApi } from "../api/chore.api";
import { userApi } from "../api/user.api";
import useScreenSize from "./useScreenSize";

const allowedPageSizes = [15, 30, 50, 100, 1000];

const frequencyStore = [
  { id: "DAILY", name: "Daily" },
  { id: "WEEKLY", name: "Weekly" },
  { id: "MONTHLY", name: "Monthly" },
  { id: "BIWEEKLY", name: "Biweekly" },
  { id: "SPECIFIC_DATE", name: "Specific Date" },
];

export const Home = () => {
  const dataGridRef = React.useRef<any>();

  const isMounted = useIsMounted();
  const { handleClearFilter } = useClearFilter(dataGridRef);
  const [loading, setLoading] = React.useState(false);

  const { width } = useScreenSize();

  const [users, setUsers] = React.useState<UserResponseDto[]>([]);
  const [chores, setChores] = React.useState<ChoreResponseDto[]>([]);

  const [formDS, setFormDS] = React.useState<any>();
  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const { data: chores } = await choreApi.getChores();
      const { data: users } = await userApi.getUsers();

      setChores(chores);
      setUsers(users);
      setFormDS(chores[0]);
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

  const onSaved = React.useCallback((e: any) => {
    try {
      setLoading(true);
      console.log("changes are,", e);
      console.log("formRef", formDS);
      if (e.changes[0].type === "insert") {
        const { data } = e.changes[0];
        console.log("insert data is,", data);
        //choreApi.createChore(chore);
      }
      if (e.changes[0].type === "update") {
        const { data: chore } = e.changes[0];
        console.log("update data is,", chore);
      }
    } catch (error) {
      console.error(error);
      GridHelperFunctions.toaster(ToastTypeEnum.Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onEditingStart = React.useCallback((e: any) => {
    if (e?.data) {
      setFormDS(e.data);
    } else {
      setFormDS({});
    }
  }, []);

  return (
    <div id="data-grid-demo">
      <LoadPanel visible={loading} position="center" showIndicator showPane />
      <DataGrid
        dataSource={chores}
        keyExpr="id"
        showBorders={true}
        wordWrapEnabled
        ref={dataGridRef}
        width="97%"
        columnHidingEnabled
        allowColumnReordering
        rowAlternationEnabled={true}
        allowColumnResizing={true}
        sorting={{ mode: "multiple" }}
        style={{
          marginTop: "1Orem !important",
        }}
        repaintChangesOnly
        onSaved={onSaved}
        onEditingStart={onEditingStart}
        // onSaving={}
      >
        <SearchPanel
          visible={true}
          width={240}
          highlightSearchText={true}
          placeholder="Search..."
        />
        <HeaderFilter visible={true} />
        <FilterRow visible={true} applyFilter="auto">
          <OperationDescriptions startsWith="Contains" />
        </FilterRow>
        <Toolbar>
          <GridItem
            location="before"
            visible={!GridHelperFunctions.isMobileView(width)}
          >
            <RecordsFoundToolbarItem
              recordsFound={GridHelperFunctions.calculateRecordsFound(chores)}
            />
          </GridItem>

          <GridItem name="addRowButton" />
          {/* <Item name='saveButton' /> */}
          <GridItem location="after">
            <ClearFiltersButton handleClearFilter={handleClearFilter} />
          </GridItem>
          <GridItem name="searchPanel" />
          <GridItem name="columnChooserButton" />
        </Toolbar>

        <Paging defaultPageSize={30} />

        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={allowedPageSizes}
          showInfo={true}
        />
        <Sorting mode="multiple" />

        <Scrolling mode="standard" />
        <Editing
          mode="popup"
          allowUpdating={true}
          allowAdding={true}
          allowDeleting={true}
        >
          <Grouping contextMenuEnabled={true} expandMode="rowClick" />
          <GroupPanel
            visible={true}
            emptyPanelText="Use the context menu of header columns to group data"
          />
          <Popup
            title="Employee Info"
            showTitle={true}
            minWidth="35%"
            minHeight="45%"
            resizeEnabled
          />
          <ColumnChooser enabled={true} mode="select" />
          <Form formData={formDS}>
            <Item itemType="group" colCount={2} colSpan={2}>
              <Item dataField="name" isRequired />
              <Item dataField="description">
                <Label text="Additional instructions" />
              </Item>
              <Item
                dataField="userName"
                isRequired
                // editorType="dxSelectBox"
                // editorOptions={{
                //   dataSource: users,
                //   displayExpr: "name",
                //   keyExpr: "name",
                // }}
              >
                <SelectBox
                  dataSource={users}
                  displayExpr="name"
                  valueExpr="id"
                  defaultValue={formDS?.userId}
                ></SelectBox>
                <Label text="Assigned To" />
              </Item>
              <Item
                dataField="frequency"
                editorType="dxSelectBox"
                isRequired
                editorOptions={{
                  dataSource: frequencyStore,
                  displayExpr: "name",
                  keyExpr: "id",
                }}
              >
                <Label text="Frequency" />
              </Item>
              <Item
                dataField="specificDate"
                editorType="dxDateBox"
                editorOptions={{
                  type: "datetime",
                }}
              >
                <DateBox
                  type="datetime"
                  defaultValue={formDS?.createdAt}
                ></DateBox>
                <Label text="Date" />
              </Item>
            </Item>
          </Form>
        </Editing>
        <Column
          dataField="name"
          caption="Name"
          //   width="auto"
          allowGrouping={false}
        />
        <Column dataField="description" caption="Additional instructions" />
        <Column
          dataField="frequency"
          caption="Frequency"
          // width={80}
        >
          <Lookup
            dataSource={frequencyStore}
            displayExpr="name"
            valueExpr="id"
          />
        </Column>
        <Column
          caption="Assigned To"
          dataField="userName"
          // width={100}
        >
          <Lookup dataSource={users} displayExpr="name" valueExpr="name" />
        </Column>
        <Column
          dataField="updatedAt"
          dataType="datetime"
          caption="LastModified"
          allowEditing={false}
        />
      </DataGrid>
    </div>
  );
};
