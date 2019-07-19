import global from "@app/global";
import rawQuery from "@app/libs/gql/data/rawQuery";
import UIBody from "@app/libs/ui/UIBody";
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import UICol from "@app/libs/ui/UICol";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UIRow from "@app/libs/ui/UIRow";
import UISearch from "@app/libs/ui/UISearch";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { isSize } from "@app/libs/ui/MediaQuery";

interface IWO {
  id: number;
  number: string;
  return_date: string;
  sales_details: string;
  sales_id: string;
  sales_name: string;
  visite_date: string;
  sopir: string;
  sopir_nopol: string;
  status: string;
}

export default withRouter(
  observer(({ history }: any) => {
    const [data, setData]: any = useState<IWO[]>([]);
    const [_data, _setData]: any = useState<IWO[]>([]);
    const field = [
      "number",
      "return_date",
      "sales_name",
      "visite_date",
      "status",
      "sopir",
      "sopir_nopol"
    ];
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      let cond: any = "";
      if (global.session.role != "admin") {
        cond = `branch: {_eq: "${global.getSession().user.branch}"}, `;
      }
      rawQuery(`{
      work_order (where: {${cond}status: {_in: ["pending", "open"]}}) {
        id
        number
        return_date
        sales_details
        sales_id
        sales_name
        visite_date
        sopir
        sopir_nopol
        status
      }
    }`).then(res => {
        setData([...res.work_order]);
        _setData([...res.work_order]);
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
          showSidebar={global.setSidebar}
          sidebar={global.sidebar}
          center={
            <UIText size="large" style={{ color: "#fff" }}>
              Report Inventory
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
                  <UIText size="medium">List Working Order</UIText>
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
              primaryKey="id"
              selection="single"
              onSelect={d => {
                history.push(`/report-inventory/open/${btoa(d.number)}`);
              }}
              fields={{
                number: {
                  table: {
                    header: "No. WO"
                  }
                },
                sales_name: {
                  table: {
                    header: "Sales"
                  }
                },
                sopir: {
                  table: {
                    header: "Sopir"
                  }
                },
                sopir_nopol: {
                  table: {
                    header: "Nopol"
                  }
                },
                status: {
                  table: {
                    header: "Status"
                  }
                },
                visite_date: {
                  table: {
                    header: "Visite"
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
