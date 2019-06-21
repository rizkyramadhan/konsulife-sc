import { isSize } from '@app/libs/ui/MediaQuery';
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UITabs from "@app/libs/ui/UITabs";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Alert, Image, View } from "reactxp";
import FormARInvoiceDetailItems from './FormARInvoiceDetailItems';

const sample = {
    CardCode: "TIM0002",
    CardName: "PT FREEPOT INDONESIA",
    U_IDU_SO_INTNUM: "SO/TIM-0002/19/VI/0001",
    U_IDU_DO_INTNUM: "",
    U_BRANCH: "",
    Comments: "",
};

const sampleList = [
  {
    ItemCode: "BSLSR000001",
    ItemName: "750R16-8PR-TL L310-T",
    U_IDU_PARTNUM: "",
    WhsCode: "TIM001",
    Quantity: 10,
    UnitMsr: "Unit",
    OpenCreQty: 50
  },
  {
    ItemCode: "BSLSR000001",
    ItemName: "750R16-8PR-TL L310-T",
    U_IDU_PARTNUM: "",
    WhsCode: "TIM001",
    Quantity: 10,
    UnitMsr: "Unit",
    OpenCreQty: 50
  }
];

export default observer(({ showSidebar, sidebar }: any) => {
  const data = sample;
  const [items, setItems] = useState(sampleList);

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center="Form AR Invoice"
      >
        <UIButton fill="clear"
          color="primary"
          size="small"
          onPress={() => {
            Alert.show("Saved!");
          }}
        >
          <Image source={require("@icon/save.png")} style={{ width: 28, height: 28 }}></Image>
          {isSize(["md", "lg"]) && <UIText style={{ color: '#613eea' }}> Save</UIText>}
        </UIButton>
      </UIHeader>
      <UIBody>
        <UIJsonField
          items={data}
          field={[
            {
              key: "general",
              label: "General",
              sublabel: "Informasi SO/DO",
              value: [
                {
                  key: "U_IDU_SO_INTNUM",
                  type: "field",
                  label: "SO Number",
                  size: 7
                },
                {
                    key: "U_IDU_DO_INTNUM",
                    type: "field",
                    label: "DO Number",
                    size: 7
                },
                { type: "empty", size: 5 },
                { key: "DocDate", size: 4, label: "Posting Date" },
                { key: "DocDueDate", size: 4, label: "Delivery Date" },
                { type: "empty", size: 2 },
                {
                    key: "U_BRANCH",
                    type: "field",
                    label: "Cabang",
                    size: 7
                },
              ]
            },
            {
              key: "customer",
              label: "Customer",
              sublabel: "Toko Penerima Barang",
              value: [
                { key: "CardCode", label: "Customer", size: 3 },
                { key: "CardName", label: "Name" },
              ]
            },
            {
              key: "optional",
              label: "Optional",
              value: [
                {
                  key: "Comments",
                  label: "Remark",
                  size: 12
                }
              ]
            }
          ]}
          setValue={(value: any, key: any) => {
            (data as any)[key] = value;
          }}
        />

        <View style={{ marginTop: 50 }}>
          <UITabs
            tabs={[
              {
                label: () => {
                  return (
                    <UIText
                      style={{
                        fontSize: 19,
                        color: "#333",
                        fontWeight: 400
                      }}
                    >
                      Detail Items
                    </UIText>
                  );
                },
                content: (
                  <FormARInvoiceDetailItems items={items} setItems={setItems} />
                )
              }
            ]}
          />
        </View>
      </UIBody>
    </UIContainer>
  );
});
