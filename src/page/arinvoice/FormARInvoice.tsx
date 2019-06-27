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
import FormARInvoiceDetailItems from './FormARInvoiceDetailItems';
import { View } from 'reactxp';
import { getLastNumbering, updateLastNumbering } from '@app/utils';
import global from '@app/global';


export default withRouter(observer(({ match, showSidebar, sidebar }: any) => {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState([]);
  const [item, setItem] = useState([]);

  const param = atob(match.params.id).split("|");
  useEffect(() => {
    let query: APISearchProps = {
      Table: "ORDR",
      Fields: [
        "CardCode",
        "CardName",
        "NumAtCard",
        "DocCur",
        "DocRate",
        "U_IDU_SO_INTNUM",
        "GroupNum",
        "SlpCode",
        "CntctCode",
        "Address2",
        "Address",
        "Comments"
      ],
      Condition: [{
        field: "DocEntry",
        cond: "IN",
        value: param
      }]
    };

    APISearch(query).then((res: any) => {
      res[0].U_BRANCH = global.session.user.branch;
      res[0].U_USERID = global.session.user.id;
      res[0].U_GENERATED = "W";

      if (res.length > 0)
        setData(res[0]);
    });
  }, []);

  useEffect(() => {
    let query: APISearchProps = {
      Table: "RDR1",
      Fields: [
        "DocEntry",
        "BaseEntry",
        "BaseType",
        "LineNum",
        "BaseLine",
        "ItemCode",
        "Dscription",
        "U_IDU_PARTNUM",
        "WhsCode",
        "Quantity",
        "UseBaseUn",
        "ShipDate",
        "OcrCode",
        "OcrCode2",
        "PriceBefDi",
        "DiscPrcnt",
        "TaxCode"
      ],
      Condition: [{
        field: "DocEntry",
        cond: "=",
        value: match.params.id
      }]
    };

    APISearch(query).then((res: any) => {
      res.forEach((item: any) => {
        item.BaseType = "17";
        item.BaseLine = item.LineNum;
        item.BaseEntry = item.DocEntry;

        delete item.LineNum;
        delete item.DocEntry;
      });
      setItem(res);
    })
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      let number: any = await getLastNumbering("INV", global.getSession().user.warehouse_id);
      (data as any)['U_IDU_SI_INTNUM'] = number.format;
      await APIPost('ARInvoice', {
        ...data, Lines: item,
      });
      updateLastNumbering(number.id, number.last_count + 1);
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
        center="Form AR Invoice"
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
              sublabel: "Informasi SO/DO",
              value: [
                {
                  key: "U_IDU_SO_INTNUM",
                  type: "field",
                  label: "SO Number",
                  size: 7
                },
                { type: "empty", size: 5 },
                { key: "DocDate", size: 4, label: "Posting Date" },
                { key: "DocDueDate", size: 4, label: "Delivery Date" },
                { type: "empty", size: 2 },
                {
                  key: "U_BRANCH",
                  type: "field",
                  label: "Cabang",
                  size: 7
                }
              ]
            },
            {
              key: "customer",
              label: "Customer",
              sublabel: "Toko Penerima Barang",
              value: [
                { key: "CardCode", label: "Customer", size: 3 },
                { key: "CardName", label: "Name" }
              ]
            },
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
          <FormARInvoiceDetailItems items={item} setItems={setItem} />
        </View>
      </UIBody>
    </UIContainer>
  );
}));
