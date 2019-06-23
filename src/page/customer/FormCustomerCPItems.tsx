import UIButton from "@app/libs/ui/UIButton";
import UIList from "@app/libs/ui/UIList";
import React from "react";
import { View, Button } from 'reactxp/dist/web/ReactXP';
import IconAdd from '@app/libs/ui/Icons/IconAdd';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';
import { MainStyle } from '@app/config';
import UISeparator from '@app/libs/ui/UISeparator';
import UIJsonField from '@app/libs/ui/UIJsonField';

export default ({ items, setItems }: any) => {
  return (
    <View>
      <View style={{
        flexDirection: "row-reverse"
      }}>
        <UIButton
          style={{
            margin: 0,
            marginBottom: 8
          }}
          color="success"
          size="small"
          onPress={() => {
            setItems([...items, {
              Id: items.length + 1,
              Name: "",
              FirstName: "",
              MiddleName: "",
              LastName: "",
              Tel1: "",
              Tel2: "",
              Cellolar: ""
            }])
          }}
        >
          <IconAdd color="#fff" height={18} width={18} style={{
            marginTop: -9
          }} />
          {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }} size="small">
              {" Add"}
            </UIText>
          )}
        </UIButton>
      </View>

      <UIList
        style={{ flex: 1 }}
        primaryKey="Id"
        items={items}
        selection="detail"
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
                <Button onPress={item.close}>
                  <UIText size="large">&times;</UIText>
                </Button>
              </View>
            </View>
            <UISeparator style={{ marginTop: 0, marginBottom: 0 }} />
            <UIJsonField
              items={item.item}
              setValue={(val: any, key: string) => {
                const idx = items.findIndex((x: any) => x.Id === item.item.Id);
                items[idx][key] = val;
                setItems(items);
              }}
              style={{
                padding: 10
              }}
              field={[
                { key: 'Id', size: 12, type: 'field' },
                { key: 'Name', size: 12 },
                { key: 'FirstName', size: 12 },
                { key: 'MiddleName', size: 12 },
                { key: 'LastName', size: 12 },
                { key: 'Tel1', size: 12 },
                { key: 'Tel2', size: 12 },
                { key: 'Cellolar', size: 12 },
              ]}
            />
          </View>
        )}
      />
    </View>
  );
};
