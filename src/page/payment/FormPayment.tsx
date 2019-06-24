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
import SAPDropdown from '@app/components/SAPDropdown';

const defData = {
    DocDate:"",
    DocDueDate:"",
    CardCode:"",
    CardName:"",
    CashAcct:"",
    CashSum:"",
    TrsfrAcct:"",
    TrsfrSum:"",
    TrsfrDate:"",
    TrsfrRef:""
}

export default withRouter(observer(({ showSidebar, sidebar }: any) => {
    const [data, setData] = useState(defData);


  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center="Form Payment Receipt"
      >
        <UIButton
          color="primary"
          size="small"
          onPress={() => {
            console.log("save");
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
                { key: "DocDate", size: 4, label: "Posting Date" },
                { key: "DocDueDate", size: 4, label: "Delivery Date" },
                { key: "CardCode", label: "BP Partner", size: 12,component: (
                    <SAPDropdown label="BP Partner" field="CustomerCode" value={(data as any).CardCode} setValue={(v) => { setData({ ...data, CardCode: v }) }} />) },
              ]
            },
            {
              key: "cash",
              label: "Cash",
              value: [
                {
                    key: "CashAcct", size: 12, label: "Cash Account", component: (
                        <SAPDropdown label="Cash Account" field="ChartOfAccount" value={(data as any).CashAcct} setValue={(v) => { setData({ ...data, CashAcct: v }) }} />)
                },
                { key: "CashSum", size: 12, label: "Cash Amount" },
              ]
            },
            {
              key: "transfer",
              label: "Bank Transfer",
              value: [
                {
                    key: "TrsfrAcct", size: 12, label: "Transfer Account", component: (
                        <SAPDropdown label="Transfer Account" field="ChartOfAccount" value={(data as any).TrsfrAcct} setValue={(v) => { setData({ ...data, TrsfrAcct: v }) }} />)
                },
                { key: "TrsfrSum", size: 12, label: "Transfer Amount"},
                { key: "TrsfrDate", size: 12, label: "Transfer Date" },
                { key: "TrsfrRef", size: 12, label: "Intended Purpose" },
              ]
            }
          ]}
          setValue={(value: any, key: any) => {
            (data as any)[key] = value;
          }}
        />
      </UIBody>
    </UIContainer>
  );
}));
