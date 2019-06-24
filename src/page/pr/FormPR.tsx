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
import { APISearchProps, APISearch, APIPost } from '@app/api';
import { View } from 'reactxp';
// import IconAdd from '@app/libs/ui/Icons/IconAdd';
import FormPRDetailItems from './FormPRDetailItems';
import UIJsonField from '@app/libs/ui/UIJsonField';

export default withRouter(observer(({ match, showSidebar, sidebar }: any) => {
    const [saving, setSaving] = useState(false);
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
                "U_IDU_SO_INTNUM",
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
                "DocEntry",
                "BaseEntry",
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
            res.forEach((item:any) => {
            item.BaseType = "22";
            item.BaseLine = item.LineNum;
            item.BaseEntry = item.DocEntry;
            });
            setItem(res);
        })
    }, []);

    const save = async () => {
        setSaving(true);
        try {
          await APIPost('PurchaseReceipt', {
            ...data, Lines: item,
          });
        }
        catch (e) {
          alert(e.Message);
        }
        finally {
          setSaving(false);
        }
      }
      
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
                        save();
                    }}
                >
                    <IconSave color="#fff" />
                    {isSize(["md", "lg"]) && (
                        <UIText style={{ color: "#fff" }}>{saving ? " Saving..." : " Save"}</UIText>
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
                                { key: "DocDate", size: 4, type:"date" ,label: "Posting Date" },
                                { key: "DocDueDate", size: 4, type:"date",label: "Delivery Date" },
                                { type: "empty", size: 2 },
                                { key: "DocCur", size: 4,type: "field", label: "Document Currency" },
                                { key: "DocRate", size: 4,type: "field", label: "Document Rate" },
                                { key: "SlpCode",type: "field", label: "Sales Employee" }
                            ]
                        },
                        {
                            key: "vendor",
                            label: "Vendor",
                            value: [
                                { key: "CardCode",type: "field", label: "Customer", size: 3 },
                                { key: "CardName",type: "field", label: "Name" },
                                { key: "CntctCode",type: "field", label: "Contact Person" },
                                { key: "NumAtCard",type: "field", label: "Ref No.", size: 8 }
                            ]
                        },
                        {
                            key: "payment",
                            label: "Payment",
                            sublabel: "Informasi Pembayaran",
                            value: [
                                { key: "Address2",type: "field",label: "Ship To",size: 8},
                                { key: "Address",type: "field",label: "Bill To",size: 8},
                                { key: "GroupNum",type: "field",label: "Payment Method",size: 8}
                            ]
                        },
                        { type: "empty" },
                        {
                            key: "optional",
                            label: "Optional",
                            value: [
                                { key: "Comments",type: "field", label: "Remark", size: 12}
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
                    </View>
                    <FormPRDetailItems items={item} setItems={setItem} />
                </View>
            </UIBody>
        </UIContainer>
    );
}))