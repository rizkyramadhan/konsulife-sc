import { APIPost, APISearch, APISearchProps } from '@app/api';
import BtnSave from '@app/components/BtnSave';
import global from '@app/global';
import IconCheck from '@app/libs/ui/Icons/IconCheck';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIBody from '@app/libs/ui/UIBody';
import UIButton from '@app/libs/ui/UIButton';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UITabs from '@app/libs/ui/UITabs';
import UIText from '@app/libs/ui/UIText';
import { getLastNumbering, updateLastNumbering, lpad } from '@app/utils';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router';
import FormDODetailItems from './FormDODetailItems';

const date = new Date();
const today = `${date.getFullYear()}-${lpad((date.getMonth() + 1).toString(), 2)}-${lpad(date.getDate().toString(), 2)}`;

export default withRouter(observer(({ history, match, showSidebar, sidebar }: any) => {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>({});
  const [items, setItems] = useState<any[]>([]);
  const [editable, setEdit] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const itemSelect = JSON.parse(atob(match.params.ItemSelect));
    const itemSelectDocEntry = itemSelect.map((d: any) => {
      return d.DocEntry;
    })
    const itemSelectSONUmber = itemSelect.map((d: any) => {
      return d.SONumber;
    })

    // SELECT FIRST SO
    let query: APISearchProps = {
      Table: "ORDR",
      Fields: [
        "CardCode",
        "CardName",
        "NumAtCard",
        "DocDate",
        "DocDueDate",
        "DocCur",
        "DocRate",
        "U_IDU_SO_INTNUM",
        "GroupNum",
        "SlpCode",
        "CntctCode",
        "Address2",
        "Address",
        "Comments",
        "U_BRANCH",
        "U_USERID",
        "U_GENERATED"
      ],
      Condition: [{
        field: "DocEntry",
        cond: "=",
        value: itemSelectDocEntry[0]
      }]
    };

    APISearch(query).then((res: any) => {
      const data = res[0];
      setData({
        ...data,
        U_IDU_SO_INTNUM: itemSelectSONUmber.join(";"),
        Comments: "",
        DocDate: "2019-01-25"
      })
    });

    // SELECT LIST SO OPEN
    query = {
      Table: "RDR1",
      Fields: [
        "DocEntry",
        "LineNum",
        "ObjType",
        "ItemCode",
        "Dscription",
        "U_IDU_PARTNUM",
        "UseBaseUn",
        "Quantity",
        "UomEntry",
        "UomCode",
        "WhsCode",
        "ShipDate",
        "OcrCode",
        "OcrCode2",
        "PriceBefDi",
        "DiscPrcnt",
        "TaxCode",
        "OpenQty"
      ],
      Condition: [{
        field: "DocEntry",
        cond: "IN",
        value: itemSelectDocEntry
      }, {
        cond: "AND"
      }, {
        field: "LineStatus",
        cond: "=",
        value: "O"
      }]
    };

    APISearch(query).then((res: any) => {
      const items = res.map((item: any) => {
        item.Key = btoa(item.DocEntry + '|' + item.LineNum);
        item.BaseType = item.ObjType;
        item.BaseLine = item.LineNum;
        item.BaseEntry = item.DocEntry;
        item.Quantity = parseInt(item.OpenQty);
        delete item.ObjType;
        delete item.LineNum;
        delete item.DocEntry;
        delete item.OpenQty;
        return item;
      });
      setItems([...items]);
    })

  }, []);

  const save = async () => {
    if (saving) return;

    setSaving(true);
    try {
      const d = {
        "CardCode": data.CardCode,
        "NumAtCard": data.NumAtCard,
        "DocDate": data.DocDate,
        "DocDueDate": data.DocDueDate,
        "DocCur": data.DocCur,
        "DocRate": data.DocRate,
        "U_IDU_SO_INTNUM": data.U_IDU_SO_INTNUM,
        "GroupNum": data.GroupNum,
        "SlpCode": data.SlpCode,
        "CntctCode": data.CntctCode,
        "Address2": data.Address2,
        "Address": data.Address,
        "Comments": data.Comments,
        "U_IDU_CONTNUM": data.U_IDU_CONTNUM,
        "U_IDU_NOSEAL": data.U_IDU_NOSEAL,
        "U_IDU_NOPL": data.U_IDU_NOPL,
        "U_IDU_NOPOL": data.U_IDU_NOPOL,
        "U_IDU_DRIVER": data.U_IDU_DRIVER,
        "U_BRANCH": global.session.user.branch,
        "U_USERID": global.session.user.username,
        "U_GENERATED": "W"
      };

      const l = selected.map((d: any) => {
        return {
          "BaseType": d.BaseType,
          "BaseEntry": d.BaseEntry,
          "BaseLine": d.BaseLine,
          "ItemCode": d.ItemCode,
          "Dscription": d.Dscription,
          "U_IDU_PARTNUM": d.U_IDU_PARTNUM,
          "UseBaseUn": d.UseBaseUn,
          "Quantity": d.Quantity,
          "UoMEntry": d.UoMEntry,
          "WhsCode": d.WhsCode,
          "ShipDate": d.ShipDate,
          "OcrCode": d.OcrCode,
          "OcrCode2": d.OcrCode2,
          "PriceBefDi": d.PriceBefDi,
          "DiscPrcnt": d.DiscPrcnt,
          "TaxCode": d.TaxCode
        }
      })

      let number: any = await getLastNumbering("DO", l[0].WhsCode);
      (d as any)['U_IDU_DO_INTNUM'] = number.format;
      (d as any)['U_IDU_DO_TRANSCODE'] = "DO";
      await APIPost('DeliveryOrder', {
        ...d, Lines: l,
      });
      updateLastNumbering(number.id, number.last_count + 1);
      history.push("/do/");
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
        center={`Form Delivery Order #${atob(match.params.CardCode)} - ${atob(match.params.CardName)}`}
      >
        <BtnSave saving={saving} onPress={() => {
          save();
        }} type={match.params.id ? "update" : "save"} />
      </UIHeader>
      <UIBody scroll={true}>
        <UIJsonField
          items={data}
          field={[
            {
              key: "customer",
              label: "Customer",
              sublabel: "Informasi Customer",
              value: [
                {
                  key: "CardCode",
                  type: "field",
                  label: "Card Code",
                  size: 4
                },
                {
                  key: "CardName",
                  type: "field",
                  label: "Card Name",
                  size: 8
                },
                { key: "U_IDU_CONTNUM", label: "No. Container", size: 4 },
                { key: "U_IDU_NOSEAL", label: "No. Seal", size: 4 },
                { key: "U_IDU_NOPL", label: "No. PL", size: 4 },
                { key: "U_IDU_NOPOL", label: "Nopol", size: 4 },
                { key: "U_IDU_DRIVER", label: "Driver", size: 8 },
              ]
            },
            {
              key: "general",
              label: "General",
              sublabel: "Informasi SO",
              value: [
                {
                  key: "U_IDU_SO_INTNUM",
                  type: "field",
                  label: "SO Number",
                  size: 12
                },
                { key: "DocDate", size: 6, label: "Posting Date", type: "date", options: { pastDate: true } },
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
              content: <FormDODetailItems items={items} setItems={setItems} flag={editable} setSelected={setSelected} />,
              action: (
                <UIButton
                  style={{
                    flexShrink: "none",
                    marginRight: 0
                  }}
                  color={!editable ? "success" : "warning"}
                  size="small"
                  onPress={() => {
                    setEdit(!editable);
                    if (editable == true) {
                      setSelected([]);
                    }
                  }}
                >
                  <IconCheck
                    color="#fff"
                    height={20}
                    width={20}
                  />
                  {isSize(["md", "lg"]) && (
                    <UIText style={{ color: "#fff" }} size="small">
                      {!editable ? " Edit" : " Select"}
                    </UIText>
                  )}
                </UIButton>
              )
            }
          ]}
        />
      </UIBody>
    </UIContainer>
  );
}));
