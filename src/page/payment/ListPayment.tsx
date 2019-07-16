import { APISearch, APISearchProps } from "@app/api";
import BtnCreate from "@app/components/BtnCreate";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UISearch from "@app/libs/ui/UISearch";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import global from "@app/global";
import UIText from "@app/libs/ui/UIText";
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import { decodeSAPDateToFormal } from "@app/utils/Helper";

export default withRouter(
  observer(({ showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    const [_data, _setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const field = [
      "DocEntry",
      "DocDate",
      "DocDueDate",
      "CardCode",
      "CardName",
      "U_IDU_PAYNUM",
      "U_WONUM",
      "U_SONUM",
      "U_REMARK"
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
    // const [filter, setFilter] = useState<any[]>([]);
    // const filterSearch = (filter: any) => {
    //   let query: APISearchProps = {
    //     Table: "ORCT",
    //     Fields: field,
    //     Condition: filter
    //   };

    //   APISearch(query).then((res: any) => {
    //     setData(res);
    //     _setData(res);
    //   });
    // }

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
        Table: "ORCT",
        Fields: field,
        Condition: cond
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
              Payment Receipt
            </UIText>
          }
          isLoading={loading}
        >
          <BtnCreate path="/payment-receipt/form" />
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
                  flexShrink: 0,
                  width: "100%"
                }}
              >
                List Payment Receipt
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
                    header: "Sales"
                  }
                },
                DocDate: {
                  table: {
                    header: "Posting Date"
                  }
                },
                U_IDU_PAYNUM: {
                  table: {
                    header: "No. Payment"
                  }
                },
                U_SONUM: {
                  table: {
                    header: "No. SO"
                  }
                },
                U_REMARK: {
                  table: {
                    header: "Remarks"
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
