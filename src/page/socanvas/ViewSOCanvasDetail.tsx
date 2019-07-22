import UIList from "@app/libs/ui/UIList";
import React from "react";

export default ({items}: any) => {
  return (
    <UIList
      primaryKey="Key"
      selection="detail"
      fields={{
        ItemCode: {
          table: {
            header: "Item Code"
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
        unitMsr: {
          table: {
            header: "UoM"
          }
        },
        Quantity: {
          table: {
            header: "Quantity"
          }
        },
        WhsCode: {
          table: {
            header: "Warehouse"
          }
        },
        PriceBefDi: {
          table: {
            header: "Price"
          }
        },
        DiscPrcnt: {
          table: {
            header: "Disc(%)"
          }
        },
        TotalPrice: {
          table: {
            header: "Price"
          }
        }
      }}
      items={items}
      
    />
  );
};
