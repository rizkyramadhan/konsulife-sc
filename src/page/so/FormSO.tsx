import { APIPost } from '@app/api';
import BtnSave from '@app/components/BtnSave';
import SAPDropdown from '@app/components/SAPDropdown';
import global from '@app/global';
import rawQuery from '@app/libs/gql/data/rawQuery';
import IconAdd from "@app/libs/ui/Icons/IconAdd";
import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UISelectField from '@app/libs/ui/UISelectField';
import UITabs from '@app/libs/ui/UITabs';
import UIText from "@app/libs/ui/UIText";
import { getLastNumbering, lpad, updateLastNumbering } from '@app/utils';
import { encodeSAPDate } from '@app/utils/Helper';
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router';
import FormSODetailItems from './FormSODetailItems';

const date = new Date();
const today = `${date.getFullYear()}-${lpad((date.getMonth() + 1).toString(), 2)}-${date.getDate()}`;

const header = {
  CardCode: "",
  CardName: "",
  NumAtCard: "",
  DocDate: today,
  DocDueDate: today,
  DocCur: "",
  DocRate: "1",
  U_IDU_SO_INTNUM: "",
  GroupNum: "",
  SlpCode: !!global.session.user.slp_code || "-1",
  CntctCode: "",
  Address2: "",
  Address: "",
  Comments: "",
  U_BRANCH: global.session.user.branch,
  U_USERID: global.session.user.username,
  U_GENERATED: "W",
  U_IDU_ISCANVAS: "N",
  U_WONUM: ""
};

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
  const [data, setData] = useState(header);
  const [WOList, setWOList] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [qCP, setQCP] = useState(false);
  const [qShip, setQShip] = useState(false);
  const [qBill, setQBill] = useState(false);

  useEffect(() => {
    rawQuery(`{
      work_order (where: {status: {_eq: "open"}, branch: {_eq: "${global.getSession().user.branch}"}}) {
        number
      }
    }`).then((res) => {
      let wo = res.work_order.map((v: any) => {
        return {
          value: v.number,
          label: v.number
        }
      })
      setWOList([...wo]);
    });
  }, [])

  const AddRow = () => {
    return (<UIButton
      style={{
        flexShrink: 'none'
      }}
      color="success"
      size="small"
      onPress={() => {
        setItems([...(items as any), {
          Key: new Date().valueOf(),
          ItemCode: "",
          Dscription: "",
          U_IDU_PARTNUM: "",
          UseBaseUn: "",
          Quantity: "",
          WhsCode: "",
          ShipDate: "",
          OcrCode: "",
          OcrCode2: "",
          PriceBefDi: "",
          DiscPrcnt: "",
          UomEntry: "",
          TaxCode: ""
        }])
      }}
    >
      <IconAdd color="#fff" height={18} width={18} />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff" }} size="small">
          {" Add Row"}
        </UIText>
      )}
    </UIButton>);
  }

  const save = async () => {
    if (saving) return;
    setSaving(true);
    const Lines_IT = items.map(d => {
      d.OcrCode = global.session.user.area;
      d.OcrCode2 = global.session.user.branch;

      delete d.LineNum;
      return d;
    });

    try {
      let number: any = await getLastNumbering("SO", items[0].WhsCode);
      (data as any).DocDate = encodeSAPDate((data as any).DocDate);
      (data as any).DocDueDate = encodeSAPDate((data as any).DocDueDate);
      (data as any).SlpCode = !!global.session.user.slp_code || "-1";
      (data as any).U_BRANCH = global.session.user.branch;
      (data as any).U_USERID = global.session.user.username;
      await APIPost('SalesOrder', {
        ...data, U_IDU_SO_INTNUM: number.format, Lines: [...Lines_IT],
      })
      updateLastNumbering(number.id, number.last_count + 1);
      history.push("/so");
    }
    catch (e) {
      (data as any).DocDate = encodeSAPDate((data as any).DocDate);
      (data as any).DocDueDate = encodeSAPDate((data as any).DocDueDate);
      setData({ ...data });
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
        <BtnSave saving={saving} onPress={() => {
          save();
        }} />
      </UIHeader>
      <UIBody scroll={true}>
        <UIJsonField
          items={data}
          field={[
            {
              key: "customer",
              label: "Customer",
              sublabel: "Toko Penerima Barang",
              value: [
                { key: "CardCode", size: 8, type: "field", label: "Customer/Vendor Code" },
                {
                  key: "CardCode", label: "Customer/Vendor", size: 12, component: (
                    <SAPDropdown label="Customer" field="CustomerCode" where={[{ field: "U_IDU_BRANCH", value: global.getSession().user.branch }]} value={(data as any).CardCode} setValue={(v, l, r) => {
                      setData({ ...data, CardCode: v, CardName: l, GroupNum: r.item.GroupNum, DocCur: r.item.Currency, CntctCode: "" });
                      setQCP(true);
                      setQBill(true);
                      setQShip(true);
                    }} />)
                },
                {
                  key: "CntctCode", label: "Contact Person", size: 7, component: (
                    <SAPDropdown label="Contact Person" field="Custom" itemField={{ value: "CardCode", label: "Name" }}
                      customQuery={{
                        Table: "OCPR",
                        Fields: ["CardCode", "Name"],
                        Condition: [{ field: "CardCode", cond: "=", value: data.CardCode }]
                      }} value={(data as any).CntctCode} setValue={(v) => { setData({ ...data, CntctCode: v }) }}
                      mustInit={false} refresh={qCP} setRefresh={setQCP} />)
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
            {
              key: "general",
              label: "General",
              sublabel: "Informasi Sales Order",
              value: [
                { key: "U_WONUM", size: 8, component: (<UISelectField label="WO Number" items={WOList} value={data.U_WONUM} setValue={(v) => { setData({ ...data, U_WONUM: v }) }} />) },
                { key: "DocDate", size: 6, type: "date", label: "Posting Date" },
                { key: "DocDueDate", size: 6, type: "date", label: "Delivery Date" },
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
            if (key === "DocDate") {
              if (value > today) {
                value = today;
              }
            }
            (data as any)[key] = value;
            setData({ ...data });
          }}
        />

        <UITabs
          tabs={[
            {
              label: "Detail Items",
              content: <FormSODetailItems data={data} items={items} setItems={setItems} />,
              action: <AddRow />
            }
          ]}
        />
      </UIBody>
    </UIContainer>
  );
}));
