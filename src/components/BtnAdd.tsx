import UIButton from '@app/libs/ui/UIButton';
import React from 'react';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';
import IconAdd from '@app/libs/ui/Icons/IconAdd';

export default ({ onPress }: any) => {
    return <UIButton
        color="success"
        size="small"
        onPress={onPress}
        style={{
            height: 'auto'
        }}
    >
        <IconAdd color="#fff" height={24} width={24} />
        {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }} size="small">
                {" Add"}
            </UIText>
        )}
    </UIButton>
}