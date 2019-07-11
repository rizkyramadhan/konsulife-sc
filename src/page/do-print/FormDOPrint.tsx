import { APISearch, APISearchProps } from "@app/api";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UITabs from "@app/libs/ui/UITabs";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import FormDOPrintDetail from "./FormDOPrintDetail";
import { ReportPost } from '@app/report';
import BtnExport from '@app/components/BtnExport';
import { decodeSAPDateToFormal } from '@app/utils/Helper';

export default withRouter(
  observer(({ match, showSidebar, sidebar }: any) => {
    const [exporting, setExporting] = useState(false);
    const [data, setData] = useState<any>({});
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {

      // SELECT FIRST SO
      let query: APISearchProps = {
        Table: "ODLN",
        Fields: [
          "CardCode",
          "CardName",
          "NumAtCard",
          "DocDate",
          "DocDueDate",
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
          "U_BRANCH",
          "U_USERID",
          "U_GENERATED",
          "U_IDU_CONTNUM",
          "U_IDU_NOSEAL",
          "U_IDU_NOPL",
          "U_IDU_NOPOL"
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
        const data = res[0];
        res[0]["DocDate"] = decodeSAPDateToFormal(res[0]["DocDate"]);
        res[0]["DocDueDate"] = decodeSAPDateToFormal(res[0]["DocDueDate"]); 

        setData(data);

        query = {
            Table: "OPRC",
            Fields: ["PrcCode", "PrcName"],
            Condition: [
              {
                field: "PrcCode",
                cond: "=",
                value: data.U_BRANCH
              }
            ]
          };
    
          APISearch(query).then((res: any) => {
                setData({...data, City:res[0]["PrcName"]});
          });
      });

      // SELECT LIST SO OPEN
      query = {
        Table: "DLN1",
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
          "unitMsr",
          "WhsCode",
          "ShipDate",
          "OcrCode",
          "OcrCode2",
          "PriceBefDi",
          "DiscPrcnt",
          "TaxCode",
          "OpenQty"
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
        const items = res.map((item: any) => {
          item.Key = btoa(item.DocEntry + "|" + item.LineNum);

          return item;
        });
        setItems([...items]);
      });
    }, []);

    const exportReport = async () => {
      if (exporting) return;
      if (items.length === 0) return;
      setExporting(true);

      const l = items.map((d: any) => {
        return {
          BaseType: d.BaseType,
          BaseEntry: d.BaseEntry,
          BaseLine: d.BaseLine,
          ItemCode: d.ItemCode,
          Dscription: d.Dscription,
          U_IDU_PARTNUM: d.U_IDU_PARTNUM,
          UseBaseUn: d.UseBaseUn,
          Quantity: d.Quantity,
          UomCode: d.UomCode,
          UomEntry: d.UomEntry,
          WhsCode: d.WhsCode,
          ShipDate: d.ShipDate,
          OcrCode: d.OcrCode,
          OcrCode2: d.OcrCode2,
          PriceBefDi: d.PriceBefDi,
          DiscPrcnt: d.DiscPrcnt,
          TaxCode: d.TaxCode
        };
      });
      
      try {
        await ReportPost("do",{...data,Lines: l});
      } catch (e) {
        alert(e.Message);

        console.error({data});
      } finally {
        setExporting(false);
      }
    };

    return (
      <UIContainer>
        <UIHeader
          showSidebar={showSidebar}
          sidebar={sidebar}
          center={`View Delivery Order #${atob(match.params.CardCode)} - ${atob(
            match.params.CardName
          )}`}
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
                  { key: "U_IDU_CONTNUM", label: "No. Container", size: 4, type: "field" },
                  { key: "U_IDU_NOSEAL", label: "No. Seal", size: 4, type: "field" },
                  { key: "U_IDU_NOPL", label: "No. PL", size: 4, type: "field" },
                  { key: "U_IDU_NOPOL", label: "Nopol", size: 4, type: "field" },
                  { key: "U_IDU_DRIVER", label: "Driver", size: 8, type: "field" }
                ]
              },
              {
                key: "general",
                label: "General",
                sublabel: "Informasi SO/DO",
                value: [
                {
                    key: "U_IDU_DO_INTNUM",
                    type: "field",
                    label: "DO Number",
                    size: 12
                }, 
                {
                    key: "U_IDU_SO_INTNUM",
                    type: "field",
                    label: "SO Number",
                    size: 12
                },
                {
                    key: "DocDate",
                    size: 6,
                    label: "Posting Date",
                    type: "field"
                },
                {
                    key: "DocDueDate",
                    size: 6,
                    label: "Delivery Date",
                    type: "field"
                }]
              },
              {
                key: "optional",
                label: "Optional",
                value: [
                  {
                    key: "Comments",
                    label: "Remark",
                    size: 12,
                    type:"field"
                  }
                ]
              }
            ]}
            setValue={(value: any, key: any) => {
              (data as any)[key] = value;
              setData({ ...data });
            }}
          />

          <UITabs
            tabs={[
              {
                label: "Detail Items",
                content: (
                  <FormDOPrintDetail
                    items={items}
                  />
                )
              }
            ]}
          />
        </UIBody>
      </UIContainer>
    );
  })
);
