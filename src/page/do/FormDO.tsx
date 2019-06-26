import IconSave from '@app/libs/ui/Icons/IconSave';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIBody from '@app/libs/ui/UIBody';
import UIButton from '@app/libs/ui/UIButton';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UIText from '@app/libs/ui/UIText';
import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router';
import { APISearch, APISearchProps, APIPost, APISearchCache } from '@app/api';
import { View } from 'reactxp';
import FormDODetailItems from './FormDODetailItems';

export default withRouter(observer(({ match, showSidebar, sidebar }: any) => {
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState([]);
    useEffect(() => {
        let query: APISearchProps = {
            Table: "ODRF",
            Fields: [
                "ObjType",
                "CardCode",
                "NumAtCard",
                "DocDate",
                "DocDueDate",
                "DocCur",
                "DocRate",
                "U_IDU_SO_INTNUM",
                "GroupNum",
                "SlpCode",
                "CntctCode",
                "Address2",
                "Address",
                "Comments"
            ],
            Condition: [{
                field: "DocEntry",
                cond: "=",
                value: match.params.id
            }]
        };

        APISearchCache(query.Table, query.Condition).then((cache: any) => {
            setData(cache);
            if (cache.length > 0)
                setData(cache[0]);

            query.Cache = cache;
            APISearch(query).then((res: any) => {
                if (res.length > 0)
                    setData(res[0]);
            })
        })

    }, []);

    const [item, setItem] = useState([]);
    useEffect(() => {
        let query: APISearchProps = {
            Table: "DRF1",
            Fields: [
                "ObjType",
                "DocEntry",
                "LineNum",
                "ItemCode",
                "Dscription",
                "U_IDU_PARTNUM",
                "WhsCode",
                "Quantity",
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
            res.forEach((item: any) => {
                item.BaseType = item.ObjType;
                item.BaseLine = item.LineNum;
                item.BaseEntry = item.DocEntry;

                delete item.ObjType;
                delete item.DocEntry;
            });
            setItem(res);
        })
    }, []);

    const save = async () => {
        setSaving(true);
        try {
            await APIPost('DeliveryOrder', {
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
                showSidebar={showSidebar}
                sidebar={sidebar}
                center="Form Delivery Order"
            >
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
                    field={[
                        {
                            key: "general",
                            label: "General",
                            sublabel: "Informasi SO",
                            value: [
                                {
                                    key: "U_IDU_SO_INTNUM",
                                    type: "field",
                                    label: "SO Number",
                                    size: 7
                                },
                                {
                                    key: "U_IDU_DO_INTNUM",
                                    label: "DO Number",
                                    size: 7
                                },
                                { type: "empty", size: 5 },
                                { key: "DocDate", size: 4, label: "Posting Date" },
                                { key: "DocDueDate", size: 4, label: "Delivery Date" },
                                { type: "empty", size: 2 },
                                {
                                    key: "U_BRANCH",
                                    type: "field",
                                    label: "Cabang",
                                    size: 7
                                }
                            ]
                        },
                        {
                            key: "customer",
                            label: "Customer",
                            sublabel: "Toko Penerima Barang",
                            value: [
                                { key: "CardCode", label: "Customer", size: 3 },
                                { key: "CardName", label: "Name" }
                            ]
                        },
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
                    </View>
                    <FormDODetailItems items={item} setItems={setItem} />
                </View>
            </UIBody>
        </UIContainer>
    );
}));
