import UIList from "@app/libs/ui/UIList";
import React from "react";
import UIButton from '@app/libs/ui/UIButton';
import IconTrash from '@app/libs/ui/Icons/IconTrash';

export default ({ items, setItems }: any) => {
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
      items={(items.map((i: any, k: any) => {
        return { ...i, del: <UIButton fill="clear" size="small" onPress={() => { items.splice(k, 1); setItems([...items]); }}><IconTrash color="red" height={20} width={20} /></UIButton> };
      }))}
    />
  );
};
