import { APISearch, APISearchProps } from "@app/api";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UISearch from "@app/libs/ui/UISearch";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import global from "@app/global";
import BtnCreate from '@app/components/BtnCreate';
import UICard, { UICardHeader } from '@app/libs/ui/UICard';
import UIText from '@app/libs/ui/UIText';

export default withRouter(
  observer(({ history, match, showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    const param = atob(match.params.vendor).split("|", 2);
    const [_data, _setData] = useState([]);
    const [loading, setLoading] = useState(false);

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
      setLoading(true);
      let query: APISearchProps = {
        Table: "OPDN",
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
            <UIText size="large" style={{ color: '#fff' }}>{param[1]}</UIText>
          }
          isLoading={loading}
        >
          <BtnCreate path={"/pr/list/" + match.params.vendor} />
        </UIHeader>
        <UIBody>
        <UICard mode="clean" style={{ borderRadius: 4, flex: 1, backgroundColor: '#fff' }}>
            <UICardHeader style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
              <UIText size="medium" style={{
                flexShrink: 'none',
                width: '100%'
              }}>List Purchase Receipt</UIText>
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
            primaryKey="DocEntry"
            selection="single"
            onSelect={(d) => {
                history.push(`/pr/view/${match.params.vendor}/${d.DocEntry}`)
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
          </UICard>  
        </UIBody>
      </UIContainer>
    );
  })
);
