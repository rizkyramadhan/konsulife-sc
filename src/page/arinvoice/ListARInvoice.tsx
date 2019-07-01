import { APISearch, APISearchProps } from '@app/api';
import BtnCopy from '@app/components/BtnCopy';
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UISearch from '@app/libs/ui/UISearch';
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";

let selectedItems: any[];

export default withRouter(observer(({ history, match, showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  const param = atob(match.params.id).split("|", 2);
  const [_data, _setData] = useState([]);
  const [field, setField] = useState<any[]>([]);
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
      Table: "ORDR",
      Fields: ["DocEntry", "CardName", "CardCode", "U_IDU_SO_INTNUM", "NumAtCard", "DocDate"],
      Condition: [
        {
          field: "DocStatus",
          cond: "=",
          value: "O"
        },
        {
          cond: "AND"
        },
        {
          field: "CardCode",
          cond: "=",
          value: param[0]
        },
        {
          cond: "AND"
        },
        {
          field: "U_IDU_ISCANVAS",
          cond: "=",
          value: "Y"
        }
      ]
    };

    APISearch(query).then((res: any) => {
      setField(Object.keys(res[0]));
      _setData(res);
      setData(res);
    });
  }, []);

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center={"AR Invoice  " + param[1]}
      >
        <BtnCopy onPress={() => {
          if (selectedItems !== undefined && selectedItems.length > 0) {
            let key = selectedItems.join("|");
            history.push("/ar-invoice/form/" + btoa(key));
          }
          else {
            alert("Please Select SO!");
          }

        }}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end"
          }} />
      </UIHeader>
      <UIBody>
        <UISearch onSearch={funcSearch}></UISearch>
        <UIList
          primaryKey="DocEntry"
          style={{ backgroundColor: "#fff" }}
          selection="multi"
          onSelect={(_, selected) => { selectedItems = selected }}
          fields={{
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
          items={_data.map((item: any) => ({
            ...item,
          }))}
        />
      </UIBody>
    </UIContainer>
  );
}));
