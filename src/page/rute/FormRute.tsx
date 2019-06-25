import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { View } from "reactxp";
import BtnSave from '@app/components/BtnSave';
import FormRuteItems from './FormRuteItems';
import BtnAdd from '@app/components/BtnAdd';

interface IRute {
  id?: number,
  name?: string,
  description?: string
}

interface IRuteItem {
  id?: number,
  rute_id?: number,
  customer_id?: string,
  customer_name?: string,
  customer_address?: string,
  customer_details?: string
}

export default observer(({ showSidebar, sidebar }: any) => {
  const [data, setData] = useState<IRute>({});
  const [items, setItems] = useState<Array<IRuteItem>>([]);

  const save = async () => {
    alert("Saved!");
  }

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center="Form Master Rute"
      >
        <BtnSave onPress={save} />
      </UIHeader>
      <UIBody scroll={true}>
        <UIJsonField
          items={data}
          field={[
            {
              key: "name",
              label: "Rute",
              size: 3
            }, {
              type: "empty",
              size: 9
            }, {
              key: "description",
              label: "Deskripsi",
              size: 7
            }
          ]}
          setValue={(value: any, key: any) => {
            (data as any)[key] = value;
            setData({ ...data });
          }}
        />

        <View style={{ marginTop: 50 }}>
          <View
            style={{
              justifyContent: "space-between",
              flex: 1,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <UIText
              style={{
                fontSize: 19,
                color: "#333",
                fontWeight: 400
              }}
            >
              Detail Items
            </UIText>
            <BtnAdd onPress={() => {
              setItems([...items, {
                id: new Date().valueOf(),
                rute_id: data.id,
              }])
            }} />
          </View>
          <FormRuteItems items={items} setItems={setItems} />
        </View>
      </UIBody>
    </UIContainer>
  );
});
