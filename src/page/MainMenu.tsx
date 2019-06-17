import { isSize } from '@app/libs/ui/MediaQuery';
import UIBody from '@app/libs/ui/UIBody';
import UIButton from '@app/libs/ui/UIButton';
import UICard, { UICardBody, UICardFooter } from '@app/libs/ui/UICard';
import UICol from '@app/libs/ui/UICol';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIRow from '@app/libs/ui/UIRow';
import UIText from '@app/libs/ui/UIText';
import React from "react";
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Image, View } from 'reactxp';

const Menu = withRouter(({ history }: RouteComponentProps) => {
    isSize(['md', 'lg']) && history.push('/so');
    const iconStyle: any = {
        flexShrink: 'none',
        overflow: 'visible'
    };
    const data = [
        {
            title: 'Sales Order',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@app/images/order.png'),
            url: '/so'
        },
        {
            title: 'Sales Order Canvas',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@app/images/order.png'),
            url: '/so-canvas'
        },
        {
            title: 'Work Order',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@app/images/order2.png'),
            url: '/wo'
        },
        {
            title: 'AR Invoice',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@app/images/invoice.png'),
            url: '/ar-invoice'
        },
        {
            title: 'Customer',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@app/images/customer.png'),
            url: '/customer'
        },
        {
            title: 'User',
            subtitle: 'Lorem Ipsum is simply dummy text.',
            icon: require('@app/images/user.png'),
            url: '/user'
        }
    ]
    return (
        <UIRow>
            {data.map((item, key) => {
                return (
                    <UICol size={6} key={key}>
                        <Button onPress={() => {
                            history.push(item.url);
                        }}>
                            <UICard style={{
                                border: 0
                            }}>
                                <UICardBody style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 10
                                }}>
                                    <View style={iconStyle}>
                                        <Image
                                            source={item.icon}
                                            resizeMode="contain"
                                            style={{
                                                width: 50,
                                                height: 50,
                                                alignSelf: "center"
                                            }}
                                        />
                                    </View>
                                    <View style={{
                                        ...iconStyle,
                                        paddingLeft: 10
                                    }}>
                                        <UIText>
                                            {item.title}
                                        </UIText>
                                    </View>
                                </UICardBody>
                                <UICardFooter>
                                    <UIText style={{
                                        fontSize: 13,
                                        color: '#767676'
                                    }}>
                                        {item.subtitle}
                                    </UIText>
                                </UICardFooter>
                            </UICard>
                        </Button>
                    </UICol>
                )
            })}
        </UIRow>
    );
});


export default () => {
    return (
        <UIContainer>
            <UIHeader center="MasaBaru" right={
                <UIButton
                    size="compact"
                    fill="clear"
                    animation={false}
                    style={{ margin: 0 }}
                >
                    <Image
                        style={{ width: 28, height: 28 }}
                        source={require("@app/images/account.png")}
                    />
                </UIButton>
            } />
            <UIBody style={{
                paddingLeft: 15,
                paddingRight: 15
            }}>
                <Menu />
            </UIBody>
        </UIContainer>
    );
}