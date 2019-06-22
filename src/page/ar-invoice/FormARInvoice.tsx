import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Alert, Image, View } from "reactxp";
import FormARInvoiceDetailItems from "./FormARInvoiceDetailItems";

const sample = {
  CardCode: "TIM0002",
  CardName: "PT FREEPOT INDONESIA",
  NumAtCard: "",
  DocDate: "",
  DocDueDate: "",
  DocCur: "",
  DocRate: "",
  U_IDU_DO_TRANSCODE: "",
  U_IDU_DO_INTNUM: "",
  U_IDU_CONTNUM: "",
  U_IDU_NOSEAL: "",
  U_IDU_NOPL: "",
  U_IDU_NOPOL: "",
  U_IDU_DRIVER: "",
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
    ItemCode: "BSLSR000001",
    Dscription: "750R16-8PR-TL L310-T",
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
  },
  {
    ItemCode: "BSLSR000001",
    Dscription: "750R16-8PR-TL L310-T",
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
      <UIHeader showSidebar={showSidebar} sidebar={sidebar} center="Form DO">
        <UIButton
          fill="clear"
          color="primary"
          size="small"
          onPress={() => {
            Alert.show("Saved!");
          }}
        >
          <Image
            source={require("@icon/save.png")}
            style={{ width: 22, height: 22 }}
          />
          {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#613eea" }}> Save</UIText>
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
              sublabel: "Informasi Delivery Order",
              value: [
                {
                  key: "U_IDU_DO_TRANSCODE",
                  label: "Trans Code (DO)",
                  size: 5
                },
                {
                  key: "U_IDU_DO_INTNUM",
                  label: "Delivery No.",
                  type: "field",
                  size: 7
                },
                {
                  key: "U_IDU_SO_INTNUM",
                  label: "SO Number",
                  type: "field",
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
              key: "driver",
              label: "Driver",
              sublabel: "Informasi Driver",
              value: [
                {
                  key: "U_IDU_CONTNUM",
                  label: "No. Container",
                  size: 5
                },
                {
                  key: "U_IDU_NOSEAL",
                  label: "No. Seal",
                  size: 5
                },
                {
                  key: "U_IDU_NOPL",
                  label: "No. PL",
                  size: 5
                },
                {
                  key: "U_IDU_NOPOL",
                  label: "Nopol",
                  size: 5
                },
                {
                  key: "U_IDU_DRIVER",
                  label: "Driver",
                  size: 7
                }
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
              fill="clear"
              style={{
                color: "#613eea"
              }}
            >
              <UIText> Copy From SO</UIText>
            </UIButton>
          </View>
          <FormARInvoiceDetailItems items={items} setItems={setItems} />
        </View>
      </UIBody>
    </UIContainer>
  );
});