import { APISearch, APISearchProps } from "@app/api";
import BtnExport from "@app/components/BtnExport";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIField from "@app/libs/ui/UIField";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UITabs from "@app/libs/ui/UITabs";
import { ReportPost } from "@app/report";
import { decodeSAPDateToFormal } from "@app/utils/Helper";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "@app/libs/router/Routing";
import { View } from "reactxp";
import FormARInvoiceDetailTOPrint from "./FormARInvoiceDetailTOPrint";


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
  observer(({ /*history,*/ match, showSidebar, sidebar }: any) => {
    const [exporting, setExporting] = useState(false);
    const [data, setData] = useState(defaultData);
    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      let query: APISearchProps = {
        Table: "OINV",
        Fields: [
          "CardCode",
          "CardName",
          "NumAtCard",
          "DocCur",
          "DocRate",
          "U_IDU_SO_INTNUM",
          "U_IDU_DO_INTNUM",
          "U_IDU_SI_INTNUM",
          "GroupNum",
          "SlpCode",
          "CntctCode",
          "Address2",
          "Address",
          "Comments",
          "DocTotal",
          "VatSum",
          "DiscSum",
          "DiscPrcnt",
          "DocDate",
          "U_IDU_FP",
          "DocDueDate"
        ],
        Condition: [
          {
            field: "DocEntry",
            cond: "=",
            value: match.params.id
          }
        ]
      };

      APISearch(query).then((res: any) => {
        res[0].DiscPrcnt = parseFloat(res[0].DiscPrcnt).toFixed(2);
        res[0].DiscSum = parseFloat(res[0].DiscSum).toFixed(2);
        res[0].VatSum = parseFloat(res[0].VatSum).toFixed(2);
        res[0].DocTotal = parseFloat(res[0].DocTotal).toFixed(2);
        
        res[0].DocDate = decodeSAPDateToFormal(res[0].DocDate);
        res[0].DocDueDate = decodeSAPDateToFormal(res[0].DocDueDate);

        const data = res[0];
        setData(data);

        query = {
          Table: "OCTG",
          Fields: ["GroupNum", "PymntGroup"],
          Condition: [
            {
              field: "GroupNum",
              cond: "=",
              value: data.GroupNum
            }
          ]
        };

        APISearch(query).then((pay: any) => {
          setData({ ...data, GroupNum: pay[0]["PymntGroup"] });
        });

      });

      // -----------------------------
      query = {
        Table: "INV1",
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
          "Price",
          "DiscPrcnt",
          "TaxCode",
          "UomCode",
          "unitMsr"
        ],
        Condition: [
          {
            field: "DocEntry",
            cond: "=",
            value: match.params.id
          }
        ]
      };

      APISearch(query).then((res: any) => {
        res.forEach((item: any) => {
          item.PK = btoa(item.LineNum + "|" + item.DocEntry);
          item.BaseType = "15";
          item.BaseLine = item.LineNum;
          item.BaseEntry = item.DocEntry;
          item.Quantity = parseInt(item.Quantity);
          item.Price = parseFloat(item.Price).toFixed(2);

          item.LineTotal = item.Quantity * item.Price;

          delete item.LineNum;
          delete item.DocEntry;
        });
        setItem(res);
        setLoading(false);
      });
    }, []);

    const exportReport = async () => {
      if (exporting) return;
      if (item.length === 0) return;
      setExporting(true);

      let Lines = item.map((val: any) => {
        let res = { ...val };
        delete res.PK;
        delete res.LineNum;
        delete res.DocEntry;
        return res;
      });

      try {
        await ReportPost("invoice", { ...data, Lines: Lines });
      } catch (e) {
        alert(e.Message);

        console.error({ data });
      } finally {
        setExporting(false);
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
          <BtnExport
            exporting={exporting}
            onPress={() => {
              exportReport();
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
                sublabel: "Cust Penerima Barang",
                value: [
                  { key: "CardCode", type: "field", label: "Code", size: 4 },
                  {
                    key: "CardName",
                    type: "field",
                    label: "Customer",
                    size: 8
                  },
                  {
                    key: "NumAtCard",
                    type: "field",
                    label: "No PO. Cust",
                    size: 12
                  }
                ]
              },
              {
                key: "general",
                label: "General",
                sublabel: "Informasi SO/DO",
                value: [
                  {
                    key: "U_IDU_SI_INTNUM",
                    type: "field",
                    label: "INV Number",
                    size: 10
                  },
                  {
                    key: "U_IDU_SO_INTNUM",
                    type: "field",
                    label: "SO Number",
                    size: 10
                  },
                  { type: "empty", size: 2 },
                  {
                    key: "U_IDU_DO_INTNUM",
                    type: "field",
                    label: "DO Number",
                    size: 10
                  },
                  { type: "empty", size: 2 },
                  {
                    key: "DocDate",
                    size: 5,
                    type: "field",
                    label: "Posting Date",
                    options: { pastDate: true }
                  },
                  {
                    key: "DocDueDate",
                    size: 5,
                    type: "field",
                    label: "Delivery Date",
                    options: { pastDate: true }
                  },
                  {
                    key: "U_IDU_FP",
                    size: 10,
                    type: "field",
                    label: "Faktur Pajak"
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
                    type: "field",
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
                    <FormARInvoiceDetailTOPrint
                      items={item}
                      setItems={setItem}
                    />
                  )
                }
              ]}
            />
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
                    key: "DiscSum",
                    size: 8,
                    label: "Disc",
                    type: "field"
                  },
                  {
                    key: "VatSum",
                    size: 12,
                    label: "PPN (10%)",
                    type: "field"
                  },
                  {
                    key: "DocTotal",
                    size: 12,
                    label: "Total After Tax",
                    type: "field"
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
