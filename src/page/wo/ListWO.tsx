import BtnCreate from "@app/components/BtnCreate";
import rawQuery from '@app/libs/gql/data/rawQuery';
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import global from '@app/global';
import UISearch from '@app/libs/ui/UISearch';

interface IWO {
  id: number
  number: string
  return_date: string
  sales_details: string
  sales_id: string
  sales_name: string
  visite_date: string
  sopir: string
  sopir_nopol: string
  status: string
}

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
  const [data, setData]: any = useState<IWO[]>([]);
  const [_data, _setData]: any = useState<IWO[]>([]);
  const field = ["number", "return_date", "sales_name", "visite_date", "status", "sopir", "sopir_nopol"];

  useEffect(() => {
    rawQuery(`{
      work_order (where: {branch: {_eq: "${global.getSession().user.branch}"}, status: {_in: ["pending", "open"]}}) {
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
    }`).then((res) => {
      setData([...res.work_order]);
      _setData([...res.work_order]);
    });
  }, []);

  const funcSearch = (value: string) => {
    _setData([...(value ? data.filter((x: any) => {
      let res = false;
      for (var i = 0; i < field.length; i++) {
        if (x[field[i]] && x[field[i]].toLowerCase().includes(value.toLowerCase())) {
          res = true;
          break;
        }
      }
      return res
    }) : data)])
  }

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center={"Working Order"}
      >
        <BtnCreate path="/wo/form" />
      </UIHeader>
      <UIBody scroll={true}>
        <UISearch onSearch={funcSearch}></UISearch>
        <UIList
          style={{ flex: 1 }}
          primaryKey="id"
          selection="single"
          onSelect={(d) => {
            history.push('/wo/form/' + d.id)
          }}
          fields={{
            number: {
              table: {
                header: "No. WO",
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
                header: "Status",
              }
            },
            visite_date: {
              table: {
                header: "Visite",
              }
            }
          }}
          items={_data.map((item: any) => ({
            ...item,
          }))}
        />
      </UIBody>
    </UIContainer>
  );
}));