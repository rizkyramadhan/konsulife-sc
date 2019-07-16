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
      "DocNum",
      "CardCode",
      "CardName",
      "NoSO",
      "NoPO",
      "PostingDate",
      "DeliveryDate",
      "Total",
      "PaymentTerm",
      "IsCanvas",
      "Sales",
      "CANCELED",
      "Status"
    ];

    useEffect(() => {
      setLoading(true);
      let query: APISearchProps = {
        CustomQuery: `GetSOByBranch,${global.getSession().user.branch}`
      };

      APISearch(query).then((res: any) => {
        res.forEach((row: any) => {
          row.Total = row.Total.split(".")[0];
          row.PostingDate = decodeSAPDateToFormal(row.PostingDate);
          row.DeliveryDate = decodeSAPDateToFormal(row.DeliveryDate);
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
              Report Sales Order
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
                  flexShrink: 0,
                  width: "100%"
                }}
              >
                List Sales Order
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
                    header: "Cust. Name"
                  }
                },
                NoSO: {
                  table: {
                    header: "No SO"
                  }
                },
                NoPO: {
                  table: {
                    header: "No PO"
                  }
                },
                PostingDate: {
                  table: {
                    header: "Post. Date"
                  }
                },
                DeliveryDate: {
                  table: {
                    header: "Deliv. Date"
                  }
                },
                Total: {
                  table: {
                    header: "Total"
                  }
                },
                PaymentTerm: {
                  table: {
                    header: "Payment Term"
                  }
                },
                IsCanvas: {
                  table: {
                    header: "IsCanvas"
                  }
                },
                Sales: {
                  table: {
                    header: "Sales"
                  }
                },
                CANCELED: {
                  table: {
                    header: "Canc."
                  }
                },
                Status: {
                  table: {
                    header: "Status"
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
