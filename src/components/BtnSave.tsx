import UIButton from '@app/libs/ui/UIButton';

import React from 'react';
import IconSave from '@app/libs/ui/Icons/IconSave';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';

export default ({ onPress, saving = false, type = "save" }: any) => {
    return <UIButton
        color="primary"
        size="small"
        onPress={onPress}
    >
        <IconSave color="#fff" />
        {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }}>{saving ? (type === "save" ? " Saving..." : "Updating") : (type === "save" ? " Save" : " Update")}</UIText>
        )}
    </UIButton>
}