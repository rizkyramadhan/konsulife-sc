import { APISearch, APISearchProps, SAPFieldMap } from '@app/api';
import { UIProps } from "@app/libs/ui/Styles/Style";
import UISelectField from "@app/libs/ui/UISelectField";
import React, { useEffect, useState } from "react";

interface SAPDropdownProps extends UIProps {
  value: string | number;
  setValue: (value: any, label?: any, row?: any) => any;
  field: 'OcrCode' | 'OcrCode2' | 'Series' | 'State' | 'BPGroup' | 'Currency' | 'CustomerCode' | 'PaymentTerms' | 'ContactPerson' | 'ShipTo' | 'BillTo' | 'TaxCode' | 'ItemCodeCanvas' | 'ItemCodeAll' | 'UomCode' | 'WarehouseCodeCanvas' | 'WarehouseCodeAll' | 'VendorCode' | 'SAPSalesCode' | 'Area' | 'Branch' | 'ChartOfAccount' | 'ItemCodeCanvas' | 'Custom';
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
  setRefresh
}: SAPDropdownProps) => {
  const [items, setItems] = useState<any[]>([]);

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

    if (refresh || mustInit) {
      APISearch(query).then((res: any) => {
        let items = res.map((item: any) => {
          let field = Object.keys(item);
          return {
            value: (item[field[0]] as any),
            label: (item[!!field[1] ? field[1] : field[0]] as any),
            item: item
          }
        });
        setItems([...items]);
      }).catch((err) => {
        console.error(err);
      });
      if (!!setRefresh) setRefresh(false);
    }
  }, [refresh]);

  return (
    <UISelectField items={items} value={value} setValue={(v: any, l: any) => { const idx: any = items.findIndex((x: any) => x.value === v); setValue(v, l, items[idx]) }} label={label} style={style} color={color} />
  );
};
