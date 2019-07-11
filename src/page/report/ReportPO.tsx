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
      "U_IDU_PO_INTNUM",
      "U_IDU_SUP_SONUM",
      "DocDate",
      "DocDueDate",
      "U_BRANCH"
    ];

    useEffect(() => {
      setLoading(true);
      let query: APISearchProps = {
        Table: "OPOR",
        Fields: field,
        Condition: [
          {
            field: "U_BRANCH",
            cond: "=",
            value: global.getSession().user.branch
          }
        ]
      };

      APISearch(query).then((res: any) => {
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
              Report Purchase Order
            </UIText>
          }
        />
        <UIBody scroll={true}>
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
                List Purchase Order
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
              selection="none"
              fields={{
                CardCode: {
                  table: {
                    header: "Code"
                  }
                },
                CardName: {
                  table: {
                    header: "Vendor Name"
                  }
                },
                U_IDU_PO_INTNUM: {
                  table: {
                    header: "No PO"
                  }
                },
                U_IDU_SUP_SONUM: {
                  table: {
                    header: "No SO SUpplier"
                  }
                },
                DocDate: {
                  table: {
                    header: "Post. Date"
                  }
                },
                DocDueDate: {
                  table: {
                    header: "Deliv. Date"
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
