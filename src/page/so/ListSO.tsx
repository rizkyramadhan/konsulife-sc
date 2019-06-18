import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UICard from "@app/libs/ui/UICard";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonTable from "@app/libs/ui/UIJsonTable";
import { observer } from "mobx-react-lite";
import React from "react";
import { withRouter } from "react-router";
import { Platform, Image } from "reactxp";
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';

const FormSO = withRouter(({ history, setSide }: any) => {

    return (
        <UIButton size="compact"
            fill="clear"
            onPress={() => {
                history.replace("/so/form");
                if (Platform.getType() !== "web") {
                    setSide(false);
                }
            }}
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end"
            }}
        >
            <Image style={{ width: 28, height: 28 }}
                source={require("@app/images/add.png")}
            />
            {isSize(["md", "lg"]) && <UIText style={{ color: '#613eea' }}>Create</UIText>}
        </UIButton>
    );
});

export default observer(({ showSidebar, sidebar }: any) => {
    return (
        <UIContainer>
            <UIHeader
                showSidebar={showSidebar}
                sidebar={sidebar}
                center={"Sales Order"}
                right={<FormSO />}
            />
            <UIBody>
                <UICard>
                    <UIJsonTable
                        data={[
                            {
                                no: 1,
                                test: "qwe",
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
                        colWidth={[
                            {
                                index: 0,
                                width: 45
                            },
                            {
                                index: 2,
                                width: 150
                            }
                        ]}
                    />
                </UICard>
            </UIBody>
        </UIContainer>
    );
});
