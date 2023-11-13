/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ChoreResponseDto } from "../../models/ChoreResponseDto";
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
  ColumnChooser,
  Scrolling,
  Item as GridItem,
  Button,
} from "devextreme-react/data-grid";
import { useClearFilter } from "../utils/useClearFilter";
import { Button as MainButton } from "devextreme-react";
import { ClearFiltersButton } from "./ClearFiltersButton";
import { RecordsFoundToolbarItem } from "../utils/RecordsFoundToolbarItem";
import { GridHelperFunctions } from "./grid.helpers";
import { UserResponseDto } from "../../models/UserResponseDto";
import useScreenSize from "../customHooks/useScreenSize";
import { _dayOfTheWeekStore, frequencyStore } from "../stores";
import { GridType } from "./chores.types";

const allowedPageSizes = [15, 30, 50, 100, 1000];

interface IChoreGridProps {
  chores: ChoreResponseDto[];
  users: UserResponseDto[];
  onInitNewRow: () => void;
  onEditingStart: (e: any) => void;
  handleDeleteButtonClicked: (e: any) => Promise<void>;
  isLoading: boolean;
  gridType?: GridType;
}

const ChoreGrid: React.FC<IChoreGridProps> = ({
  chores,
  users,
  onInitNewRow,
  onEditingStart,
  handleDeleteButtonClicked,
  gridType = GridType.Current,
  isLoading,
}) => {
  const dataGridRef = React.useRef<any>();

  const { handleClearFilter } = useClearFilter(dataGridRef);

  const { width } = useScreenSize();

  const noDataText = React.useMemo(() => {
    return isLoading ? "" : "No chores to display";
  }, [isLoading]);
  return (
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
            recordsFound={GridHelperFunctions.calculateRecordsFound(chores)}
          />
        </GridItem>

        <GridItem location="after" visible={gridType === GridType.Current}>
          <MainButton
            icon="plus"
            hint="Add Chore"
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

      <Column dataField="name" caption="Name" allowGrouping={false} />
      <Column dataField="description" caption="Additional instructions" />
      <Column dataField="frequency" caption="Frequency">
        <Lookup dataSource={frequencyStore} displayExpr="name" valueExpr="id" />
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
      <Column dataField="dayOfWeek" caption="Day of Week">
        <Lookup
          dataSource={_dayOfTheWeekStore}
          displayExpr="name"
          valueExpr="id"
        />
      </Column>
      <Column dataField="dayOfMonth" caption="Day of Month" dataType="date" />
      <Column
        dataField="specificDate"
        caption="Specific Date"
        dataType="datetime"
      />

      <Column type="buttons">
        <Button
          icon="edit"
          visible={gridType === GridType.Current}
          onClick={onEditingStart}
        />
        <Button
          icon="trash"
          visible={true}
          onClick={handleDeleteButtonClicked}
        />
      </Column>
    </DataGrid>
  );
};

export default React.memo(ChoreGrid);
