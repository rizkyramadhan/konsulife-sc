import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { View } from "reactxp";
import BtnSave from '@app/components/BtnSave';
import FormRuteItems from './FormRuteItems';
import BtnAdd from '@app/components/BtnAdd';
import createRecord from '@app/libs/gql/data/createRecord';
import updateRecord from '@app/libs/gql/data/updateRecord';
import { withRouter } from 'react-router-dom';
import query from '@app/libs/gql/data/query';
import rawQuery from '@app/libs/gql/data/rawQuery';

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

  const save = async () => {
    setSaving(true);
    try {
      if (!data.id) {
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
        items.forEach(async (item) => {
          let data = { ...item };

          if (data.isNewRecord) {
            data.rute_id = match.params.id;
            delete data.id;
            delete data.isNewRecord;
            await createRecord("rute_items", data);
          } else {
            await updateRecord("rute_items", data);
          }
        });
      }
      history.push('/rute')
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
        center="Form Master Rute"
      >
        <BtnSave onPress={save} saving={saving} />
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
            <BtnAdd onPress={() => {
              setItems([...items, {
                id: new Date().valueOf(),
                rute_id: data.id,
                isNewRecord: true
              }])
            }} />
          </View>
          <FormRuteItems items={items} setItems={setItems} />
        </View>
      </UIBody>
    </UIContainer>
  );
}));
