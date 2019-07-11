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
            Table: "ORDR",
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

        APISearch(query2).then((res: any) => {
            setDataSO(res.length)
        });

        let query3: APISearchProps = {
            Table: "ODRF",
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
            <UIHeader pattern={true} showSidebar={showSidebar} sidebar={sidebar} center={
                <UIText size="large" style={{ color: '#fff' }}>Dashboard</UIText>
            }>
            </UIHeader>
            <UIBody>
                <UIRow
                    style={{
                        width: "100%"
                    }}
                >
                    <UICol size={4} xs={12} sm={12} style={{ alignItems: 'center' }}>
                        <UICard style={{
                            borderRadius: 10,
                            borderColor: '#cde0ff',
                            width: '100%',
                            maxWidth: 250
                        }}>
                            <UICardBody style={{
                                flex: 1,
                                alignItems: 'center',
                            }}>
                                <UIText style={{ fontSize: 45, textAlign: 'right', color: '#1d6ef7' }}>
                                    {dataPOD}
                                </UIText>
                                <UIText style={{ fontSize: 14, color: '#6d6d6d' }}>
                                    Goods Receipt PO Draft (Open)
                                </UIText>
                            </UICardBody>
                        </UICard>
                    </UICol>
                    <UICol size={4} xs={12} sm={12} style={{ alignItems: 'center' }}>
                        <UICard style={{
                            borderRadius: 10,
                            borderColor: '#ffcdcd',
                            width: '100%',
                            maxWidth: 250
                        }}>
                            <UICardBody style={{
                                flex: 1,
                                alignItems: 'center',
                            }}>
                                <UIText style={{ fontSize: 45, textAlign: 'right', color: '#f71d1d' }}>
                                    {dataSOD}
                                </UIText>
                                <UIText style={{ fontSize: 14, color: '#777' }}>
                                    Sales Order Draft (Open)
                                </UIText>
                            </UICardBody>
                        </UICard>
                    </UICol>
                    <UICol size={4} xs={12} sm={12} style={{ alignItems: 'center' }}>
                        <UICard style={{
                            borderRadius: 10,
                            borderColor: '#a6d8a9',
                            width: '100%',
                            maxWidth: 250
                        }}>
                            <UICardBody style={{
                                flex: 1,
                                alignItems: 'center',
                            }}>
                                <UIText style={{ fontSize: 45, textAlign: 'right', color: '#4caf50' }}>
                                    {dataSO}
                                </UIText>
                                <UIText style={{ fontSize: 14, color: '#777' }}>
                                    Sales Order (Open)
                                </UIText>
                            </UICardBody>
                        </UICard>
                    </UICol>
                </UIRow>
            </UIBody>
        </UIContainer>
    );
}))