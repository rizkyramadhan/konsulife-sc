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
  JrnlMemo: "",
  Comments: "",
  U_SONUM: "",
  U_IDU_PAYNUM: "",
  U_USERID: global.session.user.username,
  U_GENERATED: "W",
  U_BRANCH: global.session.user.branch,
  U_WONUM: "",
  Method: "cash",
  RemarkMethod : "SO",
};

export default withRouter(
  observer(({ history, showSidebar, sidebar }: any) => {
    const [data, setData] = useState(defData);
    const [WOList, setWOList] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [_items, _setItems] = useState<any[]>([]);
    const [_inv, _setInv] = useState<any[]>([]);

    const validation = () => {
      const err: any = [];
      const required = {
        CardCode: "BP Partner",
        U_SONUM: "NO SO"
      };

      Object.keys(required).forEach((k: any) => {
        if ((data as any)[k] === "" || !(data as any)[k])
          err.push((required as any)[k]);
      });

      if (err.length > 0) {
        alert(err.join(", ") + " is required.");
        return false;
      }
      return validationPayment();
    };

    const validationPayment = () => {
      const err: any = [];
      let required = {};
      if (data.Method === "cash") {
        required = {
          CashAcct: "Cash Account",
          CashSum: "Cash Ammount"
        };
      } else {
        required = {
          TrsfrAcct: "Transfer Account",
          TrsfrSum: "Transfer Ammount",
          TrsfrDate: today,
          TrsfrRef: "Transfer Ref"
        };
      }

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

      try {
        setSaving(true);
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

    const getWO = (bp_id: string) => {
      setWOList([]);
      rawQuery(`{
        work_order (where: {status: {_eq: "open"}, bp_id: {_eq: "${bp_id}"}, branch: {_eq: "${
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


      query = {
        Table: "OINV",
        Fields: ["U_IDU_SI_INTNUM"],
        Condition: [
          {
            field: "DocStatus",
            cond: "=",
            value: "O"
          },
          ...cond
        ]
      };

      APISearch(query).then((res: any) => {
        let items = res.map((item: any) => {
          return {
            value: item["U_IDU_SI_INTNUM"],
            label: item["U_IDU_SI_INTNUM"]
          };
        });
        _setInv([...items]);
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
                          setData({ ...data, CardCode: v, U_WONUM: "" });
                          getWO(v);
                        }}
                      />
                    )
                  },
                  {
                    key: "RemarkMethod",
                    size: 12,
                    label: "Remark With",
                    component: (
                      <UISelectField
                        label="Method"
                        items={[
                          { label: "Sales Order", value: "SO" },
                          { label: "Invoice", value: "INV" }
                        ]}
                        value={(data as any).RemarkMethod}
                        setValue={v => {
                          setData({
                            ...data,
                            RemarkMethod : v,
                          });
                        }}
                      />
                    )
                  },
                  {
                    key: "SONumb",
                    size: 12,
                    label: data.RemarkMethod,
                    component: (
                      <UITagField
                        label= {data.RemarkMethod}
                        items={data.RemarkMethod == "SO"?_items:_inv}
                        value={(data as any).U_SONUM}
                        setValue={(v: any) => {
                          let remArr:any = [];
                          
                          v.forEach((el:any) => {
                            let elArr = el.split("/");
                            let elStr = elArr[0] + elArr[elArr.length -1];
                            remArr.push(elStr);
                          });
                          data.U_SONUM = v.join(";");
                          data.JrnlMemo = remArr.join(";");
                        }}
                      />
                    )
                  },
                  {
                    key: "Method",
                    size: 12,
                    label: "Method",
                    component: (
                      <UISelectField
                        label="Method"
                        items={[
                          { label: "Cash", value: "cash" },
                          { label: "Transfer", value: "transfer" }
                        ]}
                        value={(data as any).Method}
                        setValue={v => {
                          setData({
                            ...data,
                            Method: v,
                            CashAcct: "",
                            CashSum: "",
                            TrsfrAcct: "",
                            TrsfrSum: "",
                            TrsfrDate: today,
                            TrsfrRef: ""
                          });
                        }}
                      />
                    )
                  }
                ]
              },
              {
                key: "date",
                label: "",
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
                    key: "U_WONUM",
                    size: 12,
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
                  },
                  { key: "Comments", size: 12, label: "Remarks" }
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

          {data.Method === "cash" && (
            <UIJsonField
              items={data}
              field={[
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
                          field="Custom"
                          customQuery={{
                            Table: "@IDU_ACCTCODE",
                            Fields: ["U_ACCTCODE", "U_ACCTNAME"],
                            Condition: [
                              {
                                field: "U_ACCTCODE",
                                cond: "=",
                                value: global.getSession().user.cash_account
                              }
                            ]
                          }}
                          value={(data as any).CashAcct}
                          setValue={v => {
                            setData({ ...data, CashAcct: v });
                          }}
                        />
                      )
                    },
                    { key: "CashSum", size: 12, label: "Cash Amount" }
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
          )}

          {data.Method === "transfer" && (
            <UIJsonField
              items={data}
              field={[
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
                          where={[
                            {
                              field: "U_BRANCH",
                              value: global.getSession().user.branch
                            },
                            { field: "U_TYPE", value: "Bank" }
                          ]}
                          value={(data as any).TrsfrAcct}
                          setValue={v => {
                            setData({ ...data, TrsfrAcct: v });
                          }}
                        />
                      )
                    },
                    { key: "TrsfrSum", size: 12, label: "Transfer Amount" },
                    {
                      key: "TrsfrDate",
                      size: 6,
                      label: "Transfer Date",
                      type: "date"
                    },
                    { key: "TrsfrRef", size: 12, label: "Ref Number" }
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
          )}
        </UIBody>
      </UIContainer>
    );
  })
);
