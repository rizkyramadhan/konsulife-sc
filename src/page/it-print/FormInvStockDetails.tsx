import UIList from "@app/libs/ui/UIList";
import React from "react";


export default ({ items }: any) => {

  return (
    <UIList
      selection="none"
      primaryKey="Key"
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
        UseBaseUn: {
          table: {
            header: "Inventory UoM"
          }
        },
        unitMsr: {
          table: {
            header: "Unit"
          }
        },
        Quantity: {
          table: {
            header: "Quantity"
          }
        },
        SerialNum: {
          table: {
            header: "Serial Number"
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
