import IconAddressCard from "@app/libs/ui/Icons/IconAddressCard";
import IconBook from "@app/libs/ui/Icons/IconBook";
import IconCartPlus from "@app/libs/ui/Icons/IconCartPlus";
import IconHome from "@app/libs/ui/Icons/IconHome";
import IconMoneyCheck from "@app/libs/ui/Icons/IconMoneyCheck";
import IconPrint from "@app/libs/ui/Icons/IconPrint";
import IconTruck from "@app/libs/ui/Icons/IconTruck";
import UIText from "@app/libs/ui/UIText";
import React from "react";
import IconReceipt from "@app/libs/ui/Icons/IconReceipt";

// const roleList = ["sales_to", "admin", "branch", "inventory"];

export default [
  {
    title: (
      <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
        {" "}
        Dashboard
      </UIText>
    ),
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconHome width={20} height={20} color="#1D6EF7" />,
    path: "/home",
    roles: ["sales_to", "sales_canvas", "branch", "admin"]
  },
  {
    title: (
      <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
        {" "}
        Setup
      </UIText>
    ),
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconBook width={20} height={20} color="#fb6340" />,
    roles: ["admin", "branch"],
    children: [
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - User
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/user",
        roles: ["admin"]
      },
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - Rute
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/rute",
        roles: ["admin", "branch"]
      }
    ]
  },
  {
    title: (
      <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
        {" "}
        Report
      </UIText>
    ),
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconReceipt width={20} height={20} color="#968686" />,
    roles: ["admin", "branch"],
    children: [
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - Inventory
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/report-inventory",
        roles: ["admin", "branch"]
      },
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - Stock
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/report-stock",
        roles: ["admin", "branch"]
      },
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - Purchase Order
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/report-po",
        roles: ["admin", "branch"]
      },
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - Sales Order
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/report-so",
        roles: ["admin", "branch"]
      },
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - Delivery Order
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/report-do",
        roles: ["admin", "branch"]
      },
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - AR Invoice
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/report-ar-invoice",
        roles: ["admin", "branch"]
      }
    ]
  },
  {
    title: (
      <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
        {" "}
        Inventory
      </UIText>
    ),
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconPrint width={20} height={20} color="#5e72e4" />,
    roles: ["admin", "branch", "inventory"],
    children: [
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - Purchase Receipt
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/pr",
        roles: ["admin", "branch", "inventory"]
      },
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - Inventory Transfer
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/it",
        roles: ["admin", "branch", "inventory"]
      }
    ]
  },
  {
    title: (
      <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
        {" "}
        Taking Order
      </UIText>
    ),
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconCartPlus width={20} height={20} color="#ffd600" />,
    roles: ["admin", "branch", "sales_to"],
    children: [
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - Sales Order
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/so",
        roles: ["admin", "branch", "sales_to"]
      },
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - Delivery Order
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/do",
        roles: ["admin", "branch"]
      },
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - AR Invoice
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/ar-invoice-to",
        roles: ["admin", "branch"]
      }
    ]
  },
  {
    title: (
      <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
        {" "}
        Canvasing
      </UIText>
    ),
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconTruck width={20} height={20} color="#28a745" />,
    roles: ["admin", "branch", "sales_canvas"],
    children: [
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - Working Order
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/wo",
        roles: ["admin", "branch"]
      },
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - Sales Order
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/so-canvas",
        roles: ["admin", "branch", "sales_canvas"]
      },
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - AR Invoice
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/ar-invoice",
        roles: ["admin", "branch"]
      }
    ]
  },

  {
    title: (
      <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
        {" "}
        Payment
      </UIText>
    ),
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconMoneyCheck width={20} height={20} color="#f3a4b5" />,
    path: "/payment-receipt",
    roles: ["admin", "branch", "sales_to", "sales_canvas"],
    children: [
      {
        title: (
          <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
            - Payment Receipt
          </UIText>
        ),
        subtitle: "Lorem Ipsum is simply dummy text.",
        path: "/payment-receipt",
        roles: ["admin", "branch", "sales_to", "sales_canvas"]
      }
    ]
  },
  {
    title: (
      <UIText style={{ color: "#525f7f", paddingLeft: 7, fontSize: 15 }}>
        {" "}
        Customer
      </UIText>
    ),
    subtitle: "Lorem Ipsum is simply dummy text.",
    icon: <IconAddressCard width={20} height={20} color="#11cdef" />,
    path: "/customer",
    roles: ["sales_to", "sales_canvas", "branch", "admin"]
  }
];
