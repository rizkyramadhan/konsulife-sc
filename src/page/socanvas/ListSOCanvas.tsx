import IconAdd from "@app/libs/ui/Icons/IconAdd";
import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { APISearchProps, APISearch } from "@app/api";
import UISearch from "@app/libs/ui/UISearch";
import global from "@app/global";

const BtnCreate = withRouter(({ history }: any) => {
  return (
    <UIButton
      size="small"
      color="primary"
      onPress={() => {
        history.push("/so-canvas/form");
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
  const field = ["DocNum", "U_IDU_SO_INTNUM", "CardName", "CardCode", "DocDate", "DocDueDate"];
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
    let cond: any[] = [];
    if (global.getSession().role === "branch") {
      cond = [{ cond: "AND" }, { field: "U_BRANCH", cond: "=", value: global.getSession().user.branch }];
    } else if (global.getSession().role === "sales_to") {
      cond = [{ cond: "AND" }, { field: "U_USERID", cond: "=", value: global.getSession().user.username }];
    }

    let query: APISearchProps = {
      Table: "ORDR",
      Condition: [{
        field: "DocStatus",
        cond: "=",
        value: "O"
      }, { cond: "AND" }, {
        field: "ObjType",
        cond: "=",
        value: 17
      },
      { cond: "AND" }, {
        field: "U_IDU_ISCANVAS",
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
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center={"SO Canvasing"}
      >
        <BtnCreate />
      </UIHeader>
      <UIBody>
        <UISearch onSearch={funcSearch}></UISearch>
        <UIList
          style={{ flex: 1 }}
          primaryKey="DocNum"
          selection="detail"
          fields={{
            U_IDU_SO_INTNUM: {
              table: {
                header: "No. SO"
              }
            },
            CardCode: {
              table: {
                header: "Customer Code"
              }
            },
            CardName: {
              table: {
                header: "Customer"
              }
            },
            DocDate: {
              table: {
                header: "Posting Date"
              }
            },
          }}
          items={_data.map((item: any) => ({
            ...item,
          }))}
        />
      </UIBody>
    </UIContainer>
  );
}));
