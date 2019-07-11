import UIList from "@app/libs/ui/UIList";
import React from "react";

export default ({ items }: any) => {
  return (
    <UIList
      selection="none"
      primaryKey="PK"
      items={items}
      fields={{
        ItemCode: {
          table: {
            header: "Code"
          }
        },
        Dscription: {
          table: {
            header: "Item Name"
          }
        },
        U_IDU_PARTNUM: {
          table: {
            header: "Part Number"
          }
        },
        Quantity: {
          table: {
            header: "Quantity"
          }
        },
        UomCode: {
          table: {
            header: "UoM"
          }
        },
        OpenCreQty: {
          table: {
            header: "Open Qty"
          }
        },
        WhsCode: {
          table: {
            header: "Warehouse"
          }
        }
      }}
    />
  );
};
