import UIButton from "@app/libs/ui/UIButton";
import UIJsonTable from "@app/libs/ui/UIJsonTable";
import UIRow from "@app/libs/ui/UIRow";
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
            key: "ItemName",
            label: "Item Name"
        },
        {
            key: "U_IDU_PARTNUM",
            label: "Part Number"
        },
        {
            key: "WhsCode",
            label: "Warehouse Code"
        },
        {
            key: "Quantity",
            label: "QTY"
        },
        {
            key: "UnitMsr",
            label: "UoM"
        },
        {
            key: "OpenCreQty",
            label: "Open QTY"
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
