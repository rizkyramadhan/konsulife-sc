import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import UISearch from "@app/libs/ui/UISearch";
import UIText from "@app/libs/ui/UIText";
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import { APISearch, APISearchProps } from "@app/api";
import global from "@app/global";
import { decodeSAPDateToFormal } from "@app/utils/Helper";

interface IRute {
  id: number;
  name: string;
  description: string;
}

export default withRouter(
  observer(({ showSidebar, sidebar }: any) => {
    const [data, setData]: any = useState<IRute[]>([]);
    const [_data, _setData]: any = useState<IRute[]>([]);
    const [loading, setLoading] = useState(false);
    const field = [
      "DocEntry",
      "CardCode",
      "CardName",
      "U_IDU_DO_INTNUM",
      "U_IDU_SO_INTNUM",
      "DocDate"
    ];

    useEffect(() => {
      setLoading(true);
      let cond: any = [];
      if (global.session.role != "admin") {
        cond = [
          {
            field: "U_BRANCH",
            cond: "=",
            value: global.getSession().user.branch
          }
        ];
      }
      let query: APISearchProps = {
        Table: "ODLN",
        Fields: field,
        Condition: cond
      };

      APISearch(query).then((res: any) => {
        res.forEach((row: any) => {
          row.DocDate = decodeSAPDateToFormal(row.DocDate);
        });
        setData(res);
        _setData(res);
        setLoading(false);
      });
    }, []);

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

    return (
      <UIContainer>
        <UIHeader
          pattern={true}
          isLoading={loading}
          showSidebar={showSidebar}
          sidebar={sidebar}
          center={
            <UIText size="large" style={{ color: "#fff" }}>
              Report Delivery Order
            </UIText>
          }
        />
        <UIBody>
          <UICard
            mode="clean"
            style={{ borderRadius: 4, flex: 1, backgroundColor: "#fff" }}
          >
            <UICardHeader
              style={{
                backgroundColor: "#fff",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <UIText
                size="medium"
                style={{
                  flexShrink: "none",
                  width: "100%"
                }}
              >
                List Delivery Order
              </UIText>
              <UISearch
                style={{
                  width: "100%",
                  maxWidth: 300
                }}
                fieldStyle={{
                  borderWidth: 0,
                  backgroundColor: "#f6f9fc"
                }}
                onSearch={funcSearch}
              />
            </UICardHeader>
            <UIList
              style={{ flex: 1 }}
              primaryKey="DocEntry"
              selection="detail"
              fields={{
                CardCode: {
                  table: {
                    header: "Code"
                  }
                },
                CardName: {
                  table: {
                    header: "Cust. Name"
                  }
                },
                U_IDU_DO_INTNUM: {
                  table: {
                    header: "No DO"
                  }
                },
                U_IDU_SO_INTNUM: {
                  table: {
                    header: "No SO"
                  }
                },
                DocDate: {
                  table: {
                    header: "Post. Date"
                  }
                }
              }}
              items={_data.map((item: any) => ({
                ...item
              }))}
            />
          </UICard>
        </UIBody>
      </UIContainer>
    );
  })
);
