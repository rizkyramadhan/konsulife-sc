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
import UIButton from "@app/libs/ui/UIButton";
import UIText from "@app/libs/ui/UIText";
import { isSize } from "@app/libs/ui/MediaQuery";
import IconCheck from "@app/libs/ui/Icons/IconCheck";
import IconLuggageCart from "@app/libs/ui/Icons/IconLuggageCart";
import UICard, { UICardHeader } from '@app/libs/ui/UICard';

const BtnTransfer = withRouter(({ history }: any) => {
  return (
    <UIButton
      size="small"
      color="primary"
      onPress={() => {
        history.push("/it-tran");
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        height: 45
      }}
    >
      <IconLuggageCart color="#fff" width={20} height={20} />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff" }} size="small">
          {" "}
          Stock Transfer
        </UIText>
      )}
    </UIButton>
  );
});

const BtnReturn = withRouter(({ history }: any) => {
  return (
    <UIButton
      size="small"
      color="success"
      onPress={() => {
        history.push("/it-ret");
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        height: 45,
        justifyContent: "flex-end"
      }}
    >
      <IconCheck color="#fff" width={20} height={20} />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff" }} size="small">
          Stock Return
        </UIText>
      )}
    </UIButton>
  );
});

export default withRouter(
  observer(({ showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    const [_data, _setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const field = [
      "DocNum",
      "U_IDU_SO_INTNUM",
      "CardName",
      "CardCode",
      "DocDate",
      "DocDueDate"
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
        Table: "OWTR",
        Fields: [
          "DocNum",
          "DocEntry",
          "CardName",
          "CardCode",
          "U_IDU_IT_INTNUM",
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
            field: "U_BRANCH",
            cond: "=",
            value: global.session.user.branch
          },
          {
            cond: "AND"
          },
          {
            field: "U_STOCK_RETURN",
            cond: "=",
            value: "N"
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
        <UIHeader pattern={true} isLoading={loading} showSidebar={showSidebar} sidebar={sidebar} center={
          <UIText size="large" style={{ color: '#fff' }}> Inventory Transfer</UIText>
        }>
          <BtnTransfer />
          <BtnReturn />
        </UIHeader>
        <UIBody>
          <UICard mode="clean" style={{ borderRadius: 4, flex: 1, backgroundColor: '#fff' }}>
            <UICardHeader style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
              <UIText size="medium" style={{
                flexShrink: 'none',
                width: '100%'
              }}>Outstanding Stock Transfer</UIText>
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
              primaryKey="DocNum"
              selection="detail"
              fields={{
                U_IDU_IT_INTNUM: {
                  table: {
                    header: "Request No."
                  }
                },
                CardName: {
                  table: {
                    header: "BP"
                  }
                },
                CardCode: {
                  table: {
                    header: "Code"
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
          </UICard>
        </UIBody>
      </UIContainer>
    );
  })
);
