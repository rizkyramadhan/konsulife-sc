import { APISearch, APISearchProps, SAPFieldMap, APISearchCache } from '@app/api';
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
}

export default (p: SAPDropdownProps) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let query: APISearchProps;
    if (p.field === 'Custom' && p.customQuery) {
      query = p.customQuery;
    } else {
      query = (SAPFieldMap as any)[p.field];
      if (!!p.where && p.where.length > 0) {
        p.where.forEach(item => {
          let idx = (query.Condition as any).findIndex((x: any) => x.field == item.field);
          if (idx > -1)
            (query.Condition as any)[idx].value = item.value;
        });
      }

      if (!!p.search) {
        if (!query.Condition) query.Condition = [];
        if (query.Condition.length > 0) {
          query.Condition.push({
            cond: "AND"
          })
        }
        query.Condition.push({
          field: query.Fields && query.Fields[1] ? query.Fields[1] : (query.Fields && query.Fields[0]),
          cond: "like",
          value: p.search
        })
      }
    }

    APISearchCache(query.Table, query.Condition).then((cache: any) => {
      if (!!cache) {
        let items = cache.map((item: any) => {
          let field = Object.keys(item);
          return {
            value: (item[field[0]] as any),
            label: (item[!!field[1] ? field[1] : field[0]] as any),
            item: item
          }
        });
        setItems(items);
      }

      query.Cache = cache;
      APISearch(query).then((res: any) => {
        let items = res.map((item: any) => {
          let field = Object.keys(item);
          return {
            value: (item[field[0]] as any),
            label: (item[!!field[1] ? field[1] : field[0]] as any),
            item: item
          }
        });
        setItems(items);
      }).catch((err) => {
        console.error(err);
      })
    })
  }, []);

  return (
    <UISelectField items={items} value={p.value} setValue={(v: any, l: any) => { const idx: any = items.findIndex((x: any) => x.value === v); p.setValue(v, l, items[idx]) }} label={p.label} style={p.style} color={p.color} />
  );
};
