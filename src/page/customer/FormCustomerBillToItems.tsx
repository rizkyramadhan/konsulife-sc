import SAPDropdown from "@app/components/SAPDropdown";
import { MainStyle } from "@app/config";
import IconTrash from "@app/libs/ui/Icons/IconTrash";
import UIButton from "@app/libs/ui/UIButton";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UIList from "@app/libs/ui/UIList";
import UIRow from "@app/libs/ui/UIRow";
import UISeparator from "@app/libs/ui/UISeparator";
import UIText from "@app/libs/ui/UIText";
import React from "react";
import { Button, View } from "reactxp/dist/web/ReactXP";

export default ({ items, setItems }: any) => {
  return (
    <View>
      <UIList
        style={{ flex: 1 }}
        primaryKey="Key"
        items={items}
        selection="detail"
        fields={{
          Address: {
            table: {
              header: "Address"
            }
          },
          Street: {
            table: {
              header: "Street"
            }
          },
          ZipCode: {
            table: {
              header: "ZIP Code"
            }
          },
          City: {
            table: {
              header: "City"
            }
          },
          StateName: {
            table: {
              header: "State"
            }
          }
        }}
        detailComponent={item => {
          const setValue = (val: any, key: string) => {
            const idx = items.findIndex((x: any) => x.Key === item.pkval);
            items[idx][key] = val;
            setItems([...items]);
          };
          return (
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
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Button
                    onPress={() => item.close()}
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
                  { key: "Address", size: 12, label: "Address" },
                  { key: "Street", size: 12, label: "Street" },
                  { key: "ZipCode", size: 12, label: "ZIP Code" },
                  { key: "City", size: 12, label: "City" },
                  {
                    key: "State",
                    size: 12,
                    component: (
                      <SAPDropdown
                        label="State"
                        field="State"
                        value={item.item.State}
                        setValue={(v: any, l: any) => {
                          const idx = items.findIndex((x: any) => x.Key === item.pkval);
                          items[idx].State = v;
                          items[idx].StateName = l;
                          setItems([...items]);
                        }}
                      />
                    )
                  }
                ]}
              />
              <UIRow style={{
                paddingLeft: 10
              }}>
                <UIButton
                  style={{
                    flexShrink: "none"
                  }}
                  color="error"
                  size="small"
                  onPress={() => {
                    const idx = items.findIndex(
                      (x: any) => x.Key === item.pkval
                    );
                    items.splice(idx, 1);
                    setItems([...items]);
                    item.close();
                  }}
                >
                  <IconTrash color="#fff" height={18} width={18} />
                </UIButton>
              </UIRow>
            </View>
          );
        }}
      />
    </View>
  );
};
