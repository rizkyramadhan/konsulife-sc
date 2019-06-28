import IconSave from '@app/libs/ui/Icons/IconSave';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIBody from '@app/libs/ui/UIBody';
import UIButton from '@app/libs/ui/UIButton';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import UIJsonField from '@app/libs/ui/UIJsonField';
import UIText from '@app/libs/ui/UIText';
import { observer } from 'mobx-react-lite';
import React, { useState } from "react";
import { withRouter } from 'react-router';
import { APIPost } from '@app/api';
import FormInvTransferDetail from './FormInvTransferDetail';
import { View } from 'reactxp';
import global from '@app/global';
import IconAdd from '@app/libs/ui/Icons/IconAdd';
import { getLastNumbering, updateLastNumbering } from '@app/utils';
import SAPDropdown from '@app/components/SAPDropdown';

const initData = {
  DocNum:"",
  DocEntry:"",
  CardName:"",
  CardCode:"",
  U_IDU_ITR_INTNUM:"",
  Address:"",
  Filler:"",
  ToWhsCode:"",
  Comments:"",
  SlpCode: !!global.session.user.slp_code||-1,
  U_BRANCH:global.session.user.branch,
  U_USERID:global.session.user.id,
  U_GENERATED: "W",
  U_WO:"",
  U_IDU_IT_INTNUM:"",
  U_IDU_CONTNUM:"",
  U_IDU_NOSEAL:"",
  U_IDU_NOPL:"",
  U_IDU_NOPOL:"",
  U_IDU_DRIVER:""
}

export default withRouter(observer(({ showSidebar, sidebar }: any) => {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(initData);
  const [qShip, setQShip] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const ActionIt = () => {
    return (<UIButton
      style={{
        flexShrink: 'none'
      }}
      color="success"
      size="small"
      onPress={() => {
        setItems([...(items as any), {
          LineNum: Math.floor(Math.random() * Math.floor(999)),
          ItemCode: "",
          Dscription: "",
          UseBaseUn: "",
          Quantity: 0,
          UomEntry: "",
          WhsCode: data.Filler,
          SerialNum:"",
        }])
      }}
    >
      <IconAdd color="#fff" height={18} width={18} style={{
        marginTop: -9
      }} />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff" }} size="small">
          {" Add"}
        </UIText>
      )}
    </UIButton>);
  }

  const save = async () => {
    setSaving(true);
    try {
      let number: any = await getLastNumbering("PGK-T", global.getSession().user.warehouse_id);
      let postItem:any[] = [];
      items.forEach((val:any)=>{
        postItem.push({
          ItemCode: val.ItemCode,
          Dscription: val.Dscription,
          UseBaseUn: val.UseBaseUn,
          Quantity: val.Quantity,
          UomEntry: val.UomEntry,
          WhsCode: val.WhsCode,
          SerialNum: val.SerialNum,
        });
      });
      await APIPost('InventoryTransfer', {
        ...data,
        U_IDU_IT_INTNUM:number.format,
        SlpCode:global.session.user.slp_code!=="" &&global.session.user.slp_code!== null?global.session.user.slp_code:-1,
        U_BRANCH:global.session.user.branch,
        U_USERID:global.session.user.id,
        Lines: postItem,
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
        isBack={true}
        showSidebar={showSidebar}
        sidebar={sidebar} center="Stock Transfer Form">
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
                { key: "DocDate", size: 5, type: "date", label: "Posting Date",options:{pastDate:true} },
                { key: "DocDueDate", size: 5, type: "date", label: "Delivery Date",options:{pastDate:true} },
                { type: "empty", size: 2 },
                { key: "Filler", size: 5, type: "field", label: "From Warehouse", component: (
                  <SAPDropdown label="From Warehouse" field="Custom" customQuery={{ 
                      Table: "OWHS", 
                      Fields: ["WhsCode"],
                      Page:1 
                  }} value={(data as any).Filler} setValue={(v) => { 
                    setData({ ...data, Filler: v });
                    items.forEach((val:any) => {
                      val.WhsCode = v;
                    }); 
                  }} />) },
                { key: "ToWhsCode", size: 5, type: "field", label: "To Warehouse", component: (
                  <SAPDropdown label="To Warehouse" field="Custom" customQuery={{ 
                      Table: "OWHS", 
                      Fields: ["WhsCode"],
                      Page:1 
                  }} value={(data as any).ToWhsCode} setValue={(v) => { setData({ ...data, ToWhsCode: v }) }} />) },

              ]
            },
            {
              key: "vendor",
              label: "Business Partner",
              value: [
                { key: "CardCode", size: 8, type: "field", label: "Customer/Vendor Code" },
                {
                  key: "CardCode", label: "Customer/Vendor", size: 12, component: (
                    <SAPDropdown label="Customer" field="CustomerCode" value={(data as any).CardCode} setValue={(v,l) => {
                      setData({ ...data, CardCode: v, CardName:l});
                      setQShip(true);
                    }} />)
                },
                {
                  key: "Address",
                  label: "Ship To",
                  size: 12,
                  component: (
                    <SAPDropdown label="Ship To" field="Custom" mustInit={false} customQuery={{
                      Table: "CRD1",
                      Fields: ["Street"],
                      Condition: [{
                        field: "AdresType",
                        cond: "=",
                        value: "S"
                      }, { cond: "AND" }, {
                        field: "CardCode",
                        cond: "=",
                        value: data.CardCode
                      }]
                    }} value={(data as any).Address} setValue={(v) => { setData({ ...data, Address: v }) }} refresh={qShip} setRefresh={setQShip} />)
                }
              ]
            },
            {
              key: "info",
              label: "Shipment",
              value: [
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
              Detail items
              </UIText>
              <ActionIt />
          </View>
          <FormInvTransferDetail items={items} setItems={setItems} />
        </View>
      </UIBody>
    </UIContainer>
  );
}))