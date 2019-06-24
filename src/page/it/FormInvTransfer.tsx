import IconSave from '@app/libs/ui/Icons/IconSave';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIBody from '@app/libs/ui/UIBody';
import UIButton from '@app/libs/ui/UIButton';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIText from '@app/libs/ui/UIText';
import { observer } from 'mobx-react-lite';
import React from "react";
import { withRouter } from 'react-router';

export default withRouter(observer(({ history, showSidebar, sidebar }: any) => {
    console.log(history);
    return (
        <UIContainer>
            <UIHeader
                isBack={true}
                showSidebar={showSidebar}
                sidebar={sidebar} center="Inventory Transfer Form">
                <UIButton
                    color="primary"
                    size="small"
                    onPress={() => {
                        alert("Saved!");
                    }}
                >
                    <IconSave color="#fff" />
                    {isSize(["md", "lg"]) && (
                        <UIText style={{ color: "#fff" }}>{" Save"}</UIText>
                    )}
                </UIButton>
            </UIHeader>
            <UIBody>
            </UIBody>
        </UIContainer>
    );
}))