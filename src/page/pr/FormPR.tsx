import { APIPost, APISearch, APISearchProps } from "@app/api";
import BtnSave from '@app/components/BtnSave';
import global from '@app/global';
import IconCheck from '@app/libs/ui/Icons/IconCheck';
import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UITabs from "@app/libs/ui/UITabs";
import UIText from "@app/libs/ui/UIText";
import { getLastNumbering, updateLastNumbering, lpad } from '@app/utils';
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import FormPRDetailItems from "./FormPRDetailItems";

const date = new Date();
const today = `${date.getFullYear()}-${lpad((date.getMonth() + 1).toString(), 2)}-${lpad(date.getDate().toString(), 2)}`;

export default withRouter(
  observer(({ history, match, showSidebar, sidebar }: any) => {
    const [saving, setSaving] = useState(false);
    const [editable, setEdit] = useState(false);
    const [data, setData] = useState({});
    const [item, setItem] = useState([]);
    const [selected, setSelected] = useState([]);
    const param = atob(match.params.id).split("|");
    useEffect(() => {
      let query: APISearchProps = {
        Table: "OPOR",
        Fields: [
          "DocNum",
          "DocEntry",
          "DocCur",
          "DocRate",
          "SlpCode",
          "CntctCode",
          "NumAtCard",
          "Address2",
          "Address",
          "CardName",
          "CardCode",
          "U_IDU_PO_INTNUM",
          "U_IDU_SUP_SONUM",
          "U_IDU_DO_INTNUM"
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
        let poNum: any[] = [];
        let soNum: any[] = [];
        res.forEach((val: any) => {
          if (val.U_IDU_PO_INTNUM !== null && val.U_IDU_PO_INTNUM !== "") {
            poNum.push(val.U_IDU_PO_INTNUM);
          }
          if (val.U_IDU_SUP_SONUM !== null && val.U_IDU_SUP_SONUM !== "") {
            soNum.push(val.U_IDU_SUP_SONUM);
          }

        });

        if (res.length > 0) {
          res[0].U_IDU_PO_INTNUM = poNum.join(";");
          res[0].U_IDU_SUP_SONUM = soNum.join(";");
          res[0].U_BRANCH = global.session.user.branch;
          res[0].U_USERID = global.session.user.username;
          res[0].U_GENERATED = "W";
          res[0].DocDate = today;
          setData({ ...res[0] });
        }

      });

      query = {
        Table: "POR1",
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
          "OpenCreQty",
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
            cond: "IN",
            value: param
          },
          {
            cond: "AND"
          }, {
            field: "LineStatus",
            cond: "=",
            value: "O"
          }
        ]
      };

      APISearch(query).then((res: any) => {
        res.forEach((item: any) => {
          item.PK = btoa(item.LineNum + "|" + item.DocEntry);
          item.Quantity = parseInt(item.OpenCreQty).toString();
          item.OpenCreQty = parseInt(item.OpenCreQty).toString();
          item.Quantity = item.OpenCreQty;
          item.BaseType = "22";
          item.BaseLine = item.LineNum;
          item.BaseEntry = item.DocEntry;
        });
        setItem(res);
      })

    }, []);

    const save = async () => {
      setSaving(true);
      try {
        let number: any = await getLastNumbering("LPB", (selected[0] as any).WhsCode);
        await APIPost("PurchaseReceipt", {
          ...data, U_IDU_GRPO_TRANSCODE:"LPB" , U_IDU_GRPO_INTNUM: number.format,
          Lines: selected
        });
        updateLastNumbering(number.id, number.last_count + 1);
        history.goBack()
      } catch (e) {
        setData({ ...data });
        alert(e.Message);
        console.error({
          ...data, Lines: selected,
        });
      } finally {
        setSaving(false);
      }
    };

    return (
      <UIContainer>
        <UIHeader
          isBack={true}
          showSidebar={showSidebar}
          sidebar={sidebar}
          center="Purchase Receipt Form"
        >
          <BtnSave saving={saving} onPress={() => {
            save();
          }} />
        </UIHeader>
        <UIBody scroll={true}>
          <UIJsonField
            items={data}
            // hideUndeclared={true}
            field={[
              {
                key: "vendor",
                label: "Vendor",
                value: [
                  {
                    key: "CardCode",
                    type: "field",
                    label: "Code",
                    size: 4
                  },
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
                    key: "U_IDU_PO_INTNUM",
                    type: "field",
                    label: "PO Number",
                    size: 8
                  },
                  { type: "empty", size: 4 },
                  {
                    key: "U_IDU_SUP_SONUM",
                    type: "field",
                    label: "SO Number",
                    size: 8
                  },
                  { type: "empty", size: 4 },
                  {
                    key: "I_IDU_DO_INTNUM",
                    label: "NO DO Supplier",
                    size: 8
                  },
                  { type: "empty", size: 4 },
                  {
                    key: "DocDate",
                    size: 6,
                    type: "date",
                    label: "Posting Date"
                  },
                  {
                    key: "DocCur",
                    size: 4,
                    type: "field",
                    label: "Document Currency"
                  },
                ]
              },
              {
                key: "optional",
                label: "Optional",
                value: [
                  { key: "Comments", label: "Remark", size: 12 }
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
                content: <FormPRDetailItems items={item} setItems={setItem} flag={editable} setSelected={setSelected} />,
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
  })
);
