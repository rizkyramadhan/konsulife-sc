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
  U_IDU_AREA: "",
  U_IDU_BRANCH: "",
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
  const data = customer;
  const [itemCP, setItemCP] = useState(cpList);
  const [itemBillTo, setItemBillTo] = useState(billToList);
  const [itemShipTo, setItemShipTo] = useState(shipToList);

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
                { key: "Series", size: 6, label: "Series" },
                { key: "CardType", size: 6, label: "BP Type" },
                { key: "CardName", size: 8, label: "BP Name" },
                { key: "GroupCode", size: 7, label: "Group Code" },
                { key: "U_IDU_AREA", size: 6, label: "Area" },
                { key: "U_IDU_BRANCH", size: 6, label: "Branch" },
                { key: "SlpCode", size: 7, label: "Sales Employee Code" },
              ]
            },
            {
              key: "info",
              label: "Customer",
              sublabel: 'Informasi Customer',
              value: [
                { key: "LicTradNum", size: 7, label: "NPWP" },
                { key: "AddID", size: 7, label: "No KTP" },
                { key: "Phone1", size: 6, label: "Telephone 1" },
                { key: "Phone2", size: 6, label: "Telephone 2" },
                { key: "Fax", size: 6, label: "Fax Number" },
                { key: "Cellular", size: 6, label: "Mobile Phone" },
                { key: "E_Mail", size: 7, label: "E-Mail" },
              ]
            },
            {
              key: "payment",
              label: "Payment Terms",
              sublabel: "Informsi Pembayaran",
              value: [
                { key: "GroupNum", label: "Payment Terms Code", size: 7 }
              ]
            }
          ]}
          setValue={(value: any, key: any) => {
            (data as any)[key] = value;
          }}
        />

        <View style={{ marginTop: 50 }}>
          <UITabs
            tabs={[
              {
                label: () => {
                  return (
                    <UIText
                      style={{
                        fontSize: 19,
                        color: "#333",
                        fontWeight: 400
                      }}
                    >Contact Person</UIText>
                  );
                },
                content: () => (<FormCustomerCPItems items={itemCP} setItems={setItemCP} />)
              },
              {
                label: () => {
                  return (
                    <UIText
                      style={{
                        fontSize: 19,
                        color: "#333",
                        fontWeight: 400
                      }}
                    >Bill To</UIText>
                  );
                },
                content: () => (
                  <FormCustomerBillToItems items={itemBillTo} setItems={setItemBillTo} />
                )
              },
              {
                label: () => {
                  return (
                    <UIText
                      style={{
                        fontSize: 19,
                        color: "#333",
                        fontWeight: 400
                      }}
                    >Ship To</UIText>
                  );
                },
                content: (
                  <FormCustomerShipToItems items={itemShipTo} setItems={setItemShipTo} />
                )
              }
            ]}
          />
        </View>
      </UIBody>
    </UIContainer>
  );
});