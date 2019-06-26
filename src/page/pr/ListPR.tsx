import { APISearch, APISearchProps } from "@app/api";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import UIButton from '@app/libs/ui/UIButton';
import IconCopy from '@app/libs/ui/Icons/IconCopy';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';

let selectedItems:any[];  
const BtnCopy = withRouter(({ history }: any) => {
  return (
    <UIButton
      size="small"
      color="success"
      onPress={() => {
        if(selectedItems !== undefined && selectedItems.length>0)
        {
          let key=selectedItems.join("|");
          history.push("/pr/form/" + btoa(key));
        }
        else
        {
          alert("Please Select PO!");
        }
        
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
      }}
    >
      <IconCopy color="#fff" />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff" }}>Copy PO</UIText>
      )}
    </UIButton>
  );
});

export default withRouter(observer(({ match,showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  const param = atob(match.params.id).split("|",2);

  useEffect(() => {
    let query: APISearchProps = {
      Table: "OPOR",
      Fields: [],
      Condition: [
        {
          field: "DocStatus",
          cond: "=",
          value: "O"
        },
        {
          cond:"AND"
        },
        {
          field:"CardCode",
          cond:"=",
          value:param[0]
        }
      ]
    };

    APISearch(query).then((res: any) => {
      setData(res);
    });
  }, []);

  return (
    <UIContainer>
      <UIHeader showSidebar={showSidebar} sidebar={sidebar} center={"Purchase Receipt " + param[1]}>
          <BtnCopy></BtnCopy>
      </UIHeader>
      <UIBody>
        <UIList
          style={{ flex: 1 }}
          primaryKey="DocEntry"
          selection="multi"
          onSelect={(_,selected)=>{selectedItems = selected}}
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
            },
          }}
          items={data.map((item: any) => ({
            ...item,
          }))}
        />
      </UIBody>
    </UIContainer>
  );
}));