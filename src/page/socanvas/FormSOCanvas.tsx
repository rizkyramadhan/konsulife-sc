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
import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import FormSOCanvasDetailItems from "./FormSOCanvasDetailItems";
import { withRouter } from "react-router-dom";
import rawQuery from "@app/libs/gql/data/rawQuery";
import UISelectField from "@app/libs/ui/UISelectField";
import { View } from "reactxp";
import UITextField from "@app/libs/ui/UITextField";
import UIField from "@app/libs/ui/UIField";

const date = new Date();
const today = `${date.getFullYear()}-${lpad(
  (date.getMonth() + 1).toString(),
  2
)}-${lpad(date.getDate().toString(), 2)}`;

const header = {
  CardCode: "",
  CardName: "",
  CntctCode: "",
  CntctPrsn: "",
  NumAtCard: "",
  DocDate: today,
  DocDueDate: today,
  DocCur: "",
  DocRate: 1,
  GroupNum: "",
  SlpCode: -1,
  Address: "",
  AddressName: "",
  Address2: "",
  Address2Name: "",
  Comments: "",
  DiscPrcnt: "0",
  Discount: "0",
  U_BRANCH: "",
  U_USERID: "",
  U_GENERATED: "W",
  U_IDU_ISCANVAS: "Y",
  U_WONUM: "",
  U_IDU_SO_INTNUM: "",
  U_IDU_SO_TRANSCODE: "SOK",
  PriceMode: ""
};

export default withRouter(
  observer(({ history, showSidebar, sidebar }: any) => {
    const [data, setData] = useState<any>(header);
    const [WOList, setWOList] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [qCP, setQCP] = useState(false);
    const [qShip, setQShip] = useState(false);
    const [qBill, setQBill] = useState(false);

    useEffect(() => {
      (data as any).SlpCode = !!global.session.user.slp_id || "-1";
      (data as any).U_BRANCH = global.session.user.branch;
      (data as any).U_USERID = global.session.user.username;
      setData({ ...data });

      rawQuery(`{
        work_order (where: {status: {_eq: "open"}, sales_id: {_eq: "${
          global.getSession().user.slp_id
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
        CardCode: "Customer",
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

      let zeroPrice = false;
      items.forEach((v: any) => {
        // if (v.PriceBefDi === "" || v.PriceBefDi === "0" || v.PriceBefDi === 0) {
        if (v.Price === "" || v.Price === "0" || v.Price === 0) {
          zeroPrice = true;
        }
      });

      if (zeroPrice) {
        alert("Price tidak boleh kosong.");
        return false;
      }
      return true;
    };

    const save = async () => {
      if (saving) return;
      if (!validation()) return;

      setSaving(true);
      const Lines_IT = items.map(d => {
        d.ShipDate = data.DocDueDate;
        d.OcrCode = global.session.user.area;
        d.OcrCode2 = global.session.user.branch;

        delete d.LineNum;
        return d;
      });

      let number: any = await getLastNumbering("SOK", items[0].WhsCode);
      try {
        await APIPost("SalesOrder", {
          ...data,
          U_IDU_SO_INTNUM: number.format,
          Lines: [...Lines_IT]
        }).then(() => {
          updateLastNumbering(number.id, number.last_count + 1);
          history.goBack();
        });
      } catch (e) {
        if (e.Message.search("409") > -1) {
          updateLastNumbering(number.id, number.last_count + 1);
          alert(
            "No SOK sudah digunakan, simpan kembali untuk me-refresh No SOK."
          );
        } else {
          alert(e.Message);
        }

        console.error({
          ...data,
          U_IDU_SO_INTNUM: number.format,
          Lines: [...Lines_IT]
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
          center="Form SO Canvasing"
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
                    size: 8,
                    type: "field",
                    label: "Customer/Vendor Code"
                  },
                  {
                    key: "CardCode",
                    label: "Customer/Vendor",
                    size: 12,
                    component: (
                      <SAPDropdown
                        label="Customer"
                        field="CustomerCode"
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
                            GroupNum: r.item.GroupNum,
                            DocCur: r.item.Currency,
                            CntctCode: "",
                            CntctPrsn: r.item.CntctPrsn,
                            AddressName: r.item.Address,
                            Address2Name: r.item.MailAddres,
                            PriceMode: r.item.PriceMode
                          });
                          setQCP(true);
                          setQBill(true);
                          setQShip(true);
                        }}
                      />
                    )
                  },
                  {
                    key: "CntctCode",
                    label: "Contact Person",
                    size: 7,
                    component: (
                      <SAPDropdown
                        label="Contact Person"
                        field="Custom"
                        itemField={{ value: "CntctCode", label: "Name" }}
                        customQuery={{
                          Table: "OCPR",
                          Fields: ["CntctCode", "Name"],
                          Condition: [
                            {
                              field: "CardCode",
                              cond: "=",
                              value: data.CardCode
                            }
                          ]
                        }}
                        value={(data as any).CntctCode}
                        setValue={v => {
                          setData({ ...data, CntctCode: v });
                        }}
                        mustInit={false}
                        refresh={qCP}
                        setRefresh={setQCP}
                        afterQuery={(items: any) => {
                          items.forEach((i: any) => {
                            if (i.label === data.CntctPrsn) {
                              data.CntctCode = i.value;
                              setData({ ...data });
                            }
                          });
                        }}
                      />
                    )
                  },
                  { key: "NumAtCard", label: "PO Customer No", size: 8 }
                ]
              },
              {
                key: "payment",
                label: "Payment",
                sublabel: "Informasi Pembayaran",
                value: [
                  {
                    key: "Address2",
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
                        value={(data as any).Address2}
                        setValue={v => {
                          setData({ ...data, Address2: v });
                        }}
                        refresh={qShip}
                        setRefresh={setQShip}
                        afterQuery={(items: any) => {
                          items.forEach((i: any) => {
                            if (i.label === data.Address2Name) {
                              data.Address2 = i.value;
                              setData({ ...data });
                            }
                          });
                        }}
                      />
                    )
                  },
                  {
                    key: "Address",
                    label: "Bill To",
                    size: 12,
                    component: (
                      <SAPDropdown
                        label="Bill To"
                        field="Custom"
                        mustInit={false}
                        customQuery={{
                          Table: "CRD1",
                          Fields: ["Street"],
                          Condition: [
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
                        refresh={qBill}
                        setRefresh={setQBill}
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
                  },
                  {
                    key: "GroupNum",
                    label: "Payment Method",
                    size: 8,
                    component: (
                      <SAPDropdown
                        label="Payment Method"
                        field="PaymentTerms"
                        value={(data as any).GroupNum}
                        setValue={v => {
                          setData({ ...data, GroupNum: v });
                        }}
                      />
                    )
                  }
                ]
              },
              {
                key: "general",
                label: "General",
                sublabel: "Informasi Sales Order",
                value: [
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
                  },
                  {
                    key: "DocDate",
                    size: 6,
                    type: "date",
                    label: "Posting Date"
                  },
                  {
                    key: "DocDueDate",
                    size: 6,
                    type: "date",
                    label: "Delivery Date"
                  }
                ]
              },
              { type: "empty", key: "c" },
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
              if (key === "DocDate") {
                if (value > today) {
                  value = today;
                }
              }
              (data as any)[key] = value;
              setData({ ...data });
            }}
          />

          <View style={{ marginTop: 50 }}>
            <UITabs
              tabs={[
                {
                  label: "Detail Items",
                  content: () => (
                    <FormSOCanvasDetailItems
                      data={data}
                      items={items}
                      setItems={setItems}
                    />
                  ),
                  action: (
                    <BtnAdd
                      onPress={() => {
                        if (data.CardCode === "")
                          return alert("Anda belum memilih customer.");
                        setItems([
                          ...(items as any),
                          {
                            Key: new Date().valueOf(),
                            ItemCode: "",
                            Dscription: "",
                            U_IDU_PARTNUM: "",
                            UseBaseUn: "N",
                            Quantity: 1,
                            WhsCode: global.getSession().user.warehouse_id,
                            ShipDate: "",
                            OcrCode: "",
                            OcrCode2: "",
                            // PriceBefDi: 0,
                            Price: 0,
                            DiscPrcnt: 0,
                            UoMEntry: "",
                            TaxCode: "",
                            TotalPrice: 0,
                            OnHand: 0
                          }
                        ]);
                      }}
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
                        {_.sumBy(items, "TotalPrice")}
                      </UIField>
                    )
                  },
                  {
                    key: "DiscPrcnt",
                    size: 4,
                    component: (
                      <UITextField
                        type="text"
                        label="Disc (%)"
                        value={(data as any).DiscPrcnt}
                        onChangeText={v => {
                          if (isNaN(parseFloat(v))) v = "0";

                          let total = _.sumBy(items, "TotalPrice");
                          let disc = ((total * parseFloat(v)) / 100).toFixed(2);

                          setData({ ...data, Discount: disc });
                        }}
                        setValue={v => {
                          setData({ ...data, DiscPrcnt: v });
                        }}
                      />
                    )
                  },
                  {
                    key: "Discount",
                    size: 8,
                    component: (
                      <UITextField
                        type="text"
                        label="Disc"
                        value={(data as any).Discount}
                        onChangeText={v => {
                          if (isNaN(parseFloat(v))) v = "0";

                          let total = _.sumBy(items, "TotalPrice");
                          let disc = ((parseFloat(v) / total) * 100).toFixed(2);

                          setData({ ...data, DiscPrcnt: disc });
                        }}
                        setValue={v => {
                          setData({ ...data, Discount: v });
                        }}
                      />
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
                          let total =
                            _.sumBy(items, "TotalPrice") -
                            parseFloat(data.Discount);
                          let tax = ((total * 10) / 100).toFixed(2);
                          return tax;
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
                          let total =
                            _.sumBy(items, "TotalPrice") -
                            parseFloat(data.Discount);
                          let tax = (total * 10) / 100;
                          let total_net = total + tax;
                          return total_net;
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
