import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIRow from "@app/libs/ui/UIRow";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React from "react";
import { withRouter } from "react-router";
import { Image } from "reactxp";
import UIList from "@app/libs/ui/UIList";

const BtnCreate = withRouter(({ history }: any) => {
  return (
    <UIButton
      fill="clear"
      color="primary"
      size="small"
      onPress={() => {
        history.push("/do/form");
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
      }}
    >
      <Image
        style={{ width: 22, height: 22 }}
        source={require("@icon/add.png")}
      />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#613eea" }}>Create</UIText>
      )}
    </UIButton>
  );
});

const sample = [
  {
    CardCode: "TIM0002",
    CardName: "PT FREEPOT INDONESIA",
    DocDate: "12.08.19",
    DocDueDate: "12.08.19",
    DocStatus: "Open",
    U_IDU_SO_INTNUM: "SO/TIM-0002/19/VI/0001",
    Sales: "Dwi",
    GrandTotal: 1000000
  },
  {
    CardCode: "TIM0002",
    CardName: "PT FREEPOT INDONESIA",
    DocDate: "12.08.19",
    DocDueDate: "12.08.19",
    DocStatus: "Open",
    U_IDU_SO_INTNUM: "SO/TIM-0002/19/VI/0001",
    Sales: "Dwi",
    GrandTotal: 1000000
  }
];

export default observer(({ showSidebar, sidebar }: any) => {
  const data = sample;

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center={"Delivery Order"}
      >
        <BtnCreate />
      </UIHeader>
      <UIBody>
        <UIList
          items={data.map(item => ({
            ...item,
            GrandTotal: item.GrandTotal.toLocaleString(),
            action: (
              <UIRow>
                <UIButton
                  size="small"
                  color="#40c4ff"
                  style={{
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingLeft: 5,
                    paddingRight: 5,
                    marginTop: 0,
                    marginBottom: 2,
                    fontColor: "#000"
                  }}
                >
                  View
                </UIButton>
              </UIRow>
            )
          }))}
        />
      </UIBody>
    </UIContainer>
  );
});