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
import IconSave from "@app/libs/ui/Icons/IconSave";
import IconAdd from "@app/libs/ui/Icons/IconAdd";
import FormSODetailItems from "./FormSODetailItems";

const sample = {
  CardCode: "",
  CardName: "",
  NumAtCard: "",
  DocDate: "",
  DocDueDate: "",
  DocCur: "",
  DocRate: "",
  U_IDU_SO_INTNUM: "",
  GroupNum: "",
  SlpCode: "",
  CntctCode: "",
  Address2: "",
  Address: "",
  Comments: ""
};

const sampleList = [
  {
    ItemCode: "",
    Dscription: "",
    U_IDU_PARTNUM: "",
    UseBaseUn: "",
    Quantity: 0,
    UoMCode: "",
    WhsCode: "",
    ShipDate: "",
    OcrCode: "",
    OcrCode2: "",
    UnitPrice: 1950000,
    DiscPrcnt: "",
    TaxCode: ""
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
        center="Form SO Taking Order"
      >
        <UIButton
          color="primary"
          size="small"
          onPress={() => {
            alert("Saved!");
          }}
        >
          <IconSave color="#fff" />
          {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }}>{" Save"}</UIText>
          )}
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
            <UIButton
              color="success"
              size="small"
              onPress={() => {
                alert("Add!");
              }}
            >
              <IconAdd color="#fff" height={24} width={24} />
              {isSize(["md", "lg"]) && (
                <UIText style={{ color: "#fff" }} size="small">
                  {" Add"}
                </UIText>
              )}
            </UIButton>
          </View>
          <FormSODetailItems items={items} setItems={setItems} />
        </View>
      </UIBody>
    </UIContainer>
  );
});
