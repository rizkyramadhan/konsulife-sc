import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { View, Storage } from "reactxp";
import Schedule from "./pasien/Schedule";
import Home from "./psikolog/Home";
import { Router, withRouter } from "@app/libs/router/Routing";
import SwitchRoute from "@app/libs/router/SwitchRoute";
import Package from "./pasien/Package";

const Dashboard = withRouter(({ history }: any) => {
  return (
    <UIContainer>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1
        }}
      >
        <UIButton
          onPress={() => {
            // data.mode = "pasien";
            // Storage.setItem("mode", "psikolog");
            history.replace("pasien");
          }}
          style={{ display: "flex", height: "auto", width: 200 }}
        >
          Pasien
        </UIButton>
        <UIButton
          onPress={() => {
            // data.mode = "psikolog";
            // Storage.setItem("mode", "psikolog");
            history.replace("psikolog");
          }}
          style={{ display: "flex", height: "auto", width: 200 }}
        >
          Psikolog
        </UIButton>
      </View>
    </UIContainer>
  );
});

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

  return (
    <Router>
      <SwitchRoute
        routes={{
          "/": <Dashboard />,
          "/psikolog": <Home />,
          "/pasien": <Schedule />,
          "/pasien/package": <Package />
        }}
      />
    </Router>
  );
});
