import global from '@app/global';
import getSession from '@app/libs/gql/session/getSession';
import logout from '@app/libs/gql/session/logout';
import { Route, Router, Switch } from "@app/libs/router/Routing";
import { isSize } from '@app/libs/ui/MediaQuery';
import UIButton from '@app/libs/ui/UIButton';
import UISeparator from '@app/libs/ui/UISeparator';
import UISidebar from '@app/libs/ui/UISidebar';
import UISimpleList from '@app/libs/ui/UISimpleList';
import UIText from '@app/libs/ui/UIText';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Image, Platform, View } from 'reactxp';
import FormCustomer from './customer/FormCustomer';
import ListCustomer from './customer/ListCustomer';
import Login from './Login';
import MainMenu from './MainMenu';
import FormSO from './so/FormSO';
import ListSO from './so/ListSO';
import FormSOCanvas from './socanvas/FormSOCanvas';
import ListSOCanvas from './socanvas/ListSOCanvas';
import ListUser from './user/ListUser';
import ListARInvoice from './arinvoice/ListARInvoice';
import FormARInvoice from './arinvoice/FormARInvoice';

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
        setSide(isSize(['md', 'lg']));
      }
    };
    check();
  }, []);
  return (
    <UISimpleList
      style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 15, paddingRight: 15 }
      }
      data={
        [
          {
            title: 'Working Order',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@icon/order2.png'),
            path: '/wo'
          },
          {
            title: 'SO Taking Order',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@icon/order.png'),
            path: '/so'
          },
          {
            title: 'SO Canvasing',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@icon/order.png'),
            path: '/so-canvas'
          },
          {
            title: 'Delivery Order',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@icon/order2.png'),
            path: '/do'
          },
          {
            title: 'Payment Receipt',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@icon/invoice.png'),
            path: '/payment-receipt'
          },
          {
            title: 'AR Invoice',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@icon/invoice.png'),
            path: '/ar-invoice'
          },
          {
            title: 'Customer',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@icon/customer.png'),
            path: '/customer'
          },
          {
            title: 'User',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@icon/user.png'),
            path: '/user'
          }
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
              style={{ width: "100%", justifyContent: "flex-start" }}
            >
              <Image source={item.icon} style={{ width: 24, height: 24 }} />
              <UIText style={{ color: "#1D6EF7", paddingLeft: 15 }}> {item.title}</UIText>
            </UIButton>

            <UISeparator
              style={{
                opacity: 0.2,
                marginTop: 0,
                marginBottom: 0,
                borderColor: '#9c9c9c'
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
          style={{ width: "100%", justifyContent: 'flex-start' }}
          color="#fff"
        >
          <Image source={require('@icon/order.png')} style={{ width: 24, height: 24 }} />
          <UIText style={{ color: "#1D6EF7", paddingLeft: 15 }}> Logout</UIText>
        </UIButton>

        <UISeparator
          style={{
            opacity: 0.2,
            marginTop: 0,
            marginBottom: 0,
            borderColor: '#9c9c9c'
          }}
        />
      </View>
    </UISimpleList >
  );
});

export default observer((_props: any) => {
  // global.setSidebar(isSize(['md', 'lg']));
  return (
    <Router>
      <UISidebar
        style={{ width: 300 }}
        visible={global.sidebar}
        setVisible={global.setSidebar}
        sidebar={
          // <UIGradient
          //   style={{ flex: 1 }}
          //   angle={30}
          //   colors={["#7F53AC", "#647DEE"]}
          // >
          <View>
            <Image
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
            />
            <UISeparator
              style={{
                opacity: 0.2,
                marginTop: 0,
                marginBottom: 0
              }}
            />
            <Menu setSide={global.setSidebar} />
          </View>
          // </UIGradient>
        }
      >
        <Switch>
          <Route
            hideNavBar={true}
            exact
            path="/login"
            component={() => <Login />}
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
              return <ListSO />;
            }}
          />
          <Route
            hideNavBar={true}
            exact
            path="/so/form"
            component={() => {
              return <FormSO />;
            }}
          />
          <Route
            hideNavBar={true}
            exact
            path="/so-canvas"
            component={() => {
              return <ListSOCanvas />;
            }}
          />
          <Route
            hideNavBar={true}
            exact
            path="/so-canvas/form"
            component={() => {
              return <FormSOCanvas />;
            }}
          />
          <Route
            hideNavBar={true}
            exact
            path="/ar-invoice"
            component={() => {
              return <ListARInvoice />;
            }}
          />
          <Route
            hideNavBar={true}
            exact
            path="/ar-invoice/form"
            component={() => {
              return <FormARInvoice />;
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
              return <FormCustomer />;
            }}
          />
          <Route
            hideNavBar={true}
            exact
            path="/user"
            component={() => {
              return <ListUser />;
            }}
          />
        </Switch>
      </UISidebar>
    </Router>
  );
});
