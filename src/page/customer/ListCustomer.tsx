import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UIRow from "@app/libs/ui/UIRow";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React from "react";
import { withRouter } from "react-router";
import IconRemove from "@app/libs/ui/Icons/IconRemove";
import IconAdd from "@app/libs/ui/Icons/IconAdd";

const BtnCreate = withRouter(({ history }: any) => {
  return (
    <UIButton
      size="small"
      color="primary"
      onPress={() => {
        history.push("/customer/form");
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
      }}
    >
      <IconAdd color="#fff" />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff" }}>Create</UIText>
      )}
    </UIButton>
  );
});

const sample = [
    {
        CardCode: "JYP00003",
        CardName: "AMAN SALIM",
        CardFName: "AMAN SALIM - JAYAPURA",
        CardType: "CUSTOMER",
        LicTradNum: "07.754.763.6-952.000"
    },
    {
        CardCode: "TIM0002",
        CardName: "BOLEH SAJA",
        CardFName: "BOLEH SAJA - PT FREEPOT INDONESIA",
        CardType: "CUSTOMER",
        LicTradNum: "07.754.763.6-952.000"
    },
    {
        CardCode: "TIM0002",
        CardName: "BOLEH SAJA",
        CardFName: "BOLEH SAJA - PT FREEPOT INDONESIA",
        CardType: "CUSTOMER",
        LicTradNum: "07.754.763.6-952.000"
    },
    {
        CardCode: "TIM0002",
        CardName: "BOLEH SAJA",
        CardFName: "BOLEH SAJA - PT FREEPOT INDONESIA",
        CardType: "CUSTOMER",
        LicTradNum: "07.754.763.6-952.000"
    }
];

export default observer(({ showSidebar, sidebar }: any) => {
  const data = sample;

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center={"Customer"}
      >
        <BtnCreate />
      </UIHeader>
      <UIBody>
        <UIList
          style={{ backgroundColor: "#fff" }}
          itemHeight={80}
          items={data.map(item => ({
            ...item,
            action: (
              <UIRow style={{ marginTop: -10 }}>
                <UIButton
                  size="small"
                  fill="clear"
                  style={{
                    marginTop: 0,
                    marginBottom: 0
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
                      alert("remove!");
                    }}
                  />
                </UIButton>
              </UIRow>
            )
          }))}
        />
      </UIBody>
    </UIContainer>
  );
});
