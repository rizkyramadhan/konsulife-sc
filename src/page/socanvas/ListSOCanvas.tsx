import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonTable from "@app/libs/ui/UIJsonTable";
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
        history.push("/so-canvas/form");
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
      }}
    >
      <IconAdd color="#fff" />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff" }} size="small">
          Create
        </UIText>
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
        center={"SO Canvasing"}
      >
        <BtnCreate />
      </UIHeader>
      <UIBody>
        <UIJsonTable
          style={{ backgroundColor: "#fff" }}
          headers={[
            {
              key: "U_IDU_SO_INTNUM",
              label: "SO Number"
            },
            {
              key: "CardCode",
              label: "Cust Number"
            },
            {
              key: "CardName",
              label: "Cust Name"
            },
            {
              key: "DocDate",
              label: "Posting Date"
            },
            {
              key: "GrandTotal",
              label: "Grand Total"
            },
            {
              key: "action",
              label: ""
            }
          ]}
          data={data.map(item => ({
            ...item,
            GrandTotal: item.GrandTotal.toLocaleString(),
            action: (
              <UIRow style={{ marginTop: -10 }}>
                <UIButton
                  size="small"
                  fill="clear"
                  style={{
                    // paddingTop: 2,
                    // paddingBottom: 2,
                    // paddingLeft: 5,
                    // paddingRight: 5,
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
          colWidth={[
            {
              index: 5,
              width: 70
            }
          ]}
        />
      </UIBody>
    </UIContainer>
  );
});
