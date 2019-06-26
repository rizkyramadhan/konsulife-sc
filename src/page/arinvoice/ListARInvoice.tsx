import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UIRow from "@app/libs/ui/UIRow";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import IconRemove from "@app/libs/ui/Icons/IconRemove";
import { APISearch, APISearchProps, APISearchCache } from '@app/api';

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let query: APISearchProps = {
      Table: "ORDR",
      Condition: [{
        field: "DocStatus",
        cond: "=",
        value: "O"
      }]
    };

    APISearchCache(query.Table, query.Condition).then((cache: any) => {
      setData(cache);
      query.Cache = cache;
      APISearch(query).then((res: any) => {
        setData(res);
      })
    })
  }, []);

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center={"AR Invoice"}
      >
      </UIHeader>
      <UIBody>
        <UIList
          primaryKey="DocNum"
          style={{ backgroundColor: "#fff" }}
          selection="single"
          onSelect={(item) => { history.push('/ar-invoice/form/' + item.DocEntry) }}
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
            U_IDU_SO_INTNUM: {
              table: {
                header: 'SO No.'
              }
            },
            NumAtCard: {
              table: {
                header: 'PO Cust.'
              }
            },
            DocDate: {
              table: {
                header: 'Posting Date'
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
