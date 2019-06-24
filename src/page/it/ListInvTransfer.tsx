import { APISearch, APISearchProps } from '@app/api';
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import UIRow from '@app/libs/ui/UIRow';
import UIButton from '@app/libs/ui/UIButton';
import IconRemove from '@app/libs/ui/Icons/IconRemove';

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let query: APISearchProps = {
      Table: "OWTQ",
      Fields: ["DocNum", "CardName", "CardCode", "U_IDU_ITR_INTNUM", "DocDate"],
      Condition: [
        {
          field: "DocStatus",
          cond: "=",
          value: "O"
        }
      ]
    };
    APISearch(query).then((res: any) => {
      setData(res);
    })
  }, []);

  return (
    <UIContainer>
      <UIHeader showSidebar={showSidebar} sidebar={sidebar} center={"Inventory Transfer"}>
      </UIHeader>
      <UIBody>
        <UIList
          style={{ flex: 1 }}
          primaryKey="DocNum"
          selection="single"
          onSelect={(item) => { history.push('/it/form/' + item.DocNum) }}
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
            U_IDU_ITR_INTNUM: {
              table: {
                header: 'Request No.'
              }
            },
            DocDate: {
              table: {
                header: 'Posting Date'
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
