import BtnCreate from "@app/components/BtnCreate";
import rawQuery from "@app/libs/gql/data/rawQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import global from "@app/global";
import UISearch from "@app/libs/ui/UISearch";
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import UIText from "@app/libs/ui/UIText";

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
  observer(({ history, showSidebar, sidebar }: any) => {
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
          showSidebar={showSidebar}
          sidebar={sidebar}
          center={
            <UIText size="large" style={{ color: "#fff" }}>
              Working Order
            </UIText>
          }
          isLoading={loading}
        >
          <BtnCreate path="/wo/form" />
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
                  flexShrink: 0,
                  width: "100%"
                }}
              >
                List AR Invoice
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
              primaryKey="id"
              selection="single"
              onSelect={d => {
                history.push("/wo/form/" + d.id);
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
