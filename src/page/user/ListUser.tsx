import UIBody from '@app/libs/ui/UIBody';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import { observer } from 'mobx-react-lite';
import React, { useState } from "react";
import SAPDropdown from '@app/components/SAPDropdown';

export default observer(({ showSidebar, sidebar }: any) => {
    const [value, setValue] = useState("");
    return (
        <UIContainer>
            <UIHeader showSidebar={showSidebar} sidebar={sidebar} center="User" />
            <UIBody>
                <SAPDropdown label="Series" field="Series" value={value} setValue={setValue} />
            </UIBody>
        </UIContainer>
    );
})