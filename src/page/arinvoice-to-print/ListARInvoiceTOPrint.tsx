import { APISearch, APISearchProps } from "@app/api";
import BtnCreate from '@app/components/BtnCreate';
import BtnExport from '@app/components/BtnExport';
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UISearch from "@app/libs/ui/UISearch";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";

export default withRouter(
  observer(({ match, history, showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    // const param = atob(match.params.id).split("|", 2);
    const [_data, _setData] = useState([]);
    const [field, setField] = useState<any[]>([]);
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
      let query: APISearchProps = {
        Table: "OINV",
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
          },
          { cond: 'AND' },
          {
            field: "U_IDU_ISCANVAS",
            cond: "=",
            value: "N"
          }
        ]
      };

      APISearch(query).then((res: any) => {
        setField(Object.keys(res[0]));
        res.forEach((item: any) => {
          item['Action'] = () => {
            return (<BtnExport />)
          }
        });
        setData(res);
        _setData(res);
      });
    }, []);

    return (
      <UIContainer>
        <UIHeader
          showSidebar={showSidebar}
          sidebar={sidebar}
          center={"AR Invoice  " + atob(match.params.CardName)}
        >
          <BtnCreate path={`/ar-invoice-to/list/${match.params.CardCode}/${match.params.CardName}`} />
        </UIHeader>
        <UIBody>
          <UISearch onSearch={funcSearch} />
          <UIList
            primaryKey="DocEntry"
            style={{ backgroundColor: "#fff" }}
            selection="single"
            onSelect={(d) => {
              history.push(`/ar-invoice-to/view/${match.params.CardCode}/${match.params.CardName}/${d.DocEntry}`)
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
              },
              Action: {
              }
            }}
            items={_data.map((item: any) => ({
              ...item
            }))}
          />
        </UIBody>
      </UIContainer>
    );
  })
);
