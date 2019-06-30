import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import BtnCreate from "@app/components/BtnCreate";
import rawQuery from '@app/libs/gql/data/rawQuery';
import global from '@app/global';

interface IRute {
  id: number,
  name: string,
  description: string
}

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
  const [data, setData]: any = useState<IRute[]>([]);
  useEffect(() => {
    rawQuery(`{
      rute (where: {branch: {_eq: "${global.getSession().user.branch}"}}) {
          name
          id
          description
      }
    }`).then((res) => {
      setData([...res.rute]);
    });
  }, []);

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center={"Master Rute"}
      >
        <BtnCreate path="/rute/form" />
      </UIHeader>
      <UIBody scroll={true}>
        <UIList
          style={{ flex: 1 }}
          primaryKey="id"
          selection="single"
          onSelect={(d) => {
            history.push('/rute/form/' + d.id)
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
          items={data}
        />
      </UIBody>
    </UIContainer>
  );
}));
