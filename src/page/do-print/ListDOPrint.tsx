import { APISearch, APISearchProps } from "@app/api";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import global from "@app/global";
import BtnCreate from "@app/components/BtnCreate";
import UIText from "@app/libs/ui/UIText";
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import { decodeSAPDateToFormal } from "@app/utils/Helper";

export default withRouter(
  observer(({ match, history, showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);

    useEffect(() => {
      let query: APISearchProps = {
        Table: "ODLN",
        Fields: [
          "DocEntry",
          "CardCode",
          "CardName",
          "U_IDU_DO_INTNUM",
          "DocDate"
        ],
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
            field: "U_BRANCH",
            cond: "=",
            value: global.getSession().user.branch
          },
          {
            cond: "AND"
          },
          {
            field: "CardCode",
            cond: "=",
            value: atob(match.params.CardCode)
          }
        ]
      };

      APISearch(query).then((res: any) => {
        res.forEach((row: any) => {
          row.DocDate = decodeSAPDateToFormal(row.DocDate);
        });
        setData(res);
      });
    }, []);

    return (
      <UIContainer>
        <UIHeader
          pattern={true}
          showSidebar={showSidebar}
          sidebar={sidebar}
          center={
            <UIText size="large" style={{ color: "#fff" }}>{`#${atob(
              match.params.CardCode
            )} - ${atob(match.params.CardName)}`}</UIText>
          }
        >
          <BtnCreate
            path={`/do/copySO/${match.params.CardCode}/${
              match.params.CardName
            }`}
          />
        </UIHeader>
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
                List Delivery Order
              </UIText>
            </UICardHeader>
            <UIList
              primaryKey="DocEntry"
              style={{ backgroundColor: "#fff" }}
              selection="single"
              onSelect={d => {
                history.push(
                  `/do/view/${match.params.CardCode}/${match.params.CardName}/${
                    d.DocEntry
                  }`
                );
              }}
              fields={{
                CardCode: {
                  table: {
                    header: "Customer Code"
                  }
                },
                CardName: {
                  table: {
                    header: "Customer Name"
                  }
                },
                U_IDU_SO_INTNUM: {
                  table: {
                    header: "SO No."
                  }
                },
                DocDate: {
                  table: {
                    header: "Posting Date"
                  }
                }
              }}
              items={data}
            />
          </UICard>
        </UIBody>
      </UIContainer>
    );
  })
);
