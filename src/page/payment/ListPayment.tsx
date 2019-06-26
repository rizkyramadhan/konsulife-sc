import { APISearch, APISearchProps } from '@app/api';
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import UIRow from '@app/libs/ui/UIRow';
import UIButton from '@app/libs/ui/UIButton';
import IconRemove from '@app/libs/ui/Icons/IconRemove';
import { isSize } from '@app/libs/ui/MediaQuery';
import IconAdd from '@app/libs/ui/Icons/IconAdd';
import UIText from '@app/libs/ui/UIText';
import UISearch from '@app/libs/ui/UISearch';

const BtnCreate = withRouter(({ history }: any) => {
  return (
    <UIButton
      size="small"
      color="primary"
      onPress={() => {
        history.push("/payment-receipt/form");
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
      }}
    >
      <IconAdd color="#fff" />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff" }}>Create</UIText>
      )}
    </UIButton>
  );
});

export default withRouter(observer(({ showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  const [_data, _setData] = useState([]);
  const field = ["DocEntry", "DocDate", "DocDueDate", "CardCode", "CardName"];
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
      Table: "ORCT",
      Fields: field
    };

    APISearch(query).then((res: any) => {
      setData(res);
      _setData(res);
    });
  }, []);

  return (
    <UIContainer>
      <UIHeader showSidebar={showSidebar} sidebar={sidebar} center={"Payment Receipt"}>
        <BtnCreate />
      </UIHeader>
      <UIBody>
        <UISearch onSearch={funcSearch}></UISearch>
        <UIList
          style={{ flex: 1 }}
          primaryKey="DocEntry"
          fields={{
            CardName: {
              table: {
                header: 'Customer/Vendor'
              }
            },
            CardCode: {
              table: {
                header: 'Code'
              }
            },
            U_IDU_ITR_INTNUM: {
              table: {
                header: 'Request No.'
              }
            },
            DocDate: {
              table: {
                header: 'Posting Date'
              }
            },
            action: {
              table: {
                header: 'Action'
              }
            }
          }}
          items={_data.map((item: any) => ({
            ...item,
            action: (
              <UIRow style={{ marginTop: 0 }}>
                <UIButton
                  size="small"
                  fill="clear"
                  style={{
                    marginTop: 0,
                    marginBottom: 0
                  }}
                  onPress={() => {
                    alert("remove!");
                  }}
                >
                  <IconRemove
                    height={18}
                    width={18}
                    color="red"
                    onPress={() => {
                      alert("remove!");
                    }}
                  />
                </UIButton>
              </UIRow>
            )
          }))}
        />
      </UIBody>
    </UIContainer>
  );
}));
