import { isSize } from '@app/libs/ui/MediaQuery';
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UITabs from "@app/libs/ui/UITabs";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { View } from "reactxp";
import FormCustomerCPItems from './FormCustomerCPItems';
import FormCustomerBillToItems from './FormCustomerBillToItems';
import FormCustomerShipToItems from './FormCustomerShipToItems';
import IconSave from "@app/libs/ui/Icons/IconSave";

const sample = {
    Series: "",
    CardName: "",
    CardType: "",
    GroupCode: "",
    LicTradNum: "",
    AddID: "",
    SlpCode: "",
    Phone1: "",
    Phone2: "",
    Fax: "",
    Cellular: "",
    E_Mail: "",
    U_IDU_AREA: "",
    U_IDU_BRANCH: "",
    GroupNum: ""
};

const cpList = [
    {
        Name: "Jon",
        FirstName: "Joni",
        MiddleName: "",
        LastName: "",
        Tel1: "",
        Tel2: "",
        Cellolar: ""
    }
];

const billToList = [
    {
        AddressId: "GAYUNGSARI",
        Address: "Jl. Gayung Sari No.xx",
        ZipCode: "",
        City: "SURABAYA",
        State1: 10,
        AddressType: "B"
    }
];

const shipToList = [
    {
        AddressId: "GAYUNGSARI",
        MailAddress: "Jl. Gayung Sari No.xx",
        MailZipCod: "",
        MailCity: "SURABAYA",
        State2: 10,
        AddressType: "S"
    }
];

export default observer(({ showSidebar, sidebar }: any) => {
    const data = sample;
    const [itemCP, setItemCP] = useState(cpList);
    const [itemBillTo, setItemBillTo] = useState(billToList);
    const [itemShipTo, setItemShipTo] = useState(shipToList);

    return (
        <UIContainer>
            <UIHeader
                isBack={true}
                showSidebar={showSidebar}
                sidebar={sidebar}
                center="Form Master Customer"
            >
                <UIButton
                    color="primary"
                    size="small"
                    onPress={() => {
                        alert("Saved!");
                    }}
                >
                <IconSave color="#fff" />
                    {isSize(["md", "lg"]) && (
                        <UIText style={{ color: "#fff" }}>{" Save"}</UIText>
                    )}
                </UIButton>
            </UIHeader>
            <UIBody>
                <UIJsonField
                items={data}
                field={[
                    {
                        key: "general",
                        label: "General",
                        value: [
                            { key: "Series", size: 7, label: "Series" },
                            { key: "CardName", size: 7, label: "BP Name" },
                            { key: "CardType", size: 7, label: "BP Type" },
                            { key: "GroupCode", size: 7, label: "Group Code" },
                            { key: "U_IDU_AREA", size: 7, label: "Area" },
                            { key: "U_IDU_BRANCH", size: 7, label: "Branch" },
                            { key: "SlpCode", size: 7, label: "Sales Employee Code" },
                        ]
                    },
                    {
                        key:"info",
                        label:"Customer Info",
                        value: [
                            { key: "LicTradNum", size: 7, label: "NPWP" },
                            { key: "AddID", size: 7, label: "No KTP" },
                            { key: "Phone1", size: 7, label: "Telephone 1" },
                            { key: "Phone2", size: 7, label: "Telephone 2" },
                            { key: "Fax", size: 7, label: "Fax Number" },
                            { key: "Cellular", size: 7, label: "Mobile Phone" },
                            { key: "E_Mail", size: 7, label: "E-Mail" },
                        ]
                    },
                    {
                        key: "payment",
                        label: "Payment Terms",
                        value: [
                            { key: "GroupNum", label: "Payment Terms Code", size: 7}
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
                                content: (<FormCustomerCPItems items={itemCP} setItems={setItemCP} />)
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
                                    Bill To
                                    </UIText>
                                    );
                                },
                                content: (
                                <FormCustomerBillToItems items={itemBillTo} setItems={setItemBillTo} />
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
                                    Ship To
                                    </UIText>
                                    );
                                },
                                content: (
                                <FormCustomerShipToItems items={itemShipTo} setItems={setItemShipTo} />
                                )
                            }
                        ]}
                    />
                </View>
            </UIBody>
        </UIContainer>
    );
});