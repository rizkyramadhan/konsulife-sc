import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import { observer } from "mobx-react-lite";
import React from "react";
import UICard, { UICardHeader, UICardBody } from "@app/libs/ui/UICard";
import UIText from "@app/libs/ui/UIText";
import UISeparator from "@app/libs/ui/UISeparator";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UIJsonTable from "@app/libs/ui/UIJsonTable";
import UIField from "@app/libs/ui/UIField";
import UIRow from "@app/libs/ui/UIRow";
import UIButton from "@app/libs/ui/UIButton";
import UITextField from "@app/libs/ui/UITextField";

const sample = {
  CardCode: "TIM0002",
  CardName: "PT FREEPOT INDONESIA",
  DocStatus: "Open",
  U_IDU_SO_INTNUM: "SO/TIM-0002/19/VI/0001",
  Sales: "Dwi",
  GrandTotal: 1000000
};

const sampleList = [
  {
    ItemCode: "BSLSR000001",
    Dscription: "750R16-8PR-TL L310-T",
    UnitPrice: 1950000,
    DiscPrcnt: ""
  },
  {
    ItemCode: "BSLSR000001",
    Dscription: "750R16-8PR-TL L310-T",
    UnitPrice: 1950000,
    DiscPrcnt: ""
  }
];

export default observer(({ showSidebar, sidebar }: any) => {
  const data = sample;
  const items = sampleList;

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center="Form Sales Order"
      />
      <UIBody>
        <UICard>
          <UICardHeader>
            <UIText
              style={{
                flexShrink: "none",
                width: "100%"
              }}
            >
              Detail
            </UIText>
          </UICardHeader>
          <UISeparator />
          <UICardBody>
            <UIJsonField
              items={data}
              field={[
                {
                  key: "U_IDU_SO_INTNUM",
                  type: "field",
                  label: "SO Number"
                },
                { type: "empty" },
                { key: "CardCode", label: "Customer" },
                { key: "CardName", label: "Name" },
                { type: "empty" },
                { key: "ContactPerson", label: "Contact Person" },
                { key: "POCustomerNo", label: "PO Customer No" },
                { type: "empty" },
                { key: "PostingDate", label: "Posting Date" },
                { key: "DeliveryDate", label: "Delivery Date" },
                { type: "empty" },
                { key: "DocumentDate", label: "Document Date" },
                { key: "GrandTotal", type: "money" },
                { type: "empty" }
              ]}
              setValue={(value: any, key: any) => {
                (data as any)[key] = value;
              }}
            />
          </UICardBody>
        </UICard>

        <UICard>
          <UICardHeader>
            <UIText
              style={{
                flexShrink: "none",
                width: "100%"
              }}
            >
              Contents
            </UIText>
          </UICardHeader>
          <UISeparator />
          <UICardBody>
            <UIJsonTable
              headers={[
                {
                  key: "ItemCode",
                  label: "Item Code"
                },
                {
                  key: "Dscription",
                  label: "Item Description"
                },
                {
                  key: "UnitPrice",
                  label: "Unit Price"
                },
                {
                  key: "DiscPrcnt",
                  label: "Discount"
                },
                {
                  key: "action",
                  label: ""
                }
              ]}
              data={items.map(item => ({
                ...item,
                UnitPrice: item.UnitPrice.toLocaleString(),
                DiscPrcnt: (
                  <UITextField
                    type="number"
                    value={item.DiscPrcnt}
                    setValue={e => (item.DiscPrcnt = e)}
                  />
                ),
                action: (
                  <UIRow>
                    <UIButton
                      size="small"
                      color="secondary"
                      style={{
                        paddingTop: 2,
                        paddingBottom: 2,
                        paddingLeft: 5,
                        paddingRight: 5,
                        marginTop: 0,
                        marginBottom: 2,
                        fontColor: "#000"
                      }}
                    >
                      Remove
                    </UIButton>
                  </UIRow>
                )
              }))}
              colWidth={[
                {
                  index: 4,
                  width: 90
                }
              ]}
            />
          </UICardBody>
        </UICard>
      </UIBody>
    </UIContainer>
  );
});
