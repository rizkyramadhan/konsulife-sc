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
import { APISearchProps, APISearch } from '@app/api';

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


export default withRouter(observer(({ history, showSidebar, sidebar }: any) =>{
  const [data, setData] = useState([]);
  useEffect(() => {
    let query: APISearchProps = {
      Table: "ODRF",
      Fields: ["DocNum","U_IDU_SO_INTNUM", "CardName", "CardCode", "DocDate", "DocDueDate"],
      Condition:[{
          field:"DocStatus",
          cond:"=",
          value:"O"
      },{cond:"AND"},{field:"ObjType",cond:"=",value:17}]
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
        center={"SO Taking Order"}
      >
        <BtnCreate />
      </UIHeader>
      <UIBody>
        <UIList
           style={{ flex: 1 }}
           primaryKey="DocNum"
           selection="single"
           onSelect={() => { history.push('/so/form') }}
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
              table: {
                header: 'Due Date'
              }
            }
          }}
           items={data}
        />
      </UIBody>
    </UIContainer>
  );
}));
