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
import FormInvTransferDetail from './FormInvTransferDetail';
import { View } from 'reactxp';

export default withRouter(observer(({ match, showSidebar, sidebar }: any) => {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    let query: APISearchProps = {
      Table: "OWTQ",
      Fields: [
        "DocNum",
        "DocEntry",
        "CardName",
        "CardCode",
        "U_IDU_ITR_INTNUM",
        "Address",
        "Filler",
        "ToWhsCode",
        "U_BRANCH",
        "Comments",
        "SlpCode",
        "U_IDU_IT_INTNUM",
        "U_IDU_CONTNUM",
        "U_IDU_NOSEAL",
        "U_IDU_NOPL",
        "U_IDU_NOPOL",
        "U_IDU_DRIVER"
      ],
      Condition: [{
        field: "DocEntry",
        cond: "=",
        value: match.params.id
      }]
    };

    APISearch(query).then((res: any) => {
      if (res.length > 0)
        setData(res[0]);
    });
  }, []);

  const [item, setItem] = useState([]);
  useEffect(() => {
    let query: APISearchProps = {
      Table: "WTQ1",
      Fields: [
        "DocEntry",
        "BaseEntry",
        "LineNum",
        "ItemCode",
        "Dscription",
        "U_IDU_PARTNUM",
        "WhsCode",
        "Quantity",
        "UomCode",
        "OpenCreQty",

        "UseBaseUn",
        "SerialNum",
      ],
      Condition: [{
        field: "DocEntry",
        cond: "=",
        value: match.params.id
      }]
    };
    APISearch(query).then((res: any) => {
      setItem(res);
    })
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await APIPost('InventoryTransfer', {
        ...data, Lines: item,
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
        isBack={true}
        showSidebar={showSidebar}
        sidebar={sidebar} center="Inventory Transfer Form">
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
              value: [
                { key: "U_IDU_ITR_INTNUM", type: "field", label: "ITR No.", size: 7 },
                { type: "empty", size: 5 },
                { key: "DocDate", size: 4, type: "date", label: "Posting Date" },
                { key: "DocDueDate", size: 4, type: "date", label: "Delivery Date" },
                { type: "empty", size: 2 },
                { key: "Filler", size: 4, type: "field", label: "From Warehouse" },
                { key: "ToWhsCode", size: 4, type: "field", label: "To Warehouse" },

              ]
            },
            {
              key: "vendor",
              label: "Business Partner",
              value: [
                { key: "CardCode", type: "field", label: "BP Code", size: 3 },
                { key: "CardName", type: "field", label: "BP Name", size: 7 },
                { key: "SlpCode", type: "field", label: "Sales Employee", size: 7 },
                { key: "Address", type: "field", label: "Ship To", size: 7 }
              ]
            },
            {
              key: "info",
              label: "Shipment",
              value: [
                { key: "U_IDU_IT_INTNUM", size: 12, label: "Transfer No." },
                { key: "U_IDU_CONTNUM", size: 6, label: "No. Container" },
                { key: "U_IDU_NOSEAL", size: 6, label: "No. Seal" },
                { key: "U_IDU_NOPL", size: 6, label: "No. PL" },
                { key: "U_IDU_NOPOL", size: 6, label: "Nopol" },
                { key: "U_IDU_DRIVER", size: 12, label: "Driver" },
              ]
            },
          ]}
          setValue={(value: any, key: any) => {
            (data as any)[key] = value;
            setData(data);
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
          <FormInvTransferDetail items={item} setItems={setItem} />
        </View>
      </UIBody>
    </UIContainer>
  );
}))