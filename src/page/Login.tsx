import config from "@app/backend";
import getSession from "@app/libs/gql/session/getSession";
import login from "@app/libs/gql/session/login";
import logout from "@app/libs/gql/session/logout";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UICol from "@app/libs/ui/UICol";
import UIContainer from "@app/libs/ui/UIContainer";
import UIJsonDetail from "@app/libs/ui/UIJsonDetail";
import UIRow from "@app/libs/ui/UIRow";
import UIText from "@app/libs/ui/UIText";
import UITextField from "@app/libs/ui/UITextField";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Alert } from "reactxp";
import UICard from "@app/libs/ui/UICard";
import global from "@app/global";

const Logedin = ({ data, setLoading, showSidebar }: any) => {
  return (
    <UICol size={4} xs={12} sm={12}>
      <UIText size="extralarge" style={{ paddingTop: 50, textAlign: "center" }}>
        Logged in
      </UIText>
      <UIJsonDetail data={data} />
      <UIRow>
        <UIButton
          onPress={async () => {
            setLoading(true); // session loading
            await logout();
            global.removeSession();
            setLoading(false);
            showSidebar(false);
          }}
        >
          Logout
        </UIButton>
      </UIRow>
    </UICol>
  );
};

const LoginForm = observer(({ setLoading, showSidebar }: any) => {
  const data = useObservable({
    username: "coba",
    password: "123"
  });

  return (
    <UICol size={4} xs={12} sm={12}>
      <UICard style={{ padding: 25 }}>
        <UIText
          size="extralarge"
          style={{ paddingTop: 50, textAlign: "center" }}
        >
          Login Page
        </UIText>
        <UIText
          style={{ paddingTop: 10, paddingBottom: 20, textAlign: "center" }}
        >
          Silakan login sesuai dengan user di {config.url}
        </UIText>
        <UITextField
          label="Username"
          type="text"
          value={data.username}
          setValue={value => {
            data.username = value;
          }}
        />

        <UITextField
          label="Password"
          type="password"
          value={data.password}
          setValue={value => {
            data.password = value;
          }}
        />
        <UIRow>
          <UIButton
            onPress={async () => {
              setLoading(true); // set session as loading
              const res = await login(data.username, data.password);

              if (!res) {
                Alert.show("Gagal Login");
              } else {
                global.setSession(res);
                showSidebar(true);
              }

              setLoading(false);
            }}
          >
            Login
          </UIButton>
        </UIRow>
      </UICard>
    </UICol>
  );
});

export default observer(({ showSidebar }: any) => {
  const data = useObservable({
    loading: false
  });

  useEffect(() => {
    (async () => {
      const session = await getSession();
      global.setSession(session);
    })();
  }, []);

  const setLoading = (login: boolean) => {
    data.loading = login;
  };

  return (
    <UIContainer>
      <UIBody
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <UIRow
          style={{
            width: "100%"
          }}
        >
          <UICol size={4} xs={0} sm={0} />
          {data.loading === true ? (
            <UIText style={{ textAlign: "center", padding: 100 }}>
              Loading...
            </UIText>
          ) : global.session.uid === "" ? (
            <LoginForm setLoading={setLoading} showSidebar={showSidebar} />
          ) : (
            <Logedin
              data={global.session}
              setLoading={setLoading}
              showSidebar={showSidebar}
            />
          )}
          <UICol size={4} xs={0} sm={0} />
        </UIRow>
      </UIBody>
    </UIContainer>
  );
});
