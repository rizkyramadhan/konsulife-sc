import rawQuery from '@app/libs/gql/data/rawQuery';
import UIBody from '@app/libs/ui/UIBody';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIList from '@app/libs/ui/UIList';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router';
import UIButton from '@app/libs/ui/UIButton';
import IconAdd from '@app/libs/ui/Icons/IconAdd';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';
import global from '@app/global';

const BtnCreate = withRouter(({ history }: any) => {
    return (
        <UIButton
            size="small"
            color="primary"
            onPress={() => {
                history.push("/user/form");
            }}
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end"
            }}
        >
            <IconAdd color="#fff" />
            {isSize(["md", "lg"]) && (
                <UIText style={{ color: "#fff" }}>Create</UIText>
            )}
        </UIButton>
    );
});

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    console.log(global.session.user.branch);
    useEffect(() => {
        const getUser = async () => {
            await rawQuery(`{
                user(where: {branch: {_eq: "${global.session.user.branch}"}}) {
                  bpgroup
                  fullname
                  id
                  warehouse_id
                  username
                  sap_id
                  role
                }
              }`, ).then(res => setData(res.user))
        }
        getUser();
    }, []);
    return (
        <UIContainer>
            <UIHeader showSidebar={showSidebar} sidebar={sidebar} center="User">
                <BtnCreate />
            </UIHeader>
            <UIBody>
                <UIList
                    style={{ flex: 1 }}
                    primaryKey="id"
                    selection="detail"
                    onSelect={(item) => {
                        history.push('/user/form/' + item.id);
                    }}
                    fields={{
                        id: {
                            table: {
                                header: "Id"
                            }
                        },
                        fullname: {
                            table: {
                                header: 'Name'
                            }
                        },
                        warehouse_id: {
                            table: {
                                header: 'Warehouse Code'
                            }
                        },
                        bpgroup: {
                            table: {
                                header: 'BP Group'
                            }
                        }
                    }}
                    items={data}
                />
            </UIBody>
        </UIContainer>
    );
}))