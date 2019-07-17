import BtnCreate from "@app/components/BtnCreate";
import global from "@app/global";
import rawQuery from "@app/libs/gql/data/rawQuery";
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
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";

interface IRute {
  id: number;
  name: string;
  description: string;
}

export default withRouter(
  observer(({ history }: any) => {
    const [data, setData]: any = useState<IRute[]>([]);
    const [_data, _setData]: any = useState<IRute[]>([]);
    const field = ["name", "description"];
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      rawQuery(`{
      rute (where: {branch: {_eq: "${global.getSession().user.branch}"}}) {
          name
          id
          description
      }
    }`).then(res => {
        setData([...res.rute]);
        _setData([...res.rute]);
        setLoading(false);
      });
    }, []);

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

    return (
      <UIContainer>
        <UIHeader
          pattern={true}
          isLoading={loading}
          showSidebar={global.setSidebar}
          sidebar={global.sidebar}
          center={
            <UIText size="large" style={{ color: "#fff" }}>
              Master Route
            </UIText>
          }
        >
          <BtnCreate path="/rute/form" />
        </UIHeader>
        <UIBody scroll={true}>
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
                  <UIText size="medium">List Route</UIText>
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
              primaryKey="id"
              selection="single"
              onSelect={d => {
                history.push("/rute/form/" + d.id);
              }}
              fields={{
                name: {
                  table: {
                    header: "Nama"
                  }
                },
                description: {
                  table: {
                    header: "Deskripsi"
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
