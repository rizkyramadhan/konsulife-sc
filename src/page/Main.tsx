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
import FormARInvoiceTO from "./arinvoice-to/FormARInvoiceTO";
import ListARInvoiceTO from "./arinvoice-to/ListARInvoiceTO";
import ListInvoiceTOCust from "./arinvoice-to/ListInvoiceTOCust";
import FormARInvoice from "./arinvoice/FormARInvoice";
import ListARInvoice from "./arinvoice/ListARInvoice";
import ListInvoiceCust from "./arinvoice/ListInvoiceCust";
import FormCustomer from "./customer/FormCustomer";
import ListCustomer from "./customer/ListCustomer";
import ListDraftCustomer from "./customer/ListDraftCustomer";
import FormDO from "./do/FormDO";
import ListDO from "./do/ListDO";
import ListDOCopySO from "./do/ListDOCopySO";
import FormInvTransfer from "./it/FormInvTransfer";
import FormInvTransferReturn from "./it/FormInvTransferReturn";
import ListInvTransfer from "./it/ListInvTransfer";
import Login from "./Login";
import MainMenu from "./MainMenu";
import MenuList from "./MenuList";
import FormPayment from "./payment/FormPayment";
import ListPayment from "./payment/ListPayment";
import FormPR from "./pr/FormPR";
import ListPR from "./pr/ListPR";
import ListPRVendor from "./pr/ListPRVendor";
import FormRute from "./rute/FormRute";
import ListRute from "./rute/ListRute";
import FormSO from "./so/FormSO";
import ListSO from "./so/ListSO";
import FormSOCanvas from "./socanvas/FormSOCanvas";
import ListSOCanvas from "./socanvas/ListSOCanvas";
import FormUser from "./user/FormUser";
import ListUser from "./user/ListUser";
import ReportPO from "./report/ReportPO";
import ReportSO from "./report/ReportSO";
import ReportDO from "./report/ReportDO";
import ReportAR from "./report/ReportAR";
import ReportStock from "./report/ReportStock";
import ReportInventory from "./report/ReportInventory";
import FormWO from "./wo/FormWO";
import ListDraftSO from "./so/ListDraftSO";
import ListWO from "./wo/ListWO";
import IconCaretDown from "@app/libs/ui/Icons/IconCaretDown";
import Home from "./home/Home";
import ListDOPrint from "./do-print/ListDOPrint";
import FormDOPrint from "./do-print/FormDOPrint";
import ListPRPrint from "./pr-print/ListPRPrint";
import FormPRPrint from "./pr-print/FormPRPrint";
import ListARInvoiceTOPrint from "./arinvoice-to-print/ListARInvoiceTOPrint";
import FormARInvoiceTOPrint from "./arinvoice-to-print/FormARInvoiceTOPrint";
import ListARInvoicePrint from "./arinvoice-print/ListARInvoicePrint";
import FormARInvoicePrint from "./arinvoice-print/FormARInvoicePrint";
import ListInvStockTransfer from "./it-print/ListInvStockTransfer";
import ListInvStockReturn from "./it-print/ListInvStockReturn";
import FormInvStockReturn from "./it-print/FormInvStockReturn";
import FormInvStockTransfer from "./it-print/FormInvStockTransfer";
import IconUser from "@app/libs/ui/Icons/IconUser";

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
              // history.replace(item.path);
              // setPath(item.path);
              setExpand(!expand);
              if (Platform.getType() !== "web") {
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
              flexShrink: "none",
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
              flex: 1,
              overflow: "auto",
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
            if (Platform.getType() !== "web") {
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
            flexShrink: "none",
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
    <UISimpleList
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        flex: 1,
        overflow: "auto"
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
            // </UIGradient>
          }
        >
          <SwitchRoute
            routes={{
              "/": <MainMenu />,
              "/home": <Home />,
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
              "/do/open/:CardCode/:CardName/": <ListDOPrint />,
              "/do/view/:CardCode/:CardName/:id": <FormDOPrint />,
              "/do/copySO/:CardCode/:CardName": <ListDOCopySO />,
              "/do/form/:CardCode/:CardName/:ItemSelect": <FormDO />,
              "/it": <ListInvTransfer />,
              "/it-tran": <ListInvStockTransfer />,
              "/it-ret": <ListInvStockReturn />,
              "/it-tran/form": <FormInvTransfer />,
              "/it-tran/view/:id": <FormInvStockTransfer />,
              "/it-ret/form": <FormInvTransferReturn />,
              "/it-ret/view/:id": <FormInvStockReturn />,
              "/pr": <ListPRVendor />,
              "/pr/open/:vendor": <ListPRPrint />,
              "/pr/view/:vendor/:id": <FormPRPrint />,
              "/pr/list/:id?": <ListPR />,
              "/pr/form/:id?": <FormPR />,
              "/payment-receipt": <ListPayment />,
              "/payment-receipt/form": <FormPayment />,
              "/it/form/:id?": <FormInvTransfer />,
              "/ar-invoice": <ListInvoiceCust />,
              "/ar-invoice/list/:CardCode/:CardName/": <ListARInvoice />,
              "/ar-invoice/open/:CardCode/:CardName/": <ListARInvoicePrint />,
              "/ar-invoice/form/:id?": <FormARInvoice />,
              "/ar-invoice/view/:CardCode/:CardName/:id?": (
                <FormARInvoicePrint />
              ),
              "/ar-invoice-to": <ListInvoiceTOCust />,
              "/ar-invoice-to/open/:CardCode/:CardName/": (
                <ListARInvoiceTOPrint />
              ),
              "/ar-invoice-to/list/:CardCode/:CardName/": <ListARInvoiceTO />,
              "/ar-invoice-to/form/:id?": <FormARInvoiceTO />,
              "/ar-invoice-to/view/:CardCode/:CardName/:id?": (
                <FormARInvoiceTOPrint />
              ),
              "/customer": <ListCustomer />,
              "/customer/draft": <ListDraftCustomer />,
              "/customer/form/:id?": <FormCustomer />,
              "/user": <ListUser />,
              "/user/form/:id?": <FormUser />,
              "/report/po": <ReportPO />,
              "/report/so": <ReportSO />,
              "/report/do": <ReportDO />,
              "/report/ar-invoice": <ReportAR />,
              "/report/stock": <ReportStock />,
              "/report/inventory": <ReportInventory />
            }}
          />
        </UISidebar>
      )}
    </Router>
  );
});
