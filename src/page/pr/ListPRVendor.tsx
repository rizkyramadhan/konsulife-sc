import { APISearch, APISearchProps } from "@app/api";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import UISearch from '@app/libs/ui/UISearch';
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
            value: "S"
          },
          {
            cond: "AND"
          },
          {
            field: "validFor",
            cond: "=",
            value: "Y"
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
        <UIHeader
          pattern={true}
          showSidebar={showSidebar}
          sidebar={sidebar}
          center={
            <UIText size="large" style={{ color: '#fff' }}>Purchase Receipt</UIText>
          }
          isLoading={loading}
        />
        <UIBody>
          <UICard mode="clean" style={{ borderRadius: 4, flex: 1, backgroundColor: '#fff' }}>
            <UICardHeader style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
              <UIText size="medium" style={{
                flexShrink: 'none',
                width: '100%'
              }}>List Vendor</UIText>
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
              selection="single"
              onSelect={item => {
                history.push(
                  "/pr/open/" + btoa(item.CardCode + "|" + item.CardName)
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
                    header: "Vendor"
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
  }));
