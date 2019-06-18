import { isSize } from '@app/libs/ui/MediaQuery';
import UIBody from '@app/libs/ui/UIBody';
import UIButton from '@app/libs/ui/UIButton';
import UICard from '@app/libs/ui/UICard';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIJsonTable from '@app/libs/ui/UIJsonTable';
import UIRow from '@app/libs/ui/UIRow';
import UIText from '@app/libs/ui/UIText';
import React from "react";
import { withRouter } from 'react-router';
import { Image, Platform } from 'reactxp';

const FormCustomer = withRouter(({ history, setSide }: any) => {
    return (
        <UIButton size="compact"
            fill="clear"
            onPress={() => {
                history.push('/customer/form');
                if (Platform.getType() !== "web") {
                    setSide(false);
                }
            }}
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
            }}>
            <Image style={{ width: 28, height: 28 }}
                source={require("@app/images/add.png")}
            />
            {isSize(["md", "lg"]) && <UIText style={{ color: '#613eea' }}>Create</UIText>}
        </UIButton>
    );
});

const sample = [
    {
        CardCode: "JYP00003",
        CardName: "AMAN SALIM",
        CardFName: "AMAN SALIM - JAYAPURA",
        CardType: "CUSTOMER",
        LicTradNum: "07.754.763.6-952.000",
    },
    {
        CardCode: "TIM0002",
        CardName: "BOLEH SAJA",
        CardFName: "BOLEH SAJA - PT FREEPOT INDONESIA",
        CardType: "CUSTOMER",
        LicTradNum: "07.754.763.6-952.000",
    },
    {
        CardCode: "TIM0002",
        CardName: "BOLEH SAJA",
        CardFName: "BOLEH SAJA - PT FREEPOT INDONESIA",
        CardType: "CUSTOMER",
        LicTradNum: "07.754.763.6-952.000",
    },
    {
        CardCode: "TIM0002",
        CardName: "BOLEH SAJA",
        CardFName: "BOLEH SAJA - PT FREEPOT INDONESIA",
        CardType: "CUSTOMER",
        LicTradNum: "07.754.763.6-952.000",
    }
];

export default () => {
    const data = sample;

    return (
        <UIContainer>
            <UIHeader center="Customer" right={<FormCustomer />} />
            <UIBody>
                <UICard>
                    <UIJsonTable
                        headers={[
                            {
                                key: "CardCode",
                                label: "Code"
                            },
                            {
                                key: "LicTradNum",
                                label: "Federal Tax ID"
                            },
                            {
                                key: "CardName",
                                label: "Name"
                            },
                            {
                                key: "CardFName",
                                label: "Foreign Name"
                            },
                            {
                                key: "CardType",
                                label: "Type"
                            },
                            {
                                key: "action",
                                label: ""
                            }
                        ]}
                        data={data.map(item => ({
                            ...item,
                            action: (
                                <UIRow>
                                    <UIButton
                                        size="small"
                                        fill="outline"
                                        color="primary"
                                        style={{
                                            paddingTop: 2,
                                            paddingBottom: 2,
                                            paddingLeft: 5,
                                            paddingRight: 5,
                                            marginTop: 0,
                                            marginBottom: 2,
                                            fontColor: "#000"
                                        }}
                                    >
                                        View
                                        </UIButton>
                                </UIRow>
                            )
                        }))}
                        colWidth={[
                            {
                                index: 0,
                                width: 100
                            },
                            {
                                index: 2,
                                width: 150
                            },
                            {
                                index: 4,
                                width: 150
                            },
                            {
                                index: 5,
                                width: 80
                            }
                        ]}
                    />
                </UICard>
            </UIBody>
        </UIContainer>
    );
}