import { APISearch, APISearchProps } from '@app/api';
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        let query: APISearchProps = {
            Table: "OWTQ",
            Fields: ["DocNum", "CardName", "CardCode", "U_IDU_ITR_INTNUM", "DocDate"],
            Condition: [
                {
                    field: "DocStatus",
                    cond: "=",
                    value: "O"
                }
            ]
        };
        APISearch(query).then((res: any) => {
            setData(res);
        })
    }, []);

    return (
        <UIContainer>
            <UIHeader showSidebar={showSidebar} sidebar={sidebar} center={"Working Order"}>
            </UIHeader>
            <UIBody>
                <UIList
                    style={{ flex: 1 }}
                    primaryKey="DocNum"
                    selection="single"
                    onSelect={(item) => { history.push('/it/form/' + item.DocNum) }}
                    fields={{
                        CardName: {
                            table: {
                                header: 'Customer/Vendor'
                            }
                        },
                        CardCode: {
                            table: {
                                header: 'Code'
                            }
                        },
                        U_IDU_ITR_INTNUM: {
                            table: {
                                header: 'Request No.'
                            }
                        },
                        DocDate: {
                            table: {
                                header: 'Posting Date'
                            }
                        }
                    }}
                    items={data}
                />
            </UIBody>
        </UIContainer>
    );
}));
