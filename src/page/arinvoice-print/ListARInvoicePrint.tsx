import { APISearch, APISearchProps } from "@app/api";
import BtnCreate from "@app/components/BtnCreate";
import UIBody from "@app/libs/ui/UIBody";
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UISearch from "@app/libs/ui/UISearch";
import UIText from "@app/libs/ui/UIText";
import { decodeSAPDateToFormal } from "@app/utils/Helper";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "@app/libs/router/Routing";

export default withRouter(
  observer(({ match, history, showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    // const param = atob(match.params.id).split("|", 2);
    const [_data, _setData] = useState([]);
    const [field, setField] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

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
        Table: "OINV",
        Fields: [
          "DocEntry",
          "CardName",
          "CardCode",
          "U_IDU_SO_INTNUM",
          "U_IDU_DO_INTNUM",
          "NumAtCard",
          "DocDate",
          "U_IDU_SI_INTNUM",
          "U_IDU_FP",
          "U_WONUM"
        ],
        Sort: "~DocDate",
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
            field: "CardCode",
            cond: "=",
            value: atob(match.params.CardCode)
          },
          { cond: "AND" },
          {
            field: "U_IDU_ISCANVAS",
            cond: "=",
            value: "Y"
          }
        ]
      };

      APISearch(query).then((res: any) => {
        setField(Object.keys(res[0]));
        res.forEach((row: any) => {
          row.DocDate = decodeSAPDateToFormal(row.DocDate);
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
          isLoading={loading}
          center={
            <UIText size="large" style={{ color: "#fff" }}>
              {atob(match.params.CardName)}
            </UIText>
          }
        >
          <BtnCreate
            path={`/ar-invoice/list/${match.params.CardCode}/${
              match.params.CardName
            }`}
          />
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
              primaryKey="DocEntry"
              style={{ backgroundColor: "#fff" }}
              selection="single"
              onSelect={d => {
                history.push(
                  `/ar-invoice/view/${match.params.CardCode}/${
                    match.params.CardName
                  }/${d.DocEntry}`
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
                    header: "Customer"
                  }
                },
                U_IDU_SI_INTNUM: {
                  table: {
                    header: "No. Invoice"
                  }
                },
                U_IDU_DO_INTNUM: {
                  table: {
                    header: "No. DO"
                  }
                },
                U_IDU_SO_INTNUM: {
                  table: {
                    header: "No. SO"
                  }
                },
                DocDate: {
                  table: {
                    header: "Posting Date"
                  }
                },
                DocDueDate: {
                  table: {
                    header: "Due Date"
                  }
                },
                U_IDU_FP: {
                  table: {
                    header: "Faktur Pajak"
                  }
                },
                U_WONUM: {
                  table: {
                    header: "No. WO"
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
