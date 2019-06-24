import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { View } from "reactxp";
import FormSOCanvasDetailItems from "./FormWODetailItems";
import BtnSave from '@app/components/BtnSave';
import BtnAdd from '@app/components/BtnAdd';
import SAPDropdown from '@app/components/SAPDropdown';

const wo = {
  id: 1,
  number: "WO/BPP-01/VI/19",
  sales_id: 1,
  sales_name: "RICKY SUSANTO",
  sopir: "SAMINA",
  sopir_sim: "12345",
  nopol: 'KT 9800 OK',
  branch: "BPP",
  rute: "BPP-001",
  periode_start: "2019-06-01",
  periode_end: "2019-06-05"
};

const woItems = [
  {
    id: 1,
    customer_id: 1,
    customer_name: "Adi",
    customer_address: "Test",
    customer_detail: "Test",
  },
  {
    id: 2,
    customer_id: 1,
    customer_name: "Adi",
    customer_address: "Test",
    customer_detail: "Test",
  }
];

export default observer(({ showSidebar, sidebar }: any) => {
  const [data, setData] = useState(wo);
  const [items, setItems] = useState(woItems);

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center="Form Working Order"
      >
        <BtnSave />
      </UIHeader>
      <UIBody scroll={true}>
        <UIJsonField
          items={data}
          field={[
            {
              key: "general",
              label: "General",
              sublabel: "Informasi Working Order",
              value: [
                { key: "number", label: "WO Number", size: 8, type: 'field' },
                { key: "sales_id", size: 7, component: (<SAPDropdown label="Sales" field="SAPSalesCode" value={data.sales_id} setValue={(v) => { setData({ ...data, sales_id: v }) }} />) },
                { type: 'empty' },
                { key: "branch", label: "Cabang", size: 5 },
                { key: "rute", label: "Rute", size: 5 },
                { key: "periode_start", label: "Start", size: 6, type: "date" },
                { key: "periode_end", label: "End", size: 6, type: 'date' },
              ]
            },
            {
              key: "sopir",
              label: "Sopir",
              sublabel: "Informasi Sopir",
              value: [
                { key: "sopir", label: "Sopir", size: 7 },
                { key: "sopir_sim", label: "No SIM", size: 8 },
                { key: "nopol", label: "Nopol", size: 5 },
              ]
            }
          ]}
          setValue={(value: any, key: any) => {
            (data as any)[key] = value;
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
            <BtnAdd />
          </View>
          <FormSOCanvasDetailItems items={items} setItems={setItems} />
        </View>
      </UIBody>
    </UIContainer>
  );
});
