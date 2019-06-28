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
import FormSODetailItems from './FormSODetailItems';
import { getLastNumbering, updateLastNumbering, lpad } from '@app/utils';
import UITabs from '@app/libs/ui/UITabs';
import { withRouter } from 'react-router';
import { encodeSAPDate } from '@app/utils/Helper';

const date = new Date();

const header = {
  CardCode: "",
  CardName: "",
  NumAtCard: "",
  DocDate: `${date.getFullYear()}-${lpad((date.getMonth() + 1).toString(), 2)}-${date.getDate()}`,
  DocDueDate: `${date.getFullYear()}-${lpad((date.getMonth() + 1).toString(), 2)}-${date.getDate()}`,
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
};

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
  const [data, setData] = useState(header);
  const [items, setItems] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [qCP, setQCP] = useState(false);
  const [qShip, setQShip] = useState(false);
  const [qBill, setQBill] = useState(false);

  // sample
  // useEffect(() => {
  //   APISearch({
  //     Table: "OITM",
  //     Page: 1,
  //     Limit: 2
  //   }).then((res) => {
  //     console.log(res);
  //   })
  // }, [])

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
      <IconAdd color="#fff" height={18} width={18} style={{
        marginTop: -9
      }} />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff" }} size="small">
          {" Add Row"}
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
              key: "customer",
              label: "Customer",
              sublabel: "Toko Penerima Barang",
              value: [
                { key: "CardCode", size: 8, type: "field", label: "Customer/Vendor Code" },
                {
                  key: "CardCode", label: "Customer/Vendor", size: 12, component: (
                    <SAPDropdown label="Customer" field="CustomerCode" value={(data as any).CardCode} setValue={(v, l, r) => {
                      setData({ ...data, CardCode: v, CardName: l, GroupNum: r.item.GroupNum, DocCur: r.item.Currency });
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
            (data as any)[key] = value;
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
