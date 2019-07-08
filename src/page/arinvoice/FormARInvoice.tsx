import { APIPost, APISearch, APISearchProps } from "@app/api";
import BtnSave from "@app/components/BtnSave";
import global from "@app/global";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UIText from "@app/libs/ui/UIText";
import {
  /*getLastNumbering, updateLastNumbering,*/ lpad,
  getLastNumbering,
  updateLastNumbering
} from "@app/utils";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { View } from "reactxp";
import FormARInvoiceDetailItems from "./FormARInvoiceDetailItems";
import rawQuery from "@app/libs/gql/data/rawQuery";
import UISelectField from "@app/libs/ui/UISelectField";

const date = new Date();
const today = `${date.getFullYear()}-${lpad(
  (date.getMonth() + 1).toString(),
  2
)}-${lpad(date.getDate().toString(), 2)}`;

export default withRouter(
  observer(({ history, match, showSidebar, sidebar }: any) => {
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
          "U_IDU_DO_INTNUM",
          "GroupNum",
          "SlpCode",
          "CntctCode",
          "Address2",
          "Address",
          "Comments"
        ],
        Condition: [
          {
            field: "DocEntry",
            cond: "IN",
            value: param
          }
        ]
      };

      APISearch(query).then((res: any) => {
        res[0].DocDate = today;
        res[0].DocDueDate = today;
        res[0].U_BRANCH = global.session.user.branch;
        res[0].U_USERID = global.session.user.username;
        res[0].U_GENERATED = "W";
        res[0].U_WONUM = "";
        res[0].U_IDU_FP = "";

        if (res.length > 0) setData(res[0]);
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
          "TaxCode",
          "UomCode"
        ],
        Condition: [
          {
            field: "DocEntry",
            cond: "IN",
            value: param
          }
        ]
      };

      APISearch(query).then((res: any) => {
        res.forEach((item: any) => {
          item.BaseType = "17";
          item.BaseLine = item.LineNum;
          item.BaseEntry = item.DocEntry;
          item.Quantity = parseInt(item.Quantity);
          item.PriceBefDi = parseFloat(item.PriceBefDi).toFixed(2);

          delete item.LineNum;
          delete item.DocEntry;
        });
        setItem(res);
      });

      rawQuery(`{
      work_order (where: {status: {_eq: "open"}, branch: {_eq: "${
        global.getSession().user.branch
      }"}}) {
        number
      }
    }`).then(res => {
        let wo = res.work_order.map((v: any) => {
          return {
            value: v.number,
            label: v.number
          };
        });
        setWOList([...wo]);
      });
    }, []);

    const save = async () => {
      if (saving) return;
      if (item.length === 0) return;
      setSaving(true);

      let number: any = await getLastNumbering("INV", (item[0] as any).WhsCode);
      try {
        await APIPost("ARInvoice", {
          ...data,
          U_IDU_SI_TRANSCODE: "INV",
          U_IDU_SI_INTNUM: number.format,
          Lines: item
        });
        updateLastNumbering(number.id, number.last_count + 1);
        history.goBack();
      } catch (e) {
        if (e.Message.search("409") > -1) {
          updateLastNumbering(number.id, number.last_count + 1);
          alert(
            "No AR INV sudah digunakan, simpan kembali untuk me-refresh No AR INV."
          );
        } else {
          alert(e.Message);
        }

        console.error({
          ...data,
          U_IDU_SI_TRANSCODE: "INV",
          U_IDU_SI_INTNUM: number.format,
          Lines: item
        });
      } finally {
        setSaving(false);
      }
    };

    return (
      <UIContainer>
        <UIHeader
          showSidebar={showSidebar}
          sidebar={sidebar}
          center="Form AR Invoice"
        >
          <BtnSave
            saving={saving}
            onPress={() => {
              save();
            }}
          />
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
                  {
                    key: "CardCode",
                    label: "Customer",
                    size: 4,
                    type: "field"
                  },
                  { key: "CardName", label: "Name", type: "field", size: 8 }
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
                    size: 10
                  },
                  { type: "empty", size: 2 },
                  {
                    key: "U_WONUM",
                    size: 10,
                    component: (
                      <UISelectField
                        label="WO Number"
                        items={WOList}
                        value={(data as any).U_WONUM}
                        setValue={v => {
                          let d = { ...data };
                          (d as any).U_WONUM = v;
                          setData({ ...d });
                        }}
                      />
                    )
                  },
                  { type: "empty", size: 2 },
                  {
                    key: "DocDate",
                    size: 5,
                    type: "date",
                    label: "Posting Date",
                    options: { pastDate: true }
                  },
                  {
                    key: "DocDueDate",
                    size: 5,
                    type: "date",
                    label: "Delivery Date",
                    options: { pastDate: true }
                  },
                  { type: "empty", size: 2 },
                  { key: "U_IDU_FP", size: 10, label: "Faktur Pajak" }
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
  })
);
