import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { APISearch, APISearchProps } from '@app/api';
import UISearch from '@app/libs/ui/UISearch';
import BtnDraft from '@app/components/BtnDraft';
import BtnCreate from '@app/components/BtnCreate';

export default withRouter(observer(({ showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  const [_data, _setData] = useState([]);
  const field = [
    "CardName",
    "CardFName",
    "CardCode",
    "CardType",
    "GroupCode",
    "LicTradNum",
    "AddID",
    "SlpCode",
    "Phone1",
    "Phone2",
    "U_IDU_AREA",
    "U_IDU_BRANCH"
  ];
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

  useEffect(() => {
    let query: APISearchProps = {
      Table: "OCRD",
      Fields: field,
      Condition: [{
        field: "CardType",
        cond: "=",
        value: "C"
      },{
        cond: "AND"
      }, {
        field: "validFor",
        cond: "=",
        value: "Y"
      }]
    };

    APISearch(query).then((res: any) => {
      setData(res);
      _setData(res);
    });
  }, []);

  return (
    <UIContainer>
      <UIHeader showSidebar={showSidebar} sidebar={sidebar} center={"Customer"}>
        <BtnDraft path="/customer/draft" />
        <BtnCreate path="/customer/form" />
      </UIHeader>
      <UIBody>
        <UISearch onSearch={funcSearch}></UISearch>
        <UIList
          style={{ flex: 1 }}
          primaryKey="CardCode"
          selection="detail"
          fields={{
            CardCode: {
              table: {
                header: 'BP Code'
              }
            },
            CardName: {
              table: {
                header: 'BP Name'
              }
            },
            CardFName: {
              table: {
                header: 'Foreign Name'
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
