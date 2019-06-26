import UIList from "@app/libs/ui/UIList";
import React from "react";
import { MainStyle } from '@app/config';
import UIText from '@app/libs/ui/UIText';
import UISeparator from '@app/libs/ui/UISeparator';
import UIJsonField from '@app/libs/ui/UIJsonField';
import IconTrash from '@app/libs/ui/Icons/IconTrash';
import { View, Button } from 'reactxp';

export default ({ items, setItems }: any) => {
  return (
    <UIList
      selection="detail"
      primaryKey="Key"
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
        Quantity: {
          table: {
            header: "Quantity"
          }
        }
      }}
      items={items}
      detailComponent={(item) => (
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
              <UIText>{item.item.ItemCode}</UIText>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Button onPress={() => { item.close(); }}>
                <UIText size="large">&times;</UIText>
              </Button>
            </View>
          </View>
          <UISeparator style={{ marginTop: 0, marginBottom: 0 }} />
          <UIJsonField
            items={item.item}
            setValue={(val: any, key: any) => {
              const idx = items.findIndex((x: any) => x.Key === item.pkval);
              items[idx][key] = parseInt(val);
              setItems([...items]);
            }}
            style={{
              padding: 10
            }}
            field={[
              {
                key: 'Quantity', size: 12, label: 'Quantity', type: "number"
              },
            ]}
          />
          <Button onPress={() => {
            const idx = items.findIndex((x: any) => x.Key === item.pkval);
            items.splice(idx, 1);
            setItems([...items]);
            item.close();
          }} style={{
            padding: 10
          }}>
            <IconTrash color="red" height={22} width={22} />
          </Button>
        </View>
      )}
    />
  );
};
