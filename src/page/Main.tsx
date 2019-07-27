import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import { observer, useObservable } from "mobx-react-lite";
import React from "react";
import { View } from "reactxp";
import Schedule from "./pasien/Schedule";
import Home from "./psikolog/Home";

export default observer((_: any) => {
  const data = useObservable({
    mode: ""
  });
  if (!data.mode) {
    return (
      <UIContainer>
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <UIButton
            onPress={() => {
              data.mode = "pasien";
            }}
            style={{ display: "flex", height: "auto", width: 200 }}
          >
            Pasien
          </UIButton>
          <UIButton
            onPress={() => {
              data.mode = "psikolog";
            }}
            style={{ display: "flex", height: "auto", width: 200 }}
          >
            Psikolog
          </UIButton>
        </View>
      </UIContainer>
    );
  }

  if (data.mode === "psikolog") return <Home />;
  return <Schedule />;
});
