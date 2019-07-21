import { APIPost } from "@app/api";
import BtnAdd from "@app/components/BtnAdd";
import BtnSave from "@app/components/BtnSave";
import SAPDropdown from "@app/components/SAPDropdown";
import global from "@app/global";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UITabs from "@app/libs/ui/UITabs";
import { lpad, getLastNumbering, updateLastNumbering } from "@app/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { withRouter } from "@app/libs/router/Routing";
import { View } from "reactxp";
import FormInvTransferDetail from "./FormInvTransferDetail";
import rawQuery from "@app/libs/gql/data/rawQuery";
import UISelectField from "@app/libs/ui/UISelectField";

const date = new Date();
const today = `${date.getFullYear()}-${lpad(
  (date.getMonth() + 1).toString(),
  2
)}-${lpad(date.getDate().toString(), 2)}`;

const initData = {
  DocDate: today,
  DocDueDate: today,
  DocNum: "",
  DocEntry: "",
  CardName: "",
  CardCode: "",
  Address: "",
  AddressName: "",
  Filler: "",
  ToWhsCode: "",
  Comments: "",
  SlpCode: !!global.session.user.slp_id || -1,
  U_BRANCH: global.session.user.branch,
  U_USERID: global.session.user.id,
  U_GENERATED: "W",
  U_IDU_IT_TRANSCODE: "",
  U_IDU_IT_INTNUM: "",
  U_IDU_CONTNUM: "",
  U_IDU_NOSEAL: "",
  U_IDU_NOPL: "",
  U_IDU_NOPOL: "",
  U_IDU_DRIVER: "",
  U_WONUM: "",
  U_STOCK_TRANSNO: "",
  U_STOCK_RETURN: "N"
};

export default withRouter(
  observer(({ history, showSidebar, sidebar }: any) => {
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState(initData);
    const [WOList, setWOList] = useState<any[]>([]);
    const [qShip, setQShip] = useState(false);
    const [items, setItems] = useState<any[]>([]);

    const getWO = (bp_id: string) => {
      rawQuery(`{
        work_order (where: {status: {_eq: "open"}, bp_id: {_eq: "${bp_id}"}}) {
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

    const validation = () => {
      const err: any = [];
      const required = {
        CardCode: "Sales",
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
      return validationItems();
    };

    const validationItems = () => {
      if (items.length === 0) {
        alert("Items is empty.");
        return false;
      }
      return true;
    };

    const save = async () => {
      if (saving) return;
      if (!validation()) return;
      setSaving(true);

      let number: any = await getLastNumbering("PGK-T", data.Filler);
      let postItem: any[] = [];
      items.forEach((val: any) => {
        postItem.push({
          ItemCode: val.ItemCode,
          Dscription: val.Dscription,
          UseBaseUn: val.UseBaseUn,
          Quantity: val.Quantity,
          UoMEntry: val.UoMEntry,
          WhsCode: val.WhsCode,
          SerialNum: val.SerialNum
        });
      });

      try {
        await APIPost("InventoryTransfer", {
          ...data,
          U_IDU_IT_INTNUM: number.format,
          U_IDU_IT_TRANSCODE: "PGK-T",
          SlpCode:
            global.session.user.slp_id !== "" &&
            global.session.user.slp_id !== null
              ? global.session.user.slp_id
              : -1,
          U_BRANCH: global.session.user.branch,
          U_USERID: global.session.user.username,
          Lines: postItem
        });

        updateLastNumbering(number.id, number.last_count + 1);
        history.goBack();
      } catch (e) {
        if (e.Message.search("409") > -1) {
          updateLastNumbering(number.id, number.last_count + 1);
          alert(
            "No IT sudah digunakan, simpan kembali untuk me-refresh No IT."
          );
        } else {
          alert(e.Message);
        }

        console.error({
          ...data,
          U_IDU_IT_INTNUM: number.format,
          U_IDU_IT_TRANSCODE: "PGK-T",
          U_STOCK_RETURN: "N",
          SlpCode:
            global.session.user.slp_id !== "" &&
            global.session.user.slp_id !== null
              ? global.session.user.slp_id
              : -1,
          U_BRANCH: global.session.user.branch,
          U_USERID: global.session.user.username,
          Lines: postItem
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
          center="Stock Transfer Form"
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
                key: "vendor",
                label: "Business Partner",
                value: [
                  {
                    key: "CardCode",
                    size: 12,
                    type: "field",
                    label: "BP Code"
                  },
                  {
                    key: "CardCode",
                    label: "Business Partner",
                    size: 12,
                    component: (
                      <SAPDropdown
                        label="Sales Name"
                        field="SalesAsEmployee"
                        where={[
                          {
                            field: "U_IDU_BRANCH",
                            value: global.getSession().user.branch
                          }
                        ]}
                        value={(data as any).CardCode}
                        setValue={(v, l, r) => {
                          setData({
                            ...data,
                            CardCode: v,
                            CardName: l,
                            AddressName: r.item.MailAddres,
                            U_WONUM: ""
                          });
                          setQShip(true);
                          getWO(v);
                        }}
                      />
                    )
                  },
                  {
                    key: "Address",
                    label: "Ship To",
                    size: 12,
                    component: (
                      <SAPDropdown
                        label="Ship To"
                        field="Custom"
                        mustInit={false}
                        customQuery={{
                          Table: "CRD1",
                          Fields: ["Street"],
                          Condition: [
                            {
                              field: "AdresType",
                              cond: "=",
                              value: "S"
                            },
                            { cond: "AND" },
                            {
                              field: "CardCode",
                              cond: "=",
                              value: data.CardCode
                            }
                          ]
                        }}
                        value={(data as any).Address}
                        setValue={v => {
                          setData({ ...data, Address: v });
                        }}
                        refresh={qShip}
                        setRefresh={setQShip}
                        afterQuery={(items: any) => {
                          items.forEach((i: any) => {
                            if (i.label === data.AddressName) {
                              data.Address = i.value;
                              setData({ ...data });
                            }
                          });
                        }}
                      />
                    )
                  }
                ]
              },
              {
                key: "general",
                label: "General",
                value: [
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
                  {
                    key: "DocDate",
                    size: 6,
                    type: "date",
                    label: "Posting Date",
                    options: { pastDate: true }
                  },
                  {
                    key: "DocDueDate",
                    size: 6,
                    type: "date",
                    label: "Delivery Date",
                    options: { pastDate: true }
                  },
                  {
                    key: "Filler",
                    size: 6,
                    type: "field",
                    label: "From Warehouse",
                    component: (
                      <SAPDropdown
                        label="From Warehouse"
                        field="Custom"
                        customQuery={{
                          Table: "OWHS",
                          Fields: ["WhsCode"],
                          Condition: [
                            {
                              field: "U_BRANCH",
                              cond: "=",
                              value: global.getSession().user.branch
                            },
                            {
                              cond: "AND"
                            },
                            {
                              field: "U_IDU_WHSETYPE",
                              cond: "<>",
                              value: "Canvassing"
                            }
                          ],
                          Page: 1
                        }}
                        value={(data as any).Filler}
                        setValue={v => {
                          setData({ ...data, Filler: v });
                          items.forEach((val: any) => {
                            val.WhsCode = v;
                          });
                        }}
                      />
                    )
                  },
                  {
                    key: "ToWhsCode",
                    size: 6,
                    type: "field",
                    label: "To Warehouse",
                    component: (
                      <SAPDropdown
                        label="To Warehouse"
                        field="Custom"
                        customQuery={{
                          Table: "OWHS",
                          Fields: ["WhsCode"],
                          Condition: [
                            {
                              field: "U_BRANCH",
                              cond: "=",
                              value: global.getSession().user.branch
                            },
                            {
                              cond: "AND"
                            },
                            {
                              field: "U_IDU_WHSETYPE",
                              cond: "=",
                              value: "Canvassing"
                            }
                          ],
                          Page: 1
                        }}
                        value={(data as any).ToWhsCode}
                        setValue={v => {
                          setData({ ...data, ToWhsCode: v });
                        }}
                      />
                    )
                  }
                ]
              },
              {
                key: "info",
                label: "Shipment",
                value: [
                  { key: "U_IDU_CONTNUM", size: 6, label: "No. Container" },
                  { key: "U_IDU_NOSEAL", size: 6, label: "No. Seal" },
                  { key: "U_IDU_NOPL", size: 6, label: "No. PL" },
                  { key: "U_IDU_NOPOL", size: 6, label: "Nopol" },
                  { key: "U_IDU_DRIVER", size: 12, label: "Driver" }
                ]
              }
            ]}
            setValue={(value: any, key: any) => {
              (data as any)[key] = value;
              setData(data);
            }}
          />

          <View style={{ marginTop: 50 }}>
            <UITabs
              tabs={[
                {
                  label: "Detail items",
                  content: () => (
                    <FormInvTransferDetail
                      items={items}
                      setItems={setItems}
                      header={data}
                    />
                  ),
                  action: (
                    <BtnAdd
                      onPress={() => {
                        if (data.CardCode === "")
                          return alert("Anda belum memilih sales.");
                        if (data.Filler === "" || data.ToWhsCode === "")
                          return alert("Anda belum memilih warehouse.");
                        setItems([
                          ...(items as any),
                          {
                            LineNum: Math.floor(
                              Math.random() * Math.floor(999)
                            ),
                            ItemCode: "",
                            Dscription: "",
                            UseBaseUn: "",
                            Quantity: 1,
                            OhHand: "",
                            UoMEntry: "",
                            WhsCode: data.Filler,
                            SerialNum: ""
                          }
                        ]);
                      }}
                    />
                  )
                }
              ]}
            />
          </View>
        </UIBody>
      </UIContainer>
    );
  })
);
