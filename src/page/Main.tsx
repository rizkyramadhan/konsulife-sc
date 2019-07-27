import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { View, Storage } from "reactxp";
import Schedule from "./pasien/Schedule";
import Home from "./psikolog/Home";

export default observer((_: any) => {
  const data = useObservable({
    mode: "" as any,
    loading: true
  });

  useEffect(() => {
    const fetch = async () => {
      data.mode = await Storage.getItem("mode");
      data.loading = false;
    };
    fetch();
  }, []);

  if (data.loading) {
    return <View />;
  }

  if (!data.mode) {
    return (
      <UIContainer>
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <UIButton
            onPress={() => {
              data.mode = "pasien";
              Storage.setItem("mode", "psikolog");
            }}
            style={{ display: "flex", height: "auto", width: 200 }}
          >
            Pasien
          </UIButton>
          <UIButton
            onPress={() => {
              data.mode = "psikolog";
              Storage.setItem("mode", "psikolog");
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
