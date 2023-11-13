import React from "react";
interface IProps {
  recordsFound: number;
}

export const RecordsFoundToolbarItem: React.FC<IProps> = ({ recordsFound }) =>
  recordsFound > 0 ? (
    <div
      style={{
        width: "auto",
      }}
    >
      <span>
        {recordsFound}
        &nbsp;
        {recordsFound === 1 ? "Record" : "Records"} Found
      </span>
    </div>
  ) : (
    <></>
  );
