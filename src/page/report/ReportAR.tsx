import { APISearch, APISearchProps } from "@app/api";
import global from "@app/global";
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
import { decodeSAPDateToFormal } from "@app/utils/Helper";
import React, { useEffect, useState } from "react";
import { withRouter } from "@app/libs/router/Routing";

interface IRute {
  id: number;
  name: string;
  description: string;
}

export default withRouter(({  }: any) => {
  const [data, setData]: any = useState<IRute[]>([]);
  const [_data, _setData]: any = useState<IRute[]>([]);
  const [loading, setLoading] = useState(false);
  const field = [
    "DocEntry",
    "CardCode",
    "CardName",
    "U_IDU_DO_INTNUM",
    "U_IDU_SO_INTNUM",
    "DocDate",
    "DocDueDate",
    "DocTotal",
    "U_IDU_ISCANVAS"
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
        row.DocTotal = row.DocTotal.split(".")[0];
        row.DocDate = decodeSAPDateToFormal(row.DocDate);
        row.DocDueDate = decodeSAPDateToFormal(row.DocDueDate);
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
            Report AR Invoice
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
                <UIText size="medium">List AR Invoice</UIText>
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
              },
              DocDueDate: {
                table: {
                  header: "Deliv. Date"
                }
              },
              DocTotal: {
                table: {
                  header: "Total"
                }
              },
              U_IDU_ISCANVAS: {
                table: {
                  header: "IsCanvas"
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
