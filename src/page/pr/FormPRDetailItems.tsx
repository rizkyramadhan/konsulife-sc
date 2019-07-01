import UIList from "@app/libs/ui/UIList";
import React from "react";
import { View, Button } from 'reactxp';
import { MainStyle } from '@app/config';
import UIText from '@app/libs/ui/UIText';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UISeparator from '@app/libs/ui/UISeparator';
import SAPDropdown from '@app/components/SAPDropdown';
import global from '@app/global';

export default ({ items, setItems, flag, setSelected }: any) => {
  return (
    <UIList
      selection={!flag?"multi":"detail"}
      onSelect={(_,key)=>{
        let selectArr:any[]=[];
        key.forEach((val:any)=>{
          items.forEach((el:any) => {
            if(el.PK === val)
            {
              selectArr.push(el);
            }
          });
        });
        setSelected(selectArr);
      }}
      detailComponent={(item) => {
        const setValue = (val: any, key: string) => {
          const idx = items.findIndex((x: any) => x.PK === item.pkval);
          items[idx][key] = parseInt(val).toString();
          setItems([...items]);
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
                  key: 'WhsCode', size: 12, label: "Warehouse", component: (
                    <SAPDropdown label="Warehouse" field="WarehouseCodeBranch" 
                     where={[
                       {
                         field:"U_BRANCH",
                         value:global.getSession().user.branch
                       }
                     ]}
                     value={(item as any).item.WhsCode} setValue={(v) => {
                      const idx = items.findIndex((x: any) => x.PK === item.pkval);
                      items[idx]['WhsCode'] = v;
                      setItems([...items]);
                    }} />)
                },
                {
                  key: 'Quantity', size: 12, label: 'Quantity', type: "number"
                }
              ]}
            />

          </View>
        )
      }}
      primaryKey="PK"
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
        U_IDU_PARTNUM: {
          table: {
            header: "Part Number"
          }
        },
        Quantity: {
          table: {
            header: "Quantity"
          }
        },
        UomCode: {
          table: {
            header: "UoM"
          }
        },
        OpenCreQty: {
          table: {
            header: "Open Qty"
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
