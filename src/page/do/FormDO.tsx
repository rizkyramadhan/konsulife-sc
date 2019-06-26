import IconSave from '@app/libs/ui/Icons/IconSave';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIBody from '@app/libs/ui/UIBody';
import UIButton from '@app/libs/ui/UIButton';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UIText from '@app/libs/ui/UIText';
import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router';
import { APISearch, APISearchProps, APIPost } from '@app/api';
import { View } from 'reactxp';
import FormDODetailItems from './FormDODetailItems';

export default withRouter(observer(({ match, showSidebar, sidebar }: any) => {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>({});
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const itemSelect = JSON.parse(atob(match.params.ItemSelect));
    const itemSelectDocEntry = itemSelect.map((d: any) => {
      return d.DocEntry;
    })
    const itemSelectSONUmber = itemSelect.map((d: any) => {
      return d.SONumber;
    })

    // SELECT FIRST SO
    let query: APISearchProps = {
      Table: "ORDR",
      Fields: [
        "CardCode",
        "NumAtCard",
        "DocDate",
        "DocDueDate",
        "DocCur",
        "DocRate",
        "U_IDU_SO_INTNUM",
        "GroupNum",
        "SlpCode",
        "CntctCode",
        "Address2",
        "Address",
        "Comments",
        "U_BRANCH",
        "U_USERID",
        "U_GENERATED"
      ],
      Condition: [{
        field: "DocEntry",
        cond: "=",
        value: itemSelectDocEntry[0]
      }],
      Limit: 1,
      Page: 1
    };

    APISearch(query).then((res: any) => {
      const data = res[0];
      setData({
        ...data,
        U_IDU_SO_INTNUM: itemSelectSONUmber.join(";"),
        Comments: "",
        DocDate: "2019-01-25"
      })
    });

    // SELECT LIST SO OPEN
    query = {
      Table: "RDR1",
      Condition: [{
        field: "DocEntry",
        cond: "IN",
        value: itemSelectDocEntry
      }],
      Limit: 100,
      Page: 1
    };

    APISearch(query).then((res: any) => {
      const items = res.map((item: any) => {
        item.Key = btoa(item.DocEntry + item.LineNum);
        item.BaseType = item.ObjType;
        item.BaseLine = item.LineNum;
        item.BaseEntry = item.DocEntry;
        item.Quantity = parseInt(item.OpenQty);

        delete item.ObjType;
        delete item.LineNum;
        delete item.DocEntry;
        delete item.OpenQty;
        return item;
      });
      setItems([...items]);
    })
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await APIPost('DeliveryOrder', {
        ...data, Lines: items,
      });
    }
    catch (e) {
      alert(e.Message);
    }
    finally {
      setSaving(false);
    }
  }

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center={`Form Delivery Order #${atob(match.params.CardCode)} - ${atob(match.params.CardName)}`}
      >
        <UIButton
          color="primary"
          size="small"
          onPress={() => {
            save();
          }}
        >
          <IconSave color="#fff" />
          {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }}>{saving ? " Saving..." : " Save"}</UIText>
          )}
        </UIButton>
      </UIHeader>
      <UIBody scroll={true}>
        <UIJsonField
          items={data}
          field={[
            {
              key: "general",
              label: "General",
              sublabel: "Informasi SO",
              value: [
                {
                  key: "U_IDU_SO_INTNUM",
                  type: "field",
                  label: "SO Number",
                  size: 12
                },
                { key: "DocDate", size: 6, label: "Posting Date", type: "date" }
              ]
            },
            { type: "empty" },
            {
              key: "optional",
              label: "Optional",
              value: [
                {
                  key: "Comments",
                  label: "Remark",
                  size: 12
                }
              ]
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
          </View>
          <FormDODetailItems items={items} setItems={setItems} />
        </View>
      </UIBody>
    </UIContainer>
  );
}));
