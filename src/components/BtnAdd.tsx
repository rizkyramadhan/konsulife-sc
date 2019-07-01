import UIButton from '@app/libs/ui/UIButton';
import React from 'react';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';
import IconAdd from '@app/libs/ui/Icons/IconAdd';

export default ({ onPress, style }: any) => {
    return <UIButton
        color="success"
        size="small"
        onPress={onPress}
        style={{
            flexShrink: "none",
            marginRight: 0,
            ...style
        }}
    >
        <IconAdd color="#fff" height={20} width={20} />
        {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }} size="small">
                {" Add Row"}
            </UIText>
        )}
    </UIButton>
}