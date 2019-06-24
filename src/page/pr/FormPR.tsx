import IconSave from '@app/libs/ui/Icons/IconSave';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIBody from '@app/libs/ui/UIBody';
import UIButton from '@app/libs/ui/UIButton';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIText from '@app/libs/ui/UIText';
import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router';
import { APISearchProps, APISearch } from '@app/api';
import { View } from 'reactxp';
import IconAdd from '@app/libs/ui/Icons/IconAdd';
import FormPRDetailItems from './FormPRDetailItems';
import UIJsonField from '@app/libs/ui/UIJsonField';

export default withRouter(observer(({ match, showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        let query: APISearchProps = {
            Table: "OPOR",
            Fields: [
                "DocNum",
                "DocEntry",
                "DocCur",
                "DocRate",
                "GroupNum",
                "SlpCode",
                "CntctCode",
                "NumAtCard",
                "Address2",
                "Address",
                "Comments",
                "CardName",
                "CardCode",
                "U_IDU_PO_INTNUM",
                "U_IDU_SUP_SONUM"
            ],
            Condition: [{
                field: "DocEntry",
                cond: "=",
                value: match.params.id
            }]
        };
        APISearch(query).then((res: any) => {
            if (res.length > 0)
                setData(res[0]);
        })
    }, []);

    const [item, setItem] = useState([]);
    useEffect(() => {
        let query: APISearchProps = {
            Table: "POR1",
            Fields: [
                "LineNum",
                "ItemCode",
                "Dscription",
                "U_IDU_PARTNUM",
                "WhsCode",
                "Quantity",
                "UomCode",
                "OpenCreQty",

                "UseBaseUn",
                "ShipDate",
                "OcrCode",
                "OcrCode2",
                "PriceBefDi",
                "DiscPrcnt",
                "TaxCode"
            ],
            Condition: [{
                field: "DocEntry",
                cond: "=",
                value: match.params.id
            }]
        };
        APISearch(query).then((res: any) => {
            setItem(res);
        })
    }, []);

    console.log(data, item);
    return (
        <UIContainer>
            <UIHeader
                isBack={true}
                showSidebar={showSidebar}
                sidebar={sidebar} center="Purchase Receipt Form">
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
            <UIBody scroll={true}>
                <UIJsonField
                    items={data}
                    // hideUndeclared={true}
                    field={[
                        {
                            key: "general",
                            label: "General",
                            value: [
                                { key: "U_IDU_PO_INTNUM",type: "field", label: "PO Number",size: 7 },
                                { type: "empty", size: 5 },
                                { key: "DocDate", size: 4, label: "Posting Date" },
                                { key: "DocDueDate", size: 4, label: "Delivery Date" },
                                { type: "empty", size: 2 },
                                { key: "DocCur", size: 4, label: "Document Currency" },
                                { key: "DocRate", size: 4, label: "Document Rate" },
                                { key: "SlpCode", label: "Sales Employee" }
                            ]
                        },
                        {
                            key: "vendor",
                            label: "Vendor",
                            value: [
                                { key: "CardCode", label: "Customer", size: 3 },
                                { key: "CardName", label: "Name" },
                                { key: "CntctCode", label: "Contact Person" },
                                { key: "NumAtCard", label: "Ref No.", size: 8 }
                            ]
                        },
                        {
                            key: "payment",
                            label: "Payment",
                            sublabel: "Informasi Pembayaran",
                            value: [
                                {
                                    key: "Address2",
                                    label: "Ship To",
                                    size: 8
                                },
                                {
                                    key: "Address",
                                    label: "Bill To",
                                    size: 8
                                },
                                {
                                    key: "GroupNum",
                                    label: "Payment Method",
                                    size: 8
                                }
                            ]
                        },
                        { type: "empty" },
                        {
                            key: "optional",
                            label: "Optional",
                            value: [
                                {
                                    key: "Comments",
                                    label: "Remark",
                                    size: 12
                                }
                            ]
                        }
                    ]}
                    setValue={(value: any, key: any) => {
                        (data as any)[key] = value;
                    }}
                />

                <View style={{ marginTop: 50 }}>
                    <View
                        style={{
                            justifyContent: "space-between",
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <UIText
                            style={{
                                fontSize: 19,
                                color: "#333",
                                fontWeight: 400
                            }}
                        >
                            Detail Items
                        </UIText>
                        <UIButton
                            color="success"
                            size="small"
                            onPress={() => {
                                alert("Add!");
                            }}
                            style={{
                                height: 'auto'
                            }}
                        >
                            <IconAdd color="#fff" height={24} width={24} />
                            {isSize(["md", "lg"]) && (
                                <UIText style={{ color: "#fff" }} size="small">
                                    {" Add"}
                                </UIText>
                            )}
                        </UIButton>
                    </View>
                    <FormPRDetailItems items={item} setItems={setItem} />
                </View>
            </UIBody>
        </UIContainer>
    );
}))