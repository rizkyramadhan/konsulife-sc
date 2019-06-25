import UIList from "@app/libs/ui/UIList";
import React from "react";
import { View } from 'reactxp/dist/web/Animated';
import { MainStyle } from '@app/config';
import UIText from '@app/libs/ui/UIText';
import { Button } from 'reactxp';
import UISeparator from '@app/libs/ui/UISeparator';
import UIJsonField from '@app/libs/ui/UIJsonField';
import SAPDropdown from '@app/components/SAPDropdown';

interface IRuteItem {
  id?: number,
  rute_id?: number,
  customer_id?: string,
  customer_name?: string,
  customer_address?: string,
  customer_details?: string
}

interface IProps {
  items: IRuteItem[],
  setItems: any
}

const DetailComponent = ({ item, items, setItems }: any) => {
  return <View
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
        <Button onPress={() => { item.close(); }}>
          <UIText size="large">&times;</UIText>
        </Button>
      </View>
    </View>
    <UISeparator style={{ marginTop: 0, marginBottom: 0 }} />
    <UIJsonField
      items={item.item}
      setValue={(val: any, key: string) => {
        const idx = items.findIndex((x: any) => x.LineNum === item.item.LineNum);
        items[idx][key] = val;
        setItems(items);
      }}
      style={{ padding: 10 }}
      field={[
        {
          key: 'customer_id', size: 12, component: (
            <SAPDropdown label="Customer" field="CustomerCode" value={(item as any).item.customer_id} setValue={(value, label, row) => {
              const idx = items.findIndex((x: any) => x.id === item.item.id);
              items[idx]['customer_id'] = value;
              items[idx]["customer_name"] = label;
              items[idx]["customer_details"] = row;
              setItems([...items]);
            }} />)
        }
      ]}
    />
  </View>
}

export default ({ items, setItems }: IProps) => {
  return (
    <UIList
      primaryKey="id"
      selection="detail"
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
      }}
      items={items}
      detailComponent={(item) => (<DetailComponent item={item as any} items={items} setItems={setItems} />)}
    />
  );
};
