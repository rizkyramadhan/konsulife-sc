import { APISearch, APISearchProps } from "@app/api";
import BtnCopy from "@app/components/BtnCopy";
import global from "@app/global";
import { withRouter } from "@app/libs/router/Routing";
import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import UICol from "@app/libs/ui/UICol";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UIRow from "@app/libs/ui/UIRow";
import UISearch from "@app/libs/ui/UISearch";
import UIText from "@app/libs/ui/UIText";
import { getParams } from "@app/utils/Helper";
import { decode as atob, encode as btoa } from "base-64";
import React, { useEffect, useState } from "react";

let selectedItems: any[];

export default withRouter(({ history, match }: any) => {
  match.params = getParams(history.location.pathname);
  const [data, setData] = useState([]);
  const param = atob(match.params.id).split("|", 2);
  const [_data, _setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const field = [
    "DocNum",
    "DocEntry",
    "CardName",
    "CardCode",
    "U_IDU_PO_INTNUM",
    "U_IDU_SUP_SONUM",
    "U_IDU_DO_INTNUM"
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
    let cond: any = [];
    if (global.session.role != "admin") {
      cond = [
        {
          cond: "AND"
        },
        {
          field: "U_BRANCH",
          cond: "=",
          value: global.getSession().user.branch
        }
      ];
    }
    let query: APISearchProps = {
      Table: "OPOR",
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
        ...cond
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
        showSidebar={global.setSidebar}
        sidebar={global.sidebar}
        center={
          <UIText size="large" style={{ color: "#fff" }}>
            {param[1]}
          </UIText>
        }
        isLoading={loading}
      >
        <BtnCopy
          onPress={() => {
            if (selectedItems !== undefined && selectedItems.length > 0) {
              let key = selectedItems.join("|");
              history.push("/pr/form/" + btoa(key));
            } else {
              alert("Anda belum memilih PO.");
            }
          }}
          label="Copy PO"
        />
      </UIHeader>
      <UIBody>
        <UICard
          mode="clean"
          style={{ borderRadius: 4, flex: 1, backgroundColor: "#fff" }}
        >
          <UICardHeader
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <UIRow style={{ flex: 1 }}>
              <UICol
                size={6}
                xs={12}
                sm={12}
                md={6}
                lg={6}
                style={{ justifyContent: "center", height: 35 }}
              >
                <UIText size="medium">List Purchase Order</UIText>
              </UICol>
              <UICol
                size={6}
                xs={12}
                sm={12}
                md={6}
                lg={6}
                style={{ justifyContent: "center", alignItems: "flex-end" }}
              >
                <UISearch
                  style={{
                    width: "100%",
                    ...(isSize(["md", "lg"]) ? { maxWidth: 300 } : {})
                  }}
                  fieldStyle={{
                    borderWidth: 0,
                    backgroundColor: "#f6f9fc"
                  }}
                  onSearch={funcSearch}
                />
              </UICol>
            </UIRow>
          </UICardHeader>
          <UIList
            style={{ flex: 1 }}
            primaryKey="DocEntry"
            selection="multi"
            onSelect={(_, selected) => {
              selectedItems = selected;
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
              },
              DueDate: {
                table: {
                  header: "Posting Date"
                }
              },
              U_IDU_DO_INTNUM: {
                table: {
                  header: "No. DO"
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
});
