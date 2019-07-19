import BtnCreate from "@app/components/BtnCreate";
import rawQuery from "@app/libs/gql/data/rawQuery";
import UIBody from "@app/libs/ui/UIBody";
import UICard, { UICardHeader } from "@app/libs/ui/UICard";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import global from "@app/global";

export default withRouter(
  observer(({ history }: any) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      const getUser = async () => {
        await rawQuery(`{
                user{
                  bpgroup
                  fullname
                  id
                  warehouse_id
                  username
                  sap_id
                  role
                }
              }`).then(res => {
          setData(res.user);
          setLoading(false);
        });
      };
      getUser();
    }, []);
    return (
      <UIContainer>
        <UIHeader
          pattern={true}
          isLoading={loading}
          showSidebar={global.setSidebar}
          sidebar={global.sidebar}
          center={
            <UIText size="large" style={{ color: "#fff" }}>
              User
            </UIText>
          }
        >
          <BtnCreate path="/user/form" />
        </UIHeader>
        <UIBody>
          <UICard
            mode="clean"
            style={{ borderRadius: 4, flex: 1, backgroundColor: "#fff" }}
          >
            <UICardHeader>
              <UIText size="medium">List User</UIText>
            </UICardHeader>
            <UIList
              style={{ flex: 1 }}
              primaryKey="id"
              selection="detail"
              onSelect={item => {
                history.push("/user/form/" + item.id);
              }}
              fields={{
                id: {
                  table: {
                    header: "Id"
                  }
                },
                fullname: {
                  table: {
                    header: "Name"
                  }
                },
                warehouse_id: {
                  table: {
                    header: "Warehouse Code"
                  }
                },
                bpgroup: {
                  table: {
                    header: "BP Group"
                  }
                }
              }}
              items={data}
            />
          </UICard>
        </UIBody>
      </UIContainer>
    );
  })
);
