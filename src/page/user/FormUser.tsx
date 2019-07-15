import BtnSave from "@app/components/BtnSave";
import SAPDropdown from "@app/components/SAPDropdown";
import createRecord from "@app/libs/gql/data/createRecord";
import query from "@app/libs/gql/data/query";
import updateRecord from "@app/libs/gql/data/updateRecord";
import { hashPassword } from "@app/libs/gql/session/hashPassword";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UISelectField from "@app/libs/ui/UISelectField";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import rawQuery from "@app/libs/gql/data/rawQuery";
import UITabs from "@app/libs/ui/UITabs";
import UserWareHouse from "./UserWareHouse";
import BtnAdd from "@app/components/BtnAdd";

export default withRouter(
  observer(({ match, showSidebar, sidebar }: any) => {
    const [data, setData] = useState({} as any);
    const [itemsWhouse, setItemsWhouse] = useState([] as any);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rBranch, setRBranch] = useState(false);
    const [rCashAccount, setRCashAccount] = useState(false);
    const [rWhsCanvas, setRWhsCanvas] = useState(false);
    const [rSalesAsCust, setRSalesAsCust] = useState(false);

    useEffect(() => {
      if (!!match.params.id) {
        setLoading(true);
        getUser();
      }
    }, []);

    const getUser = () => {
      query(
        "user",
        [
          "area",
          "bpgroup",
          "branch",
          "cash_account",
          "fullname",
          "id",
          "username",
          "transfer_account",
          "slp_id",
          "warehouse_id",
          "sales_as_customer",
          "role",
          "password"
        ],
        { where: { id: match.params.id } }
      ).then(res => {
        res["password"] = "";
        setData(res);
        setRBranch(true);
        setRCashAccount(true);
        setRWhsCanvas(true);
        setRSalesAsCust(true);
        getWhouse(res.id);
      });
    };

    const getWhouse = (id: any) => {
      rawQuery(`{
        user_warehouse(where: {user_id: {_eq: "${id}"}}) {
          user_id
          warehouse_code
          id
        }
      }`).then(res => {
        setItemsWhouse(res.user_warehouse);
        setLoading(false);
      });
    };

    return (
      <UIContainer>
        <UIHeader
          showSidebar={showSidebar}
          sidebar={sidebar}
          center="Form User"
          isLoading={loading}
        >
          <BtnSave
            saving={saving}
            onPress={async () => {
              if (saving) return;
              setSaving(true);
              let record: any = {
                ...data,
                sales_as_customer: data.sales_as_customer || "",
                cash_account: data.cash_account || "",
                transfer_account: data.transfer_account || "",
                slp_id: data.slp_id || ""
              };
              if (!record.password) delete record.password;
              if (!!record.id) {
                await updateRecord("user", record);
                alert("Updated!");
              } else {
                record.id = await createRecord("user", record);
                alert("Saved!");
              }

              if (!!record.password) {
                hashPassword(record.id);
              }

              itemsWhouse.forEach(async (item: any, idx: number) => {
                let n = { ...item };
                if (n.status && n.status == "new" && !!n.warehouse_code) {
                  delete n.id;
                  delete n.status;
                  n.user_id = record.id;
                  itemsWhouse[idx].id = await createRecord("user_warehouse", n);
                } else if (
                  n.status &&
                  n.status == "update" &&
                  !!n.warehouse_code
                ) {
                  delete n.status;
                  await updateRecord("user_warehouse", n);
                }
              });
              setSaving(false);
            }}
            type={match.params.id ? "update" : "save"}
          />
        </UIHeader>
        <UIBody scroll={true}>
          <UIJsonField
            items={data}
            field={[
              {
                key: "general",
                label: "General",
                sublabel: "Informasi User",
                value: [
                  { key: "fullname", label: "Full Name", size: 12 },
                  {
                    key: "area",
                    size: 12,
                    label: "Area",
                    component: (
                      <SAPDropdown
                        label="Area"
                        field="Area"
                        value={(data as any).area}
                        setValue={v => {
                          setData({
                            ...data,
                            area: v,
                            branch: ""
                          });
                          setRBranch(true);
                        }}
                      />
                    )
                  },
                  {
                    key: "bpgroup",
                    size: 6,
                    label: "BP Group",
                    component: (
                      <SAPDropdown
                        label="BP Group"
                        field="BPGroup"
                        where={[{ field: "GroupName", value: data.area }]}
                        value={(data as any).bpgroup}
                        setValue={v => {
                          setData({ ...data, bpgroup: v });
                        }}
                      />
                    )
                  },
                  {
                    key: "branch",
                    size: 6,
                    label: "Branch",
                    component: (
                      <SAPDropdown
                        label="Branch"
                        field="Branch"
                        where={[{ field: "U_IDU_AREA", value: data.area }]}
                        value={(data as any).branch}
                        setValue={v => {
                          setData({
                            ...data,
                            branch: v,
                            cash_account: "",
                            warehouse_id: ""
                          });
                          setRCashAccount(true);
                          setRWhsCanvas(true);
                          setRSalesAsCust(true);
                        }}
                        mustInit={false}
                        refresh={rBranch}
                        setRefresh={(v: boolean) => setRBranch(v)}
                      />
                    )
                  },
                  {
                    key: "cash_account",
                    size: 12,
                    label: "Cash Account",
                    component: (
                      <SAPDropdown
                        label="Cash Account"
                        field="ChartOfAccount"
                        where={[
                          { field: "U_BRANCH", value: data.branch },
                          { field: "U_TYPE", value: "Cash" }
                        ]}
                        value={(data as any).cash_account}
                        setValue={v => {
                          setData({ ...data, cash_account: v });
                        }}
                        mustInit={false}
                        refresh={rCashAccount}
                        setRefresh={(v: boolean) => setRCashAccount(v)}
                      />
                    )
                  },
                  {
                    key: "warehouse_id",
                    size: 12,
                    label: "Warehouse Canvas",
                    component: (
                      <SAPDropdown
                        label="Warehouse Canvas"
                        field="Custom"
                        customQuery={{
                          Table: "OWHS",
                          Fields: ["WhsCode"],
                          Condition: [
                            { field: "U_BRANCH", cond: "=", value: data.branch }
                          ],
                          Page: 1
                        }}
                        value={(data as any).warehouse_id}
                        setValue={v => {
                          setData({ ...data, warehouse_id: v });
                        }}
                        mustInit={false}
                        refresh={rWhsCanvas}
                        setRefresh={(v: boolean) => setRWhsCanvas(v)}
                      />
                    )
                  },
                  {
                    key: "sales_as_customer",
                    size: 12,
                    label: "Sales As Customer",
                    component: (
                      <SAPDropdown
                        label="Sales As Customer"
                        field="SalesAsEmployee"
                        value={(data as any).sales_as_customer}
                        setValue={v => {
                          setData({ ...data, sales_as_customer: v });
                        }}
                        where={[
                          { field: "U_IDU_BRANCH", value: data.branch },
                        ]}
                        mustInit={false}
                        refresh={rSalesAsCust}
                        setRefresh={(v: boolean) => setRSalesAsCust(v)}
                      />
                    )
                  },
                  {
                    key: "slp_id",
                    size: 12,
                    label: "Sales Employee",
                    component: (
                      <SAPDropdown
                        label="Sales Employee"
                        field="SAPSalesCodeUser"
                        value={(data as any).slp_id}
                        setValue={v => {
                          setData({ ...data, slp_id: v });
                        }}
                      />
                    )
                  }
                ]
              },
              {
                key: "account",
                label: "Account",
                sublabel: "User Account",
                value: [
                  {
                    key: "role",
                    label: "Role",
                    size: 12,
                    component: (
                      <UISelectField
                        label="Role"
                        items={[
                          { label: "Admin", value: "admin" },
                          { label: "Branch Admin", value: "branch" },
                          { label: "Inventory Admin", value: "inventory" },
                          { label: "Sales Canvasing", value: "sales_canvas" },
                          { label: "Sales Taking Order", value: "sales_to" }
                        ]}
                        value={(data as any).role}
                        setValue={v => {
                          setData({ ...data, role: v });
                        }}
                      />
                    )
                  },
                  { key: "username", size: 12, label: "Username" },
                  {
                    key: "password",
                    type: "password",
                    size: 12,
                    label: "Password"
                  }
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
                label: "Warehouse",
                content: (
                  <UserWareHouse
                    items={itemsWhouse}
                    setItems={setItemsWhouse}
                    branch={data.branch}
                  />
                ),
                action: (
                  <BtnAdd
                    onPress={() => {
                      setItemsWhouse([
                        ...(itemsWhouse as any),
                        {
                          id: new Date().getTime(),
                          user_id: "",
                          warehouse_code: "",
                          status: "new"
                        }
                      ]);
                    }}
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
