import BtnAdd from '@app/components/BtnAdd';
import BtnSave from '@app/components/BtnSave';
import global from '@app/global';
import createRecord from '@app/libs/gql/data/createRecord';
import query from '@app/libs/gql/data/query';
import rawQuery from '@app/libs/gql/data/rawQuery';
import updateRecord from '@app/libs/gql/data/updateRecord';
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UITabs from '@app/libs/ui/UITabs';
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router-dom';
import { View } from "reactxp";
import FormRuteItems from './FormRuteItems';
import deleteRecord from '@app/libs/gql/data/deleteRecord';

interface IRute {
  id?: number,
  name?: string,
  description?: string,
  area?: string,
  branch?: string
}

interface IRuteItem {
  id?: number,
  rute_id?: number,
  customer_id?: string,
  customer_name?: string,
  customer_address?: string,
  customer_details?: string,
  isNewRecord?: boolean
}

export default withRouter(observer(({ history, match, showSidebar, sidebar }: any) => {
  const [data, setData] = useState<IRute>({});
  const [items, setItems] = useState<Array<IRuteItem>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      query("rute", ['id', 'name', 'description'], { where: { id: match.params.id } }).then((res) => {
        setData(res);
        rawQuery(`{
          rute_items(where: {rute_id: {_eq: ${match.params.id}}}) {
            id
            rute_id
            customer_name
            customer_id
            customer_details
            customer_address
          }
        }
        `).then((res) => {
          setItems([...res.rute_items]);
        })
      });
    }
  }, [])

  const AddRow = () => {
    return (<BtnAdd onPress={() => {
      setItems([...items, {
        id: new Date().valueOf(),
        rute_id: data.id,
        isNewRecord: true
      }])
    }} />
    );
  }

  const save = async () => {
    setSaving(true);
    try {
      //  cek rute
      let checkRute = await rawQuery(`{
        rute(where: {_and:{name: {_eq: "${data.name}"}, branch: {_eq: "${global.getSession().user.branch}"}}}) {
          name
        }
      }`);
      if (checkRute.rute.length > 0) return alert("Nama rute sudah digunakan!");

      if (!data.id) {
        data.branch = global.getSession().user.branch || "";
        data.area = global.getSession().user.area || "";
        let id = await createRecord("rute", data);
        items.forEach(async (item) => {
          let data = { ...item };
          data.rute_id = id;
          delete data.isNewRecord;
          delete data.id;
          await createRecord("rute_items", data);
        });
      } else {
        await updateRecord("rute", data);
        await deleteRecord("rute_items", { rute_id: data.id }, { primaryKey: "rute_id" });
        items.forEach(async (item) => {
          let data = { ...item };
          data.rute_id = match.params.id;
          delete data.id;
          delete data.isNewRecord;
          await createRecord("rute_items", data);
        });
      }
      history.goBack();
    } catch (e) {
      alert(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center="Form Master Rute"
      >
        <BtnSave onPress={save} saving={saving} type={match.params.id ? "update" : "save"} />
      </UIHeader>
      <UIBody scroll={true}>
        <UIJsonField
          items={data}
          field={[
            {
              key: "name",
              label: "Rute",
              size: 3
            }, {
              type: "empty",
              size: 9
            }, {
              key: "description",
              label: "Deskripsi",
              size: 7
            }
          ]}
          setValue={(value: any, key: any) => {
            (data as any)[key] = value;
            setData({ ...data });
          }}
        />

        <View style={{ marginTop: 50 }}>
          <UITabs
            tabs={[
              {
                label: "Detail Items",
                content: () => (
                  <FormRuteItems items={items} setItems={setItems} />
                ),
                action: AddRow()
              }]}
          />
        </View>
      </UIBody>
    </UIContainer>
  );
}));
