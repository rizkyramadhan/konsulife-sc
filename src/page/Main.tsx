import global from "@app/global";
import getSession from "@app/libs/gql/session/getSession";
import logout from "@app/libs/gql/session/logout";
import { Router } from "@app/libs/router/Routing";
import SwitchRoute, { RouteState } from "@app/libs/router/SwitchRoute";
import IconSignOut from "@app/libs/ui/Icons/IconSignOut";
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
import { RouteComponentProps, withRouter } from "react-router";
import { Platform, View } from "reactxp";
import FormARInvoiceTO from './arinvoice-to/FormARInvoiceTO';
import ListARInvoiceTO from './arinvoice-to/ListARInvoiceTO';
import ListInvoiceTOCust from './arinvoice-to/ListInvoiceTOCust';
import FormARInvoice from "./arinvoice/FormARInvoice";
import ListARInvoice from "./arinvoice/ListARInvoice";
import ListInvoiceCust from './arinvoice/ListInvoiceCust';
import FormCustomer from "./customer/FormCustomer";
import ListCustomer from "./customer/ListCustomer";
import ListDraftCustomer from './customer/ListDraftCustomer';
import FormDO from './do/FormDO';
import ListDO from './do/ListDO';
import ListDOCopySO from './do/ListDOCopySO';
import FormInvTransfer from './it/FormInvTransfer';
import FormInvTransferReturn from './it/FormInvTransferReturn';
import ListInvTransfer from './it/ListInvTransfer';
import Login from "./Login";
import MainMenu from "./MainMenu";
import MenuList from './MenuList';
import FormPayment from './payment/FormPayment';
import ListPayment from './payment/ListPayment';
import FormPR from './pr/FormPR';
import ListPR from './pr/ListPR';
import ListPRVendor from './pr/ListPRVendor';
import FormRute from './rute/FormRute';
import ListRute from './rute/ListRute';
import FormSO from "./so/FormSO";
import ListSO from "./so/ListSO";
import FormSOCanvas from "./socanvas/FormSOCanvas";
import ListSOCanvas from "./socanvas/ListSOCanvas";
import FormUser from './user/FormUser';
import ListUser from "./user/ListUser";
import FormWO from './wo/FormWO';
import ListDraftSO from './so/ListDraftSO';
import ListWO from './wo/ListWO';

interface MenuProps extends RouteComponentProps<any> {
  setSide: any;
}

const Menu = withRouter(({ history, setSide }: MenuProps) => {
  RouteState.setRootPaths(MenuList.map(item => item.path));
  const [path, setPath] = useState("");
  const active = {
    backgroundColor: "#cee0ff"
  };
  useEffect(() => {
    setPath(history.location.pathname);
  }, []);
  return (
    <UISimpleList
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        flex: 1,
        overflow: "auto"
      }}
      data={MenuList}
      renderItems={(item, opt) => {
        if (item.roles.indexOf(global.session.user.role) > -1) return (
          <View key={opt.index} style={{ padding: 0, ...(path == item.path ? active : {}) }}>
            <UIButton
              onPress={() => {
                history.replace(item.path);
                setPath(item.path);
                if (Platform.getType() !== "web") {
                  setSide(false);
                }
              }}
              animation={false}
              fill="clear"
              style={{
                margin: 0,
                width: "100%",
                flexShrink: "none",
                justifyContent: "flex-start",
                paddingTop: 15,
                paddingBottom: 15
              }}
            >
              {item.icon}
              <UIText style={{ color: "#1D6EF7", paddingLeft: 15 }}>
                {" "}
                {item.title}
              </UIText>
            </UIButton>

            <UISeparator
              style={{
                marginTop: 0,
                marginBottom: 0,
                borderColor: "#e8f1ff"
              }}
            />
          </View>
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
          animation={false}
          fill="clear"
          style={{ width: "100%", justifyContent: "flex-start" }}
          color="#fff"
        >
          <IconSignOut width={20} height={20} color="#1D6EF7" />
          <UIText style={{ color: "#1D6EF7", paddingLeft: 15 }}> Logout</UIText>
        </UIButton>

        <UISeparator
          style={{
            opacity: 0.2,
            marginTop: 0,
            marginBottom: 0,
            borderColor: "#9c9c9c"
          }}
        />
      </View>
    </UISimpleList>
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
              // <UIGradient
              //   style={{ flex: 1 }}
              //   angle={30}
              //   colors={["#7F53AC", "#647DEE"]}
              // >
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
            <SwitchRoute
              routes={{
                "/": <MainMenu />,
                "/rute": <ListRute />,
                "/rute/form/:id?": <FormRute />,
                "/wo": <ListWO />,
                "/wo/form/:id?": <FormWO />,
                "/so": <ListSO />,
                "/so/draft": <ListDraftSO />,
                "/so/form": <FormSO />,
                "/so-canvas": <ListSOCanvas />,
                "/so-canvas/form": <FormSOCanvas />,
                "/do": <ListDO />,
                "/do/copySO/:CardCode/:CardName": <ListDOCopySO />,
                "/do/form/:CardCode/:CardName/:ItemSelect": <FormDO />,
                "/it": <ListInvTransfer />,
                "/it/form": <FormInvTransfer />,
                "/it-ret/form": <FormInvTransferReturn />,
                "/pr": <ListPRVendor />,
                "/pr/list/:id?": <ListPR />,
                "/pr/form/:id?": <FormPR />,
                "/payment-receipt": <ListPayment />,
                "/payment-receipt/form": <FormPayment />,
                "/it/form/:id?": <FormInvTransfer />,
                "/ar-invoice": <ListInvoiceCust />,
                "/ar-invoice/list/:id?": <ListARInvoice />,
                "/ar-invoice/form/:id?": <FormARInvoice />,
                "/ar-invoice-to": <ListInvoiceTOCust />,
                "/ar-invoice-to/list/:id?": <ListARInvoiceTO />,
                "/ar-invoice-to/form/:id?": <FormARInvoiceTO />,
                "/customer": <ListCustomer />,
                "/customer/draft": <ListDraftCustomer />,
                "/customer/form/:id?": <FormCustomer />,
                "/user": <ListUser />,
                "/user/form/:id?": <FormUser />
              }}
            />
          </UISidebar>
        )}
    </Router>
  );
});
