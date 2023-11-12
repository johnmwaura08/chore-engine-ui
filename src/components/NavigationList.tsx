/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from "react";
import List from "devextreme-react/list";

const navigation = [
  { id: 1, text: "Inbox", icon: "message", path: "views/inbox" },
  { id: 2, text: "Sent Mail", icon: "check", path: "views/sent-mail" },
  { id: 3, text: "Trash", icon: "trash", path: "views/trash" },
  { id: 4, text: "Spam", icon: "mention", path: "views/spam" },
];

function NavigationList(props: any) {
  const closeDrawer = () => {
    props.stateHandler(false);
  };

  const renderItem = useCallback(
    (data: { path: string; icon: any; text: any }) => {
      return (
        <div>
          {/* <Link to={"/" + data.path}> */}
          <div>
            <div className="dx-list-item-icon-container">
              <i className={`dx-icon dx-list-item-icon dx-icon-${data.icon}`} />
            </div>
            <span>{data.text}</span>
          </div>
          {/* </Link> */}
        </div>
      );
    },
    []
  );

  return (
    <div>
      <List
        items={navigation}
        width={200}
        selectionMode="single"
        onSelectionChanged={closeDrawer}
        itemRender={renderItem}
      />
    </div>
  );
}

export default NavigationList;
