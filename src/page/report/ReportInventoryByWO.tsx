import { APISearch, APISearchProps } from "@app/api";
import global from "@app/global";
import { withRouter } from "@app/libs/router/Routing";
import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import UICol from "@app/libs/ui/UICol";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UIRow from "@app/libs/ui/UIRow";
import UISearch from "@app/libs/ui/UISearch";
import UIText from "@app/libs/ui/UIText";
import { getParams } from "@app/utils/Helper";
import React, { useEffect, useState } from "react";
import { decode as atob } from "base-64";

interface IRute {
  id: number;
  name: string;
  description: string;
}

export default withRouter(({ match, history }: any) => {
  match.params = getParams(history.location.pathname);
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
        showSidebar={global.setSidebar}
        sidebar={global.sidebar}
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
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <UIRow style={{ flex: 1 }}>
              <UICol
                size={6}
                xs={12}
                sm={12}
                md={6}
                lg={6}
                style={{ justifyContent: "center", height: 35 }}
              >
                <UIText size="medium">List Inventory</UIText>
              </UICol>
              <UICol
                size={6}
                xs={12}
                sm={12}
                md={6}
                lg={6}
                style={{ justifyContent: "center", alignItems: "flex-end" }}
              >
                <UISearch
                  style={{
                    width: "100%",
                    ...(isSize(["md", "lg"]) ? { maxWidth: 300 } : {})
                  }}
                  fieldStyle={{
                    borderWidth: 0,
                    backgroundColor: "#f6f9fc"
                  }}
                  onSearch={funcSearch}
                />
              </UICol>
            </UIRow>
          </UICardHeader>
          <UIList
            style={{ flex: 1 }}
            primaryKey="ItemCode"
            selection="detail"
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
});
