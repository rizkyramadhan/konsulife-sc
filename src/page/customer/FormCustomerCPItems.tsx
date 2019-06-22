import UIButton from "@app/libs/ui/UIButton";
import UIJsonTable from "@app/libs/ui/UIJsonTable";
import UIRow from "@app/libs/ui/UIRow";
import React from "react";

export default ({ items, setItems }: any) => {
  return (
    <UIJsonTable
      headers={[
        {
            key: "Name",
            label: "Contact Person Name"
        },
        {
            key: "FirstName",
            label: "First Name"
        },
        {
            key: "MiddleName",
            label: "Middle Name"
        },
        {
            key: "LastName",
            label: "Last Name"
        },
        {
            key: "Tel1",
            label: "Telephone 1"
        },
        {
            key: "Tel2",
            label: "Telephone 2"
        },
        {
            key: "Cellolar",
            label: "Mobile Phone"
        },
        {
            key: "action",
            label: ""
        }
      ]}
      data={items.map((item: any, index: any) => ({
        ...item,
        action: (
          <UIRow>
            <UIButton
              size="small"
              color="error"
              onPress={() => {
                items.splice(index, 1);
                setItems([...items]);
              }}
              fill="clear"
            >
              Remove
            </UIButton>
          </UIRow>
        )
      }))}
      colWidth={[
        {
          index: 4,
          width: 90
        }
      ]}
    />
  );
};