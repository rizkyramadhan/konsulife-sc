import UIButton from '@app/libs/ui/UIButton';

import React from 'react';
import IconSave from '@app/libs/ui/Icons/IconSave';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';

export default () => {
    return <UIButton
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
}