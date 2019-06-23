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
import UIList from "@app/libs/ui/UIList";
import IconAdd from "@app/libs/ui/Icons/IconAdd";
import IconInvoice from "@app/libs/ui/Icons/IconInvoice";

const BtnCreate = withRouter(({ history }: any) => {
  return (
    <UIButton
      size="small"
      color="primary"
      onPress={() => {
        history.push("/do/form");
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
    CardCode: "TIM0001",
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
          primaryKey="CardCode"
          items={data.map(item => ({
            ...item,
            GrandTotal: item.GrandTotal.toLocaleString(),
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
                    alert("view!");
                  }}
                >
                  <IconInvoice height={18} width={18} color="blue" />
                </UIButton>
              </UIRow>
            )
          }))}
        />
      </UIBody>
    </UIContainer>
  );
});
