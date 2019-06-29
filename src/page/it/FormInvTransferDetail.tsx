import UIList from "@app/libs/ui/UIList";
import React from "react";
import { View, Button } from 'reactxp';
import { MainStyle } from '@app/config';
import UIText from '@app/libs/ui/UIText';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UISeparator from '@app/libs/ui/UISeparator';
import UISelectField from '@app/libs/ui/UISelectField';
import SAPDropdown from '@app/components/SAPDropdown';

export default ({ items, setItems }: any) => {
  return (
    <UIList
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
                <Button onPress={() => { setItems([...items]); item.close(); }}>
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
                  key: 'ItemCode', size: 12, label: 'Item Code', component: (
                    <SAPDropdown label="Item Code" field="Custom" customQuery={{
                      Table: 'OITM',
                      Fields: ["ItemCode", "ItemName", "U_IDU_PARTNUM"],
                      Condition: [{
                        field: "OnHand",
                        cond: ">",
                        value: "0"
                      }]
                    }}
                    
                    value={(item as any).item.ItemCode} setValue={async (v, l) => {
                      const idx = items.findIndex((x: any) => x.LineNum === item.item.LineNum);
                      items[idx]['ItemCode'] = v;
                      items[idx]["Dscription"] = l;
                      setItems([...items]);
                    }} />)
                },
                {
                  key: 'UseBaseUn', size: 12, label: 'Inventory UoM', component: (
                    <UISelectField
                      label="Inventory UoM"
                      items={[
                        { label: "Yes", value: "Y" },
                        { label: "No", value: "N" }
                      ]}
                      value={(item as any).item.UseBaseUn}
                      setValue={v => {
                        const idx = items.findIndex((x: any) => x.LineNum === item.item.LineNum);
                        items[idx]['UseBaseUn'] = v;
                        setItems([...items]);
                      }}
                    />
                  )
                },
                { key: 'Quantity', size: 12, label: "Quantity" },
                {
                  key: 'UomEntry', size: 12, label: 'Uom', component: (
                    <SAPDropdown label="UoM Code" field="UomCode" value={(item as any).item.UomEntry} setValue={(v) => {
                      const idx = items.findIndex((x: any) => x.LineNum === item.item.LineNum);
                      items[idx]['UomEntry'] = v;
                      setItems([...items]);
                    }} />)
                },
                { key: 'SerialNum', size: 12, label: "Serial Number" },
              ]}
            />

          </View>
        )
      }}
      primaryKey="LineNum"
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
        Quantity: {
          table: {
            header: "Quantity"
          }
        },
        UomEntry: {
          table: {
            header: "UoM Code"
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
        },
        
      }}
    />
  );
};
