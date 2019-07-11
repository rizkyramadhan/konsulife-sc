import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { APISearch, APISearchProps } from "@app/api";
import UISearch from "@app/libs/ui/UISearch";
import global from "@app/global";
import UIText from '@app/libs/ui/UIText';
import UICard, { UICardHeader } from '@app/libs/ui/UICard';

export default withRouter(
  observer(({ history, showSidebar, sidebar }: any) => {
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
        Table: "OCRD",
        Fields: ["CardCode", "CardName"],
        Condition: [
          {
            field: "CardType",
            cond: "=",
            value: "C"
          },
          { cond: "AND" },
          {
            field: "validFor",
            cond: "=",
            value: "Y"
          },
          {
            cond: "AND"
          },
          {
            field: "U_IDU_BRANCH",
            cond: "=",
            value: global.session.user.branch
          },
          {
            cond: "AND"
          },
          {
            field: "U_SALES",
            cond: "=",
            value: "N"
          }
        ]
      };

      APISearch(query).then((res: any) => {
        setField(Object.keys(res[0]));
        setData(res);
        _setData(res);
        setLoading(false);
      });
    }, []);

    return (
      <UIContainer>
        <UIHeader pattern={true} isLoading={loading} showSidebar={showSidebar} sidebar={sidebar} center={
          <UIText size="large" style={{ color: '#fff' }}>Delivery Order</UIText>
        } />
        <UIBody>
          <UICard mode="clean" style={{ borderRadius: 4, flex: 1, backgroundColor: '#fff' }}>
            <UICardHeader style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
              <UIText size="medium" style={{
                flexShrink: 'none',
                width: '100%'
              }}>List Customer</UIText>
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
              primaryKey="CardCode"
              style={{ backgroundColor: "#fff" }}
              selection="single"
              onSelect={item => {
                history.push(
                  `/do/open/${btoa(item.CardCode)}/${btoa(item.CardName)}`
                );
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
                }
              }}
              items={_data}
            />
          </UICard>
        </UIBody>
      </UIContainer>
    );
  })
);
