import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import { observer } from "mobx-react-lite";
import React from "react";
import { withRouter } from "react-router";
import UIButton from "@app/libs/ui/UIButton";
import { Platform } from "reactxp";
import UICard, { UICardHeader, UICardBody } from "@app/libs/ui/UICard";
import UIText from "@app/libs/ui/UIText";
import UISeparator from "@app/libs/ui/UISeparator";
import UIJsonTable from "@app/libs/ui/UIJsonTable";
import UIRow from "@app/libs/ui/UIRow";

const BtnCreate = withRouter(({ history, setSide }: any) => {
  return (
    <UIButton
      color="primary"
      size="small"
      onPress={() => {
        history.replace("/so-canvas/form");
        if (Platform.getType() !== "web") {
          setSide(false);
        }
      }}
      style={{
        height: 40,
        marginRight: 28,
        paddingLeft: 20,
        paddingRight: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
      }}
    >
      Create
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
        <UICard>
          <UICardHeader>
            <UIText
              style={{
                flexShrink: "none",
                width: "100%"
              }}
            >
              List Sales Order
            </UIText>
          </UICardHeader>
          <UISeparator />
          <UICardBody>
            <UIJsonTable
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
              colWidth={[
                {
                  index: 5,
                  width: 70
                }
              ]}
            />
          </UICardBody>
        </UICard>
      </UIBody>
    </UIContainer>
  );
});
