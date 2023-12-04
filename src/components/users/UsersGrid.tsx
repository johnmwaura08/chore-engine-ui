/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { UserResponseDto } from "../../models/UserResponseDto";
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
  ColumnChooser,
  Scrolling,
  Item as GridItem,
  Button,
} from "devextreme-react/data-grid";
import { useClearFilter } from "../utils/useClearFilter";
import { Button as MainButton } from "devextreme-react";
import { RecordsFoundToolbarItem } from "../utils/RecordsFoundToolbarItem";
import useScreenSize from "../customHooks/useScreenSize";
import { _dayOfTheWeekStore } from "../stores";
import { ClearFiltersButton } from "components/chores/ClearFiltersButton";
import { GridHelperFunctions } from "components/chores/grid.helpers";
import { useAuthContext } from "context/useAuth";

const allowedPageSizes = [15, 30, 50, 100, 1000];

interface IUserGridProps {
  users: UserResponseDto[];
  onInitNewRow: () => void;
  onEditingStart: (e: any) => void;
  handleDeleteButtonClicked: (e: any) => Promise<void>;
  isDeleteButtonVisible: (e: any) => boolean;
  isLoading: boolean;
  onInitNewFamily: () => void;
}

const UserGrid: React.FC<IUserGridProps> = ({
  users,
  onInitNewRow,
  onEditingStart,
  handleDeleteButtonClicked,
  isDeleteButtonVisible,
  isLoading,
  onInitNewFamily,
}) => {
  const dataGridRef = React.useRef<any>();

  const { handleClearFilter } = useClearFilter(dataGridRef);

  const { width } = useScreenSize();
  const noDataText = React.useMemo(() => {
    return isLoading ? "" : "No users to display";
  }, [isLoading]);

  const { loginResponse } = useAuthContext();

  const isSystemAdmin =
    loginResponse?.email === "johnmwaura08@gmail.com" || false;
  return (
    <DataGrid
      dataSource={users}
      keyExpr="id"
      showBorders={true}
      wordWrapEnabled
      ref={dataGridRef}
      width="97%"
      columnHidingEnabled
      allowColumnReordering
      rowAlternationEnabled={true}
      allowColumnResizing={true}
      style={{
        marginTop: "1Orem !important",
      }}
      repaintChangesOnly
      noDataText={noDataText}
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
      <Sorting mode="multiple" />
      <Toolbar>
        <GridItem
          location="before"
          visible={!GridHelperFunctions.isMobileView(width)}
        >
          <RecordsFoundToolbarItem
            recordsFound={GridHelperFunctions.calculateRecordsFound(users)}
          />
        </GridItem>

        <GridItem location="after">
          <MainButton
            hint="Onboard Family"
            text="Onboard Family"
            type="success"
            visible={isSystemAdmin}
            onClick={onInitNewFamily}
            style={{ marginRight: "1rem" }}
          />
        </GridItem>
        <GridItem location="after">
          <MainButton
            icon="plus"
            hint="Add User"
            type="default"
            onClick={onInitNewRow}
          />
        </GridItem>

        {/* <Item name='saveButton' /> */}
        <GridItem location="after">
          <ClearFiltersButton handleClearFilter={handleClearFilter} />
        </GridItem>
        <GridItem name="searchPanel" />
        <GridItem
          name="columnChooserButton"
          visible={!GridHelperFunctions.isMobileView(width)}
        />
      </Toolbar>

      <Paging defaultPageSize={30} />

      <Pager
        showPageSizeSelector={true}
        allowedPageSizes={allowedPageSizes}
        showInfo={true}
      />
      <Sorting mode="multiple" />

      <Scrolling mode="standard" />
      <ColumnChooser enabled={true} mode="select" />

      <Column dataField="name" caption="Name" />
      <Column dataField="email" caption="Email" />
      <Column caption="Phone Number" dataField="phoneNumber" />
      <Column
        dataField="updatedAt"
        dataType="datetime"
        caption="LastModified"
        allowEditing={false}
      />

      <Column type="buttons">
        <Button icon="edit" visible={true} onClick={onEditingStart} />
        <Button
          icon="trash"
          visible={isDeleteButtonVisible}
          onClick={handleDeleteButtonClicked}
        />
      </Column>
    </DataGrid>
  );
};

export default React.memo(UserGrid);
