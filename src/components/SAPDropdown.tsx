import { APISearch, APISearchProps, SAPFieldMap } from "@app/api";
import { UIProps } from "@app/libs/ui/Styles/Style";
import UISelectField from "@app/libs/ui/UISelectField";
import React, { useEffect, useState } from "react";
import { View } from "reactxp";

interface SAPDropdownProps extends UIProps {
  value: string | number;
  setValue: (value: any, label?: any, item?: any) => any;
  field:
    | "SAPSalesCodeUser"
    | "WarehouseCodeBranch"
    | "SalesAsEmployee"
    | "OcrCode"
    | "OcrCode2"
    | "Series"
    | "State"
    | "BPGroup"
    | "Currency"
    | "CustomerCode"
    | "PaymentTerms"
    | "ContactPerson"
    | "ShipTo"
    | "BillTo"
    | "TaxCode"
    | "ItemCodeCanvas"
    | "ItemCodeAll"
    | "UomCode"
    | "WarehouseCodeCanvas"
    | "WarehouseCodeAll"
    | "VendorCode"
    | "SAPSalesCode"
    | "Area"
    | "Branch"
    | "ChartOfAccount"
    | "ItemCodeCanvas"
    | "Custom";
  itemField?: {
    value: string;
    label: string;
  };
  search?: string;
  searchRealtime?: boolean;
  searchField?: string;
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
  disable?: boolean;
  afterQuery?: (items: any) => any;
}

export default ({
  value,
  setValue,
  field,
  search,
  searchRealtime = false,
  searchField,
  where,
  customQuery,
  label,
  color,
  refresh = false,
  style,
  mustInit = true,
  setRefresh,
  itemField,
  disable,
  afterQuery = () => {}
}: SAPDropdownProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [_items, _setItems] = useState<any[]>([]);
  const [query, setQuery] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [servQuery, setServQuery] = useState(0);

  useEffect(() => {
    let query: APISearchProps;
    if (field === "Custom" && customQuery) {
      query = customQuery;
    } else {
      query = (SAPFieldMap as any)[field];
      if (!!where && where.length > 0) {
        where.forEach(item => {
          let idx = (query.Condition as any).findIndex(
            (x: any) => x.field == item.field
          );
          if (idx > -1) (query.Condition as any)[idx].value = item.value;
        });
      }

      if (!!search) {
        if (!query.Condition) query.Condition = [];
        if (query.Condition.length > 0) {
          query.Condition.push({
            cond: "AND"
          });
        }
        query.Condition.push({
          field:
            query.Fields && query.Fields[1]
              ? query.Fields[1]
              : query.Fields && query.Fields[0],
          cond: "like",
          value: search
        });
      }
    }

    if (refresh || mustInit) {
      getData({ ...query });
      if (!!setRefresh) setRefresh(false);
    }
    setQuery({ ...query });
  }, [refresh]);

  const getData = (q: APISearchProps, search: string = "") => {
    setLoading(true);
    setItems([]);
    _setItems([]);

    q.Limit = searchRealtime ? 50 : 0;
    if (searchRealtime && search !== "") {
      if (Array.isArray(q.Condition) && q.Condition.length > 0) {
        q.Condition = q.Condition.concat([
          { cond: "AND" },
          {
            field: searchField,
            cond: "LIKE",
            value: `%${search.toUpperCase()}%`
          }
        ]);
      } else {
        q.Condition = [
          {
            field: searchField,
            cond: "LIKE",
            value: `%${search.toUpperCase()}%`
          }
        ];
      }
    }

    APISearch({ ...q })
      .then(async (res: any) => {
        let items = res.map((item: any) => {
          let fields = (SAPFieldMap as any)[field]
            ? (SAPFieldMap as any)[field].Fields
            : Object.keys(item);
          return {
            value: itemField ? item[itemField.value] : (item[fields[0]] as any),
            label: itemField
              ? item[itemField.label]
              : (item[!!fields[1] ? fields[1] : fields[0]] as any),
            item: item
          };
        });

        setItems([...items]);
        _setItems([...items]);
        afterQuery(items);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={style}>
      <UISelectField
        items={_items}
        value={value}
        setValue={async (v: any, l: any, item: any) => {
          setValue(v, l, item);
        }}
        label={label}
        color={color}
        search={true}
        loading={loading}
        onSearch={value => {
          setServQuery(servQuery);
          if (searchRealtime) {
            setLoading(true);
            clearTimeout(servQuery);
            let search = setTimeout(() => {
              getData({ ...query }, value);
            }, 500);
            setServQuery(search);
          } else {
            if (value) {
              let search = items.filter(
                (x: any) =>
                  x.value.toLowerCase().includes(value.toLowerCase()) ||
                  x.label.toLowerCase().includes(value.toLowerCase())
              );
              _setItems([...search]);
            } else {
              _setItems([...items]);
            }
          }

          //setItems([...(value ? items.filter((x: any) => x.value.toLowerCase().includes(value.toLowerCase()) || x.label.toLowerCase().includes(value.toLowerCase())) : items)]);
        }}
        onDismiss={(value: any) => value && setItems([...items])}
        disable={disable}
      />
    </View>
  );
};
