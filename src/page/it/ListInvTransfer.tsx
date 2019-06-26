import { APISearch, APISearchProps } from '@app/api';
import IconRemove from '@app/libs/ui/Icons/IconRemove';
import UIBody from "@app/libs/ui/UIBody";
import UIButton from '@app/libs/ui/UIButton';
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UIRow from '@app/libs/ui/UIRow';
import UISearch from '@app/libs/ui/UISearch';
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  const [_data, _setData] = useState([]);
  const field = ["DocNum", "U_IDU_SO_INTNUM", "CardName", "CardCode", "DocDate", "DocDueDate"];
  const funcSearch = (value: string) => {
    _setData([...(value ? data.filter((x: any) => {
      let res = false;
      for (var i = 0; i < field.length; i++) {
        if (x[field[i]] && x[field[i]].toLowerCase().includes(value.toLowerCase())) {
          res = true;
          break;
        }
      }
      return res
    }) : data)])
  }

  useEffect(() => {
    let query: APISearchProps = {
      Table: "OWTQ",
      Fields: ["DocNum", "DocEntry", "CardName", "CardCode", "U_IDU_ITR_INTNUM", "DocDate"],
      Condition: [
        {
          field: "DocStatus",
          cond: "=",
          value: "O"
        }
      ]
    };

    APISearch(query).then((res: any) => {
      _setData(res);
      setData(res);
    });
  }, []);

  return (
    <UIContainer>
      <UIHeader showSidebar={showSidebar} sidebar={sidebar} center={"Inventory Transfer"}>
      </UIHeader>
      <UIBody>
        <UISearch onSearch={funcSearch}></UISearch>
        <UIList
          style={{ flex: 1 }}
          primaryKey="DocNum"
          selection="single"
          onSelect={(item) => { history.push('/it/form/' + item.DocEntry) }}
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
          items={_data.map((item: any) => ({
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
