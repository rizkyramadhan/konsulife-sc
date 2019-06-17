import UIBody from '@app/libs/ui/UIBody';
import UICard, { UICardBody, UICardHeader } from '@app/libs/ui/UICard';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UIText from '@app/libs/ui/UIText';
import { observer, useObservable } from 'mobx-react-lite';
import React from "react";
import UISeparator from '@app/libs/ui/UISeparator';

export default observer(({ showSidebar, sidebar }: any) => {
    const data = useObservable({
        CardCode: "",
        CardName: "",
        CardFName: "",
        CardType: "",
        GroupCode: "",
        Currency: "",
        ListNum: "",
        LicTradNum: "",
        AddID: "",
        SlpCode: "",
        Phone1: "",
        Phone2: "",
        Fax: "",
        Cellular: "",
        E_Mail: "",
        validFor: "",
        validFrom: "",
        validTo: "",
        frozenFor: "",
        frozenFrom: "",
        frozenTo: "",
        U_IDU_LIMITTEM: "",
        U_IDU_AREA: "",
        U_IDU_BRANCH: "",
        DebPayAcct: "",
        ECVatGroup: "",
        GroupNum: "",
        CreditLine: "",
        DebtLine: ""
    });
    const setValue = (value: any, key: any) => {
        (data as any)[key] = value;
    }
    return (
        <UIContainer>
            <UIHeader
                isBack={true}
                showSidebar={showSidebar}
                sidebar={sidebar}
                center="Customer"
            />
            <UIBody>
                <UICard>
                    <UICardHeader>
                        <UIText>Form Customer</UIText>
                        <UISeparator />
                    </UICardHeader>
                    <UICardBody>
                        <UIJsonField items={data} setValue={setValue} />
                    </UICardBody>
                </UICard>
            </UIBody>
        </UIContainer>
    );
});