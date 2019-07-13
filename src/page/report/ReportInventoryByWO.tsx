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

interface IRute {
  id: number;
  name: string;
  description: string;
}

export default withRouter(
  observer(({ match, showSidebar, sidebar }: any) => {
    const [data, setData]: any = useState<IRute[]>([]);
    const [_data, _setData]: any = useState<IRute[]>([]);
    const [loading, setLoading] = useState(false);
    const field = [
      "ItemCode",
      "ItemName",
      "InStock",
      "Commited",
      "Available",
      "Invoiced",
      "OnHand"
    ];

    useEffect(() => {
      setLoading(true);
      let query: APISearchProps = {
        CustomQuery: `GetStockWO,${atob(match.params.id)}`
      };

      APISearch(query).then((res: any) => {
        res.forEach((row: any) => {
          row.InStock = row.InStock.split(".")[0];
          row.Commited = row.Commited.split(".")[0];
          row.Available = row.Available.split(".")[0];
          row.Invoiced = row.Invoiced.split(".")[0];
          row.OnHand = row.OnHand.split(".")[0];
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
              #{atob(match.params.id)}
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
                List Inventory
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
              primaryKey="ItemCode"
              selection="none"
              fields={{
                ItemCode: {
                  table: {
                    header: "Code"
                  }
                },
                ItemName: {
                  table: {
                    header: "Item Name"
                  }
                },
                InStock: {
                  table: {
                    header: "In Stock"
                  }
                },
                Commited: {
                  table: {
                    header: "Commited"
                  }
                },
                Available: {
                  table: {
                    header: "Available"
                  }
                },
                Invoiced: {
                  table: {
                    header: "Invoiced"
                  }
                },
                OnHand: {
                  table: {
                    header: "On Hand"
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
