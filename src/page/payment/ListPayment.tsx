import { APISearch, APISearchProps } from "@app/api";
import BtnCreate from "@app/components/BtnCreate";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UISearch from "@app/libs/ui/UISearch";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import global from "@app/global";

export default withRouter(
  observer(({ showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    const [_data, _setData] = useState([]);
    const field = [
      "DocEntry",
      "DocDate",
      "DocDueDate",
      "CardCode",
      "CardName",
      "U_IDU_PAYNUM",
      "U_WONUM"
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
    // const [filter, setFilter] = useState<any[]>([]);
    // const filterSearch = (filter: any) => {
    //   let query: APISearchProps = {
    //     Table: "ORCT",
    //     Fields: field,
    //     Condition: filter
    //   };

    //   APISearch(query).then((res: any) => {
    //     setData(res);
    //     _setData(res);
    //   });
    // }

    useEffect(() => {
      let query: APISearchProps = {
        Table: "ORCT",
        Fields: field,
        Condition: [
          {
            field: "U_BRANCH",
            cond: "=",
            value: global.getSession().user.branch
          }
        ]
      };

      APISearch(query).then((res: any) => {
        setData(res);
        _setData(res);
      });
    }, []);

    return (
      <UIContainer>
        <UIHeader
          showSidebar={showSidebar}
          sidebar={sidebar}
          center={"Payment Receipt"}
        >
          <BtnCreate path="/payment-receipt/form" />
        </UIHeader>
        <UIBody>
          <UISearch onSearch={funcSearch} />
          <UIList
            style={{ flex: 1 }}
            primaryKey="DocEntry"
            selection="detail"
            fields={{
              U_IDU_PAYNUM: {
                table: {
                  header: "No. PR"
                }
              },
              U_WONUM: {
                table: {
                  header: "No. WO"
                }
              },
              CardName: {
                table: {
                  header: "Customer/Vendor"
                }
              },
              U_IDU_ITR_INTNUM: {
                table: {
                  header: "Request No."
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
        </UIBody>
      </UIContainer>
    );
  })
);
