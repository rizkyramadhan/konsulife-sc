import { APIPost, APISearch, APISearchProps } from "@app/api";
import global from '@app/global';
import IconSave from "@app/libs/ui/Icons/IconSave";
import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UITabs from "@app/libs/ui/UITabs";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import FormPRDetailItems from "./FormPRDetailItems";
import IconCheck from '@app/libs/ui/Icons/IconCheck';
import { getLastNumbering, updateLastNumbering } from '@app/utils';

export default withRouter(
  observer(({ match, showSidebar, sidebar }: any) => {
    const [saving, setSaving] = useState(false);
    const [editable, setEdit] = useState(false);
    const [data, setData] = useState([]);
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

          //res[0].U_IDU_PO_INTNUM = poNum.join(";");
          //res[0].U_IDU_SUP_SONUM = soNum.join(";");
          res[0].U_BRANCH = global.session.user.branch;
          res[0].U_USERID = global.session.user.username;
          res[0].U_GENERATED = "W";
          setData(res[0]);
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
          }
        ]
      };

      APISearch(query).then((res: any) => {
        res.forEach((item: any) => {
          item.PK = btoa(item.LineNum + "|" + item.DocEntry);
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
        let number: any = await getLastNumbering("LPB", global.getSession().user.warehouse_id);
        await APIPost("PurchaseReceipt", {
          ...data, U_IDU_GRPO_INTNUM: number.format,
          Lines: selected
        });
        updateLastNumbering(number.id, number.last_count + 1);

        
      } catch (e) {
        alert(e.Message);
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
          <UIButton
            color="primary"
            size="small"
            onPress={() => {
              save();
            }}
          >
            <IconSave color="#fff" />
            {isSize(["md", "lg"]) && (
              <UIText style={{ color: "#fff" }}>
                {saving ? " Saving..." : " Save"}
              </UIText>
            )}
          </UIButton>
        </UIHeader>
        <UIBody scroll={true}>
          <UIJsonField
            items={data}
            // hideUndeclared={true}
            field={[
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
                    key: "DocDate",
                    size: 4,
                    type: "date",
                    label: "Posting Date"
                  },
                  {
                    key: "DocCur",
                    size: 4,
                    type: "field",
                    label: "Document Currency"
                  },
                  { type: "empty", size: 2 },

                  { key: "SlpCode", type: "field", label: "Sales Employee" }
                ]
              },
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
                  { key: "CardName", type: "field", label: "Name", size: 8 },
                  { key: "CntctCode", type: "field", label: "Contact Person" },
                  { key: "NumAtCard", type: "field", label: "Ref No.", size: 8 }
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
              (data as any)[key] = value;
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
                      height={18}
                      width={18}
                      style={{
                        marginTop: -5,
                        marginRight: 5,
                        marginLeft: -5
                      }}
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
