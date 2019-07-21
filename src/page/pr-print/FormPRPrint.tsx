import { APISearch, APISearchProps } from "@app/api";
import BtnExport from "@app/components/BtnExport";
import { withRouter } from "@app/libs/router/Routing";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UITabs from "@app/libs/ui/UITabs";
import { ReportPost } from "@app/report";
import { decodeSAPDateToFormal, getParams } from "@app/utils/Helper";
import React, { useEffect, useState } from "react";
import FormPRPrintDetail from "./FormPRPrintDetail";
import global from "@app/global";
import { encode as btoa } from "base-64";

export default withRouter(({ match, history }: any) => {
  match.params = getParams(history.location.pathname);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState<any>({});
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);

  const param = match.params.id;
  useEffect(() => {
    setLoading(true);
    let query: APISearchProps = {
      Table: "OPDN",
      Fields: [
        "DocNum",
        "DocEntry",
        "DocCur",
        "DocRate",
        "DocDate",
        "DocDueDate",
        "SlpCode",
        "CntctCode",
        "NumAtCard",
        "Address2",
        "Address",
        "CardName",
        "CardCode",
        "U_IDU_PO_INTNUM",
        "U_IDU_SUP_SONUM",
        "U_IDU_DO_INTNUM",
        "U_IDU_GRPO_INTNUM",
        "U_IDU_NOPOL",
        "U_IDU_DRIVER",
        "U_IDU_CONTNUM",
        "U_BRANCH",
        "U_USERID",
        "U_GENERATED"
      ],
      Condition: [
        {
          field: "DocEntry",
          cond: "=",
          value: param
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
            value: res[0]["U_BRANCH"]
          }
        ]
      };

      APISearch(query).then((cit: any) => {
        setData({ ...data, City: cit[0]["PrcName"] });
      });
    });

    query = {
      Table: "PDN1",
      Fields: [
        "DocEntry",
        "BaseEntry",
        "LineNum",
        "ItemCode",
        "Dscription",
        "U_IDU_PARTNUM",
        "WhsCode",
        "Quantity",
        "UomCode",
        "UomEntry",
        "unitMsr",
        "UseBaseUn",
        "ShipDate",
        "OcrCode",
        "OcrCode2",
        "PriceBefDi",
        "DiscPrcnt",
        "TaxCode"
      ],
      Condition: [
        {
          field: "DocEntry",
          cond: "=",
          value: param
        },
        {
          cond: "AND"
        },
        {
          field: "LineStatus",
          cond: "=",
          value: "O"
        }
      ]
    };

    APISearch(query).then((res: any) => {
      res.forEach((item: any) => {
        item.PK = btoa(item.LineNum + "|" + item.DocEntry);
      });
      setItem(res);
      setLoading(false);
    });
  }, []);

  const exportReport = async () => {
    if (exporting) return;
    if (item.length === 0) return;
    setExporting(true);

    let postItem: any[] = [];
    item.forEach((val: any) => {
      postItem.push({
        ItemCode: val.ItemCode,
        Dscription: val.Dscription,
        UseBaseUn: val.UseBaseUn,
        Quantity: val.Quantity,
        UoMEntry: val.UoMEntry,
        unitMsr: val.unitMsr,
        WhsCode: val.WhsCode,
        SerialNum: val.SerialNum
      });
    });

    try {
      await ReportPost("goodReceipt", { ...data, Lines: postItem });
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
        isBack={true}
        showSidebar={global.setSidebar}
        sidebar={global.sidebar}
        center="Purchase Receipt View"
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
              key: "vendor",
              label: "Vendor",
              value: [
                { key: "CardCode", type: "field", label: "Code", size: 4 },
                { type: "empty" },
                { key: "CardName", type: "field", label: "Name", size: 12 },
                { key: "CntctCode", type: "field", label: "Contact Person" },
                { key: "NumAtCard", type: "field", label: "Ref No.", size: 8 }
              ]
            },
            {
              key: "general",
              label: "General",
              value: [
                {
                  key: "U_IDU_GRPO_INTNUM",
                  type: "field",
                  label: "PO Number",
                  size: 12
                },
                {
                  key: "U_IDU_PO_INTNUM",
                  type: "field",
                  label: "PO Number",
                  size: 12
                },
                {
                  key: "U_IDU_SUP_SONUM",
                  type: "field",
                  label: "SO Number",
                  size: 12
                },
                {
                  key: "I_IDU_DO_INTNUM",
                  type: "field",
                  label: "NO DO Supplier",
                  size: 12
                },
                {
                  key: "DocDate",
                  size: 6,
                  type: "field",
                  label: "Posting Date"
                },
                {
                  key: "DocDueDate",
                  size: 6,
                  type: "field",
                  label: "Delivery Date"
                },
                { key: "DocCur", size: 6, type: "field", label: "Currency" }
              ]
            },
            {
              key: "optional",
              label: "Optional",
              value: [
                { key: "Comments", label: "Remark", type: "field", size: 12 }
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
              content: <FormPRPrintDetail items={item} />
            }
          ]}
        />
      </UIBody>
    </UIContainer>
  );
});
