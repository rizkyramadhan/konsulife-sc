import UIJsonField from '@app/libs/ui/UIJsonField';
import React from "react";

export default ({ data, setData }: any) => {
  return (
    <UIJsonField
      items={data}
      field={[
        {
          key: "general",
          label: "Address Bill",
          sublabel: "Informasi Bill",
          value: [
            { key: "AddressId", label: "Address ID", size: 7 },
            { key: "ZipCode", size: 5, label: "Bill-to Zip Code" },
            { key: "Address", size: 12, label: "Bill-to Street" },
            { key: "City", size: 6, label: "Bill-to City" },
            { key: "State1", size: 6, label: "Bill-to State" },
          ]
        },
        {
          key: "general",
          label: "Address Shipment",
          sublabel: "Informasi Shipment",
          value: [
            { key: "AddressIdS", label: "Address ID", size: 7 },
            { key: "MailZipCode", size: 5, label: "Ship-to Zip Code" },
            { key: "MailAddress", size: 12, label: "Ship-to Street" },
            { key: "MailCity", size: 6, label: "Ship-to City" },
            { key: "State2", size: 6, label: "Ship-to State" },
          ]
        }
      ]}
      setValue={setData}
    />
  );
};