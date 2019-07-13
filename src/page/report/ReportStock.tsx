import { APISearch, APISearchProps } from "@app/api";
import global from "@app/global";
import UIBody from "@app/libs/ui/UIBody";
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UISearch from "@app/libs/ui/UISearch";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import SAPDropdown from "@app/components/SAPDropdown";

interface IRute {
  id: number;
  name: string;
  description: string;
}

export default withRouter(
  observer(({ showSidebar, sidebar }: any) => {
    const [data, setData]: any = useState<IRute[]>([]);
    const [_data, _setData]: any = useState<IRute[]>([]);
    const [warehouse, setWarehouse]: any = useState(
      global.session.user.warehouse_id
    );
    const [loading, setLoading] = useState(false);
    const field = [
      "ItemNo",
      "ItemName",
      "InStock",
      "Commited",
      "Ordered",
      "Available"
    ];

    useEffect(() => {
      setLoading(true);
      let query: APISearchProps = {
        CustomQuery: `GetStockWarehouse,${warehouse}`
      };

      APISearch(query).then((res: any) => {
        res.forEach((row: any) => {
          row.InStock = row.InStock.split(".")[0];
          row.Commited = row.Commited.split(".")[0];
          row.Available = row.Available.split(".")[0];
          row.Ordered = row.Ordered.split(".")[0];
        });
        setData(res);
        _setData(res);
        setLoading(false);
      });
    }, [warehouse]);

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
              Report Stock
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
                List Stock #{warehouse}
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
            {global.session.user.role == "admin" && (
              <UICardHeader>
                <SAPDropdown
                  field="WarehouseCodeBranch"
                  value={warehouse}
                  setValue={setWarehouse}
                  where={[
                    {
                      field: "U_BRANCH",
                      value: global.session.user.branch
                    }
                  ]}
                />
              </UICardHeader>
            )}
            <UIList
              style={{ flex: 1 }}
              primaryKey="ItemNo"
              selection="none"
              fields={{
                ItemNo: {
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
                    header: "COmmited"
                  }
                },
                Ordered: {
                  table: {
                    header: "Ordered"
                  }
                },
                Available: {
                  table: {
                    header: "Available"
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
