import UIButton from '@app/libs/ui/UIButton';

import React from 'react';
import IconSave from '@app/libs/ui/Icons/IconSave';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';

export default ({ onPress, saving = false, type = "save", style }: any) => {
    return <UIButton
        color="primary"
        size="small"
        onPress={onPress}
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            height: 45,
            ...style
        }}
    >
        <IconSave color="#fff" width={20} height={20} />
        {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }} size="small">{saving ? (type === "save" ? " Saving..." : "Updating") : (type === "save" ? " Save" : " Update")}</UIText>
        )}
    </UIButton>
}