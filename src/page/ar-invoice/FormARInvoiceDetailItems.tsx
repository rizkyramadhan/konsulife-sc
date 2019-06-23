import UIButton from "@app/libs/ui/UIButton";
import UIRow from "@app/libs/ui/UIRow";
import React from "react";
import UIList from "@app/libs/ui/UIList";

export default ({ items, setItems }: any) => {
  return (
    <UIList
      primaryKey="CardCode"
      items={items.map((item: any, index: any) => ({
        ...item,
        UnitPrice: item.UnitPrice.toLocaleString(),
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
