import { APISearch, APISearchProps } from '@app/api';
// import IconAdd from "@app/libs/ui/Icons/IconAdd";
// import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
// import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
// import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";

// const BtnCreate = withRouter(({ history }: any) => {
//   return (
//     <UIButton
//       size="small"
//       color="primary"
//       onPress={() => {
//         history.push("/pr/form");
//       }}
//       style={{
//         display: "flex",
//         flexDirection: "row",
//         justifyContent: "flex-end"
//       }}
//     >
//       <IconAdd color="#fff" />
//       {isSize(["md", "lg"]) && (
//         <UIText style={{ color: "#fff" }}>Create</UIText>
//       )}
//     </UIButton>
//   );
// });

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let query: APISearchProps = {
      Table: "OPOR",
      Fields: ["DocNum","DocEntry", "CardName", "CardCode", "U_IDU_PO_INTNUM", "U_IDU_SUP_SONUM"],
      Condition:[{
          field:"DocStatus",
          cond:"=",
          value:"O"
      }]
    };
    APISearch(query).then((res: any) => {
      setData(res);
    })
  }, []);
  
  return (
    <UIContainer>
      <UIHeader showSidebar={showSidebar} sidebar={sidebar} center={"Purchase Receipt"}>
      </UIHeader>
      <UIBody>
        <UIList
          style={{ flex: 1 }}
          primaryKey="DocNum"
          selection="single"
          onSelect={(item) => { 
            console.log(item);
            history.push('/pr/form/'+item.DocEntry); 
          }}
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
            U_IDU_PO_INTNUM: {
              table: {
                header: 'No. PO'
              }
            },
            U_IDU_SUP_SONUM: {
              table: {
                header: 'No. SO Supplier'
              }
            }
          }}
          items={data}
        />
      </UIBody>
    </UIContainer>
  );
}));