import { APIPost, APISearch, APISearchProps } from "@app/api";
import BtnSave from "@app/components/BtnSave";
import global from "@app/global";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UIText from "@app/libs/ui/UIText";
import { getLastNumbering, updateLastNumbering, lpad } from "@app/utils";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { View } from "reactxp";
import FormARInvoiceDetailItems from "./FormARInvoiceDetailItems";
import rawQuery from "@app/libs/gql/data/rawQuery";
import UISelectField from "@app/libs/ui/UISelectField";
import UIField from "@app/libs/ui/UIField";
import _ from "lodash";

const date = new Date();
const today = `${date.getFullYear()}-${lpad(
  (date.getMonth() + 1).toString(),
  2
)}-${lpad(date.getDate().toString(), 2)}`;

const defaultData = {
  CardCode: "",
  CardName: "",
  NumAtCard: "",
  DocCur: "",
  DocRate: "",
  U_IDU_SO_INTNUM: "",
  U_IDU_DO_INTNUM: "",
  U_IDU_SI_INTNUM: "",
  U_IDU_SI_TRANSCODE: "",
  GroupNum: "",
  SlpCode: "",
  CntctCode: "",
  Address2: "",
  Address: "",
  Comments: "",
  DiscPrcnt: "",
  DocDate: "",
  DocDueDate: "",
  U_BRANCH: "",
  U_USERID: "",
  U_GENERATED: "W",
  U_WONUM: "",
  U_IDU_FP: ""
};

export default withRouter(
  observer(({ history, match, showSidebar, sidebar }: any) => {
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState(defaultData);
    const [WOList, setWOList] = useState<any[]>([]);
    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(false);

    const param = atob(match.params.id).split("|");
    useEffect(() => {
      setLoading(true);
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
          "Comments",
          "DiscPrcnt"
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

      query = {
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
          "Price",
          "PriceBefDi",
          "DiscPrcnt",
          "TaxCode",
          "UomCode",
          "unitMsr"
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
          item.PK = btoa(item.LineNum + "|" + item.DocEntry);
          item.BaseType = "17";
          item.BaseLine = item.LineNum;
          item.BaseEntry = item.DocEntry;
          item.Quantity = parseInt(item.Quantity);
          item.PriceBefDi = parseInt(item.PriceBefDi);

          item.LineTotal = item.Quantity * item.PriceBefDi;

          delete item.LineNum;
          delete item.DocEntry;
        });
        setItem(res);
        setLoading(false);
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

    const validation = () => {
      const err: any = [];
      const required = {
        U_WONUM: "WO Number"
      };

      Object.keys(required).forEach((k: any) => {
        if ((data as any)[k] === "" || !(data as any)[k])
          err.push((required as any)[k]);
      });

      if (err.length > 0) {
        alert(err.join(", ") + " is required.");
        return false;
      }
      return true;
    };

    const save = async () => {
      if (saving) return;
      if (!validation()) return;

      setSaving(true);
      let number: any = await getLastNumbering("INV", (item[0] as any).WhsCode);
      try {
        await APIPost("ARInvoice", {
          ...data,
          U_IDU_SI_INTNUM: number.format,
          U_IDU_SI_TRANSCODE: "INV",
          Lines: item
        });

        updateLastNumbering(number.id, number.last_count + 1);
        history.goBack();
      } catch (e) {
        if (e.Message.search("409") > -1) {
          updateLastNumbering(number.id, number.last_count + 1);
          alert(
            "No INV sudah digunakan, simpan kembali untuk me-refresh No INV."
          );
        } else {
          alert(e.Message);
        }

        console.error({
          ...data,
          U_IDU_SI_INTNUM: number.format,
          U_IDU_SI_TRANSCODE: "INV",
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
          isLoading={loading}
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
          <UIJsonField
            items={data}
            style={{
              paddingTop: 20,
              paddingBottom: 100,
              borderWidth: 0,
              borderTopWidth: 1,
              borderColor: "#ccc"
            }}
            field={[
              { type: "empty", size: 6 },
              {
                key: "summary",
                label: "Summary",
                size: 6,
                value: [
                  {
                    key: "TotalPrice",
                    label: "Total",
                    size: 12,
                    component: (
                      <UIField
                        label="Total"
                        fieldStyle={{ backgroundColor: "#ececeb" }}
                      >
                        {_.sumBy(item, "LineTotal")}
                      </UIField>
                    )
                  },
                  {
                    key: "DiscPrcnt",
                    size: 4,
                    label: "Disc (%)",
                    type: "field"
                  },
                  {
                    key: "Discount",
                    size: 8,
                    component: (
                      <UIField
                        label="Disc"
                        fieldStyle={{ backgroundColor: "#ececeb" }}
                      >
                        {(() => {
                          let discPrcnt = (data as any)["DiscPrcnt"];
                          if (isNaN(parseFloat(discPrcnt))) discPrcnt = "0";

                          let totalItems = _.sumBy(item, "LineTotal");
                          let disc = (totalItems * parseFloat(discPrcnt)) / 100;

                          return disc.toFixed(2);
                        })()}
                      </UIField>
                    )
                  },
                  {
                    key: "Ppn",
                    size: 12,
                    component: (
                      <UIField
                        label="PPN (10%)"
                        fieldStyle={{ backgroundColor: "#ececeb" }}
                      >
                        {(() => {
                          let discPrcnt = (data as any)["DiscPrcnt"];
                          if (isNaN(parseFloat(discPrcnt))) discPrcnt = "0";

                          let totalItems = _.sumBy(item, "LineTotal");
                          let disc = (totalItems * parseFloat(discPrcnt)) / 100;

                          let total = totalItems - disc;
                          let tax = (total * 10) / 100;

                          return tax.toFixed(2);
                        })()}
                      </UIField>
                    )
                  },
                  {
                    key: "TotalAfterTax",
                    size: 12,
                    component: (
                      <UIField
                        label="Total After Tax"
                        fieldStyle={{ backgroundColor: "#ececeb" }}
                      >
                        {(() => {
                          let discPrcnt = (data as any)["DiscPrcnt"];
                          if (isNaN(parseFloat(discPrcnt))) discPrcnt = "0";

                          let totalItems = _.sumBy(item, "LineTotal");
                          let disc = (totalItems * parseFloat(discPrcnt)) / 100;

                          let total = totalItems - disc;
                          let tax = (total * 10) / 100;

                          let total_net = total + tax;

                          return total_net.toFixed(2);
                        })()}
                      </UIField>
                    )
                  }
                ]
              }
            ]}
            setValue={(value: any, key: any) => {
              (data as any)[key] = value;
              setData({ ...data });
            }}
          />
        </UIBody>
      </UIContainer>
    );
  })
);
