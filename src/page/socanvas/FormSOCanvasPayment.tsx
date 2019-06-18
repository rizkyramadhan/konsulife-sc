import UIJsonField from "@app/libs/ui/UIJsonField";
import React from "react";

export default ({ data, setData }: any) => {
  return (
    <UIJsonField
      items={data}
      field={[
        {
          key: "payment",
          label: "Payment",
          sublabel: "Informasi Pengirimal Bill & Payment",
          value: [
            {
              size: 12,
              key: "Address",
              label: "Bill To"
            },
            { key: "PaymentMethod", label: "Paymen Method", size: 12 }
          ]
        }
      ]}
      setValue={setData}
    />
  );
};
