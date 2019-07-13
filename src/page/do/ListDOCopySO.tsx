import { APISearch, APISearchProps } from "@app/api";
import BtnCopy from "@app/components/BtnCopy";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import UIText from "@app/libs/ui/UIText";
import { decodeSAPDateToFormal } from "@app/utils/Helper";

export default withRouter(
  observer(({ match, history, showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    const [itemSelect, setItemSelect] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      let query: APISearchProps = {
        Table: "ORDR",
        Fields: [
          "DocEntry",
          "CardCode",
          "CardName",
          "U_IDU_SO_INTNUM",
          "DocDate"
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
            field: "ObjType",
            cond: "=",
            value: "17"
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
        res.forEach((row: any) => {
          row.DocDate = decodeSAPDateToFormal(row.DocDate);
        });
        setData(res);
        setLoading(false);
      });
    }, []);

    return (
      <UIContainer>
        <UIHeader
          pattern={true}
          isLoading={loading}
          showSidebar={showSidebar}
          sidebar={sidebar}
          center={
            <UIText size="large" style={{ color: "#fff" }}>{`#${atob(
              match.params.CardCode
            )} - ${atob(match.params.CardName)}`}</UIText>
          }
        >
          <BtnCopy
            onPress={() => {
              if (itemSelect.length === 0)
                return alert("Anda belum memilih SO.");
              history.push(
                `/do/form/${match.params.CardCode}/${
                  match.params.CardName
                }/${btoa(JSON.stringify(itemSelect))}`
              );
            }}
          />
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
                  flexShrink: "none",
                  width: "100%"
                }}
              >
                List Sales Order
              </UIText>
            </UICardHeader>
            <UIList
              primaryKey="DocEntry"
              style={{ backgroundColor: "#fff" }}
              selection="multi"
              onSelect={item => {
                const idx = itemSelect.findIndex(
                  (x: any) => x.DocEntry == item.DocEntry
                );
                if (idx >= 0) {
                  itemSelect.splice(idx, 1);
                } else {
                  itemSelect.push({
                    DocEntry: item.DocEntry,
                    SONumber: item.U_IDU_SO_INTNUM
                  });
                }
                setItemSelect([...itemSelect]);
              }}
              fields={{
                CardCode: {
                  table: {
                    header: "Customer Code"
                  }
                },
                CardName: {
                  table: {
                    header: "Customer Name"
                  }
                },
                U_IDU_SO_INTNUM: {
                  table: {
                    header: "SO No."
                  }
                },
                DocDate: {
                  table: {
                    header: "Posting Date"
                  }
                }
              }}
              items={data}
            />
          </UICard>
        </UIBody>
      </UIContainer>
    );
  })
);
