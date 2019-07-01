import IconNavigation from '@app/libs/ui/Icons/IconNavigation';
import React from "react";
import IconLuggageCart from '@app/libs/ui/Icons/IconLuggageCart';
import IconInvoice from '@app/libs/ui/Icons/IconInvoice';
import IconCartPlus from '@app/libs/ui/Icons/IconCartPlus';
import IconShoppingCart from '@app/libs/ui/Icons/IconShoppingCart';
import IconTruck from '@app/libs/ui/Icons/IconTruck';
import IconReceipt from '@app/libs/ui/Icons/IconReceipt';
import IconAddressCard from '@app/libs/ui/Icons/IconAddressCard';
import IconUser from '@app/libs/ui/Icons/IconUser';

// const roleList = ["sales_to", "admin", "branch", "inventory"];

export default [
    {
        title: "Rute",
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconNavigation width={20} height={20} color="#1D6EF7" />,
        path: "/rute",
        roles: ["admin", "branch"]
    },
    {
        title: "Working Order",
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconLuggageCart width={20} height={20} color="#1D6EF7" />,
        path: "/wo",
        roles: ["admin", "branch"]
    },
    {
        title: "Purchase Receipt",
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconInvoice width={20} height={20} color="#1D6EF7" />,
        path: "/pr",
        roles: ["admin", "branch","inventory"]
    },
    {
        title: "Inventory Transfer",
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconInvoice width={20} height={20} color="#1D6EF7" />,
        path: "/it",
        roles: ["admin", "branch","inventory"]
    },
    {
        title: "SO Taking Order",
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconCartPlus width={20} height={20} color="#1D6EF7" />,
        path: "/so",
        roles: ["admin", "branch", "sales_to"]
    },
    {
        title: "SO Canvasing",
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconShoppingCart width={20} height={20} color="#1D6EF7" />,
        path: "/so-canvas",
        roles: ["admin", "branch", "sales_canvas"]
    },
    {
        title: "Delivery Order",
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconTruck width={20} height={20} color="#1D6EF7" />,
        path: "/do",
        roles: ["admin", "branch"]
    },
    {
        title: "Payment Receipt",
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconReceipt width={20} height={20} color="#1D6EF7" />,
        path: "/payment-receipt",
        roles: ["admin", "branch", "sales_to", "sales_canvas"]
    },
    {
        title: "AR Invoice (Taking Order)",
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconInvoice width={20} height={20} color="#1D6EF7" />,
        path: "/ar-invoice-to",
        roles: ["admin", "branch"]
    },
    {
        title: "AR Invoice (Canvasing)",
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconInvoice width={20} height={20} color="#1D6EF7" />,
        path: "/ar-invoice",
        roles: ["admin", "branch"]
    },
    {
        title: "Customer",
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconAddressCard width={20} height={20} color="#1D6EF7" />,
        path: "/customer",
        roles: ["sales_to", "sales_canvas", "branch", "admin"]
    },
    {
        title: "User",
        subtitle: "Lorem Ipsum is simply dummy text.",
        icon: <IconUser width={20} height={20} color="#1D6EF7" />,
        path: "/user",
        roles: ["admin"]
    }
];
