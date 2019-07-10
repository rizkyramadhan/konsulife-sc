import { APISearch, APISearchProps } from '@app/api';
import global from '@app/global';
import UIBody from '@app/libs/ui/UIBody';
import UICard, { UICardBody } from '@app/libs/ui/UICard';
import UICol from '@app/libs/ui/UICol';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIRow from '@app/libs/ui/UIRow';
import UIText from '@app/libs/ui/UIText';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router';

export default withRouter(observer(({ showSidebar, sidebar }: any) => {
    const [dataSOD, setDataSOD] = useState(0);
    const [dataPOD, setDataPOD] = useState(0);
    const [dataSO, setDataSO] = useState(0);

    useEffect(() => {
        let query: APISearchProps = {
            Table: "ODRF",
            Fields: ['DocEntry'],
            Condition: [
                {
                    field: "DocStatus",
                    cond: "=",
                    value: "O"
                },
                { cond: "AND" },
                { field: "ObjType", cond: "=", value: 17 },
                { cond: "AND" },
                {
                    field: "U_BRANCH",
                    cond: "=",
                    value: global.getSession().user.branch
                }
            ]
        };

        APISearch(query).then((res: any) => {
            setDataSOD(res.length)
        });

        let query2: APISearchProps = {
            Table: "ODRF",
            Fields: ['DocEntry'],
            Condition: [
                {
                    field: "DocStatus",
                    cond: "=",
                    value: "O"
                },
                { cond: "AND" },
                { field: "ObjType", cond: "=", value: 17 }
            ]
        };

        APISearch(query2).then((res: any) => {
            setDataSO(res.length)
        });

        let query3: APISearchProps = {
            Table: "OPDN",
            Fields: ['DocEntry'],
            Condition: [
                {
                    field: "DocStatus",
                    cond: "=",
                    value: "O"
                },
                { cond: "AND" },
                { field: "ObjType", cond: "=", value: 20 },
                { cond: "AND" },
                {
                    field: "U_BRANCH",
                    cond: "=",
                    value: global.getSession().user.branch
                }
            ]
        };

        APISearch(query3).then((res: any) => {
            setDataPOD(res.length)
        });
    }, []);
    return (
        <UIContainer>
            <UIHeader showSidebar={showSidebar} sidebar={sidebar} center="Home">
            </UIHeader>
            <UIBody>
                <UIRow
                    style={{
                        width: "100%"
                    }}
                >
                    <UICol size={4} xs={12} sm={12}>
                        <UICard style={{
                            borderRadius: 10,
                            borderColor: '#cde0ff',
                            backgroundColor: '#edf6ff'
                        }}>
                            <UICardBody style={{
                                flex: 1,
                                alignItems: 'center',
                            }}>
                                <UIText style={{ fontSize: 45, textAlign: 'right', color: '#1d6ef7' }}>
                                    {dataPOD}
                                </UIText>
                                <UIText style={{ fontSize: 14, color: '#6d6d6d' }}>
                                    Outstanding Goods Receipt PO
                                </UIText>
                            </UICardBody>
                        </UICard>
                    </UICol>
                    <UICol size={4} xs={12} sm={12}>
                        <UICard style={{
                            borderRadius: 10,
                            borderColor: '#ffcdcd',
                            backgroundColor: '#ffeded'
                        }}>
                            <UICardBody style={{
                                flex: 1,
                                alignItems: 'center',
                            }}>
                                <UIText style={{ fontSize: 45, textAlign: 'right', color: '#f71d1d' }}>
                                    {dataSOD}
                                </UIText>
                                <UIText style={{ fontSize: 14, color: '#777' }}>
                                    Outstanding Sales Order
                                </UIText>
                            </UICardBody>
                        </UICard>
                    </UICol>
                    <UICol size={4} xs={12} sm={12}>
                        <UICard style={{
                            borderRadius: 10,
                            borderColor: '#a6d8a9',
                            backgroundColor: '#def1df'
                        }}>
                            <UICardBody style={{
                                flex: 1,
                                alignItems: 'center',
                            }}>
                                <UIText style={{ fontSize: 45, textAlign: 'right', color: '#4caf50' }}>
                                    {dataSO}
                                </UIText>
                                <UIText style={{ fontSize: 14, color: '#777' }}>
                                    Outstanding SO
                                </UIText>
                            </UICardBody>
                        </UICard>
                    </UICol>
                </UIRow>
            </UIBody>
        </UIContainer>
    );
}))