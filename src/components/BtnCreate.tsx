import { withRouter } from 'react-router-dom';
import React from 'react';
import UIButton from '@app/libs/ui/UIButton';
import IconAdd from '@app/libs/ui/Icons/IconAdd';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';

export default withRouter(({ history, path, style }: any) => {
    return (
        <UIButton
            size="small"
            color="primary"
            onPress={() => {
                history.push(path);
            }}
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                ...style
            }}
        >
            <IconAdd color="#fff" />
            {isSize(["md", "lg"]) && (
                <UIText style={{ color: "#fff" }}>Create</UIText>
            )}
        </UIButton>
    );
});