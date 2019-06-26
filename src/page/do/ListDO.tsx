import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { APISearch, APISearchProps } from '@app/api';

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let query: APISearchProps = {
      Table: "OCRD",
      // Fields: ['CardCode', 'CardName'],
      Condition: [
        {
          field: "CardType",
          cond: "=",
          value: "C"
        }
        // {
        //   cond: "AND"
        // },
        // {
        //   field: "U_IDU_BRANCH",
        //   cond: "=",
        //   value: ""
        // }
      ]
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
        center={"Delivery Order"}
      >
      </UIHeader>
      <UIBody scroll={true}>
        <UIList
          primaryKey="CardCode"
          style={{ backgroundColor: "#fff" }}
          selection="single"
          onSelect={(item) => { history.push(`/do/copySO/${btoa(item.CardCode)}/${btoa(item.CardName)}`) }}
          fields={{
            CardCode: {
              table: {
                header: 'Customer Code'
              }
            },
            CardName: {
              table: {
                header: 'Customer Name'
              }
            }
          }}
          items={data}
        />
      </UIBody>
    </UIContainer>
  );
}));
