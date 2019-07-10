import { MainStyle } from '@app/config';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UIList from "@app/libs/ui/UIList";
import UISeparator from '@app/libs/ui/UISeparator';
import UIText from '@app/libs/ui/UIText';
import React from "react";
import { Button, View, Modal } from 'reactxp/dist/web/ReactXP';
import UIButton from '@app/libs/ui/UIButton';
import IconRemove from '@app/libs/ui/Icons/IconRemove';
import UIRow from '@app/libs/ui/UIRow';

export default ({ items, setItems }: any) => {
  return (
    <View>
      <UIList
        style={{ flex: 1 }}
        primaryKey="Key"
        items={items}
        selection="detail"
        fields={{
          Name: {
            table: {
              header: 'Name'
            }
          },
          Tel1: {
            table: {
              header: 'Telpon'
            }
          },
          Cellolar: {
            table: {
              header: 'Cellolar'
            }
          }
        }}
        detailComponent={(item) => 
          {
            let modal = <View
            style={{
              borderWidth: 0,
              borderLeftWidth: 1,
              borderColor: "#ececeb",
              backgroundColor: "#fff",
              flexBasis: 350,
              overflow:"visible"
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
                <Button onPress={() =>{
                  Modal.dismiss("detail_cp" + item.pkval);
                  item.close();
                }}>
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
                { key: 'Name', size: 12, label: "Name" },
                { key: 'FirstName', size: 12, label: "First Name" },
                { key: 'MiddleName', size: 12, label: "Middle Name" },
                { key: 'LastName', size: 12, label: "Last Name" },
                { key: 'Tel1', size: 12, label: "Phone 1" },
                { key: 'Tel2', size: 12, label: "Phone 2" },
                { key: 'Cellolar', size: 12, label: "Mobile" },
              ]}
            />

            <UIRow style={{
              paddingLeft: 10
            }}>
              <UIButton
                style={{
                  flexShrink: 'none'
                }}
                color="error"
                size="small"
                onPress={() => {
                  const idx = items.findIndex((x: any) => x.Key === item.pkval);
                  items.splice(idx, 1);
                  setItems([...items]);
                  Modal.dismiss("detail_cp" + item.pkval);
                  item.close();
                }}
              >
                <IconRemove color="#fff" height={18} width={18} />
              </UIButton>
            </UIRow>
          </View>;

          Modal.show(modal, "detail_cp" + item.pkval);

        }}
      />
    </View>
  );
};
