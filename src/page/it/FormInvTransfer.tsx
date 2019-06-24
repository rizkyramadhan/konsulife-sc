import SAPDropdown from '@app/components/SAPDropdown';
import IconSave from '@app/libs/ui/Icons/IconSave';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIBody from '@app/libs/ui/UIBody';
import UIButton from '@app/libs/ui/UIButton';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UIText from '@app/libs/ui/UIText';
import { observer } from 'mobx-react-lite';
import React, { useState } from "react";
import { withRouter } from 'react-router';

const general = {
    DocDate: "",
    DocDueDate: "",
    CardCode: "",
    CardName: "",
    Address: "",
    Comments: "",
    SlpCode: "",
    Filler: "",
    ToWhsCode: "",
    U_IDU_IT_INTNUM: "",
    U_IDU_CONTNUM: "",
    U_IDU_NOSEAL: "",
    U_IDU_NOPL: "",
    U_IDU_NOPOL: "",
    U_IDU_DRIVER: ""
};

const detail = {
    ItemCode: "",
    Dscription: "",
    UseBaseUn: "",
    Quantity: "",
    UoMCode: "",
    SerialNum: "",
    WhsCode: ""
}

export default withRouter(observer(({ match, showSidebar, sidebar }: any) => {
    const [data, setData] = useState(general);

    console.log(match);
    return (
        <UIContainer>
            <UIHeader
                isBack={true}
                showSidebar={showSidebar}
                sidebar={sidebar} center="Inventory Transfer Form">
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
                                { key: "DocDate", size: 6, label: "Posting Date" },
                                { key: "DocDueDate", size: 6, label: "Due Date" },
                                {
                                    key: "CardCode", size: 7, component: (
                                        <SAPDropdown label="Customer/Vendor Code" field="CustomerCode" value={data.CardCode} setValue={(v) => { setData({ ...data, CardCode: v }) }} />)
                                },
                                { key: "CardName", size: 12, label: "Customer/Vendor Name" },
                                { key: "Address", size: 7, label: "Ship To" },
                                { key: "Comments", size: 7, label: "Remarks" },
                                { key: "SlpCode", size: 7, label: "Sales Employee", type: "field" },
                                {
                                    key: "Filler", size: 5, component: (
                                        <SAPDropdown label="From Warehouse Code" field="WarehouseCodeAll" value={data.Filler} setValue={(v) => { setData({ ...data, Filler: v }) }} />)
                                },
                                {
                                    key: "ToWhsCode", size: 6, component: (
                                        <SAPDropdown label="To Warehouse Code" field="WarehouseCodeAll" value={data.ToWhsCode} setValue={(v) => { setData({ ...data, ToWhsCode: v }) }} />)
                                }
                            ]
                        },
                        {
                            key: "info",
                            label: "Shipment",
                            value: [
                                { key: "U_IDU_IT_INTNUM", size: 12, label: "Transfer No." },
                                { key: "U_IDU_CONTNUM", size: 6, label: "No. Container" },
                                { key: "U_IDU_NOSEAL", size: 6, label: "No. Seal" },
                                { key: "U_IDU_NOPL", size: 6, label: "No. PL" },
                                { key: "U_IDU_NOPOL", size: 6, label: "Nopol" },
                                { key: "U_IDU_DRIVER", size: 12, label: "Driver" },
                            ]
                        },
                    ]}
                    setValue={(value: any, key: any) => {
                        (data as any)[key] = value;
                        setData(data);
                    }}
                />
            </UIBody>
        </UIContainer>
    );
}))