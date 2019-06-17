import config from "@app/backend";
import getSession from '@app/libs/gql/session/getSession';
import login from '@app/libs/gql/session/login';
import logout from '@app/libs/gql/session/logout';
import UIBody from '@app/libs/ui/UIBody';
import UIButton from '@app/libs/ui/UIButton';
import UICol from '@app/libs/ui/UICol';
import UIContainer from '@app/libs/ui/UIContainer';
import UIJsonDetail from '@app/libs/ui/UIJsonDetail';
import UIRow from '@app/libs/ui/UIRow';
import UIText from '@app/libs/ui/UIText';
import UITextField from '@app/libs/ui/UITextField';
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Alert } from "reactxp";
import UICard from '@app/libs/ui/UICard';

const Logedin = ({ data, setSession }: any) => {
    return (
        <UICol size={4} xs={12} sm={12}>
            <UIText size="extralarge" style={{ paddingTop: 50, textAlign: "center" }}>
                Logged in
      </UIText>
            <UIJsonDetail data={data} />
            <UIRow>
                <UIButton
                    onPress={async () => {
                        setSession(false); // session loading
                        await logout();
                        setSession(null);
                    }}
                >
                    Logout
        </UIButton>
            </UIRow>
        </UICol>
    );
};

const LoginForm = observer(({ setSession }: any) => {
    const data = useObservable({
        username: "coba",
        password: "123"
    });
    return (
        <UICol size={4} xs={12} sm={12}>
            <UICard style={{ padding: 25 }}>
                <UIText size="extralarge" style={{ paddingTop: 50, textAlign: "center" }}>
                    Login Page
            </UIText>
                <UIText
                    style={{ paddingTop: 10, paddingBottom: 20, textAlign: "center" }}
                >
                    Silakan login sesuai dengan user di {config.url}
                </UIText>
                <UITextField
                    label="Username"
                    type="text"
                    value={data.username}
                    setValue={value => {
                        data.username = value;
                    }}
                />

                <UITextField
                    label="Password"
                    type="password"
                    value={data.password}
                    setValue={value => {
                        data.password = value;
                    }}
                />
                <UIRow>
                    <UIButton
                        onPress={async () => {
                            setSession(false); // set session as loading
                            let res = await login(data.username, data.password);

                            setSession(res);
                            if (!res) {
                                Alert.show("Gagal Login");
                            }
                        }}
                    >
                        Login
                </UIButton>
                </UIRow>
            </UICard>
        </UICol>
    );
});

export default observer(({ showSidebar }: any) => {
    showSidebar(false);
    const data = useObservable({
        session: false as any
    });

    useEffect(() => {
        (async () => {
            data.session = await getSession();
        })();
    }, []);

    const setSession = (session: any) => {
        data.session = session;
    };
    return (
        <UIContainer>
            <UIBody style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <UIRow style={{
                    width: '100%'
                }}>
                    <UICol size={4} xs={0} sm={0} />
                    {data.session === false ? (
                        <UIText style={{ textAlign: "center", padding: 100 }}>
                            Loading...
                        </UIText>
                    ) : data.session === null ? (
                        <LoginForm setSession={setSession} />
                    ) : (
                                <Logedin data={data.session} setSession={setSession} />
                            )}
                    <UICol size={4} xs={0} sm={0} />
                </UIRow>
            </UIBody>
        </UIContainer>
    );
});
