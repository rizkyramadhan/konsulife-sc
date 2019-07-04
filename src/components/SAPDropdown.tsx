import { APISearch, APISearchProps, SAPFieldMap } from '@app/api';
import { UIProps } from "@app/libs/ui/Styles/Style";
import UISelectField from "@app/libs/ui/UISelectField";
import React, { useEffect, useState } from "react";

interface SAPDropdownProps extends UIProps {
  value: string | number;
  setValue: (value: any, label?: any, row?: any) => any;
  field: 'SAPSalesCodeUser'| 'WarehouseCodeBranch' | 'SalesAsEmployee' | 'OcrCode' | 'OcrCode2' | 'Series' | 'State' | 'BPGroup' | 'Currency' | 'CustomerCode' | 'PaymentTerms' | 'ContactPerson' | 'ShipTo' | 'BillTo' | 'TaxCode' | 'ItemCodeCanvas' | 'ItemCodeAll' | 'UomCode' | 'WarehouseCodeCanvas' | 'WarehouseCodeAll' | 'VendorCode' | 'SAPSalesCode' | 'Area' | 'Branch' | 'ChartOfAccount' | 'ItemCodeCanvas' | 'Custom';
  itemField?: {
    value: string,
    label: string
  }
  search?: string;
  where?: {
    field: string;
    value: any;
  }[];
  customQuery?: APISearchProps;
  label?: string;
  color?: "default" | "error" | "success";
  mustInit?: boolean;
  refresh?: boolean;
  setRefresh?: any;
  disable?: boolean
}

export default ({
  value,
  setValue,
  field,
  search,
  where,
  customQuery,
  label,
  color,
  refresh = false,
  style,
  mustInit = true,
  setRefresh,
  itemField,
  disable
}: SAPDropdownProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [_items, _setItems] = useState<any[]>([]);

  useEffect(() => {
    let query: APISearchProps;
    if (field === 'Custom' && customQuery) {
      query = customQuery;
    } else {
      query = (SAPFieldMap as any)[field];
      if (!!where && where.length > 0) {
        where.forEach(item => {
          let idx = (query.Condition as any).findIndex((x: any) => x.field == item.field);
          if (idx > -1)
            (query.Condition as any)[idx].value = item.value;
        });
      }

      if (!!search) {
        if (!query.Condition) query.Condition = [];
        if (query.Condition.length > 0) {
          query.Condition.push({
            cond: "AND"
          })
        }
        query.Condition.push({
          field: query.Fields && query.Fields[1] ? query.Fields[1] : (query.Fields && query.Fields[0]),
          cond: "like",
          value: search
        })
      }
    }

    // query.Limit = 50;
    if (refresh || mustInit) {
      _setItems([]);
      setItems([]);

      APISearch(query).then((res: any) => {
        let items = res.map((item: any) => {
          let fields = (SAPFieldMap as any)[field] ? (SAPFieldMap as any)[field].Fields : Object.keys(item);
          return {
            value: itemField ? item[itemField.value] : (item[fields[0]] as any),
            label: itemField ? item[itemField.label] : (item[!!fields[1] ? fields[1] : fields[0]] as any),
            item: item
          }
        });
        _setItems([...items]);
        setItems([...items]);
      }).catch((err) => {
        console.error(err);
      });
      if (!!setRefresh) setRefresh(false);
    }
  }, [refresh]);

  return (
    <UISelectField items={_items} value={value} setValue={(v: any, l: any) => { const idx: any = _items.findIndex((x: any) => x.value === v); setValue(v, l, _items[idx]) }} label={label} style={style} color={color} search={true} onSearch={(value) => {
      if (value) {
        let search = items.filter((x: any) => x.value.toLowerCase().includes(value.toLowerCase()) || x.label.toLowerCase().includes(value.toLowerCase()));
        _setItems([...search]);
      } else {
        _setItems([...items]);
      }
      //setItems([...(value ? items.filter((x: any) => x.value.toLowerCase().includes(value.toLowerCase()) || x.label.toLowerCase().includes(value.toLowerCase())) : items)]);
    }} onDismiss={(value: any) => value && setItems([...items])} disable={disable} />
  );
};
