import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIList from "@app/libs/ui/UIList";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import BtnCreate from "@app/components/BtnCreate";

export default withRouter(observer(({ showSidebar, sidebar }: any) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        setData([]);
    }, []);

    return (
        <UIContainer>
            <UIHeader
                showSidebar={showSidebar}
                sidebar={sidebar}
                center={"Master Rute"}
            >
                <BtnCreate path="/rute/form" />
            </UIHeader>
            <UIBody scroll={true}>
                <UIList
                    style={{ flex: 1 }}
                    primaryKey="id"
                    selection="detail"
                    fields={{
                        name: {
                            table: {
                                header: "Nama"
                            }
                        },
                        description: {
                            table: {
                                header: "Deskripsi"
                            }
                        }
                    }}
                    items={data}
                />
            </UIBody>
        </UIContainer>
    );
}));
