import UIButton from "@app/libs/ui/UIButton";
import UIRow from "@app/libs/ui/UIRow";
import React from "react";
import UIList from "@app/libs/ui/UIList";
import IconRemove from "@app/libs/ui/Icons/IconRemove";

export default ({ items, setItems }: any) => {
  return (
    <UIList
      primaryKey="CardCode"
      items={items.map((item: any, index: any) => ({
        ...item,
        UnitPrice: item.UnitPrice.toLocaleString(),
        action: (
          <UIRow style={{ marginTop: -10 }}>
            <UIButton
              size="small"
              fill="clear"
              style={{
                marginTop: 0,
                marginBottom: 0
              }}
              onPress={() => {
                alert("remove!");
              }}
            >
              <IconRemove
                height={18}
                width={18}
                color="red"
                onPress={() => {
                  items.splice(index, 1);
                  setItems([...items]);
                }}
              />
            </UIButton>
          </UIRow>
        )
      }))}
    />
  );
};
