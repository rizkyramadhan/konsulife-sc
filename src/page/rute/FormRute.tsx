import BtnAdd from "@app/components/BtnAdd";
import BtnSave from "@app/components/BtnSave";
import global from "@app/global";
import createRecord from "@app/libs/gql/data/createRecord";
import deleteRecord from "@app/libs/gql/data/deleteRecord";
import query from "@app/libs/gql/data/query";
import rawQuery from "@app/libs/gql/data/rawQuery";
import updateRecord from "@app/libs/gql/data/updateRecord";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UITabs from "@app/libs/ui/UITabs";
import { getParams } from "@app/utils/Helper";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { View } from "reactxp";
import FormRuteItems from "./FormRuteItems";

interface IRute {
  id?: number;
  name?: string;
  description?: string;
  area?: string;
  branch?: string;
}

interface IRuteItem {
  id?: number;
  rute_id?: number;
  customer_id?: string;
  customer_name?: string;
  customer_address?: string;
  customer_details?: string;
  isNewRecord?: boolean;
}

export default withRouter(({ history, match }: any) => {
  match.params = getParams(history.location.pathname);
  const [data, setData] = useState<IRute>({});
  const [items, setItems] = useState<Array<IRuteItem>>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      query("rute", ["id", "name", "description"], {
        where: { id: match.params.id }
      }).then(res => {
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
        `).then(res => {
          setItems([...res.rute_items]);
          setLoading(false);
        });
      });
    }
  }, []);

  const AddRow = () => {
    return (
      <BtnAdd
        onPress={() => {
          setItems([
            ...items,
            {
              id: new Date().valueOf(),
              rute_id: data.id,
              isNewRecord: true
            }
          ]);
        }}
      />
    );
  };

  const validation = () => {
    const err: any = [];
    const required = {
      name: "Name"
    };

    Object.keys(required).forEach((k: any) => {
      if ((data as any)[k] === "" || !(data as any)[k])
        err.push((required as any)[k]);
    });

    if (err.length > 0) {
      alert(err.join(", ") + " is required.");
      return false;
    }
    return validationCustomer();
  };

  const validationCustomer = () => {
    if (items.length === 0) {
      alert("Customer is empty, please add a customer.");
      return false;
    }
    return true;
  };

  const checkRute = async () => {
    let checkRute = await rawQuery(`{
        rute(where: {id: {_neq: ${data.id || 0}}, branch: {_eq: "${
      global.getSession().user.branch
    }"}, name: {_eq: "${data.name}"}}) {
          name
        }
      }`);

    if (checkRute && checkRute.rute.length > 0) {
      alert("Nama rute sudah digunakan!");
      return false;
    }
    return true;
  };

  const save = async () => {
    if (saving) return;
    if (!validation()) return;

    try {
      setSaving(true);
      if (!(await checkRute())) return;
      if (!data.id) {
        data.branch = global.getSession().user.branch || "";
        data.area = global.getSession().user.area || "";
        let id = await createRecord("rute", data);
        items.forEach(async item => {
          let data = { ...item };
          data.rute_id = id;
          delete data.isNewRecord;
          delete data.id;
          await createRecord("rute_items", data);
        });
      } else {
        await updateRecord("rute", data);
        await deleteRecord(
          "rute_items",
          { rute_id: data.id },
          { primaryKey: "rute_id" }
        );
        items.forEach(async item => {
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
  };

  return (
    <UIContainer>
      <UIHeader
        showSidebar={global.setSidebar}
        sidebar={global.sidebar}
        center="Form Master Rute"
        isLoading={loading}
      >
        <BtnSave
          onPress={save}
          saving={saving}
          type={match.params.id ? "update" : "save"}
        />
      </UIHeader>
      <UIBody scroll={true}>
        <UIJsonField
          items={data}
          field={[
            {
              key: "name",
              label: "Rute",
              size: 3
            },
            {
              type: "empty",
              size: 9
            },
            {
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
              }
            ]}
          />
        </View>
      </UIBody>
    </UIContainer>
  );
});
