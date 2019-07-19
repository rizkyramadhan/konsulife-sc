import IconAddressCard from "@app/libs/ui/Icons/IconAddressCard";
import IconCartPlus from "@app/libs/ui/Icons/IconCartPlus";
import IconInvoice from "@app/libs/ui/Icons/IconInvoice";
import IconLuggageCart from "@app/libs/ui/Icons/IconLuggageCart";
import IconReceipt from "@app/libs/ui/Icons/IconReceipt";
import IconShoppingCart from "@app/libs/ui/Icons/IconShoppingCart";
import IconTruck from "@app/libs/ui/Icons/IconTruck";
import IconUser from "@app/libs/ui/Icons/IconUser";
import IconUserCircle from "@app/libs/ui/Icons/IconUserCircle";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UICard, { UICardBody, UICardFooter } from "@app/libs/ui/UICard";
import UICol from "@app/libs/ui/UICol";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIRow from "@app/libs/ui/UIRow";
import UIText from "@app/libs/ui/UIText";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button, View } from "reactxp";

const menuList = [
  {
    title: "Working Order",
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconLuggageCart width={50} height={50} color="#1D6EF7" />,
    path: "/wo"
  },
  {
    title: "SO Taking Order",
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconCartPlus width={50} height={50} color="#1D6EF7" />,
    path: "/so"
  },
  {
    title: "SO Canvasing",
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconShoppingCart width={50} height={50} color="#1D6EF7" />,
    path: "/so-canvas"
  },
  {
    title: "Delivery Order",
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconTruck width={50} height={50} color="#1D6EF7" />,
    path: "/do"
  },
  {
    title: "Payment Receipt",
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconReceipt width={50} height={50} color="#1D6EF7" />,
    path: "/payment-receipt"
  },
  {
    title: "AR Invoice",
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconInvoice width={50} height={50} color="#1D6EF7" />,
    path: "/ar-invoice"
  },
  {
    title: "Customer",
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconAddressCard width={50} height={50} color="#1D6EF7" />,
    path: "/customer"
  },
  {
    title: "User",
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconUser width={50} height={50} color="#1D6EF7" />,
    path: "/user"
  }
];

const Menu = withRouter(({ history }: RouteComponentProps) => {
  // isSize(['md', 'lg']) && history.push('/home');
  const iconStyle: any = {
    flexShrink: "none",
    overflow: "visible"
  };
  const data = menuList;
  return (
    <UIRow>
      {data.map((item, key) => {
        return (
          <UICol size={6} key={key}>
            <Button
              onPress={() => {
                history.push(item.path);
              }}
            >
              <UICard
                style={{
                  border: 0
                }}
              >
                <UICardBody
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10
                  }}
                >
                  <View style={iconStyle}>{item.icon}</View>
                  <View
                    style={{
                      ...iconStyle,
                      paddingLeft: 10
                    }}
                  >
                    <UIText>{item.title}</UIText>
                  </View>
                </UICardBody>
                <UICardFooter>
                  <UIText
                    style={{
                      fontSize: 13,
                      color: "#767676"
                    }}
                  >
                    {item.subtitle}
                  </UIText>
                </UICardFooter>
              </UICard>
            </Button>
          </UICol>
        );
      })}
    </UIRow>
  );
});

export default () => {
  return (
    <UIContainer>
      <UIHeader
        center="MasaBaru"
        right={
          <UIButton
            size="compact"
            fill="clear"
            animation={false}
            style={{ margin: 0 }}
          >
            <IconUserCircle width={32} height={32} color="#1D6EF7" />
          </UIButton>
        }
      />
      <UIBody
        style={{
          paddingLeft: 15,
          paddingRight: 15
        }}
      >
        <Menu />
      </UIBody>
    </UIContainer>
  );
};
