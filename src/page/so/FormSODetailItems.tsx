import UIList from "@app/libs/ui/UIList";
import React from "react";

export default ({ items }: any) => {
  return (
    <UIList
      primaryKey="ItemCode"
      items={items.map((item: any) => ({
        ...item,
        UnitPrice: item.UnitPrice.toLocaleString(),
      }))}
    />
  );
};
