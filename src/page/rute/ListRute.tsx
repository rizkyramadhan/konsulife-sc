import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import BtnCreate from "@app/components/BtnCreate";
import rawQuery from "@app/libs/gql/data/rawQuery";
import global from "@app/global";
import UISearch from "@app/libs/ui/UISearch";

interface IRute {
  id: number;
  name: string;
  description: string;
}

export default withRouter(
  observer(({ history, showSidebar, sidebar }: any) => {
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
          showSidebar={showSidebar}
          sidebar={sidebar}
          center={"Master Rute"}
          isLoading={loading}
        >
          <BtnCreate path="/rute/form" />
        </UIHeader>
        <UIBody scroll={true}>
          <UISearch onSearch={funcSearch} />
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
        </UIBody>
      </UIContainer>
    );
  })
);
