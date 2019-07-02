import UIButton from "@app/libs/ui/UIButton";
import UIList from "@app/libs/ui/UIList";
import UIRow from "@app/libs/ui/UIRow";
import React, { useState } from "react";
import IconRemove from "@app/libs/ui/Icons/IconRemove";
import { View } from 'reactxp/dist/web/Animated';
import { MainStyle } from '@app/config';
import UIText from '@app/libs/ui/UIText';
import { Button } from 'reactxp';
import UISeparator from '@app/libs/ui/UISeparator';
import UIJsonField from '@app/libs/ui/UIJsonField';
import SAPDropdown from '@app/components/SAPDropdown';
import UISelectField from '@app/libs/ui/UISelectField';
import { APISearch } from '@app/api';
import global from '@app/global';

export default ({ data, items, setItems }: any) => {
  const [uoMEntry, setUoMEntry] = useState<any>({});
  const [sUoMEntry, setSUoMEntry] = useState<any>({});

  const getPrice = (idx: any, value: any) => {
    APISearch({
      CustomQuery: "UnitPriceSO",
      Condition: [{
        field: "CardCode",
        cond: "=",
        value: data.CardCode
      }, { cond: 'AND' }, {
        field: "ItemCode",
        cond: "=",
        value: value
      }]
    }).then((res: any) => {
      items[idx]["PriceBefDi"] = parseInt(res[0]["Price"]);
      setItems([...items]);
    });
  };

  const getUoM = (idx: any, value: any) => {
    APISearch({
      CustomQuery: `GetUom,${value}`,
    }).then((res: any) => {
      // group list uom entry berdasarkan item code karena uom entry setiap item code berbeda
      uoMEntry[value] = res.Lines.map((d: any) => {
        return { value: d.UomEntry, label: d.UomCode }
      });

      // jika uom group entry = -1 maka set uom entry = manual dan set base un = N
      // jika bukan mana set uom entry sesuai sales uom entry dan set base un = Y
      if (res.UgpEntry == -1) {
        items[idx].UseBaseUn = "N";
        items[idx]["UoMEntry"] = -1;
        items[idx]["UoMName"] = "Manual";
      } else {
        items[idx].UseBaseUn = "Y";
        items[idx]["UoMEntry"] = res.SUoMEntry;
        items[idx]["UoMName"] = res.SUoMCode;
      }

      setUoMEntry({ ...uoMEntry });
      setItems([...items]);
      // group list sales uom berdasarkan item code karena sales uom setiap item berbeda 
      sUoMEntry[value] = res.SUoMEntry;
      setSUoMEntry({ ...sUoMEntry });
    });
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
      }}
      items={items.map((item: any, index: any) => ({
        ...item,
        action: (
          <UIRow style={{ marginTop: 0 }}>
            <UIButton
              size="small"
              fill="clear"
              style={{
                marginTop: 0,
                marginBottom: 0,
                flexShrink: "none"
              }}
              onPress={() => {
                alert("remove!");
              }}
            >
              <IconRemove
                height={18}
                width={18}
                color="red"
                onPress={() => {
                  items.splice(index, 1);
                  setItems([...items]);
                }}
              />
            </UIButton>
          </UIRow>
        )
      }))}
      detailComponent={(item) => (
        <View
          style={{
            borderWidth: 0,
            borderLeftWidth: 1,
            borderColor: "#ececeb",
            backgroundColor: "#fff",
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
              <Button onPress={() => { setItems([...items]); item.close(); }}>
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
              setItems([...items]);
            }}
            style={{
              padding: 10
            }}
            field={[
              {
                key: 'ItemCode', size: 12, label: 'Item Code', component: (
                  <SAPDropdown label="Item Code" field="ItemCodeAll" itemField={{ value: "ItemCode", label: "ItemName" }}
                    value={(item as any).item.ItemCode} setValue={(v, l, r) => {
                      const idx = items.findIndex((x: any) => x.Key === item.pkval);
                      items[idx]['ItemCode'] = v;
                      items[idx]["Dscription"] = l;
                      items[idx]["U_IDU_PARTNUM"] = r.item.U_IDU_PARTNUM;
                      items[idx]["TaxCode"] = r.item.VatGourpSa;

                      setItems([...items]);
                      getPrice(idx, v);
                      getUoM(idx, v);
                    }} />)
              },
              // {
              //   key: 'UseBaseUn', size: 12, label: 'Inventory UoM', component: (
              //     <UISelectField
              //       label="Inventory UoM"
              //       items={[
              //         { label: "Yes", value: "Y" },
              //         { label: "No", value: "N" }
              //       ]}
              //       value={(item as any).item.UseBaseUn}
              //       setValue={v => {
              //         const idx = items.findIndex((x: any) => x.Key === item.pkval);
              //         items[idx]['UseBaseUn'] = v;
              //         setItems([...items]);
              //       }}
              //     />
              //   )
              // },
              { key: 'Quantity', size: 12, label: 'Quantity' },
              {
                key: 'WhsCode', size: 12, label: 'Warehouse', component: (
                  <SAPDropdown label="Warehouse" field="Custom" customQuery={{
                    Table: 'OWHS',
                    Fields: ["WhsCode", "WhsName"],
                    Condition: [{ field: 'U_BRANCH', cond: "=", value: global.getSession().user.branch }]
                  }} value={(item as any).item.WhsCode} setValue={(v) => {
                    const idx = items.findIndex((x: any) => x.Key === item.pkval);
                    items[idx]['WhsCode'] = v;
                    setItems([...items]);
                  }} />)
              },
              {
                key: 'UoMEntry', size: 12, label: 'Uom', component: () => {
                  // <SAPDropdown label="UoM" field="UomCode" value={(item as any).item.UoMEntry} setValue={(v, l) => {
                  //   const idx = items.findIndex((x: any) => x.Key === item.pkval);
                  //   items[idx]['UoMEntry'] = v;
                  //   items[idx]['UoMName'] = l;
                  //   setItems([...items]);
                  // }} />
                  return <UISelectField label="UoMCode" items={uoMEntry[(item as any).item.ItemCode]} value={(item as any).item.UoMEntry} setValue={(v, l) => {
                    const idx = items.findIndex((x: any) => x.Key === item.pkval);
                    items[idx]['UoMEntry'] = v;
                    items[idx]['UoMName'] = l;

                    // jika uom entry yang dipilih bukan merupakan default sales uom, maka set base un = N
                    let itemCode = (item as any).item.ItemCode;
                    if (v !== sUoMEntry[itemCode]) {
                      items[idx]['UseBaseUn'] = 'N';
                    } else {
                      items[idx]['UseBaseUn'] = 'Y';
                    }
                    setItems([...items]);
                  }} />
                }
              },
              { key: 'PriceBefDi', size: 12, label: 'Unit Price' },
              { key: 'DiscPrcnt', size: 12, label: 'Disc Prcnt' },
              {
                key: 'TaxCode', size: 12, label: 'Tax Code', component: (
                  <SAPDropdown label="Tax Code" field="Custom"
                    customQuery={{
                      Table: "OVTG",
                      Fields: ["Code", "Name"],
                      Condition: [{ field: "Category", cond: "=", value: "O" }, { cond: "AND" }, { field: "Inactive", cond: "=", value: "N" }]
                    }} value={(item as any).item.TaxCode}
                    setValue={(v: any) => {
                      const idx = items.findIndex((x: any) => x.Key === item.pkval);
                      items[idx]['TaxCode'] = v;
                      setItems([...items]);
                    }} />)
              },
            ]}
          />
        </View>
      )}
    />
  );
};
