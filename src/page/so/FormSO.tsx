import UIBody from '@app/libs/ui/UIBody';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import { observer } from 'mobx-react-lite';
import React from "react";

export default observer(({ showSidebar, sidebar }: any) => {
    return (
        <UIContainer>
            <UIHeader showSidebar={showSidebar} sidebar={sidebar} center="Form Sales Order" />
            <UIBody></UIBody>
        </UIContainer>
    );
})