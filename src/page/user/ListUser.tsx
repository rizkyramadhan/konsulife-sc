import IconAddressCard from '@app/libs/ui/Icons/IconAddressCard';
import IconArrowBackIOS from '@app/libs/ui/Icons/IconArrowBackIOS';
import IconCaretDown from '@app/libs/ui/Icons/IconCaretDown';
import IconCartPlus from '@app/libs/ui/Icons/IconCartPlus';
import IconCheck from '@app/libs/ui/Icons/IconCheck';
import IconCopy from '@app/libs/ui/Icons/IconCopy';
import IconEdit from '@app/libs/ui/Icons/IconEdit';
import IconInvoice from '@app/libs/ui/Icons/IconInvoice';
import IconMenu from '@app/libs/ui/Icons/IconMenu';
import IconPlus from '@app/libs/ui/Icons/IconPlus';
import IconReceipt from '@app/libs/ui/Icons/IconReceipt';
import IconSave from '@app/libs/ui/Icons/IconSave';
import IconShoppingCart from '@app/libs/ui/Icons/IconShoppingCart';
import IconSignOut from '@app/libs/ui/Icons/IconSignOut';
import IconTrash from '@app/libs/ui/Icons/IconTrash';
import IconTruck from '@app/libs/ui/Icons/IconTruck';
import IconUser from '@app/libs/ui/Icons/IconUser';
import UIBody from '@app/libs/ui/UIBody';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import { observer } from 'mobx-react-lite';
import React from "react";

export default observer(({ showSidebar, sidebar }: any) => {
    return (
        <UIContainer>
            <UIHeader showSidebar={showSidebar} sidebar={sidebar} center="User" />
            <UIBody>
                <IconPlus></IconPlus> plus
                <IconSave></IconSave> save
                <IconShoppingCart></IconShoppingCart> shop cart
                <IconReceipt></IconReceipt> receipt
                <IconTruck></IconTruck> truck
                <IconAddressCard></IconAddressCard> card
                <IconArrowBackIOS></IconArrowBackIOS> back
                <IconCartPlus></IconCartPlus> cart p
                <IconCaretDown></IconCaretDown> dropdown
                <IconCheck></IconCheck> check
                <IconCopy></IconCopy> copy
                <IconEdit></IconEdit> edit
                <IconTrash></IconTrash> trash
                <IconInvoice></IconInvoice> invoice
                <IconMenu></IconMenu> menu
                <IconSignOut></IconSignOut> sign out
                <IconUser></IconUser> user
            </UIBody>
        </UIContainer>
    );
})