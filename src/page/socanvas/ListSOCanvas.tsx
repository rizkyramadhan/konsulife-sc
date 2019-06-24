import IconAdd from "@app/libs/ui/Icons/IconAdd";
import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
<<<<<<< Updated upstream
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { APISearch, APISearchProps } from '@app/api';
=======
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { APISearchProps, APISearch } from '@app/api';
>>>>>>> Stashed changes

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
        <UIText style={{ color: "#fff" }}>Create</UIText>
      )}
    </UIButton>
  );
});

<<<<<<< Updated upstream
export default withRouter(observer(({ showSidebar, sidebar }: any) =>{
=======
export default observer(({ showSidebar, sidebar }: any) => {
>>>>>>> Stashed changes
  const [data, setData] = useState([]);
  useEffect(() => {
    let query: APISearchProps = {
      Table: "ORDR",
<<<<<<< Updated upstream
      Fields: ["DocNum","U_IDU_SO_INTNUM", "CardName", "CardCode", "DocDate", "DocDueDate"],
      Condition:[{
          field:"DocStatus",
          cond:"=",
          value:"O"
      }]
=======
      Condition: [
        {
          field: "DocStatus",
          cond: "=",
          value: "O"
        }
      ]
>>>>>>> Stashed changes
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
        center={"SO Canvasing"}
      >
        <BtnCreate />
      </UIHeader>
      <UIBody>
        <UIList
           style={{ flex: 1 }}
           primaryKey="DocNum"
           selection="detail"
           fields={{
            U_IDU_SO_INTNUM:{
              table:{
                header: "No. SO"
              }
            },
            CardName: {
              table: {
                header: 'Customer'
              }
            },
            CardCode: {
              table: {
                header: 'Code'
              }
            },
            DocDate: {
              table: {
                header: 'Posting Date'
              }
            },
            DocDueDate: {
<<<<<<< Updated upstream
              table: {
                header: 'Due Date'
              }
            }
          }}
           items={data}
=======
              table: { header: "Tgl Due Date " }
            },
            DocStatus: {
              table: { header: "Status " }
            }
          }}
          primaryKey="DocNum"
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
>>>>>>> Stashed changes
        />
      </UIBody>
    </UIContainer>
  );
}));
