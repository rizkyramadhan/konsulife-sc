import UIList from "@app/libs/ui/UIList";
import React from "react";
import { View, Button } from 'reactxp';
import { MainStyle } from '@app/config';
import UIText from '@app/libs/ui/UIText';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UISeparator from '@app/libs/ui/UISeparator';

export default ({ items, setItems }: any) => {
    
    return (
        <UIList
            selection="detail"
            detailComponent={(item) => {
                const setValue = (val: any, key: string) => {
                const idx = items.findIndex((x: any) => x.No === item.item.No);
                items[idx][key] = val;
                setItems(items);
                };
                return (
                <View
                    style={{
                    borderWidth: 0,
                    borderLeftWidth: 1,
                    borderColor: "#ececeb",
                    backgroundColor: "#fff",
                    flexBasis: 350
                    }}
                >
                    <View
                    style={{
                        padding: 4,
                        marginLeft: 0,
                        marginRight: 0,
                        paddingLeft: 0,
                        flexDirection: "row",
                        justifyContent: "space-around",
                        backgroundColor: MainStyle.backgroundColor
                    }}
                    >
                    <View
                        style={{
                        alignItems: "flex-start",
                        justifyContent: "center",
                        flex: 1,
                        paddingLeft: 10
                        }}
                    >
                    <UIText>{item.pkval}</UIText>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Button onPress={() => { setItems([...items]); item.close(); }}>
                        <UIText size="large">&times;</UIText>
                        </Button>
                    </View>
                    </View>
                    <UISeparator style={{ marginTop: 0, marginBottom: 0 }} />
                    <UIJsonField
                    items={item.item}
                    setValue={setValue}
                    style={{
                        padding: 10
                    }}
                    field={[
                        { key: 'Quantity', size: 12, label:"Quantity" },
                    ]}
                    />
                    
                </View>
                )
            }}
            primaryKey="LineNum"
            items={items}
            fields={{
                ItemCode: {
                    table: {
                        header: "Code"
                    }
                },
                Dscription: {
                    table: {
                        header: "Item Name"
                    }
                },
                U_IDU_PARTNUM: {
                    table: {
                        header: "Part Number"
                    }
                },
                WhsCode: {
                    table: {
                        header: "Warehouse"
                    }
                },
                Quantity: {
                    table: {
                        header: "Quantity"
                    }
                },
                UomCode: {
                    table: {
                        header: "UoM Code"
                    }
                },
                OpenCreQty: {
                    table: {
                        header: "Open Qty"
                    }
                },
            }}
        />
    );
};
