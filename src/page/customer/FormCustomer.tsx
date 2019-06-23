import { isSize } from '@app/libs/ui/MediaQuery';
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UITabs from "@app/libs/ui/UITabs";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { View } from "reactxp";
import FormCustomerCPItems from './FormCustomerCPItems';
import FormCustomerBillToItems from './FormCustomerBillToItems';
import FormCustomerShipToItems from './FormCustomerShipToItems';
import IconSave from "@app/libs/ui/Icons/IconSave";
import SAPDropdown from '@app/components/SAPDropdown';
import UISelectField from '@app/libs/ui/UISelectField';
import IconAdd from '@app/libs/ui/Icons/IconAdd';

const customer = {
  Series: "",
  CardName: "",
  CardType: "",
  GroupCode: "",
  LicTradNum: "",
  AddID: "",
  SlpCode: "",
  Phone1: "",
  Phone2: "",
  Fax: "",
  Cellular: "",
  E_Mail: "",
  GroupNum: ""
};

const cpList = [{
  Id: 1,
  Name: "Jon",
  FirstName: "Joni",
  MiddleName: "asasa",
  LastName: "asas",
  Tel1: "asasa",
  Tel2: "",
  Cellolar: ""
}];

const billToList = [{
  Id: 1,
  Address: "GAYUNGSARI",
  Street: "Jl. Gayung Sari No.xx",
  ZipCode: "",
  City: "SURABAYA",
  State: 10,
  AdresType: "B",
  IsDefault: 'Y'
}];

const shipToList = [{
  Id: 1,
  Address: "GAYUNGSARI",
  Street: "Jl. Gayung Sari No.xx",
  ZipCode: "",
  City: "SURABAYA",
  State: 10,
  AdresType: "S",
  IsDefault: 'Y'
}];

export default observer(({ showSidebar, sidebar }: any) => {
  const [data, setData] = useState(customer);
  const [itemCP, setItemCP] = useState(cpList);
  const [itemBillTo, setItemBillTo] = useState(billToList);
  const [itemShipTo, setItemShipTo] = useState(shipToList);
  const ActionCP = () => {
    return (<UIButton
      style={{
        flexShrink: 'none'
      }}
      color="success"
      size="small"
      onPress={() => {
        setItemCP([...itemCP, {
          Id: itemCP.length + 1,
          Name: "",
          FirstName: "",
          MiddleName: "",
          LastName: "",
          Tel1: "",
          Tel2: "",
          Cellolar: ""
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
  const ActionShip = () => {
    return (<UIButton
      style={{
        flexShrink: 'none'
      }}
      color="success"
      size="small"
      onPress={() => {
        setItemShipTo([...itemShipTo, {
          Id: itemShipTo.length + 1,
          Address: "",
          Street: "",
          ZipCode: "",
          City: "",
          State: 0,
          AdresType: "S",
          IsDefault: itemShipTo.length === 0 ? 'Y' : 'N'
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
  const ActionBill = () => {
    return (<UIButton
      style={{
        flexShrink: 'none'
      }}
      color="success"
      size="small"
      onPress={() => {
        setItemBillTo([...itemBillTo, {
          Id: itemBillTo.length + 1,
          Address: "",
          Street: "",
          ZipCode: "",
          City: "",
          State: 0,
          AdresType: "B",
          IsDefault: itemBillTo.length === 0 ? 'Y' : 'N'
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
  return (
    <UIContainer>
      <UIHeader
        isBack={true}
        showSidebar={showSidebar}
        sidebar={sidebar}
        center="Form Master Customer"
      >
        <UIButton
          color="primary"
          size="small"
          onPress={() => {
            alert("Saved!");
          }}
        >
          <IconSave color="#fff" />
          {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }}>{" Save"}</UIText>
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
                {
                  key: "Series", size: 7, component: (
                    <SAPDropdown label="Series" field="Series" value={data.Series} setValue={(v) => { setData({ ...data, Series: v }) }} />)
                },
                { key: "CardName", size: 7, label: "BP Name" },
                { key: "CardType", size: 5, component: (<UISelectField label="BP Type" items={[{ label: 'Customer', value: 'C' }, { label: 'Vendor', value: 'V' }]} value={data.CardType} setValue={(v) => { setData({ ...data, CardType: v }) }} />) },
                {
                  key: "GroupCode", size: 6, component: (
                    <SAPDropdown label="Group Code" field="BPGroup" value={data.GroupCode} setValue={(v) => { setData({ ...data, GroupCode: v }) }} />)
                },
                {
                  key: "GroupNum", size: 7, component: (
                    <SAPDropdown label="Payment Terms Code" field="PaymentTerms" value={data.GroupNum} setValue={(v) => { setData({ ...data, GroupNum: v }) }} />)
                },
                { key: "SlpCode", size: 7, label: "Sales Employee Code" },
              ]
            },
            {
              key: "info",
              label: "Customer",
              sublabel: 'Informasi Customer',
              value: [
                { key: "LicTradNum", size: 8, label: "NPWP" },
                { key: "AddID", size: 8, label: "No KTP" },
                { key: "Phone1", size: 6, label: "Telephone 1" },
                { key: "Phone2", size: 6, label: "Telephone 2" },
                { key: "Fax", size: 6, label: "Fax Number" },
                { key: "Cellular", size: 6, label: "Mobile Phone" },
                { key: "E_Mail", size: 7, label: "E-Mail" },
              ]
            },
          ]}
          setValue={(value: any, key: any) => {
            (data as any)[key] = value;
            setData(data);
          }}
        />

        <View style={{ marginTop: 50 }}>
          <UITabs
            tabs={[
              {
                label: "Contact Person",
                content: () => (<FormCustomerCPItems items={itemCP} setItems={setItemCP} />),
                action: ActionCP()
              },
              {
                label: "Bill To",
                content: () => (
                  <FormCustomerBillToItems items={itemBillTo} setItems={setItemBillTo} />
                ),
                action: ActionBill()
              },
              {
                label: "Ship To",
                content: (
                  <FormCustomerShipToItems items={itemShipTo} setItems={setItemShipTo} />
                ),
                action: ActionShip()
              }
            ]}
          />
        </View>
      </UIBody>
    </UIContainer>
  );
});