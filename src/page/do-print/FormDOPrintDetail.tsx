import React from "react";
import UIList from '@app/libs/ui/UIList';

export default ({ items }: any) => {
  return (
    <UIList
      primaryKey="Key"
      selection="none"
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
        WhsCode: {
          table: {
            header: "Warehouse"
          }
        },
        unitMsr: {
          table: {
            header: "UoM Code"
          }
        },
        Quantity: {
          table: {
            header: "Quantity"
          }
        }
      }}
      items={items}
    />
  );
};
