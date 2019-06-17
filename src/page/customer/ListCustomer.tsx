import UIBody from '@app/libs/ui/UIBody';
import UIButton from '@app/libs/ui/UIButton';
import UICard, { UICardBody, UICardHeader } from '@app/libs/ui/UICard';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIJsonTable from '@app/libs/ui/UIJsonTable';
import UISeparator from '@app/libs/ui/UISeparator';
import UIText from '@app/libs/ui/UIText';
import { observer } from 'mobx-react-lite';
import React from "react";
import { withRouter } from 'react-router';
import { Platform } from 'reactxp';

const FormCustomer = withRouter(({ history, setSide }: any) => {
    return (
        <UIButton size="small"
            onPress={() => {
                history.replace('/customer/form');
                if (Platform.getType() !== "web") {
                    setSide(false);
                }
            }}
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
            }}>Create</UIButton>
    );
});

export default observer(({ showSidebar, sidebar }: any) => {
    return (
        <UIContainer>
            <UIHeader showSidebar={showSidebar} sidebar={sidebar} center="Customer" />
            <UIBody>
                <UICard>
                    <UICardHeader style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        paddingTop: 0,
                        paddingBottom: 0,
                        width: '100%',
                    }}>
                        <UIText style={{
                            flexShrink: 'none',
                            width: '100%'
                        }}>List Customer</UIText>
                        <FormCustomer />
                    </UICardHeader>
                    <UISeparator />
                    <UICardBody>
                        <UIJsonTable
                            data={[
                                {
                                    no: 1,
                                    test: 'qwe',
                                    coba: "halo"
                                },
                                {
                                    no: 2,
                                    test: "asdasd",
                                    coba: "halo"
                                },
                                {
                                    no: 3,
                                    test: "asdasd",
                                    coba: "halo"
                                },
                                {
                                    no: 4,
                                    test: "asdasd",
                                    coba: "halo"
                                }
                            ]}
                            colWidth={[{
                                index: 0,
                                width: 45
                            },
                            {
                                index: 2,
                                width: 150
                            }
                            ]}
                        />
                    </UICardBody>
                </UICard>
            </UIBody>
        </UIContainer>
    );
})