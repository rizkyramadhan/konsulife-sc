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
import global from "@app/global";

let selectedItems: any[];

export default withRouter(
  observer(({ history, match, showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    const param = atob(match.params.id).split("|", 2);
    const [_data, _setData] = useState([]);
    const field = [
      "DocNum",
      "DocEntry",
      "CardName",
      "CardCode",
      "U_IDU_PO_INTNUM",
      "U_IDU_SUP_SONUM"
    ];
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
        Table: "OPOR",
        Fields: field,
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
            value: param[0]
          },
          {
            cond: "AND"
          },
          {
            field: "U_BRANCH",
            cond: "=",
            value: global.getSession().user.branch
          }
        ]
      };

      APISearch(query).then((res: any) => {
        _setData(res);
        setData(res);
      });
    }, []);

    return (
      <UIContainer>
        <UIHeader
          showSidebar={showSidebar}
          sidebar={sidebar}
          center={"Purchase Receipt " + param[1]}
        >
          <BtnCopy
            onPress={() => {
              if (selectedItems !== undefined && selectedItems.length > 0) {
                let key = selectedItems.join("|");
                history.push("/pr/form/" + btoa(key));
              } else {
                alert("Please Select PO!");
              }
            }}
            label="Copy PO"
          />
        </UIHeader>
        <UIBody>
          <UISearch onSearch={funcSearch} />
          <UIList
            style={{ flex: 1 }}
            primaryKey="DocEntry"
            selection="multi"
            onSelect={(_, selected) => {
              selectedItems = selected;
            }}
            fields={{
              CardCode: {
                table: {
                  header: "Code"
                }
              },
              CardName: {
                table: {
                  header: "Customer/Vendor"
                }
              },
              U_IDU_PO_INTNUM: {
                table: {
                  header: "No. PO"
                }
              },
              U_IDU_SUP_SONUM: {
                table: {
                  header: "No. SO Supplier"
                }
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
