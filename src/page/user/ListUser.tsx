import UIBody from '@app/libs/ui/UIBody';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import { observer } from 'mobx-react-lite';
import React from "react";
import IconCaretUpDown from '@app/libs/ui/Icons/IconCaretUpDown';
import IconCevronDown from '@app/libs/ui/Icons/IconCevronDown';

export default observer(({ showSidebar, sidebar }: any) => {
    return (
        <UIContainer>
            <UIHeader showSidebar={showSidebar} sidebar={sidebar} center="User" />
            <UIBody>
                <IconCaretUpDown></IconCaretUpDown>
                <IconCevronDown></IconCevronDown>
            </UIBody>
        </UIContainer>
    );
})