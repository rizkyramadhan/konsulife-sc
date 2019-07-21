import global from "@app/global";
import getSession from "@app/libs/gql/session/getSession";
import logout from "@app/libs/gql/session/logout";
import {
  Router,
  RouteComponentProps,
  withRouter
} from "@app/libs/router/Routing";
import SwitchRoute, { RouteState } from "@app/libs/router/SwitchRoute";
import IconCaretDown from "@app/libs/ui/Icons/IconCaretDown";
import IconSignOut from "@app/libs/ui/Icons/IconSignOut";
import IconUser from "@app/libs/ui/Icons/IconUser";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UILoading from "@app/libs/ui/UILoading";
import UISeparator from "@app/libs/ui/UISeparator";
import UISidebar from "@app/libs/ui/UISidebar";
import UISimpleList from "@app/libs/ui/UISimpleList";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Platform, View } from "reactxp";
import Login from "./Login";
import MenuList from "./MenuList";
import { isSize } from "@app/libs/ui/MediaQuery";
import RouteList from "./RouteList";

interface MenuProps extends RouteComponentProps<any> {
  setSide: any;
}

const MenuItem = ({ item, history, path, setPath, setSide, child }: any) => {
  const [expand, setExpand] = useState(false);
  const [activePar, setActivePar] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    let idx =
      item.children && item.children.findIndex((x: any) => x.path == path);
    if (idx > -1) {
      setExpand(true);
      setActivePar(true);
    } else {
      setExpand(false);
      setActivePar(false);
    }
  }, [path]);
  if (item.children && item.children.length > 0) {
    return (
      <View>
        <View
          style={{
            padding: 0,
            ...(activePar ? { backgroundColor: "#2ece896e" } : {})
          }}
        >
          <UIButton
            onPress={() => {
              setExpand(!expand);
            }}
            attr={{
              onMouseOver: () => setHover(true),
              onMouseLeave: () => setHover(false)
            }}
            animation={false}
            fill="clear"
            style={{
              margin: 0,
              width: "100%",
              flexShrink: 0,
              justifyContent: "flex-start",
              paddingTop: 15,
              paddingBottom: 15
            }}
          >
            {item.icon && item.icon}
            <View
              style={{
                opacity: 0.7,
                ...(hover ? { opacity: 1 } : activePar ? { opacity: 1 } : {})
              }}
            >
              {item.title}
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "flex-end",
                opacity: 0.7
              }}
            >
              {item.children && item.children.length > 0 && (
                <IconCaretDown width={20} height={20} />
              )}
            </View>
          </UIButton>

          {/* <UISeparator
            style={{
              marginTop: 0,
              marginBottom: 0,
              borderColor: "#e8f1ff"
            }}
          /> */}
        </View>
        {expand && (
          <UISimpleList
            style={{
              paddingTop: 0,
              paddingBottom: 0,
              marginLeft: 25,
              borderWidth: 0,
              borderLeftWidth: 2,
              borderColor: "#009688"
            }}
            data={item.children}
            renderItems={(child, opt) => {
              if (child.roles.indexOf(global.session.user.role) > -1)
                return (
                  <MenuItem
                    key={opt.index}
                    item={child}
                    history={history}
                    path={path}
                    setPath={setPath}
                    setSide={setSide}
                    sperator="#e2e2e2"
                    child={true}
                  />
                );
              else return;
            }}
          />
        )}
      </View>
    );
  } else {
    return (
      <View
        style={{
          padding: 0,
          ...(item.path == path ? { backgroundColor: "#d3f7e4" } : {})
        }}
      >
        <UIButton
          onPress={() => {
            history.replace(item.path);
            setPath(item.path);
            if (
              Platform.getType() !== "web" ||
              (Platform.getType() == "web" && isSize(["xs", "sm"]))
            ) {
              setSide(false);
            }
          }}
          attr={{
            onMouseOver: () => setHover(true),
            onMouseLeave: () => setHover(false)
          }}
          animation={false}
          fill="clear"
          style={{
            margin: 0,
            width: "100%",
            // flexShrink: 0,
            justifyContent: "flex-start",
            paddingTop: 15,
            paddingBottom: 15,
            ...(child ? { paddingTop: 8, paddingBottom: 8 } : {})
          }}
        >
          {item.icon && item.icon}
          <View
            style={{
              opacity: 0.7,
              ...(hover
                ? { opacity: 1 }
                : item.path == path
                ? { opacity: 1 }
                : {})
            }}
          >
            {item.title}
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "flex-end"
            }}
          />
        </UIButton>

        {/* <UISeparator
          style={{
            marginTop: 0,
            marginBottom: 0,
            borderColor: sperator
          }}
        /> */}
      </View>
    );
  }
};

const Menu = withRouter(({ history, setSide }: MenuProps) => {
  const [path, setPath] = useState("");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    let routeList: any = [];
    MenuList.map((item: any) => {
      if (item.children) {
        item.children.map((child: any) => {
          routeList.push(child.path);
        });
      } else {
        routeList.push(item.path);
      }
    });
    RouteState.setRootPaths(routeList);

    let path = history.location.pathname.split("/");
    setPath(`/${path[1]}`);
  }, []);
  return (
    <UIBody
      scroll={true}
      style={{ padding: 0, paddingLeft: 0, paddingRight: 0 }}
    >
      <UISimpleList
        style={{
          paddingTop: 0,
          paddingBottom: 0,
          flex: 1
        }}
        data={MenuList}
        renderItems={(item, opt) => {
          if (item.roles.indexOf(global.session.user.role) > -1)
            return (
              <MenuItem
                key={opt.index}
                item={item}
                history={history}
                path={path}
                setPath={setPath}
                setSide={setSide}
                sperator="#e8f1ff"
              />
            );
          else return;
        }}
      >
        <View>
          <UIButton
            onPress={async () => {
              await logout();
              global.removeSession();
              history.replace("/login");
              setSide(false);
            }}
            attr={{
              onMouseOver: () => setHover(true),
              onMouseLeave: () => setHover(false)
            }}
            animation={false}
            fill="clear"
            style={{ width: "100%", justifyContent: "flex-start" }}
            color="#fff"
          >
            <IconSignOut width={20} height={20} color="#f5365c" />
            <UIText
              style={{
                color: "#525f7f",
                paddingLeft: 15,
                ...(hover ? { opacity: 1 } : { opacity: 0.7 })
              }}
            >
              {" "}
              Logout
            </UIText>
          </UIButton>
        </View>
      </UISimpleList>
    </UIBody>
  );
});

export default observer((_props: any) => {
  // global.setSidebar(isSize(['md', 'lg']));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      global.setSession(await getSession());
      setLoading(false);
    };
    check();
  }, []);

  if (loading) {
    return (
      <UIContainer>
        <UIBody
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            display: "flex"
          }}
        >
          <UILoading style={{ width: 100, height: 100 }} />
        </UIBody>
      </UIContainer>
    );
  }
  return (
    <Router>
      {!global.session.uid ? (
        <Login />
      ) : (
        <UISidebar
          style={{ width: 300, background: "#fff" }}
          visible={global.sidebar}
          setVisible={global.setSidebar}
          sidebar={
            <View style={{ flex: 1 }}>
              {/* <Image
                source={require("@app/libs/sample/imgs/logo.png")}
                resizeMode="contain"
                style={{
                  margin: 0,
                  marginLeft: 15,
                  marginRight: 15,
                  width: 115,
                  height: 115,
                  alignSelf: "center"
                }}
              /> */}
              <View
                style={{
                  margin: 15,
                  marginLeft: 0,
                  paddingLeft: 20,
                  borderWidth: 0,
                  borderLeftWidth: 6,
                  borderColor: "#2ece9d"
                }}
              >
                <UIText size="large">MBGP - Sales App</UIText>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10
                  }}
                >
                  <IconUser width={20} height={20} />
                  <UIText size="medium">{global.session.user.fullname}</UIText>
                </View>
              </View>
              <UISeparator
                style={{
                  opacity: 0.4,
                  marginTop: 0,
                  marginBottom: 0
                }}
              />
              <Menu setSide={global.setSidebar} />
            </View>
          }
        >
          <SwitchRoute routes={RouteList} />
        </UISidebar>
      )}
    </Router>
  );
});
