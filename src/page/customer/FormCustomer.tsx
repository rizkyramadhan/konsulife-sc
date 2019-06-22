import UIBody from '@app/libs/ui/UIBody';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UITabs from '@app/libs/ui/UITabs';
import UIText from '@app/libs/ui/UIText';
import { observer } from 'mobx-react-lite';
import React from "react";
import { View } from 'reactxp';
import FormAddress from './FormAddress';
import FormContactPerson from './FormContactPerson';

const sample = {
    Series: "",
    CardName: "",
    CardType: "LEAD",
    GroupCode: "",
    LicTradNum: "",
    AddID: "",
    SlpCode: "",
    Phone1: "",
    Phone2: "",
    Fax: "",
    Cellular: "",
    E_Mail: "",
    U_IDU_AREA: "PAPUA",
    U_IDU_BRANCH: "JYP"
};

const sampleContactP = {
    Name: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Tel1: "",
    Tel2: "",
    Cellolar: ""
};

const sampleAddress = {
    AddressId: "",
    Address: "",
    ZipCode: "",
    City: "",
    State1: "",
    AddressIdS: "",
    MailAddress: "",
    MailZipCode: "",
    MailCity: "",
    State2: ""
};

export default observer(({ showSidebar, sidebar }: any) => {
    const data = sample;
    const dataContactP = sampleContactP;
    const dataAddress = sampleAddress;
    return (
        <UIContainer>
            <UIHeader
                isBack={true}
                showSidebar={showSidebar}
                sidebar={sidebar}
                center="Customer"
            />
            <UIBody>
                <UIJsonField
                    items={data}
                    field={[
                        {
                            key: "general",
                            label: "General",
                            sublabel: "Informasi Customer",
                            value: [
                                { key: "CardType", type: 'field', size: 6, label: "BP Type" },
                                { key: "U_IDU_BRANCH", type: 'field', size: 6, label: "Branch" },
                                { key: "U_IDU_AREA", type: 'field', size: 12, label: "Area" },
                                { key: "Series", size: 12, label: "Series" },
                                { key: "GroupCode", size: 6, label: "Group Code" },
                                { key: "SlpCode", size: 6, label: "Sales Employee Code" },
                                { key: "CardName", size: 12, label: "BP Name" },
                                { key: "LicTradNum", size: 12, label: "NPWP" },
                                { key: "AddID", size: 12, label: "No KTP" },
                            ]
                        },
                        {
                            key: "general",
                            label: "Contact",
                            sublabel: "Informasi Contact",
                            value: [
                                { key: "Phone1", size: 6, label: "Telephone 1" },
                                { key: "Phone2", size: 6, label: "Telephone 1" },
                                { key: "Fax", size: 6, label: "Fax Number" },
                                { key: "Cellular", size: 6, label: "Mobile Phone" },
                                { key: "E_Mail", size: 12, label: "E-Mail" }
                            ]
                        }
                    ]}
                    setValue={(value: any, key: any) => {
                        (data as any)[key] = value;
                    }}
                />
                <View style={{ marginTop: 50 }}>
                    <UITabs
                        tabs={[
                            {
                                label: () => {
                                    return (
                                        <UIText
                                            style={{
                                                fontSize: 19,
                                                color: "#333",
                                                fontWeight: 400
                                            }}
                                        >
                                            Contact Person
                                         </UIText>
                                    );
                                },
                                content: (
                                    <FormContactPerson data={dataContactP} setItems={(value: any, key: any) => {
                                        (dataContactP as any)[key] = value;
                                    }} />
                                )
                            },
                            {
                                label: () => {
                                    return (
                                        <UIText
                                            style={{
                                                fontSize: 19,
                                                color: "#333",
                                                fontWeight: 400
                                            }}
                                        >
                                            Address
                                        </UIText>
                                    );
                                },
                                content: (
                                    <FormAddress
                                        data={dataAddress}
                                        setData={(value: any, key: any) => {
                                            (dataAddress as any)[key] = value;
                                        }}
                                    />
                                )
                            }
                        ]}
                    />
                </View>
            </UIBody>
        </UIContainer>
    );
});