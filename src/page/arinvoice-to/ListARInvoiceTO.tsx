import { APISearch, APISearchProps } from "@app/api";
import BtnCopy from "@app/components/BtnCopy";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UISearch from "@app/libs/ui/UISearch";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import UIText from "@app/libs/ui/UIText";
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import { decodeSAPDateToFormal } from "@app/utils/Helper";

let selectedItems: any[];

export default withRouter(
  observer(({ match, history, showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
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
        Table: "ODLN",
        Fields: [
          "DocEntry",
          "CardName",
          "CardCode",
          "U_IDU_SO_INTNUM",
          "U_IDU_DO_INTNUM",
          "NumAtCard",
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
            field: "CardCode",
            cond: "=",
            value: atob(match.params.CardCode)
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
          <BtnCopy
            label="Copy DO"
            onPress={() => {
              if (selectedItems !== undefined && selectedItems.length > 0) {
                let key = selectedItems.join("|");
                history.push("/ar-invoice-to/form/" + btoa(key));
              } else {
                alert("Please Select DO!");
              }
            }}
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
                  flexShrink: "none",
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
              selection="multi"
              onSelect={(_, selected) => {
                selectedItems = selected;
              }}
              fields={{
                CardName: {
                  table: {
                    header: "Customer"
                  }
                },
                CardCode: {
                  table: {
                    header: "Code"
                  }
                },
                U_IDU_SO_INTNUM: {
                  table: {
                    header: "SO No."
                  }
                },
                U_IDU_DO_INTNUM: {
                  table: {
                    header: "DO No."
                  }
                },
                NumAtCard: {
                  table: {
                    header: "PO Cust."
                  }
                },
                DocDate: {
                  table: {
                    header: "Posting Date"
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
