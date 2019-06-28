import { withRouter } from 'react-router-dom';
import React from 'react';
import UIButton from '@app/libs/ui/UIButton';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';
import IconReceipt from '@app/libs/ui/Icons/IconReceipt';

export default withRouter(({ history, path, style }: any) => {
    return (
        <UIButton
            size="small"
            color="success"
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
            <IconReceipt color="#fff" />
            {isSize(["md", "lg"]) && (
                <UIText style={{ color: "#fff" }}>Draft</UIText>
            )}
        </UIButton>
    );
});