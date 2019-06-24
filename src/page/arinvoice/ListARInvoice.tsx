import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UIRow from "@app/libs/ui/UIRow";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import IconRemove from "@app/libs/ui/Icons/IconRemove";
import IconAdd from "@app/libs/ui/Icons/IconAdd";
import { APISearch, APISearchProps } from '@app/api';

const BtnCreate = withRouter(({ history }: any) => {
  return (
    <UIButton
      size="small"
      color="primary"
      onPress={() => {
        history.push("/ar-invoice/form");
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

export default observer(({ showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let query: APISearchProps = {
      Table: "OINV"
    };
    APISearch(query).then((res: any) => {
      setData(res);
    })
  }, []);

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center={"AR Invoice"}
      >
        <BtnCreate />
      </UIHeader>
      <UIBody>
        <UIList
          primaryKey="DocEntry"
          style={{ backgroundColor: "#fff" }}
          fields={{
            CardName: {
              table: {
                header: 'Customer/Vendor'
              }
            },
            CardCode: {
              table: {
                header: 'Code'
              }
            },
            U_IDU_SI_INTNUM: {
              table: {
                header: 'Sales Invoice No.'
              }
            },
            U_IDU_DO_INTNUM: {
              table: {
                header: 'Delivery No.'
              }
            },
            DocDate: {
              table: {
                header: 'Posting Date'
              }
            },
            action: {
              table: {
                header: 'Action',
              }
            }
          }}
          items={data.map((item: any) => ({
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
