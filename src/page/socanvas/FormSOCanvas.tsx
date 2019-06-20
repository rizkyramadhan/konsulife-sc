import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import UIText from "@app/libs/ui/UIText";
import { View } from "reactxp/dist/web/ReactXP";
import UITabs from "@app/libs/ui/UITabs";
import FormSOCanvasDetailItems from "./FormSOCanvasDetailItems";
import FormSOCanvasPayment from "./FormSOCanvasPayment";

const sample = {
  CardCode: "TIM0002",
  CardName: "PT FREEPOT INDONESIA",
  NumAtCard: "",
  DocDate: "",
  DocDueDate: "",
  DocCur: "",
  DocRate: "",
  U_IDU_SO_INTNUM: "SO/TIM-0002/19/VI/0001",
  GroupNum: "",
  SlpCode: "",
  CntctCode: "",
  Address2: "",
  Address: "",
  Comments: ""
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
        <UIButton
          color="primary"
          size="small"
          onPress={() => {
            alert("Saved!");
          }}
          style={{
            height: 40,
            marginRight: 28,
            paddingLeft: 20,
            paddingRight: 20,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end"
          }}
        >
          Save
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
                  label: "SO Number",
                  size: 7
                },
                { type: "empty", size: 5 },
                { key: "DocDate", size: 4, label: "Posting Date" },
                { key: "DocDueDate", size: 4, label: "Delivery Date" },
                { type: "empty", size: 2 },
                { key: "DocCur", size: 4, label: "Document Currency" },
                { key: "DocRate", size: 4, label: "Document Rate" },
                { key: "SlpCode", label: "Sales Employee" }
              ]
            },
            {
              key: "customer",
              label: "Customer",
              sublabel: "Toko Penerima Barang",
              value: [
                { key: "CardCode", label: "Customer", size: 3 },
                { key: "CardName", label: "Name" },
                { key: "CntctCode", label: "Contact Person" },
                { key: "NumAtCard", label: "PO Customer No", size: 8 }
              ]
            },
            {
              key: "payment",
              label: "Payment",
              sublabel: "Informasi Pembayaran",
              value: [
                {
                  key: "Address2",
                  label: "Ship To",
                  size: 8
                },
                {
                  key: "Address",
                  label: "Bill To",
                  size: 8
                },
                {
                  key: "GroupNum",
                  label: "Payment Method",
                  size: 8
                }
              ]
            },
            { type: "empty" },
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
