import global from '@app/global';
import getSession from '@app/libs/gql/session/getSession';
import logout from '@app/libs/gql/session/logout';
import { Router } from "@app/libs/router/Routing";
import SwitchRoute, { RouteState } from '@app/libs/router/SwitchRoute';
import UIBody from '@app/libs/ui/UIBody';
import UIButton from '@app/libs/ui/UIButton';
import UIContainer from '@app/libs/ui/UIContainer';
import UILoading from '@app/libs/ui/UILoading';
import UISeparator from '@app/libs/ui/UISeparator';
import UISidebar from '@app/libs/ui/UISidebar';
import UISimpleList from '@app/libs/ui/UISimpleList';
import UIText from '@app/libs/ui/UIText';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
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
  const menuList = [
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
  ];

  RouteState.setRootPaths(menuList.map(item => item.path));
  return (
    <UISimpleList
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 15,
        paddingRight: 15,
        flex: 1,
        overflow: "auto"
      }}
      data={menuList}
      renderItems={(item, opt) => {
        return (
          <View key={opt.index} >
            <UIButton
              onPress={() => {
                history.replace(item.path);
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      global.setSession(await getSession());
      setLoading(false);
    };
    check();
  }, []);


  if (loading) {
    return <UIContainer>
      <UIBody style={{ alignItems: "center", justifyContent: "center", flex: 1, display: "flex" }}>
        <UILoading style={{ width: 100, height: 100 }} />
      </UIBody>
    </UIContainer>
  }
  return (
    <Router>
      {!global.session.uid ? <Login /> :
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
            <View style={{ flex: 1 }}>
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
          <SwitchRoute routes={{
            "/": <MainMenu />,
            "/so": <ListSO />,
            "/so/form": <FormSO />,
            "/so-canvas": <ListSOCanvas />,
            "/so-canvas/form": <FormSOCanvas />,
            "/ar-invoice": <ListARInvoice />,
            "/ar-invoice/form": <FormARInvoice />,
            "/customer": <ListCustomer />,
            "/customer/form": <FormCustomer />,
            "/user": <ListUser />
          }} />
        </UISidebar>
      }
    </Router>
  );
});