import UIButton from "@app/libs/ui/UIButton";
import UIJsonTable from "@app/libs/ui/UIJsonTable";
import UIRow from "@app/libs/ui/UIRow";
import React from "react";

export default ({ items, setItems }: any) => {
  return (
    <UIJsonTable	
      headers={[
        {
            key: "AddressId",
            label: "Address ID"
        },
        {
            key: "MailAddres",
            label: "Ship-to Street"
        },
        {
            key: "MailZipCod",
            label: "Ship-to Zip Code"
        },
        {
            key: "MailCity",
            label: "Ship-to City"
        },
        {
            key: "State2",
            label: "Ship-to State"
        },
        {
            key: "AddressType",
            label: "Type"
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