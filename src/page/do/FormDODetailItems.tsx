import UIList from "@app/libs/ui/UIList";
import React from "react";

export default ({ items}: any) => {
  return (
    <UIList
      primaryKey="LineNum"
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
          UomCode: {
              table: {
                  header: "Inventory UoM"
              }
          },
          Quantity: {
              table: {
                  header: "Quantity"
              }
          },
          PriceBefDi: {
              table: {
                  header: "Unit Price"
              }
          },
      }}
      items={items}
    />
  );
};
