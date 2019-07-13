import UIList from "@app/libs/ui/UIList";
import React, { useState } from "react";
import { View } from "reactxp/dist/web/Animated";
import { MainStyle } from "@app/config";
import UIText from "@app/libs/ui/UIText";
import { Button, Modal } from "reactxp";
import UISeparator from "@app/libs/ui/UISeparator";
import UIJsonField from "@app/libs/ui/UIJsonField";
import SAPDropdown from "@app/components/SAPDropdown";
import UISelectField from "@app/libs/ui/UISelectField";
import { APISearch } from "@app/api";
import IconTrash from "@app/libs/ui/Icons/IconTrash";
import global from "@app/global";

export default ({ data, items, setItems }: any) => {
  const [uoMEntry, setUoMEntry] = useState<any>({});
  const [iUoMEntry, setIUoMEntry] = useState<any>({});

  const getPrice = async (idx: any, value: any) => {
    const res = await APISearch({
      CustomQuery: "UnitPriceSO",
      Condition: [
        {
          field: "CardCode",
          cond: "=",
          value: data.CardCode
        },
        { cond: "AND" },
        {
          field: "ItemCode",
          cond: "=",
          value: value
        }
      ]
    });

    if (Array.isArray(res) && res.length > 0) {
      items[idx]["PriceBefDi"] = parseInt(res[0]["Price"]);
      setItems([...items]);
    }
  };

  const getStockInWhs = async (idx: any, itemCode: string) => {
    const res = await APISearch({
      Table: "OITW",
      Fields: ["OnHand"],
      Condition: [
        {
          field: "ItemCode",
          cond: "=",
          value: itemCode
        },
        { cond: "AND" },
        {
          field: "WhsCode",
          cond: "=",
          value: global.getSession().user.warehouse_id
        }
      ]
    });

    if (Array.isArray(res) && res.length > 0) {
      items[idx]["OnHand"] = parseInt(res[0]["OnHand"]);
      setItems([...items]);
    }
  };

  const getUoM = async (idx: any, value: any) => {
    const res: any = await APISearch({
      CustomQuery: `GetUom,${value}`
    });
    // jika uom group entry = -1 maka set uom entry = manual
    // jika bukan maka set uom entry sesuai sales uom entry
    items[idx]["UseBaseUn"] = "N";
    if (res.UgpEntry == -1) {
      items[idx]["UoMEntry"] = -1;
      items[idx]["UoMName"] = "Manual";
    } else {
      items[idx]["UoMEntry"] = res.SUoMEntry;
      items[idx]["UoMName"] = res.SUoMCode;
    }
    setItems([...items]);

    // group list uom entry berdasarkan item code karena uom entry setiap item code berbeda
    uoMEntry[value] = res.Lines.map((d: any) => {
      return { value: d.UomEntry, label: d.UomCode };
    });
    setUoMEntry({ ...uoMEntry });

    // group list sales uom berdasarkan item code karena sales uom setiap item berbeda
    iUoMEntry[value] = res.IUoMEntry;
    setIUoMEntry({ ...iUoMEntry });
  };

  return (
    <UIList
      primaryKey="Key"
      selection="detail"
      fields={{
        ItemCode: {
          table: {
            header: "Item Code"
          }
        },
        Dscription: {
          table: {
            header: "Item Name"
          }
        },
        U_IDU_PARTNUM: {
          table: {
            header: "Part Number"
          }
        },
        UseBaseUn: {
          table: {
            header: "Inv UoM"
          }
        },
        UoMName: {
          table: {
            header: "UoM Name"
          }
        },
        Quantity: {
          table: {
            header: "Quantity"
          }
        },
        OnHand: {
          table: {
            header: "Qty In Whs"
          }
        },
        WhsCode: {
          table: {
            header: "Warehouse"
          }
        },
        PriceBefDi: {
          table: {
            header: "Price"
          }
        },
        DiscPrcnt: {
          table: {
            header: "Disc(%)"
          }
        },
        TotalPrice: {
          table: {
            header: "Price"
          }
        }
      }}
      items={items}
      detailComponent={item => {
        let modal = (
          <View
            style={{
              borderWidth: 0,
              borderLeftWidth: 1,
              borderColor: "#ececeb",
              backgroundColor: "#fff",
              flexBasis: 350,
              overflow: "visible"
            }}
          >
            <View
              style={{
                padding: 4,
                marginLeft: 0,
                marginRight: 0,
                paddingLeft: 0,
                flexDirection: "row",
                justifyContent: "space-around",
                backgroundColor: MainStyle.backgroundColor
              }}
            >
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "center",
                  flex: 1,
                  paddingLeft: 10
                }}
              >
                <UIText>{item.pkval}</UIText>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Button
                  onPress={() => {
                    setItems([...items]);
                    item.close();
                    Modal.dismiss("detail" + item.pkval);
                  }}
                >
                  <UIText size="large">&times;</UIText>
                </Button>
              </View>
            </View>
            <UISeparator style={{ marginTop: 0, marginBottom: 0 }} />
            <UIJsonField
              items={item.item}
              setValue={(val: any, key: string) => {
                const idx = items.findIndex((x: any) => x.Key === item.pkval);
                items[idx][key] = val;
                if (
                  key === "Quantity" ||
                  key === "PriceBefDi" ||
                  key === "DiscPrcnt"
                ) {
                  if (isNaN(parseFloat(items[idx]["Quantity"])))
                    items[idx]["Quantity"] = "0";
                  if (isNaN(parseFloat(items[idx]["PriceBefDi"])))
                    items[idx]["PriceBefDi"] = "0";
                  if (isNaN(parseFloat(items[idx]["DiscPrcnt"])))
                    items[idx]["DiscPrcnt"] = "0";

                  let price: number =
                    parseFloat(items[idx]["Quantity"]) *
                    parseFloat(items[idx]["PriceBefDi"]);
                  let disc: number = parseFloat(
                    (
                      (price * parseFloat(items[idx]["DiscPrcnt"])) /
                      100
                    ).toFixed(2)
                  );

                  items[idx]["TotalPrice"] = price - disc;
                }
                setItems([...items]);
              }}
              style={{
                padding: 10
              }}
              field={[
                {
                  key: "ItemCode",
                  size: 12,
                  label: "Item Code",
                  component: (
                    <SAPDropdown
                      label="Item Code"
                      field="Custom"
                      searchRealtime={true}
                      searchField="T2.ItemName"
                      customQuery={{
                        CustomQuery: "ItemCodeCanvas",
                        Condition: [
                          {
                            field: "T1.WhsCode",
                            cond: "=",
                            value: global.getSession().user.warehouse_id
                          },
                          {
                            cond: "AND"
                          },
                          {
                            field: "T1.OnHand",
                            cond: ">",
                            value: "0"
                          }
                        ]
                      }}
                      value={(item as any).item.ItemCode}
                      setValue={async (v, l, r) => {
                        const idx = items.findIndex(
                          (x: any) => x.Key === item.pkval
                        );
                        items[idx]["ItemCode"] = v;
                        items[idx]["Dscription"] = l;
                        items[idx]["U_IDU_PARTNUM"] = r.item.U_IDU_PARTNUM;
                        items[idx]["TaxCode"] = r.item.VatGourpSa;

                        setItems([...items]);
                        await getUoM(idx, v);
                        await getStockInWhs(idx, v);
                        await getPrice(idx, v);
                      }}
                    />
                  )
                },
                {
                  key: "UomEntry",
                  size: 12,
                  label: "Uom",
                  component: (
                    <UISelectField
                      label="UoMCode"
                      items={uoMEntry[(item as any).item.ItemCode] || []}
                      value={(item as any).item.UoMEntry}
                      setValue={(v, l) => {
                        const idx = items.findIndex(
                          (x: any) => x.Key === item.pkval
                        );
                        items[idx]["UoMEntry"] = v;
                        items[idx]["UoMName"] = l;

                        // jika uom entry yang dipilih merupakan default inv uom, maka set base un = Y
                        let itemCode = (item as any).item.ItemCode;
                        if (v === iUoMEntry[itemCode]) {
                          items[idx]["UseBaseUn"] = "Y";
                        } else {
                          items[idx]["UseBaseUn"] = "N";
                        }
                        setItems([...items]);
                      }}
                    />
                  )
                },
                { key: "Quantity", size: 12, label: "Quantity" },
                { key: "OnHand", size: 12, label: "Qty In Whs", type: "field" },
                { key: "PriceBefDi", size: 12, label: "Unit Price" },
                { key: "DiscPrcnt", size: 12, label: "Disc Prcnt" },
                {
                  key: "TaxCode",
                  size: 12,
                  label: "Tax Code",
                  component: (
                    <SAPDropdown
                      label="Tax Code"
                      field="Custom"
                      customQuery={{
                        Table: "OVTG",
                        Fields: ["Code", "Name"],
                        Condition: [
                          { field: "Category", cond: "=", value: "O" },
                          { cond: "AND" },
                          { field: "Inactive", cond: "=", value: "N" }
                        ]
                      }}
                      value={(item as any).item.TaxCode}
                      setValue={v => {
                        const idx = items.findIndex(
                          (x: any) => x.Key === item.pkval
                        );
                        items[idx]["TaxCode"] = v;
                        setItems([...items]);
                      }}
                    />
                  )
                }
              ]}
            />
            <View style={{ padding: 5, flexDirection: "row-reverse" }}>
              <Button
                onPress={() => {
                  const idx = items.findIndex((x: any) => x.Key === item.pkval);
                  items.splice(idx, 1);
                  setItems([...items]);
                  item.close();
                  Modal.dismiss("detail" + item.pkval);
                }}
              >
                <IconTrash width={20} height={20} color="red" />
              </Button>
            </View>
          </View>
        );
        Modal.show(modal, "detail" + item.pkval);
      }}
    />
  );
};
