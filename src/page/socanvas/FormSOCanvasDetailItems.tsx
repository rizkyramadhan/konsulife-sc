import UIButton from "@app/libs/ui/UIButton";
import UIJsonTable from "@app/libs/ui/UIJsonTable";
import UIRow from "@app/libs/ui/UIRow";
import UITextField from "@app/libs/ui/UITextField";
import React from "react";

export default ({ items, setItems }: any) => {
  return (
    <UIJsonTable
      headers={[
        {
          key: "ItemCode",
          label: "Item Code"
        },
        {
          key: "Dscription",
          label: "Item Description"
        },
        {
          key: "UnitPrice",
          label: "Unit Price"
        },
        {
          key: "DiscPrcnt",
          label: "Discount"
        },
        {
          key: "action",
          label: ""
        }
      ]}
      data={items.map((item: any, index: number) => ({
        ...item,
        UnitPrice: item.UnitPrice.toLocaleString(),
        DiscPrcnt: (
          <UITextField
            type="number"
            value={item.DiscPrcnt}
            setValue={e => (item.DiscPrcnt = e)}
          />
        ),
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
