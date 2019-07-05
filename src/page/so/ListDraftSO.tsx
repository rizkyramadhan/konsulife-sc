import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { APISearchProps, APISearch } from "@app/api";
import UISearch from "@app/libs/ui/UISearch";
import global from "@app/global";

export default withRouter(
  observer(({ showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    const [_data, _setData] = useState([]);
    const field = [
      "DocNum",
      "DocEntry",
      "U_IDU_SO_INTNUM",
      "CardName",
      "CardCode",
      "DocDate",
      "DocDueDate"
    ];
    const funcSearch = (value: string) => {
      _setData([
        ...(value
          ? data.filter((x: any) => {
              let res = false;
              for (var i = 0; i < field.length; i++) {
                if (
                  x[field[i]] &&
                  x[field[i]].toLowerCase().includes(value.toLowerCase())
                ) {
                  res = true;
                  break;
                }
              }
              return res;
            })
          : data)
      ]);
    };

    useEffect(() => {
      // jika yang membuka merupakan admin cabang, maka set kondisi branch sesuai branch admin cabang
      // jika yang membuka merupakan sales, maka set userid sesuai userid sales
      let cond: any[] = [];
      if (global.getSession().role === "branch") {
        cond = [
          { cond: "AND" },
          {
            field: "U_BRANCH",
            cond: "=",
            value: global.getSession().user.branch
          }
        ];
      } else if (global.getSession().role === "sales_to") {
        cond = [
          { cond: "AND" },
          {
            field: "U_USERID",
            cond: "=",
            value: global.getSession().user.username
          }
        ];
      }

      let query: APISearchProps = {
        Table: "ODRF",
        Fields: field,
        Condition: [
          {
            field: "DocStatus",
            cond: "=",
            value: "O"
          },
          { cond: "AND" },
          { field: "ObjType", cond: "=", value: 17 },
          ...cond
        ]
      };

      APISearch(query).then((res: any) => {
        setData(res);
        _setData(res);
      });
    }, []);

    return (
      <UIContainer>
        <UIHeader
          showSidebar={showSidebar}
          sidebar={sidebar}
          center={"Draft SO Taking Order"}
        />
        <UIBody>
          <UISearch onSearch={funcSearch} />
          <UIList
            style={{ flex: 1 }}
            primaryKey="DocEntry"
            selection="detail"
            fields={{
              U_IDU_SO_INTNUM: {
                table: {
                  header: "No. SO"
                }
              },
              CardCode: {
                table: {
                  header: "Customer Code"
                }
              },
              CardName: {
                table: {
                  header: "Customer"
                }
              },
              DocDate: {
                table: {
                  header: "Posting Date"
                }
              }
            }}
            items={_data.map((item: any) => ({
              ...item
            }))}
          />
        </UIBody>
      </UIContainer>
    );
  })
);
