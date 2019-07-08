import UIList, { DetailComponentProps } from "@app/libs/ui/UIList";
import React from "react";
import { MainStyle } from "@app/config";
import UIText from "@app/libs/ui/UIText";
import UISeparator from "@app/libs/ui/UISeparator";
import UIJsonField from "@app/libs/ui/UIJsonField";
import { View, Button, Modal } from "reactxp";
import SAPDropdown from "@app/components/SAPDropdown";
import global from "@app/global";
import IconTrash from "@app/libs/ui/Icons/IconTrash";

export default ({ items, setItems, flag, setSelected }: any) => {
  const DetailComponent = (item: DetailComponentProps) => {
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
          setValue={(val: any, key: any) => {
            const idx = items.findIndex((x: any) => x.Key === item.pkval);
            items[idx][key] = parseInt(val);
            setItems([...items]);
          }}
          style={{
            padding: 10
          }}
          field={[
            {
              key: "WhsCode",
              size: 12,
              label: "Warehouse",
              component: (
                <SAPDropdown
                  label="Warehouse"
                  field="WarehouseCodeBranch"
                  where={[
                    {
                      field: "U_BRANCH",
                      value: global.getSession().user.branch
                    }
                  ]}
                  value={(item as any).item.WhsCode}
                  setValue={v => {
                    const idx = items.findIndex(
                      (x: any) => x.Key === item.pkval
                    );
                    items[idx]["WhsCode"] = v;
                    setItems([...items]);
                  }}
                />
              )
            },
            {
              key: "Quantity",
              size: 12,
              label: "Quantity",
              type: "number"
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
  };

  return (
    <UIList
      primaryKey="Key"
      selection={!flag ? "multi" : "detail"}
      onSelect={(_, key) => {
        let selectArr: any[] = [];
        key.forEach((val: any) => {
          let idx = items.findIndex((x: any) => x.Key === val);
          if (idx >= 0) {
            selectArr.push(items[idx]);
          }
        });
        setSelected([...selectArr]);
      }}
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
        U_IDU_PARTNUM: {
          table: {
            header: "Part Number"
          }
        },
        WhsCode: {
          table: {
            header: "Warehouse"
          }
        },
        UomCode: {
          table: {
            header: "UoM Code"
          }
        },
        Quantity: {
          table: {
            header: "Quantity"
          }
        }
      }}
      items={items}
      detailComponent={item => {
        DetailComponent(item);
      }}
    />
  );
};
