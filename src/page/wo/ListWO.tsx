import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import BtnCreate from "@app/components/BtnCreate";
import rawQuery from '@app/libs/gql/data/rawQuery';

interface IRute {
    id: number,
    name: string,
    description: string
}

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
    const [data, setData]: any = useState<IRute[]>([]);
    useEffect(() => {
        rawQuery(`{
            work_order {
              id
              number
              return_date
              sales_details
              sales_id
              sales_name
              visite_date
              sopir
              sopir_nopol
            }
        }`).then((res) => {
            setData([...res.work_order]);
        });
    }, []);

    return (
        <UIContainer>
            <UIHeader
                showSidebar={showSidebar}
                sidebar={sidebar}
                center={"Working Order"}
            >
                <BtnCreate path="/wo/form" />
            </UIHeader>
            <UIBody scroll={true}>
                <UIList
                    style={{ flex: 1 }}
                    primaryKey="id"
                    selection="single"
                    onSelect={(d) => {
                        history.push('/wo/form/' + d.id)
                    }}
                    fields={{
                        number: {
                            table: {
                                header: "No. WO"
                            }
                        },
                        sales_name: {
                            table: {
                                header: "Sales"
                            }
                        },
                        sopir: {
                            table: {
                                header: "Sopir"
                            }
                        },
                        sopir_nopol: {
                            table: {
                                header: "Nopol"
                            }
                        },
                        visite_date: {
                            table: {
                                header: "Visite"
                            }
                        },
                        return_date: {
                            table: {
                                header: "Return"
                            }
                        }
                    }}
                    items={data}
                />
            </UIBody>
        </UIContainer>
    );
}));
