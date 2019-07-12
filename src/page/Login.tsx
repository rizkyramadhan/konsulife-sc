import config from "@app/backend";
import global from "@app/global";
import getSession from "@app/libs/gql/session/getSession";
import login from "@app/libs/gql/session/login";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UICard from "@app/libs/ui/UICard";
import UICol from "@app/libs/ui/UICol";
import UIContainer from "@app/libs/ui/UIContainer";
import UILoading from "@app/libs/ui/UILoading";
import UIRow from "@app/libs/ui/UIRow";
import UIText from "@app/libs/ui/UIText";
import UITextField from "@app/libs/ui/UITextField";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Alert, View, Image } from "reactxp";
import IconSignIn from '@app/libs/ui/Icons/IconSignIn';

const background = require("@app/assets/images/pattern.png");

const LoginForm = withRouter(({ history }: RouteComponentProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      global.setSession(session);
      if (!global.session.uid) {
        global.setSession(false);
      } else {
        history.replace("/");
      }
    })();
  }, []);

  return (
    <UICol size={4} xs={12} sm={12} style={{ alignItems: 'center' }}>
      <UICard style={{
        maxWidth: 450,
        padding: 25,
        backgroundColor: "#f7fafc",
        borderColor: '#fff',
        borderRadius: 4
      }}>
        <UIText
          size="extralarge"
          style={{ paddingTop: 20, textAlign: "center" }}
        >
          MBGP - Sales App
        </UIText>
        <UIText
          size="small"
          style={{ paddingTop: 10, paddingBottom: 20, textAlign: "center" }}
        >
          Silakan login sesuai dengan user di {config.url}
        </UIText>
        <UITextField
          label="Username"
          type="text"
          value={username}
          setValue={value => {
            setUsername(value);
          }}
          fieldStyle={{
            borderColor: '#e0e0e0',
            backgroundColor: '#fff',
          }}
        />

        <UITextField
          label="Password"
          type="password"
          value={password}
          setValue={value => {
            setPassword(value);
          }}
          fieldStyle={{
            borderColor: '#e0e0e0',
            backgroundColor: '#fff',
          }}
        />
        <UIRow style={{
          marginTop: 15,
          justifyContent: 'flex-end'
        }}>
          {loading ? (
            <UILoading />
          ) : (
              <UIButton
                onPress={async () => {
                  setLoading(true);
                  const res = await login(username, password);
                  if (!res) {
                    Alert.show("Gagal Login");
                    setLoading(false);
                  } else {
                    setLoading(false);
                    global.setSession(res);
                    history.replace("/");
                    // global.setSidebar(isSize(['md', 'lg']));
                  }
                }}
                attr={{
                  onMouseOver: () => setHover(true),
                  onMouseLeave: () => setHover(false)
                }}
                style={{
                  ...(hover ? { opacity: 1 } : { opacity: 0.8 })
                }}
              >
                <IconSignIn color="#fff" width={20} height={20} />
                <UIText style={{ color: "#fff" }} size="small"> Login</UIText>
              </UIButton>
            )}
        </UIRow>
      </UICard>
    </UICol>
  );
});

export default () => {
  const imgstyle: any = {
    position: 'absolute',
    width: '100%',
    height: '100%',
  };
  const style: any = {
    position: 'absolute',
    width: '100%',
    height: (window.innerHeight * 50 / 100),
  };
  const styleTitle: any = {
    display: 'flex',
    marginBottom: 60,
    alignItems: 'center'
  }
  return (
    <UIContainer>
      <View style={style}>
        <Image resizeMode="cover" style={imgstyle} source={background} />
      </View>
      <UIBody
        style={{
          position: "static",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: '#172b4d'
        }}
      >
        <View style={styleTitle}>
          <UIText size="extralarge" style={{ color: "#fff" }}>Welcome!</UIText>
          <UIText size="medium" style={{ color: "#fff" }}>
            Use these awesome forms to login or create new account in your project for free.
          </UIText>
        </View>
        <UIRow
          style={{
            width: "100%"
          }}
        >
          <UICol size={4} xs={0} sm={0} />
          <LoginForm />
          <UICol size={4} xs={0} sm={0} />
        </UIRow>
        <View style={{ ...styleTitle, marginBottom: 0, marginTop: 30 }}>
          <UIText size="small" style={{ color: "#fff" }}>
            &copy; 2019 MBGP. Supported by IDU.
          </UIText>
        </View>
      </UIBody>
    </UIContainer>
  );
};
