import UIButton from "@app/libs/ui/UIButton";
import UIList from "@app/libs/ui/UIList";
import UIRow from "@app/libs/ui/UIRow";
import React from "react";
import IconRemove from "@app/libs/ui/Icons/IconRemove";
import { View } from 'reactxp/dist/web/Animated';
import { MainStyle } from '@app/config';
import UIText from '@app/libs/ui/UIText';
import { Button } from 'reactxp';
import UISeparator from '@app/libs/ui/UISeparator';
import UIJsonField from '@app/libs/ui/UIJsonField';
import SAPDropdown from '@app/components/SAPDropdown';
import UISelectField from '@app/libs/ui/UISelectField';

export default ({ items, setItems }: any) => {
  return (
    <UIList
      primaryKey="LineNum"
      selection="detail"
      fields={{
        ItemCode:{
          table:{
            header:"Item Code"
          }
        },
        Dscription:{
          table:{
            header: "Item Name"
          }
        },
        UseBaseUn:{
          table:{
            header: "Inventory UoM"
          }
        },
        Quantity:{
          table:{
            header: "Quantity"
          }
        },
        WhsCode:{
          table:{
            header: "Warehouse"
          }
        },
        OcrCode:{
          table:{
            header: "Area"
          }
        },
        OcrCode2:{
          table:{
            header: "Branch"
          }
        },
        PriceBefDi:{
          table:{
            header: "Unit Price"
          }
        },
        DiscPrcnt:{
          table:{
            header: "Discount(%)"
          }
        },
        TaxCode:{
          table:{
            header: "Tax Code"
          }
        },
      }}
      items={items.map((item: any, index: any) => ({
        ...item,
        action: (
          <UIRow style={{ marginTop: -10 }}>
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
              <Button onPress={() => { setItems([...items]);item.close(); }}>
                <UIText size="large">&times;</UIText>
              </Button>
            </View>
          </View>
          <UISeparator style={{ marginTop: 0, marginBottom: 0 }} />
          <UIJsonField
            items={item.item}
            setValue={(val: any, key: string) => {
              const idx = items.findIndex((x: any) => x.LineNum === item.item.LineNum);
              items[idx][key] = val;
              setItems(items);
            }}
            style={{
              padding: 10
            }}
            field={[
              {
                key: 'ItemCode', size: 12, label: 'Item Code', component: (
                  <SAPDropdown label="Item Code" field="ItemCodeAll" value={(item as any).item.ItemCode} setValue={(v,l) => {
                    const idx = items.findIndex((x: any) => x.LineNum === item.item.LineNum);
                    items[idx]['ItemCode'] = v;
                    items[idx]["Dscription"] = l;
                    setItems([...items]);
                  }} />)
              },
              { key: 'UseBaseUn', size: 12, label: 'Inventory UoM', component: (
                <UISelectField
                  label="Inventory UoM"
                  items={[
                    { label: "Yes", value: "Y" },
                    { label: "No", value: "N" }
                  ]}
                  value={(item as any).UseBaseUn}
                  setValue={v => {
                    const idx = items.findIndex((x: any) => x.LineNum === item.item.LineNum);
                    items[idx]['UseBaseUn'] = v;
                    setItems([...items]);
                  }}
                />
              )},
              { key: 'Quantity', size: 12, label: 'Quantity' },
              {
                key: 'WhsCode', size: 12, label: 'Warehouse', component: (
                  <SAPDropdown label="Warehouse" field="Custom" customQuery={{
                    Table: 'OWHS',
                    Fields: ["WhsCode", "WhsName"]
                  }} value={(item as any).WhsCode} setValue={(v) => {
                    const idx = items.findIndex((x: any) => x.LineNum === item.item.LineNum);
                    items[idx]['WhsCode'] = v;
                    setItems(items);
                  }} />)
              },
              { key: 'OcrCode', size: 12, label: 'Area', component: (
                <SAPDropdown label="Dist Rule" field="OcrCode" value={(item as any).item.OcrCode} setValue={(v) => {
                  const idx = items.findIndex((x: any) => x.LineNum === item.item.LineNum);
                  items[idx]['OcrCode'] = v;
                  setItems([...items]);
                }} />) },

              { key: 'OcrCode2', size: 12, label: 'Branch', component: (
                <SAPDropdown label="Dist Rule" field="OcrCode2" value={(item as any).item.OcrCode2} setValue={(v) => {
                  const idx = items.findIndex((x: any) => x.LineNum === item.item.LineNum);
                  items[idx]['OcrCode2'] = v;
                  setItems([...items]);
                }} />) },
              { key: 'PriceBefDi', size: 12, label: 'Unit Price' },
              { key: 'DiscPrcnt', size: 12, label: 'Disc Prcnt' },
              {
                key: 'TaxCode', size: 12, label: 'Tax Code', component: (
                  <SAPDropdown label="Tax Code" field="Custom" customQuery={{
                    Table: "OVTG",
                    Fields: ["Code", "Name"],
                  }} value={(item as any).TaxCode} setValue={(v) => {
                    const idx = items.findIndex((x: any) => x.LineNum === item.item.LineNum);
                    items[idx]['TaxCode'] = v;
                    setItems(items);
                  }} />)
              },
            ]}
          />
        </View>
      )}
    />
  );
};
