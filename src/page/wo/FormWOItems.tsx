import UIList from "@app/libs/ui/UIList";
import React from "react";

export default ({ items }: any) => {
  return (
    <UIList
      primaryKey="id"
      selection="none"
      fields={{
        customer_id: {
          table: {
            header: "Customer Code"
          }
        },
        customer_name: {
          table: {
            header: "Customer Name"
          }
        },
        customer_address: {
          table: {
            header: "Customer Address"
          }
        },
        del: {
          table: {
            header: ""
          }
        },
      }}
      items={items}
    />
  );
};
