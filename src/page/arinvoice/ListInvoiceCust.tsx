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
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import UIText from "@app/libs/ui/UIText";

export default withRouter(
  observer(({ history, showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    const [_data, _setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const field = [
      "CardName",
      "CardFName",
      "CardCode",
      "CardType",
      "GroupCode",
      "LicTradNum",
      "AddID",
      "SlpCode",
      "Phone1",
      "Phone2",
      "U_IDU_AREA",
      "U_IDU_BRANCH",
      "E_Mail",
      "MailAddres"
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
      let query: APISearchProps = {
        Table: "OCRD",
        Fields: field,
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
          { cond: "AND" },
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
        // Limit: 1000,
        // Page: 1
      };

      APISearch(query).then((res: any) => {
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
              AR Invoice (Canvassing)
            </UIText>
          }
          isLoading={loading}
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
                List Customer
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
              primaryKey="CardCode"
              selection="single"
              onSelect={item => {
                history.push(
                  `/ar-invoice/open/${btoa(item.CardCode)}/${btoa(
                    item.CardName
                  )}`
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
                    header: "Name"
                  }
                },
                AddID: {
                  table: {
                    header: "NIK"
                  }
                },
                LicTradNum: {
                  table: {
                    header: "NPWP"
                  }
                },
                Phone1: {
                  table: {
                    header: "Tlpn"
                  }
                },
                E_Mail: {
                  table: {
                    header: "Email"
                  }
                },
                MailAddres: {
                  table: {
                    header: "Address"
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
