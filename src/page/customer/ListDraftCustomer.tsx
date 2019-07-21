import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "@app/libs/router/Routing";
import { APISearch, APISearchProps } from '@app/api';
import UISearch from '@app/libs/ui/UISearch';
import global from '@app/global';
import UICard, { UICardHeader } from '@app/libs/ui/UICard';
import UIText from '@app/libs/ui/UIText';

export default withRouter(
  observer(({ showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    const [_data, _setData] = useState([]);
    const [loading, setLoading] = useState(false);

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
        Table: "OCRD",
        Fields: field,
        Condition: [
          {
            field: "CardType",
            cond: "=",
            value: "L"
          },
          {
            cond: "AND"
          },
          {
            field: "validFor",
            cond: "=",
            value: "Y"
          },
          { cond: "AND" },
          {
            field: "U_IDU_BRANCH",
            cond: "=",
            value: global.session.user.branch
          }
        ]
      };

      APISearch(query).then((res: any) => {
        setData(res);
        _setData(res);
        setLoading(false);
      });
    }, []);

    return (
      <UIContainer>
        <UIHeader pattern={true} isLoading={loading} showSidebar={showSidebar} sidebar={sidebar} center={
          <UIText size="large" style={{ color: '#fff' }}>Customer</UIText>
        }></UIHeader>
        <UIBody>
          <UICard mode="clean" style={{ borderRadius: 4, flex: 1, backgroundColor: '#fff' }}>
            <UICardHeader style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
              <UIText size="medium" style={{
                flexShrink: 'none',
                width: '100%'
              }}>List Customer Draft</UIText>
              <UISearch style={{
                width: '100%',
                maxWidth: 300
              }}
                fieldStyle={{
                  borderWidth: 0,
                  backgroundColor: '#f6f9fc'
                }} onSearch={funcSearch}></UISearch>
            </UICardHeader>
            <UIList
              style={{ flex: 1 }}
              primaryKey="CardCode"
              selection="detail"
              fields={{
                CardCode: {
                  table: {
                    header: "BP Code"
                  }
                },
                CardName: {
                  table: {
                    header: "BP Name"
                  }
                },
                CardFName: {
                  table: {
                    header: "Foreign Name"
                  }
                }
              }}
              items={_data.map((item: any) => ({
                ...item,
              }))}
            />
          </UICard>
        </UIBody >
      </UIContainer >
    );
  }));
