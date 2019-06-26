import BtnSave from '@app/components/BtnSave';
import SAPDropdown from '@app/components/SAPDropdown';
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import rawQuery from '@app/libs/gql/data/rawQuery';
import UISelectField from '@app/libs/ui/UISelectField';
import { withRouter } from 'react-router-dom';
import query from '@app/libs/gql/data/query';
import UIText from '@app/libs/ui/UIText';
import FormWOItems from './FormWOItems';
import { View } from 'reactxp';
import createRecord from '@app/libs/gql/data/createRecord';
import updateRecord from '@app/libs/gql/data/updateRecord';
import deleteRecord from '@app/libs/gql/data/deleteRecord';

interface IWO {
  id?: number,
  number?: string,
  visite_date?: string,
  return_date?: string,
  area?: string,
  branch?: string,
  sopir?: string,
  sopir_sim?: string,
  sopir_nopol?: string,
  sales_id?: string,
  sales_name?: string,
  rute_id?: number,
  rute?: string,
}

interface IWOItem {
  id?: number,
  rute_id?: number,
  customer_id?: string,
  customer_name?: string,
  customer_address?: string,
  customer_details?: string,
  isNewRecord?: boolean
}

interface IRute {
  id: number,
  name: string,
}

export default withRouter(observer(({ history, match, showSidebar, sidebar }: any) => {
  const [data, setData] = useState<IWO>({});
  const [items, setItems] = useState<Array<IWOItem>>([]);
  const [rute, setRute] = useState<Array<IRute>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      query("work_order", ['id', 'number', 'visite_date', 'return_date', 'area', 'branch', 'sopir', 'sopir_sim', 'sopir_nopol', 'sales_id', 'sales_name', 'rute_id', 'rute'], { where: { id: match.params.id } }).then((res) => {
        setData(res);
        rawQuery(`{
                    work_order_items(where: {work_order_id: {_eq: ${match.params.id}}}) {
                        id
                        customer_name
                        customer_id
                        customer_details
                        customer_address
                    }
                }`).then((res) => {
          setItems([...res.work_order_items]);
        })
      });
    }

    rawQuery(`{
            rute {
                name
                id
            }
        }`).then((res) => {
      let items = res.rute.map((d: IRute) => {
        return { value: d.id, label: d.name }
      })
      setRute([...items]);
    });
  }, [])

  const save = async () => {
    setSaving(true);
    try {
      const rute = await rawQuery(`{
        rute_items(where: {rute_id: {_eq: ${data.rute_id}}}) {
          customer_name
          customer_id
          customer_details
          customer_address
        }
      }`);

      if (!data.id) {
        data.number = new Date().valueOf().toString();
        let id = await createRecord("work_order", data);
        rute.rute_items.forEach(async (item: any) => {
          let data = { ...item };
          data.work_order_id = id;
          await createRecord("work_order_items", data);
        });
      } else {
        await updateRecord("work_order", data);
        await deleteRecord("work_order_items", { work_order_id: match.params.id }, { primaryKey: "work_order_id" })

        rute.rute_items.forEach(async (item: any) => {
          let data = { ...item };
          data.work_order_id = match.params.id;
          await createRecord("work_order_items", data);
        });
      }
      history.push('/wo')
    } catch (e) {
      alert(e);
    }
    setSaving(false);
  }

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center="Form Working Order"
      >
        <BtnSave onPress={save} saving={saving} />
      </UIHeader>
      <UIBody scroll={true}>
        <UIJsonField
          items={data}
          field={[
            {
              key: "general",
              label: "General",
              sublabel: "Informasi Working Order",
              value: [
                { key: "number", label: "WO Number", size: 8, type: 'field' },
                { key: "sales_id", size: 7, component: (<SAPDropdown label="Sales" field="SAPSalesCode" value={data.sales_id || 0} setValue={(v, l) => { setData({ ...data, sales_id: v, sales_name: l }) }} />) },
                { type: 'empty' },
                { key: "rute", label: "Rute", size: 5, component: (<UISelectField label="Rute" items={rute as any} value={data.rute_id || 0} setValue={(v, l) => { setData({ ...data, rute_id: v, rute: l }) }} />) },
                { type: 'empty' },
                { key: "visite_date", label: "Visite Date", size: 6, type: "date" },
                { key: "return_date", label: "Return Date", size: 6, type: 'date' },
              ]
            },
            {
              key: "sopir",
              label: "Sopir",
              sublabel: "Informasi Sopir",
              value: [
                { key: "sopir", label: "Sopir", size: 7 },
                { key: "sopir_sim", label: "No SIM", size: 8 },
                { key: "sopir_nopol", label: "Nopol", size: 5 },
              ]
            }
          ]}

          setValue={(value: any, key: any) => {
            (data as any)[key] = value;
          }}
        />

        <View style={{ marginTop: 50 }}>
          <View
            style={{
              justifyContent: "space-between",
              flex: 1,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <UIText
              style={{
                fontSize: 19,
                color: "#333",
                fontWeight: 400
              }}
            >
              Detail Items
                        </UIText>
          </View>
          <FormWOItems items={items} />
        </View>
      </UIBody>
    </UIContainer>
  );
}));
