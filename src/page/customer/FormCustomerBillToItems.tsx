import { MainStyle } from '@app/config';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UIList from "@app/libs/ui/UIList";
import UISeparator from '@app/libs/ui/UISeparator';
import UIText from '@app/libs/ui/UIText';
import React from "react";
import { Button, View } from 'reactxp/dist/web/ReactXP';

export default ({ items, setItems }: any) => {
  return (
    <View>
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
              except={['Id', 'AdresType', 'IsDefault']}
              field={[
                { key: 'Address', size: 12 },
                { key: 'Street', size: 12 },
                { key: 'ZipCode', size: 12 },
                { key: 'City', size: 12 },
                { key: 'State', size: 12 }
              ]}
            />
          </View>
        )}
      />
    </View>
  );
};
