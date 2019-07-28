import React from "react";
import { View, ScrollView } from "reactxp";
import { pasien } from "@app/storage/pasien";
import { observer } from "mobx-react-lite";
import UICard from "@app/libs/ui/UICard";
import UIText from "@app/libs/ui/UIText";

export default observer(() => {
  const packageList = pasien.package;
  const data = pasien.session;
  console.log(data);
  return (
    <View>
      <ScrollView>
        {packageList.map((item, key) => {
          return (
            <UICard key={key} mode="clean">
              <UIText>{item.title}</UIText>
            </UICard>
          );
        })}
      </ScrollView>
    </View>
  );
});
