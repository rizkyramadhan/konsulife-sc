import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { APISearch, APISearchProps } from '@app/api';
import UIButton from '@app/libs/ui/UIButton';
import IconCopy from '@app/libs/ui/Icons/IconCopy';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';

export default withRouter(observer(({ match, history, showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  const [itemSelect, setItemSelect] = useState<any[]>([]);

  useEffect(() => {
    let query: APISearchProps = {
      Table: "ORDR",
      Fields: ["DocEntry", "CardCode", "CardName", "U_IDU_SO_INTNUM", "DocDate"],
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
          field: "ObjType",
          cond: "=",
          value: "17"
        },
        {
          cond: "AND"
        },
        {
          field: "CardCode",
          cond: "=",
          value: atob(match.params.CardCode)
        }
      ]
    };

    APISearch(query).then((res: any) => {
      setData(res);
    })
  }, []);

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center={`Delivery Order #${atob(match.params.CardCode)} - ${atob(match.params.CardName)}`}
      >
        <UIButton
          size="small"
          color="success"
          onPress={() => {
            if (itemSelect.length === 0) return;
            history.push(`/do/form/${match.params.CardCode}/${match.params.CardName}/${btoa(JSON.stringify(itemSelect))}`)
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end"
          }}
        >
          <IconCopy color="#fff" />
          {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }}>Copy</UIText>
          )}
        </UIButton>
      </UIHeader>
      <UIBody scroll={true}>
        <UIList
          primaryKey="DocEntry"
          style={{ backgroundColor: "#fff" }}
          selection="multi"
          onSelect={(item) => {
            const idx = itemSelect.findIndex((x: any) => x.DocEntry == item.DocEntry);
            if (idx >= 0) {
              itemSelect.splice(idx, 1);
            } else {
              itemSelect.push({ DocEntry: item.DocEntry, SONumber: item.U_IDU_SO_INTNUM });
            }
            setItemSelect([...itemSelect]);
          }}
          fields={{
            CardCode: {
              table: {
                header: 'Customer Code'
              }
            },
            CardName: {
              table: {
                header: 'Customer Name'
              }
            },
            U_IDU_SO_INTNUM: {
              table: {
                header: 'SO No.'
              }
            },
            DocDate: {
              table: {
                header: 'Posting Date'
              }
            }
          }}
          items={data}
        />
      </UIBody>
    </UIContainer>
  );
}));
