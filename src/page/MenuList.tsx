import IconAddressCard from '@app/libs/ui/Icons/IconAddressCard';
import IconBook from '@app/libs/ui/Icons/IconBook';
import IconCartPlus from '@app/libs/ui/Icons/IconCartPlus';
import IconInvoice from '@app/libs/ui/Icons/IconInvoice';
import IconLocationArrow from '@app/libs/ui/Icons/IconLocationArrow';
import IconLuggageCart from '@app/libs/ui/Icons/IconLuggageCart';
import IconPrint from '@app/libs/ui/Icons/IconPrint';
import IconReceipt from '@app/libs/ui/Icons/IconReceipt';
import IconShoppingCart from '@app/libs/ui/Icons/IconShoppingCart';
import IconTruck from '@app/libs/ui/Icons/IconTruck';
import IconUser from '@app/libs/ui/Icons/IconUser';
import UIText from '@app/libs/ui/UIText';
import React from "react";
import IconInvoiceDollar from '@app/libs/ui/Icons/IconInvoiceDollar';
import IconMoneyCheck from '@app/libs/ui/Icons/IconMoneyCheck';
import IconHome from '@app/libs/ui/Icons/IconHome';

// const roleList = ["sales_to", "admin", "branch", "inventory"];

export default [
    {
        title: <UIText style={{ color: "#1D6EF7", paddingLeft: 15 }}> Home</UIText>,
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconHome width={20} height={20} color="#1D6EF7" />,
        path: "/home",
        roles: ["sales_to", "sales_canvas", "branch", "admin"]
    },
    {
        title: <UIText style={{ color: "#1D6EF7", paddingLeft: 15 }}> Setup</UIText>,
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconBook width={20} height={20} color="#1D6EF7" />,
        roles: ["admin", "branch"],
        children: [
            {
                title: <UIText style={{ color: "#676767", paddingLeft: 15 }}> User</UIText>,
                subtitle: "Lorem Ipsum is simply dummy text.",
                icon: <IconUser width={20} height={20} color="#676767" />,
                path: "/user",
                roles: ["admin"]
            },
            {
                title: <UIText style={{ color: "#676767", paddingLeft: 15 }}> Rute</UIText>,
                subtitle: "Lorem Ipsum is simply dummy text.",
                icon: <IconLocationArrow width={20} height={20} color="#676767" />,
                path: "/rute",
                roles: ["admin", "branch"]
            }
        ]
    },
    {
        title: <UIText style={{ color: "#1D6EF7", paddingLeft: 15 }}> Inventory</UIText>,
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconPrint width={20} height={20} color="#1D6EF7" />,
        roles: ["admin", "branch", "inventory"],
        children: [
            {
                title: <UIText style={{ color: "#676767", paddingLeft: 15 }}> Purchase Receipt</UIText>,
                subtitle: "Lorem Ipsum is simply dummy text.",
                icon: <IconReceipt width={20} height={20} color="#676767" />,
                path: "/pr",
                roles: ["admin", "branch", "inventory"]
            },
            {
                title: <UIText style={{ color: "#676767", paddingLeft: 15 }}> Inventory Transfer</UIText>,
                subtitle: "Lorem Ipsum is simply dummy text.",
                icon: <IconInvoice width={20} height={20} color="#676767" />,
                path: "/it",
                roles: ["admin", "branch", "inventory"]
            }
        ]
    },
    {
        title: <UIText style={{ color: "#1D6EF7", paddingLeft: 15 }}> Taking Order</UIText>,
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconCartPlus width={20} height={20} color="#1D6EF7" />,
        roles: ["admin", "branch", "sales_to"],
        children: [{
            title: <UIText style={{ color: "#676767", paddingLeft: 15 }}> Sales Order</UIText>,
            subtitle: "Lorem Ipsum is simply dummy text.",
            icon: <IconShoppingCart width={20} height={20} color="#676767" />,
            path: "/so",
            roles: ["admin", "branch", "sales_to"]
        },
        {
            title: <UIText style={{ color: "#676767", paddingLeft: 15 }}> Delivery Order</UIText>,
            subtitle: "Lorem Ipsum is simply dummy text.",
            icon: <IconTruck width={20} height={20} color="#676767" />,
            path: "/do",
            roles: ["admin", "branch"]
        },
        {
            title: <UIText style={{ color: "#676767", paddingLeft: 15 }}> AR Invoice</UIText>,
            subtitle: "Lorem Ipsum is simply dummy text.",
            icon: <IconInvoice width={20} height={20} color="#676767" />,
            path: "/ar-invoice-to",
            roles: ["admin", "branch"]
        }]
    },
    {
        title: <UIText style={{ color: "#1D6EF7", paddingLeft: 15 }}> Canvasing</UIText>,
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconTruck width={20} height={20} color="#1D6EF7" />,
        roles: ["admin", "branch", "sales_canvas"],
        children: [{
            title: <UIText style={{ color: "#676767", paddingLeft: 15 }}> Working Order</UIText>,
            subtitle: "Lorem Ipsum is simply dummy text.",
            icon: <IconLuggageCart width={20} height={20} color="#676767" />,
            path: "/wo",
            roles: ["admin", "branch"]
        },
        {
            title: <UIText style={{ color: "#676767", paddingLeft: 15 }}> Sales Order</UIText>,
            subtitle: "Lorem Ipsum is simply dummy text.",
            icon: <IconShoppingCart width={20} height={20} color="#676767" />,
            path: "/so-canvas",
            roles: ["admin", "branch", "sales_canvas"]
        },
        {
            title: <UIText style={{ color: "#676767", paddingLeft: 15 }}> AR Invoice</UIText>,
            subtitle: "Lorem Ipsum is simply dummy text.",
            icon: <IconInvoice width={20} height={20} color="#676767" />,
            path: "/ar-invoice",
            roles: ["admin", "branch"]
        }]
    },

    {
        title: <UIText style={{ color: "#1D6EF7", paddingLeft: 15 }}> Payment</UIText>,
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconMoneyCheck width={20} height={20} color="#1D6EF7" />,
        path: "/payment-receipt",
        roles: ["admin", "branch", "sales_to", "sales_canvas"],
        children: [
            {
                title: <UIText style={{ color: "#676767", paddingLeft: 15 }}> Payment Receipt</UIText>,
                subtitle: "Lorem Ipsum is simply dummy text.",
                icon: <IconInvoiceDollar width={20} height={20} color="#676767" />,
                path: "/payment-receipt",
                roles: ["admin", "branch", "sales_to", "sales_canvas"]
            }
        ]
    },
    {
        title: <UIText style={{ color: "#1D6EF7", paddingLeft: 15 }}> Customer</UIText>,
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconAddressCard width={20} height={20} color="#1D6EF7" />,
        path: "/customer",
        roles: ["sales_to", "sales_canvas", "branch", "admin"]
    },
];
