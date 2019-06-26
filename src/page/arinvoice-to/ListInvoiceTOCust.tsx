import { APISearch, APISearchProps } from "@app/api";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import global from '@app/global';

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
  console.log(global.session);
  const [data, setData] = useState([]);
  useEffect(() => {
    let query: APISearchProps = {
        Table: "OCRD",
        Fields: [],
        Condition: [
            {
                field: "CardType",
                cond: "=",
                value: "C"
            }
        ],
      Limit:20,
      Page:1
    };

    APISearch(query).then((res: any) => {
      setData(res);
    });
  }, []);
  
  return (
    <UIContainer>
      <UIHeader showSidebar={showSidebar} sidebar={sidebar} center={"AR Invoice (Taking Order)"}>
      </UIHeader>
      <UIBody>
        <UIList
          style={{ flex: 1 }}
          primaryKey="CardCode"
          selection="single"
          onSelect={(item) => {
            history.push("/ar-invoice-to/list/" + btoa(item.CardCode+"|"+item.CardName));
          }}
          fields={{
            CardCode: {
                table: {
                    header: "Code"
                }
            },
            CardName: {
              table: {
                header: "Customer"
              }
            }
          }}
          items={data.map((item: any) => ({
            ...item
          }))}
        />
      </UIBody>
    </UIContainer>
  );
}));