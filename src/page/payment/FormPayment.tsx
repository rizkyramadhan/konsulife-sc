import { APIPost, APISearchProps, APISearch } from "@app/api";
import BtnSave from "@app/components/BtnSave";
import SAPDropdown from "@app/components/SAPDropdown";
import global from "@app/global";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import { getLastNumbering, updateLastNumbering, lpad } from "@app/utils";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import UITagField from "@app/libs/ui/UITagField";
import rawQuery from "@app/libs/gql/data/rawQuery";
import UISelectField from "@app/libs/ui/UISelectField";

const date = new Date();
const today = `${date.getFullYear()}-${lpad(
  (date.getMonth() + 1).toString(),
  2
)}-${lpad(date.getDate().toString(), 2)}`;

const defData = {
  DocDate: today,
  DocDueDate: today,
  CardCode: "",
  CardName: "",
  CashAcct: "",
  CashSum: "",
  TrsfrAcct: "",
  TrsfrSum: "",
  TrsfrDate: today,
  TrsfrRef: "",
  U_Remark: "",
  U_SONUM: "",
  U_IDU_PAYNUM: "",
  U_USERID: global.session.user.username,
  U_GENERATED: "W",
  U_BRANCH: global.session.user.branch,
  U_WONUM: ""
};

export default withRouter(
  observer(({ history, showSidebar, sidebar }: any) => {
    const [data, setData] = useState(defData);
    const [WOList, setWOList] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [_items, _setItems] = useState<any[]>([]);

    const save = async () => {
      setSaving(true);
      try {
        let number: any = await getLastNumbering(
          "TP",
          global.getSession().user.branch || ""
        );
        await APIPost("IncomingPayment", {
          ...data,
          U_IDU_PAYNUM: number.format,
          U_IDU_PAY_TRANSCODE: "TP",
          U_USERID: global.session.user.username,
          U_GENERATED: "W",
          U_BRANCH: global.session.user.branch
        });
        updateLastNumbering(number.id, number.last_count + 1);
        history.goBack();
      } catch (e) {
        alert(e.Message);
      } finally {
        setSaving(false);
      }
    };

    useEffect(() => {
      let cond: any[] = [];
      if (global.getSession().role === "branch") {
        cond = [
          { cond: "AND" },
          {
            field: "U_BRANCH",
            cond: "=",
            value: global.getSession().user.branch
          }
        ];
      } else if (global.getSession().role === "sales_to") {
        cond = [
          { cond: "AND" },
          {
            field: "U_USERID",
            cond: "=",
            value: global.getSession().user.username
          }
        ];
      }

      let query: APISearchProps = {
        Table: "ORDR",
        Fields: ["U_IDU_SO_INTNUM"],
        Condition: [
          {
            field: "DocStatus",
            cond: "=",
            value: "O"
          },
          { cond: "AND" },
          {
            field: "ObjType",
            cond: "=",
            value: 17
          },
          ...cond
        ]
      };

      APISearch(query).then((res: any) => {
        let items = res.map((item: any) => {
          return {
            value: item["U_IDU_SO_INTNUM"],
            label: item["U_IDU_SO_INTNUM"]
          };
        });
        _setItems([...items]);
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

    return (
      <UIContainer>
        <UIHeader
          showSidebar={showSidebar}
          sidebar={sidebar}
          center="Form Payment Receipt"
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
                key: "general",
                label: "General",
                value: [
                  {
                    key: "DocDate",
                    size: 6,
                    label: "Posting Date",
                    type: "date",
                    options: { pastDate: true }
                  },
                  {
                    key: "DocDueDate",
                    size: 6,
                    label: "Delivery Date",
                    type: "date",
                    options: { pastDate: true }
                  },
                  {
                    key: "CardCode",
                    label: "BP Partner",
                    size: 12,
                    component: (
                      <SAPDropdown
                        label="BP Partner"
                        field="SalesAsEmployee"
                        where={[
                          {
                            field: "U_IDU_BRANCH",
                            value: global.getSession().user.branch
                          }
                        ]}
                        value={(data as any).CardCode}
                        setValue={v => {
                          setData({ ...data, CardCode: v });
                        }}
                      />
                    )
                  },
                  {
                    key: "U_SONUM",
                    size: 12,
                    label: "No. SO",
                    component: (
                      <UITagField
                        label="No. SO"
                        items={_items}
                        value={(data as any).U_SONUM}
                        setValue={(v: any) => {
                          data.U_SONUM = v.join(";");
                        }}
                      />
                    )
                  },
                  {
                    key: "U_WONUM",
                    size: 8,
                    component: (
                      <UISelectField
                        label="WO Number"
                        items={WOList}
                        value={data.U_WONUM}
                        setValue={v => {
                          setData({ ...data, U_WONUM: v });
                        }}
                      />
                    )
                  }
                ]
              },
              {
                key: "cash",
                label: "Cash",
                value: [
                  {
                    key: "CashAcct",
                    size: 12,
                    label: "Cash Account",
                    component: (
                      <SAPDropdown
                        label="Cash Account"
                        field="ChartOfAccount"
                        value={(data as any).CashAcct}
                        setValue={v => {
                          setData({ ...data, CashAcct: v });
                        }}
                      />
                    )
                  },
                  { key: "CashSum", size: 12, label: "Cash Amount" },
                  { key: "U_Remark", size: 12, label: "Remarks" }
                ]
              },
              {
                key: "transfer",
                label: "Bank Transfer",
                value: [
                  {
                    key: "TrsfrAcct",
                    size: 12,
                    label: "Transfer Account",
                    component: (
                      <SAPDropdown
                        label="Transfer Account"
                        field="ChartOfAccount"
                        value={(data as any).TrsfrAcct}
                        setValue={v => {
                          setData({ ...data, TrsfrAcct: v });
                        }}
                      />
                    )
                  },
                  { key: "TrsfrSum", size: 12, label: "Transfer Amount" },
                  { key: "TrsfrDate", size: 6, label: "Transfer Date", type:"date" },
                  { key: "TrsfrRef", size: 12, label: "Intended Purpose" }
                ]
              }
            ]}
            setValue={(value: any, key: any) => {
              if (key === "TrsfrDate") {
                if (value > today) {
                  value = today;
                }
              }
              (data as any)[key] = value;
              setData({ ...data });
            }}
          />
        </UIBody>
      </UIContainer>
    );
  })
);
