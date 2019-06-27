import { APIPost } from '@app/api';
import global from '@app/global';
import SAPDropdown from '@app/components/SAPDropdown';
import IconAdd from "@app/libs/ui/Icons/IconAdd";
import IconSave from "@app/libs/ui/Icons/IconSave";
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
import FormSODetailItems from './FormSODetailItems';
import { getLastNumbering, updateLastNumbering } from '@app/utils';

const sample = {
  CardCode: "",
  CardName: "",
  NumAtCard: "",
  DocCur: "",
  DocRate: 1,
  U_IDU_SO_INTNUM: -1,
  GroupNum: -1,
  SlpCode: !!global.session.user.slp_code || -1,
  CntctCode: 1,
  Address2: "",
  Address: "",
  Comments: "",
  U_BRANCH: global.session.user.branch,
  U_USERID: global.session.user.id,
  U_GENERATED: "W",
  U_IDU_ISCANVAS: "N",
};

export default observer(({ showSidebar, sidebar }: any) => {
  const [data, setData] = useState(sample);
  const [items, setItems] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [qShip, setQShip] = useState(false);
  const [qBill, setQBill] = useState(false);

  const ActionIt = () => {
    return (<UIButton
      style={{
        flexShrink: 'none'
      }}
      color="success"
      size="small"
      onPress={() => {
        setItems([...(items as any), {
          LineNum: Math.floor(Math.random() * Math.floor(999)),
          ItemCode: "",
          Dscription: "",
          U_IDU_PARTNUM: "",
          UseBaseUn: "",
          Quantity: 0,
          WhsCode: "",
          ShipDate: "",
          OcrCode: "",
          OcrCode2: "",
          PriceBefDi: 0,
          DiscPrcnt: "",
          UomEntry: "",
          TaxCode: ""
        }])
      }}
    >
      <IconAdd color="#fff" height={18} width={18} style={{
        marginTop: -9
      }} />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff" }} size="small">
          {" Add"}
        </UIText>
      )}
    </UIButton>);
  }

  const save = async () => {
    setSaving(true);
    const Lines_IT = items.map(d => {
      d.OcrCode = global.session.user.area;
      d.OcrCode2 = global.session.user.branch;

      delete d.LineNum;
      return d;
    });

    try {
      let number: any = await getLastNumbering("SO", global.getSession().user.warehouse_id);
      await APIPost('SalesOrder', {
        ...data, U_IDU_SO_INTNUM: number.format, Lines: [...Lines_IT],
      })
      updateLastNumbering(number.id, number.last_count + 1);
    }
    catch (e) {
      alert(e.Message)
      console.error({
        ...data, Lines: [...Lines_IT],
      });
    }
    finally {
      setSaving(false);
    }

  }

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
            save();
          }}
        >
          <IconSave color="#fff" />
          {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }}>{saving ? " Saving..." : " Save"}</UIText>
          )}
        </UIButton>
      </UIHeader>
      <UIBody scroll={true}>
        <UIJsonField
          items={data}
          field={[
            {
              key: "general",
              label: "General",
              sublabel: "Informasi Sales Order",
              value: [
                { key: "DocDate", size: 6, type: "date", label: "Posting Date", options: { futureDate: true } },
                { key: "DocDueDate", size: 6, type: "date", label: "Delivery Date",options:{pastDate:true} },
                {
                  key: "DocCur", size: 8, label: "Document Currency",
                  component: (
                    <SAPDropdown label="Document Currency" field="Currency" value={(data as any).DocCur} setValue={(v) => { setData({ ...data, DocCur: v }) }} />)
                },
              ]
            },
            {
              key: "customer",
              label: "Customer",
              sublabel: "Toko Penerima Barang",
              value: [
                { key: "CardCode", size: 8, type: "field", label: "Customer/Vendor Code" },
                {
                  key: "CardCode", label: "Customer/Vendor", size: 12, component: (
                    <SAPDropdown label="Customer" field="CustomerCode" value={(data as any).CardCode} setValue={(v, l, r) => {
                      setData({ ...data, CardCode: v, CardName: l, GroupNum: r.item.GroupNum, DocCur: r.item.Currency });
                      setQBill(true);
                      setQShip(true);
                    }} />)
                },
                // { key: "CardName", label: "Name" },
                {
                  key: "CntctCode", label: "Contact Person", size: 7, component: (
                    <SAPDropdown label="Contact Person" field="Custom" customQuery={{
                      Table: "OCPR",
                      Fields: ["CardCode", "Name"],
                    }} value={(data as any).CntctCode} setValue={(v) => { setData({ ...data, CntctCode: v }) }} />)
                },
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
                  size: 12,
                  component: (
                    <SAPDropdown label="Ship To" field="Custom" mustInit={false} customQuery={{
                      Table: "CRD1",
                      Fields: ["Street"],
                      Condition: [{
                        field: "AdresType",
                        cond: "=",
                        value: "S"
                      }, { cond: "AND" }, {
                        field: "CardCode",
                        cond: "=",
                        value: data.CardCode
                      }]
                    }} value={(data as any).Address2} setValue={(v) => { setData({ ...data, Address2: v }) }} refresh={qShip} setRefresh={setQShip} />)
                },
                {
                  key: "Address",
                  label: "Bill To",
                  size: 12,
                  component: (
                    <SAPDropdown label="Bill To" field="Custom" mustInit={false} customQuery={{
                      Table: "CRD1",
                      Fields: ["Street"],
                      Condition: [{
                        field: "CardCode",
                        cond: "=",
                        value: data.CardCode
                      }]
                    }} value={(data as any).Address} setValue={(v) => { setData({ ...data, Address: v }) }} refresh={qBill} setRefresh={setQBill} />)
                },
                {
                  key: "GroupNum",
                  label: "Payment Method",
                  size: 8,
                  component: (
                    <SAPDropdown label="Payment Method" field="PaymentTerms" value={(data as any).GroupNum} setValue={(v) => { setData({ ...data, GroupNum: v }) }} />)
                }
              ]
            },
            { type: "empty", key: "c" },
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
              alignItems: "center",
              paddingLeft: 10,
              backgroundColor: "#fff"
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
            <ActionIt />
          </View>
          <FormSODetailItems data={data} items={items} setItems={setItems} />
        </View>
      </UIBody>
    </UIContainer>
  );
});
