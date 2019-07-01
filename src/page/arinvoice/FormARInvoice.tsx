import { APIPost, APISearch, APISearchProps } from '@app/api';
import BtnSave from '@app/components/BtnSave';
import global from '@app/global';
import UIBody from '@app/libs/ui/UIBody';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UIText from '@app/libs/ui/UIText';
import { getLastNumbering, updateLastNumbering, lpad } from '@app/utils';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router';
import { View } from 'reactxp';
import FormARInvoiceDetailItems from './FormARInvoiceDetailItems';
import rawQuery from '@app/libs/gql/data/rawQuery';
import UISelectField from '@app/libs/ui/UISelectField';

const date = new Date();
const today = `${date.getFullYear()}-${lpad((date.getMonth() + 1).toString(), 2)}-${lpad(date.getDate().toString(), 2)}`;

export default withRouter(observer(({ history, match, showSidebar, sidebar }: any) => {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState([]);
  const [WOList, setWOList] = useState<any[]>([]);
  const [item, setItem] = useState([]);

  const param = atob(match.params.id).split("|");
  useEffect(() => {
    let query: APISearchProps = {
      Table: "ORDR",
      Fields: [
        "CardCode",
        "CardName",
        "NumAtCard",
        "DocCur",
        "DocRate",
        "U_IDU_SO_INTNUM",
        "GroupNum",
        "SlpCode",
        "CntctCode",
        "Address2",
        "Address",
        "Comments"
      ],
      Condition: [{
        field: "DocEntry",
        cond: "IN",
        value: param
      }]
    };

    APISearch(query).then((res: any) => {
      res[0].U_BRANCH = global.session.user.branch;
      res[0].U_USERID = global.session.user.username;
      res[0].U_GENERATED = "W";
      res[0].U_WONUM = "";
      res[0].U_IDU_FP = ""

      if (res.length > 0)
        setData(res[0]);
    });
  }, []);

  useEffect(() => {
    let query: APISearchProps = {
      Table: "RDR1",
      Fields: [
        "DocEntry",
        "BaseEntry",
        "BaseType",
        "LineNum",
        "BaseLine",
        "ItemCode",
        "Dscription",
        "U_IDU_PARTNUM",
        "WhsCode",
        "Quantity",
        "UseBaseUn",
        "ShipDate",
        "OcrCode",
        "OcrCode2",
        "PriceBefDi",
        "DiscPrcnt",
        "TaxCode"
      ],
      Condition: [{
        field: "DocEntry",
        cond: "IN",
        value: param
      }]
    };

    APISearch(query).then((res: any) => {
      res.forEach((item: any) => {
        item.BaseType = "17";
        item.BaseLine = item.LineNum;
        item.BaseEntry = item.DocEntry;

        delete item.LineNum;
        delete item.DocEntry;
      });
      setItem(res);
    })

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
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      let number: any = await getLastNumbering("INV", (item[0] as any).WhsCode);
      (data as any)['U_IDU_SI_INTNUM'] = number.format;
      await APIPost('ARInvoice', {
        ...data, Lines: item,
      });
      updateLastNumbering(number.id, number.last_count + 1);
      history.push("/ar-invoice")
    }
    catch (e) {
      alert(e.Message);
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
        center="Form AR Invoice"
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
                { key: "CardCode", label: "Customer", size: 3, type: "field" },
                { key: "CardName", label: "Name", type: "field" }
              ]
            },
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
                { type: "empty", size: 5 },
                { key: "U_WONUM", size: 8, component: (<UISelectField label="WO Number" items={WOList} value={(data as any).U_WONUM} setValue={(v) => { let d = { ...data }; (d as any).U_WONUM = v; setData({ ...d }) }} />) },
                { type: "empty", size: 4 },
                { key: "DocDate", size: 4, type: "date", label: "Posting Date", options: { pastDate: true } },
                { key: "DocDueDate", size: 4, type: "date", label: "Delivery Date", options: { pastDate: true } },
                { type: "empty", size: 2 },
                { key: "U_IDU_FP", size: 8, label: "Faktur Pajak" },
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
          </View>
          <FormARInvoiceDetailItems items={item} setItems={setItem} />
        </View>
      </UIBody>
    </UIContainer>
  );
}));
