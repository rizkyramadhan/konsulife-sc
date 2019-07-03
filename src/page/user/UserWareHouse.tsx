import { MainStyle } from '@app/config';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UIList from '@app/libs/ui/UIList';
import UISeparator from '@app/libs/ui/UISeparator';
import UIText from '@app/libs/ui/UIText';
import React from "react";
import { Button, View } from 'reactxp';
import SAPDropdown from '@app/components/SAPDropdown';

export default ({ items, setItems }: any) => {
    return (
        <UIList
            style={{ flex: 1 }}
            primaryKey="id"
            selection="detail"
            fields={{
                warehouse_code: {
                    table: {
                        header: 'Warehouse Code'
                    }
                }
            }}
            items={items}
            detailComponent={(item) => (
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
                        setValue={(val: any, key: string) => {
                            const idx = items.findIndex((x: any) => x.Key === item.pkval);
                            items[idx][key] = val;
                            setItems([...items]);
                        }}
                        style={{
                            padding: 10
                        }}
                        field={[
                            {
                                key: "warehouse_code", size: 12, label: "Warehouse Code", component: (
                                    <SAPDropdown label="Warehouse Code" field="Custom" customQuery={{
                                        Table: "OWHS",
                                        Fields: ["WhsCode"],
                                        Page: 1
                                    }} value={(item as any).item.warehouse_code} setValue={(v) => {
                                        const idx = items.findIndex((x: any) => x.id === item.pkval);
                                        items[idx]['warehouse_code'] = v;
                                        if (!items[idx]['status']) {
                                            items[idx]['status'] = 'update';
                                        }
                                        setItems([...items]);
                                        console.log(items[idx]);
                                    }} />)
                            }
                        ]}
                    />
                </View>
            )}
        />
    );
}