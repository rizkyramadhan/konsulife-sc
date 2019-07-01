import { APIPost, APISearch, APISearchProps } from '@app/api';
import BtnSave from '@app/components/BtnSave';
import global from '@app/global';
import UIBody from '@app/libs/ui/UIBody';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UITabs from '@app/libs/ui/UITabs';
import { getLastNumbering, updateLastNumbering, lpad } from '@app/utils';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router';
import { View } from 'reactxp';
import FormARInvoiceDetailTO from './FormARInvoiceDetailTO';

const date = new Date();
const today = `${date.getFullYear()}-${lpad((date.getMonth() + 1).toString(), 2)}-${lpad(date.getDate().toString(), 2)}`;

export default withRouter(observer(({ history, match, showSidebar, sidebar }: any) => {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [item, setItem] = useState([]);

  const param = atob(match.params.id).split("|");
  useEffect(() => {
    let query: APISearchProps = {
      Table: "ODLN",
      Fields: [
        "CardCode",
        "CardName",
        "NumAtCard",
        "DocCur",
        "DocRate",
        "U_IDU_SO_INTNUM",
        "U_IDU_DO_INTNUM",
        "GroupNum",
        "SlpCode",
        "CntctCode",
        "Address2",
        "Address",
        "Comments",

      ],
      Condition: [{
        field: "DocEntry",
        cond: "IN",
        value: param
      }]
    };

    APISearch(query).then((res: any) => {
      let poNum: any[] = [];
      let soNum: any[] = [];
      let doNum: any[] = [];
      res.forEach((val: any) => {
        if (val.NumAtCard !== null && val.NumAtCard !== "") {
          poNum.push(val.NumAtCard);
        }
        if (val.U_IDU_SO_INTNUM !== null && val.U_IDU_SO_INTNUM !== "") {
          soNum.push(val.U_IDU_SO_INTNUM);
        }
        if (val.U_IDU_DO_INTNUM !== null && val.U_IDU_DO_INTNUM !== "") {
          doNum.push(val.U_IDU_DO_INTNUM);
        }

      });

      res[0].DocDate = today;
      res[0].DocDueDate = today;
      res[0].NumAtCard = poNum.join(";");
      res[0].U_IDU_SO_INTNUM = soNum.join(";");
      res[0].U_IDU_DO_INTNUM = doNum.join(";");

      res[0].U_BRANCH = global.session.user.branch;
      res[0].U_USERID = global.session.user.username;
      res[0].U_GENERATED = "W";
      res[0].U_WONUM = "";
      res[0].U_IDU_FP = ""

      if (res.length > 0)
        setData(res[0]);
    });

    // -----------------------------
    query = {
      Table: "DLN1",
      Fields: [
        "BaseEntry",
        "BaseType",
        "BaseLine",
        "DocEntry",
        "LineNum",
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
        item.PK = btoa(item.LineNum + "|" + item.DocEntry);
        item.BaseType = "15";
        item.BaseLine = item.LineNum;
        item.BaseEntry = item.DocEntry;
      });
      setItem(res);
    })

  }, []);

  const save = async () => {
    setSaving(true);
    try {
      
      let Lines = item.map((val: any) => {
        let res = { ...val };
        delete res.PK;
        delete res.LineNum;
        delete res.DocEntry;
        return res;
      });

      let number: any = await getLastNumbering("INV", (item[0] as any).WhsCode);
      (data as any)['U_IDU_SI_INTNUM'] = number.format;
      (data as any)['U_IDU_SI_TRANSCODE'] = "INV";
      await APIPost('ARInvoice', {
        ...data, Lines: Lines,
      });
      updateLastNumbering(number.id, number.last_count + 1);
      history.push("/ar-invoice-to")
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
              sublabel: "Cust Penerima Barang",
              value: [
                { key: "CardCode", type: "field", label: "Code", size: 4 },
                { key: "CardName", type: "field", label: "Customer", size: 8 },
                { key: "NumAtCard", type: "field", label: "No PO. Cust", size: 12 }
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
                  size: 8
                },
                {
                  key: "U_IDU_DO_INTNUM",
                  type: "field",
                  label: "DO Number",
                  size: 8
                },
                { type: "empty", size: 4 },
                { key: "DocDate", size: 4, type: "date", label: "Posting Date", options: { pastDate: true } },
                { key: "DocDueDate", size: 4, type: "date", label: "Delivery Date", options: { pastDate: true } },
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
          <UITabs
            tabs={[
              {
                label: "Detail items",
                content: () => (
                  <FormARInvoiceDetailTO items={item} setItems={setItem} />
                )
              }
            ]} />
        </View>
      </UIBody>
    </UIContainer>
  );
}));
