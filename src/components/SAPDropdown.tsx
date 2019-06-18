import UISelectField from "@app/libs/ui/UISelectField";
import React, { useState } from "react";
import { UIProps } from "@app/libs/ui/Styles/Style";

interface SAPDropdownProps extends UIProps {
  value: string | number;
  setValue: (value: any) => any;
}

export default (p: SAPDropdownProps) => {
  const [items, setItems] = useState([]);
  return <UISelectField items={items} value={p.value} setValue={p.setValue} />;
};
