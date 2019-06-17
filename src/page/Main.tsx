import getSession from "@app/libs/gql/session/getSession";
import { Route, Router, Switch } from "@app/libs/router/Routing";
import { isSize } from "@app/libs/ui/MediaQuery";
import UIButton from "@app/libs/ui/UIButton";
import UIGradient from "@app/libs/ui/UIGradient";
import UISeparator from "@app/libs/ui/UISeparator";
import UISidebar from "@app/libs/ui/UISidebar";
import UISimpleList from "@app/libs/ui/UISimpleList";
import { observable } from "mobx";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Image, Platform, View } from "reactxp";
import FormCustomer from "./customer/FormCustomer";
import ListCustomer from "./customer/ListCustomer";
import Login from "./Login";
import FormSO from "./so/FormSO";
import ListSO from "./so/ListSO";
import ListUser from "./user/ListUser";

interface MenuProps extends RouteComponentProps<any> {
  setSide: any;
}

const Menu = withRouter(({ history, setSide }: MenuProps) => {
  return (
    <UISimpleList
      data={[
        { label: "Sales Order", path: "/" },
        { label: "User", path: "/user" },
        { label: "Customer", path: "/customer" },
        { label: "Login", path: "/login" }
      ]}
      renderItems={(item, opt) => {
        return (
          <View key={opt.index}>
            <UIButton
              onPress={() => {
                history.replace(item.path);
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
    />
  );
});

export const global = observable({
  session: null as any
});

export default (_props: any) => {
  const [side, setSide] = useState(isSize(["md", "lg"]));
  useEffect(() => {
    const check = async () => {
      global.session = await getSession();
      if (!global.session) {
        setSide(false);
      }
    };
    check();
  }, []);

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
            path="/customer"
            component={() => {
              return <ListCustomer showSidebar={setSide} sidebar={side} />;
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
