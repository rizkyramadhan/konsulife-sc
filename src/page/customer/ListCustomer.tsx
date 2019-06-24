import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import IconAdd from "@app/libs/ui/Icons/IconAdd";
import { APISearch, APISearchProps } from '@app/api';
import UIRow from '@app/libs/ui/UIRow';
import IconRemove from '@app/libs/ui/Icons/IconRemove';

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

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let query: APISearchProps = {
      Table: "OCRD",
      Fields: [
        "CardName",
        "CardFName",
        "CardCode",
        "CardType",
        "GroupCode",
        "LicTradNum",
        "AddID",
        "SlpCode",
        "Phone1",
        "Phone2",
        "U_IDU_AREA",
        "U_IDU_BRANCH"
      ],
      Condition: [{
        field: "CardType",
        cond: "=",
        value: "C"
      },
      {
        cond: "OR"
      },
      {
        field: "CardType",
        cond: "=",
        value: "L"
      }
      ]
    };
    APISearch(query).then((res: any) => {
      setData(res);
    })
  }, []);

  return (
    <UIContainer>
      <UIHeader showSidebar={showSidebar} sidebar={sidebar} center={"Customer"}>
        <BtnCreate />
      </UIHeader>
      <UIBody>
        <UIList
          style={{ flex: 1 }}
          primaryKey="CardCode"
          selection="single"
          onSelect={(item) => { history.push('customer/form/' + item.CardCode) }}
          fields={{
            CardCode: {
              table: {
                header: 'BP Code'
              }
            },
            CardName: {
              table: {
                header: 'BP Name'
              }
            },
            CardFName: {
              table: {
                header: 'Foreign Name'
              }
            },
            CardType: {
              table: {
                header: 'BP Type'
              }
            },
            action: {
              table: {
                header: 'Action'
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
}));
