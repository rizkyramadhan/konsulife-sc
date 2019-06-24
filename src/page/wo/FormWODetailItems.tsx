import UIList from "@app/libs/ui/UIList";
import React from "react";
import { View, Button } from 'reactxp';
import { MainStyle } from '@app/config';
import UIText from '@app/libs/ui/UIText';
import UISeparator from '@app/libs/ui/UISeparator';
import UIJsonField from '@app/libs/ui/UIJsonField';
import SAPDropdown from '@app/components/SAPDropdown';
import UIRow from '@app/libs/ui/UIRow';
import UIButton from '@app/libs/ui/UIButton';
import IconRemove from '@app/libs/ui/Icons/IconRemove';

export default ({ items, setItems }: any) => {
  return (
    <UIList
      primaryKey="id"
      items={items}
      selection="detail"
      detailComponent={(item) => {
        const setValue = (val: any, key: string) => {
          const idx = items.findIndex((x: any) => x.No === item.item.No);
          items[idx][key] = val;
          setItems(items);
        };
        return (
          <View
            style={{
              borderWidth: 0,
              borderLeftWidth: 1,
              borderColor: "#ececeb",
              backgroundColor: "#fff",
              flexBasis: 350
            }}
          >
            <View
              style={{
                padding: 4,
                marginLeft: 0,
                marginRight: 0,
                paddingLeft: 0,
                flexDirection: "row",
                justifyContent: "space-around",
                backgroundColor: MainStyle.backgroundColor
              }}
            >
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "center",
                  flex: 1,
                  paddingLeft: 10
                }}
              >
                <UIText>{item.pkval}</UIText>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Button onPress={() => { setItems([...items]); item.close; }}>
                  <UIText size="large">&times;</UIText>
                </Button>
              </View>
            </View>
            <UISeparator style={{ marginTop: 0, marginBottom: 0 }} />
            <UIJsonField
              items={item.item}
              setValue={setValue}
              style={{
                padding: 10
              }}
              field={[
                {
                  key: 'customer_id', size: 12, component: (
                    <SAPDropdown label="Customer"
                      field="CustomerCode"
                      value={item.item.customer_id}
                      setValue={(v) => {
                        setValue(v, "customer_id")
                      }} />)
                },
              ]}
            />
            <UIRow>
              <UIButton
                style={{
                  flexShrink: 'none'
                }}
                color="error"
                size="small"
                onPress={() => {
                  const idx = items.findIndex((x: any) => x.No === item.item.No);
                  items.splice(idx, 1);
                  setItems([...items]);
                }}
              >
                <IconRemove color="#fff" height={18} width={18} style={{
                  marginTop: -9
                }} />
              </UIButton>
            </UIRow>

          </View>
        )
      }}
    />
  );
};
