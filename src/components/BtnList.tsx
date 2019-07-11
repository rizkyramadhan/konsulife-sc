import UIButton from '@app/libs/ui/UIButton';

import React from 'react';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';
import IconReceipt from '@app/libs/ui/Icons/IconReceipt';

export default ({ onPress, style }: any) => {
    return <UIButton
        size="small"
        color="success"
        onPress={onPress}
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            height: 45,
            ...style
        }}
    >
        <IconReceipt color="#fff" width={20} height={20} />
        {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }} size="small"> List</UIText>
        )}
    </UIButton>
}