import global from "@app/global";
import getSession from "@app/libs/gql/session/getSession";
import logout from "@app/libs/gql/session/logout";
import { Route, Router, Switch } from "@app/libs/router/Routing";
import { isSize } from "@app/libs/ui/MediaQuery";
import UIButton from "@app/libs/ui/UIButton";
import UIGradient from "@app/libs/ui/UIGradient";
import UISeparator from "@app/libs/ui/UISeparator";
import UISidebar from "@app/libs/ui/UISidebar";
import UISimpleList from "@app/libs/ui/UISimpleList";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Image, Platform, View } from "reactxp";
import FormCustomer from "./customer/FormCustomer";
import ListCustomer from "./customer/ListCustomer";
import Login from "./Login";
import MainMenu from "./MainMenu";
import FormSO from "./so/FormSO";
import ListSO from "./so/ListSO";
import ListUser from "./user/ListUser";
import FormSOCanvas from "./socanvas/FormSOCanvas";
import ListSOCanvas from "./socanvas/ListSOCanvas";

interface MenuProps extends RouteComponentProps<any> {
  setSide: any;
}

const Menu = withRouter(({ history, setSide }: MenuProps) => {
  useEffect(() => {
    const check = async () => {
      global.setSession(await getSession());
      if (!global.session.uid) {
        history.replace("/login");
        setSide(false);
      } else {
        setSide(true);
      }
    };
    check();
  }, []);
  return (
    <UISimpleList
      data={[
        { label: "Work Order", path: "/wo" },
        { label: "SO Taking Order", path: "/so" },
        { label: "SO Canvasing", path: "/so-canvas" },
        { label: "Delivery Order", path: "/do" },
        { label: "AR Invoice", path: "/ar-invoice" },
        { label: "Payent Receipt", path: "/payment-receipt" },
        { label: "User", path: "/user" },
        { label: "Customer", path: "/customer" }
      ]}
      renderItems={(item, opt) => {
        return (
          <View key={opt.index}>
            <UIButton
              onPress={() => {
                history.push(item.path);
                if (Platform.getType() !== "web") {
                  setSide(false);
                }
              }}
              animation={false}
              fill="clear"
              style={{ width: "100%" }}
              color="#fff"
            >
              {item.label}
            </UIButton>

            <UISeparator
              style={{
                opacity: 0.2,
                marginTop: 0,
                marginBottom: 0
              }}
            />
          </View>
        );
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
          animation={false}
          fill="clear"
          style={{ width: "100%" }}
          color="#fff"
        >
          Logout
        </UIButton>

        <UISeparator
          style={{
            opacity: 0.2,
            marginTop: 0,
            marginBottom: 0
          }}
        />
      </View>
    </UISimpleList>
  );
});

export default (_props: any) => {
  const [side, setSide] = useState(isSize(["md", "lg"]));
  return (
    <Router>
      <UISidebar
        style={{ width: 300 }}
        visible={side}
        setVisible={setSide}
        sidebar={
          <UIGradient
            style={{ flex: 1 }}
            angle={30}
            colors={["#7F53AC", "#647DEE"]}
          >
            <Image
              source={require("@app/libs/sample/imgs/logo.png")}
              resizeMode="contain"
              style={{
                margin: 30,
                width: 115,
                height: 115,
                alignSelf: "center"
              }}
            />
            <UISeparator
              style={{
                opacity: 0.2,
                marginTop: 0,
                marginBottom: 0
              }}
            />
            <Menu setSide={setSide} />
          </UIGradient>
        }
      >
        <Switch>
          <Route
            hideNavBar={true}
            exact
            path="/login"
            component={() => <Login showSidebar={setSide} />}
          />
          <Route
            hideNavBar={true}
            exact
            path="/"
            component={() => {
              return <MainMenu />;
            }}
          />
          <Route
            hideNavBar={true}
            exact
            path="/so"
            component={() => {
              return <ListSO showSidebar={setSide} sidebar={side} />;
            }}
          />
          <Route
            hideNavBar={true}
            exact
            path="/so/form"
            component={() => {
              return <FormSO showSidebar={setSide} sidebar={side} />;
            }}
          />
          <Route
            hideNavBar={true}
            exact
            path="/so-canvas"
            component={() => {
              return <ListSOCanvas showSidebar={setSide} sidebar={side} />;
            }}
          />
          <Route
            hideNavBar={true}
            exact
            path="/so-canvas/form"
            component={() => {
              return <FormSOCanvas showSidebar={setSide} sidebar={side} />;
            }}
          />
          <Route
            hideNavBar={true}
            exact
            path="/customer"
            component={() => {
              return <ListCustomer />;
            }}
          />
          <Route
            hideNavBar={true}
            exact
            path="/customer/form"
            component={() => {
              return <FormCustomer showSidebar={setSide} sidebar={side} />;
            }}
          />
          <Route
            hideNavBar={true}
            exact
            path="/user"
            component={() => {
              return <ListUser showSidebar={setSide} sidebar={side} />;
            }}
          />
        </Switch>
      </UISidebar>
    </Router>
  );
};
