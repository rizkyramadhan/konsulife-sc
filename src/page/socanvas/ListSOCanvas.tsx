import { APISearch, APISearchProps } from "@app/api";
import BtnCreate from "@app/components/BtnCreate";
import global from "@app/global";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import UISearch from "@app/libs/ui/UISearch";
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import { decodeSAPDateToFormal } from "@app/utils/Helper";

export default withRouter(
  observer(({ showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    const [_data, _setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const field = [
      "DocNum",
      "DocEntry",
      "U_IDU_SO_INTNUM",
      "CardName",
      "CardCode",
      "DocDate",
      "DocDueDate",
      "U_WONUM",
      "NumAtCard"
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
      setLoading(true);
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
        Table: "ORDR",
        Fields: field,
        Sort: "~DocDate",
        Condition: [
          {
            field: "DocStatus",
            cond: "=",
            value: "O"
          },
          { cond: "AND" },
          {
            field: "ObjType",
            cond: "=",
            value: 17
          },
          { cond: "AND" },
          {
            field: "U_IDU_ISCANVAS",
            cond: "=",
            value: "Y"
          },
          ...cond
        ]
      };

      APISearch(query).then((res: any) => {
        res.forEach((row: any) => {
          row.DocDate = decodeSAPDateToFormal(row.DocDate);
          row.DocDueDate = decodeSAPDateToFormal(row.DocDueDate);
        });
        setData(res);
        _setData(res);
        setLoading(false);
      });
    }, []);

    return (
      <UIContainer>
        <UIHeader
          pattern={true}
          showSidebar={showSidebar}
          sidebar={sidebar}
          center={
            <UIText size="large" style={{ color: "#fff" }}>
              SO Canvasing
            </UIText>
          }
          isLoading={loading}
        >
          <BtnCreate path="/so-canvas/form" />
        </UIHeader>
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
                List SO Canvasing
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
              primaryKey="DocNum"
              selection="detail"
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
                },
                DocDate: {
                  table: {
                    header: "Posting Date"
                  }
                },
                DocDueDate: {
                  table: {
                    header: "Delivery Date"
                  }
                },
                NumAtCard: {
                  table: {
                    header: "No. PO"
                  }
                },
                U_IDU_SO_INTNUM: {
                  table: {
                    header: "No. SO"
                  }
                },
                U_WONUM: {
                  table: {
                    header: "No. WO"
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
