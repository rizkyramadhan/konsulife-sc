import UIButton from "@app/libs/ui/UIButton";
import UIList from "@app/libs/ui/UIList";
import UIRow from "@app/libs/ui/UIRow";
import React from "react";

export default ({ items, setItems }: any) => {
  return (
    <UIList
      fields={{
        ItemCode: {
          index: 0,
          table: { header: "Item Code" }
        },
        ItemName: {
          index: 1,
          table: { header: "Item Name" }
        },
        U_IDU_PARTNUM: {
          index: 2,
          table: { header: "Part Number" }
        },
        WhsCode: {
          index: 3,
          table: { header: "Warehouse Code" }
        },
        Quantity: {
          index: 4,
          table: { header: "QTY", width: 90 }
        },
        UnitMsr: {
          index: 5,
          table: { header: "UoM" }
        },
        UnitCreQty: {
          index: 6,
          table: { header: "Open QTY" }
        },
        action: {
          index: 7,
          table: {}
        }
      }}
      items={items.map((item: any, index: any) => ({
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
    />
  );
};
