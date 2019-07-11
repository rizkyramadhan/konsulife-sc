import { APISearch, APISearchProps } from "@app/api";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UISearch from "@app/libs/ui/UISearch";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import global from "@app/global";

export default withRouter(
  observer(({ history, showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    const [_data, _setData] = useState([]);
    const [field, setField] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

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
      setLoading(true);
      let query: APISearchProps = {
        Table: "OCRD",
        Fields: ["CardCode", "CardName"],
        Condition: [
          {
            field: "CardType",
            cond: "=",
            value: "C"
          },
          { cond: "AND" },
          {
            field: "validFor",
            cond: "=",
            value: "Y"
          },
          {
            cond: "AND"
          },
          {
            field: "U_IDU_BRANCH",
            cond: "=",
            value: global.session.user.branch
          },
          {
            cond: "AND"
          },
          {
            field: "U_SALES",
            cond: "=",
            value: "N"
          }
        ]
        // Limit: 20,
        // Page: 1
      };

      APISearch(query).then((res: any) => {
        setField(Object.keys(res[0]));
        setData(res);
        _setData(res);
        setLoading(false);
      });
    }, []);

    return (
      <UIContainer>
        <UIHeader
          showSidebar={showSidebar}
          sidebar={sidebar}
          center={"AR Invoice (Taking Order)"}
          isLoading={loading}
        />
        <UIBody>
          <UISearch onSearch={funcSearch} />
          <UIList
            style={{ flex: 1 }}
            primaryKey="CardCode"
            selection="single"
            onSelect={item => {
              history.push(
                "/ar-invoice-to/list/" +
                  btoa(item.CardCode + "|" + item.CardName)
              );
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
            items={_data.map((item: any) => ({
              ...item
            }))}
          />
        </UIBody>
      </UIContainer>
    );
  })
);
