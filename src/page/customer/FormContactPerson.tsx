import UIJsonField from '@app/libs/ui/UIJsonField';
import React from "react";

export default ({ data, setData }: any) => {
    return (
        <UIJsonField
            items={data}
            field={[
                { key: "Name", size: 12, label: "Contact Person Name" },
                { key: "FirstName", size: 4, label: "First Name" },
                { key: "MiddleName", size: 4, label: "Middle Name" },
                { key: "LastName", size: 4, label: "Last Name" },
                { key: "Tel1", size: 4, label: "Telephone 1" },
                { key: "Tel2", size: 4, label: "Telephone 2" },
                { key: "Cellolar", size: 4, label: "Mobile Phone" },
            ]}
            setValue={setData}
        />
    );
};