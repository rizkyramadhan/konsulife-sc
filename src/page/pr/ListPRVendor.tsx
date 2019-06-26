import { APISearch, APISearchProps } from "@app/api";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let query: APISearchProps = {
        Table: "OCRD",
        Fields: [],
        Condition: [
            {
                field: "CardType",
                cond: "=",
                value: "S"
            },
            {
                cond:"AND"
            },
            {
                field: "CardCode",
                cond: "=",
                value: "S00050"
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
      <UIHeader showSidebar={showSidebar} sidebar={sidebar} center={"Purchase Receipt"}>
      </UIHeader>
      <UIBody>
        <UIList
          style={{ flex: 1 }}
          primaryKey="CardCode"
          selection="single"
          onSelect={(item) => {
            history.push("/pr/list/" + btoa(item.CardCode+"|"+item.CardName));
          }}
          fields={{
            CardCode: {
                table: {
                    header: "Code"
                }
            },
            CardName: {
              table: {
                header: "Vendor"
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