import UIList, { DetailComponentProps } from "@app/libs/ui/UIList";
import React, { useState } from "react";
import { View, Button, Modal } from "reactxp";
import { MainStyle } from "@app/config";
import UIText from "@app/libs/ui/UIText";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UISeparator from "@app/libs/ui/UISeparator";
import UISelectField from "@app/libs/ui/UISelectField";
import SAPDropdown from "@app/components/SAPDropdown";
import { APISearch } from "@app/api";
import IconTrash from "@app/libs/ui/Icons/IconTrash";

export default ({ items, setItems, header }: any) => {
  const [uoMEntry, setUoMEntry] = useState<any>({});
  const [iUoMEntry, setIUoMEntry] = useState<any>({});

  const getStockInWhs = async (idx: any, itemCode: string, whsCode: string) => {
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
          value: whsCode
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
      items[idx]["UoMEntry"] = res.IUoMEntry;
      items[idx]["UoMName"] = res.IUoMCode;
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

  const DetailComponent = (item: DetailComponentProps) => {
    const setValue = (val: any, key: string) => {
      const idx = items.findIndex((x: any) => x.LineNum === item.item.LineNum);
      items[idx][key] = val;
      setItems(items);
    };

    let modal = (
      <View
        style={{
          borderWidth: 0,
          borderLeftWidth: 1,
          borderColor: "#ececeb",
          backgroundColor: "#fff",
          overflow: "visible",
          flexBasis: 350
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
          setValue={setValue}
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
                  customQuery={{
                    CustomQuery: "ItemCodeCanvas",
                    Condition: [
                      {
                        field: "T1.WhsCode",
                        cond: "=",
                        value: header.Filler
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
                  setValue={async (v, l) => {
                    const idx = items.findIndex(
                      (x: any) => x.LineNum === item.item.LineNum
                    );

                    items[idx]["ItemCode"] = v;
                    items[idx]["Dscription"] = l;

                    setItems([...items]);
                    await getUoM(idx, v);
                    await getStockInWhs(idx, v, header.Filler);
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
                      (x: any) => x.LineNum === item.pkval
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
            { key: "SerialNum", size: 12, label: "Serial Number" }
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
  };

  return (
    <UIList
      selection="detail"
      detailComponent={item => {
        DetailComponent(item);
      }}
      primaryKey="LineNum"
      items={items}
      fields={{
        ItemCode: {
          table: {
            header: "Code"
          }
        },
        Dscription: {
          table: {
            header: "Item Name"
          }
        },
        UseBaseUn: {
          table: {
            header: "Inventory UoM"
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
        SerialNum: {
          table: {
            header: "Serial Number"
          }
        },
        WhsCode: {
          table: {
            header: "Warehouse"
          }
        }
      }}
    />
  );
};
