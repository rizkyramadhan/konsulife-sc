import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import BtnCreate from "@app/components/BtnCreate";

const sample = [{
    id: 1,
    number: "WO/BPP-01/VI/19",
    sales_id: 1,
    sales_name: "RICKY SUSANTO",
    sopir: "SAMINA",
    sopir_sim: "12345",
    nopol: 'KT 9800 OK',
    branch: "BPP",
    rute: "BPP-001",
    periode_start: "2019-06-01",
    periode_end: "2019-06-05"
}, {
    id: 2,
    number: "WO/BPP-01/VI/19",
    sales_id: 1,
    sales_name: "RICKY SUSANTO",
    sopir: "SAMINA",
    sopir_sim: "12345",
    nopol: 'KT 9800 OK',
    branch: "BPP",
    rute: "BPP-001",
    periode_start: "2019-06-01",
    periode_end: "2019-06-05"
}]

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
    const [data, setData]: any[] = useState([]);
    useEffect(() => {
        setData([...sample]);
    }, []);

    return (
        <UIContainer>
            <UIHeader
                showSidebar={showSidebar}
                sidebar={sidebar}
                center={"Working Order"}
            >
                <BtnCreate path="wo/form" />
            </UIHeader>
            <UIBody>
                <UIList
                    style={{ flex: 1 }}
                    primaryKey="id"
                    selection="single"
                    onSelect={() => { history.push("/wo/form") }}
                    fields={{
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
                        sopir_sim: {
                            table: {
                                header: "No SIM"
                            }
                        },
                        nopol: {
                            table: {
                                header: "Nopol"
                            }
                        },
                        branch: {
                            table: {
                                header: "Cabang"
                            }
                        },
                        rute: {
                            table: {
                                header: "Rute"
                            }
                        },
                        periode_start: {
                            table: {
                                header: "Start"
                            }
                        },
                        periode_end: {
                            table: {
                                header: "End"
                            }
                        }
                    }}
                    items={data}
                />
            </UIBody>
        </UIContainer>
    );
}));
