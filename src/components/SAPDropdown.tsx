import UISelectField from "@app/libs/ui/UISelectField";
import React, { useState, useEffect } from "react";
import { UIProps } from "@app/libs/ui/Styles/Style";
import { APISearch, APISearchProps } from '@app/api';

interface SAPDropdownProps extends UIProps {
  value: string | number;
  setValue: (value: any) => any;
  field: 'Series' | 'BPGroup' | 'DocumentRate';
  search?: string;
  where?: {
    field: string;
    value: any;
  }[];
}

export default (p: SAPDropdownProps) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let query = fieldSAP[p.field];
    if (!!p.where && p.where.length > 0) {
      p.where.forEach(item => {
        let idx = (query.Condition as any).findIndex((x: any) => x.Field == item.field);
        (query.Condition as any)[idx].value = item.value;
      });
    }

    APISearch(query).then((res: any) => {
      let items = res.map((item: any) => {
        let field = Object.keys(item);
        return {
          label: (item[field[0]] as any),
          value: (item[!!field[1] ? field[1] : field[0]] as any)
        }
      });
      setItems(items);
    }).catch(() => {
      setItems([]);
    })
    // const fetch = async () => {
    //   setItems([]);
    // };
    // fetch();
  }, []);

  return <UISelectField items={items} value={p.value} setValue={p.setValue} />;
};

const fieldSAP = {
  Series: {
    Table: "NNM1",
    Condition: [{
      field: 'ObjectCode',
      value: 2,
      cond: '=',
    }],
    Fields: ['Series', 'SeriesName']
  } as APISearchProps,
  BPGroup: {
    Table: "OCRG",
    Condition: [{
      field: 'GroupType',
      value: 'C',
      cond: '=',
    }],
    Fields: ['GroupCode', 'GroupName']
  } as APISearchProps,
  DocumentRate: {
    Table: "ORTT",
    Condition: [
      {
        field: 'Currency',
        value: '',
        cond: '='
      },
      {
        cond: 'AND'
      },
      {
        field: 'RateDate',
        value: '',
        cond: '='
      }
    ],
    Fields: ['Rate']
  } as APISearchProps,
}
