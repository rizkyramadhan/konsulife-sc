import { APISearch, APISearchProps } from '@app/api';
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import UIRow from '@app/libs/ui/UIRow';
import IconRemove from '@app/libs/ui/Icons/IconRemove';
import UIButton from '@app/libs/ui/UIButton';

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let query: APISearchProps = {
      Table: "OPOR",
      Fields: ["DocNum", "DocEntry", "CardName", "CardCode", "U_IDU_PO_INTNUM", "U_IDU_SUP_SONUM"],
      Condition: [{
        field: "DocStatus",
        cond: "=",
        value: "O"
      }]
    };
    APISearch(query).then((res: any) => {
      setData(res);
    })
  }, []);

  return (
    <UIContainer>
      <UIHeader showSidebar={showSidebar} sidebar={sidebar} center={"Purchase Receipt"}>
      </UIHeader>
      <UIBody>
        <UIList
          style={{ flex: 1 }}
          primaryKey="DocNum"
          selection="single"
          onSelect={(item) => {
            history.push('/pr/form/' + item.DocEntry);
          }}
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
            U_IDU_PO_INTNUM: {
              table: {
                header: 'No. PO'
              }
            },
            U_IDU_SUP_SONUM: {
              table: {
                header: 'No. SO Supplier'
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
              <UIRow style={{ marginTop: 0 }}>
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