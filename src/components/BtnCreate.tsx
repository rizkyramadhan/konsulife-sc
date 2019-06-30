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
                height: 45,
                ...style
            }}
        >
            <IconAdd color="#fff" width={20} height={20} />
            {isSize(["md", "lg"]) && (
                <UIText style={{ color: "#fff" }} size="small"> Create</UIText>
            )}
        </UIButton>
    );
});