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
import FormSOCanvasDetailItems from './FormSOCanvasDetailItems';
import FormSOCanvasPayment from './FormSOCanvasPayment';

const sample = {
  CardCode: "TIM0002",
  CardName: "PT FREEPOT INDONESIA",
  DocStatus: "Open",
  U_IDU_SO_INTNUM: "SO/TIM-0002/19/VI/0001",
  Sales: "Dwi",
  DiscPrcnt: 0,
  DiscSum: 0,
  VatSum: 0,
  GrandTotal: 1000000
};

const sampleList = [
  {
    ItemCode: "BSLSR000001",
    Dscription: "750R16-8PR-TL L310-T",
    UnitPrice: 1950000,
    DiscPrcnt: ""
  },
  {
    ItemCode: "BSLSR000001",
    Dscription: "750R16-8PR-TL L310-T",
    UnitPrice: 1950000,
    DiscPrcnt: ""
  }
];

const samplePayment = {
  Address: "TIM0002",
  PaymentMethod: "Cash"
};

export default observer(({ showSidebar, sidebar }: any) => {
  const data = sample;
  const dataPayment = samplePayment;
  const [items, setItems] = useState(sampleList);

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center="Form SO Canvasing"
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
              sublabel: "Informasi Sales Order",
              value: [
                {
                  key: "U_IDU_SO_INTNUM",
                  type: "field",
                  label: "SO Number"
                },
                { key: "DocStatus", size: 3, label: "Status" },

                { key: "Sales", size: 8, label: "Sales" },
                { type: "empty", size: 2 },
                { key: "PostingDate", size: 4, label: "Posting Date" },
                { key: "DeliveryDate", size: 4, label: "Delivery Date" },
                { key: "DocumentDate", size: 4, label: "Document Date" }
              ]
            },
            {
              key: "customer",
              label: "Customer",
              sublabel: "Toko Penerima Barang",
              value: [
                { key: "CardCode", label: "Customer", size: 3 },
                { key: "CardName", label: "Name" },
                { key: "ContactPerson", label: "Contact Person" },
                { key: "POCustomerNo", label: "PO Customer No", size: 8 }
              ]
            },
            {
              key: "summary",
              label: "Summary",
              sublabel: "Informasi Total Order",
              value: [
                {
                  key: "DiscPrcnt",
                  type: "money",
                  label: "Disc %",
                  size: 2
                },
                { key: "DiscSum", type: "money", label: "Discount", size: 7 },
                { key: "VatSum", type: "money", label: "Tax", size: 7 },
                { key: "GrandTotal", type: "money", size: 7 }
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
                  <FormSOCanvasDetailItems items={items} setItems={setItems} />
                )
              },
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
                      Payment
                    </UIText>
                  );
                },
                content: (
                  <FormSOCanvasPayment
                    data={dataPayment}
                    setData={(value: any, key: any) => {
                      (dataPayment as any)[key] = value;
                    }}
                  />
                )
              }
            ]}
          />
        </View>
      </UIBody>
    </UIContainer>
  );
});
